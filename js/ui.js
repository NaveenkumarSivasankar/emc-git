// ═══════════════════════════════════════════════
//  APPLIANCE TOGGLE SYSTEM
// ═══════════════════════════════════════════════
function toggleAppliance(idx, isOn) {
    const a = is2BHK ? bhk2Appliances[idx] : null;
    if (!a) return;
    a.on = isOn;
    if (a.kind === 'light') {
        a.mesh.pointLight.intensity = isOn ? 1.5 : 0;
        a.mesh.bulbMat.emissiveIntensity = isOn ? 1.5 : 0;
        a.mesh.bulbMat.opacity = isOn ? 0.95 : 0.3;
    } else if (a.kind === 'ac') {
        a.mesh.particles.visible = isOn;
    } else if (a.kind === 'tv') {
        const screen = a.mesh.screen;
        screen.material.emissiveIntensity = isOn ? 1.0 : 0;
        if (isOn) {
            const tex = tvTextures[Math.floor(Math.random() * tvTextures.length)];
            screen.material.map = tex; screen.material.emissiveMap = tex;
            screen.material.color.set(0xffffff);
        } else {
            screen.material.map = null; screen.material.emissiveMap = null;
            screen.material.color.set(0x111111);
            screen.material.emissive.set(0x000000);
        }
        screen.material.needsUpdate = true;
    } else if (a.kind === 'tap') {
        waterStream.visible = isOn;
    }
    recalcWattage();
    buildAppliancePanel();
    updateDynamicEnergy();
    if (typeof updateEnergyVisionWires === 'function') updateEnergyVisionWires();
    if (typeof dispatchApplianceToggle === 'function') dispatchApplianceToggle(a.name, a.watt, isOn);
}

function toggleSimpleAppliance(idx, isOn) {
    const a = simpleAppliances[idx];
    if (!a) return;
    a.on = isOn;
    if (a.kind === 'light') {
        a.mesh.pointLight.intensity = isOn ? 1.5 : 0;
        a.mesh.bulbMat.emissiveIntensity = isOn ? 1.5 : 0;
        a.mesh.bulbMat.opacity = isOn ? 0.95 : 0.3;
    } else if (a.kind === 'ac') {
        a.mesh.particles.visible = isOn;
    } else if (a.kind === 'tv') {
        const screen = a.mesh.screen;
        screen.material.emissiveIntensity = isOn ? 1.0 : 0;
        if (isOn) {
            const tex = tvTextures[Math.floor(Math.random() * tvTextures.length)];
            screen.material.map = tex; screen.material.emissiveMap = tex;
            screen.material.color.set(0xffffff);
        } else {
            screen.material.map = null; screen.material.emissiveMap = null;
            screen.material.color.set(0x111111);
            screen.material.emissive.set(0x000000);
        }
        screen.material.needsUpdate = true;
    }
    recalcWattage();
    buildAppliancePanel();
    updateDynamicEnergy();
    if (typeof updateEnergyVisionWires === 'function') updateEnergyVisionWires();
    if (typeof dispatchApplianceToggle === 'function') dispatchApplianceToggle(a.name, a.watt, isOn);
}

// ═══════════════════════════════════════════════
//  WATTAGE & BAR CHART
// ═══════════════════════════════════════════════
function recalcWattage() {
    let total = 0;
    const activeKey = typeof is2BHK !== 'undefined' && is2BHK ? '2bhk' : '1bhk';
    if (activeKey === '2bhk') {
        bhk2Appliances.forEach(a => { if (a.on) total += a.watt; });
    } else {
        simpleAppliances.forEach(a => { if (a.on) total += a.watt; });
    }

    // Fallback if houseState isn't fully initialized yet
    const currentCount = (typeof houseState !== 'undefined' && houseState[activeKey]) ? houseState[activeKey].count : 0;

    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };

    setText('stat-consumption', total.toLocaleString() + ' W');
    const panelsNeeded = Math.max(1, Math.ceil(total / 350));
    setText('stat-panels', currentCount + ' / ' + panelsNeeded + ' needed');

    const coverageRatio = Math.min(currentCount / panelsNeeded, 1);
    
    // FETCH ACCURATE PANEL COUNT AND CALCULATE SOLAR GENERATION
    const panelCount = (typeof houseState !== 'undefined' && houseState[activeKey]) ? houseState[activeKey].count : 0;
    const solarKW = panelCount * 0.35; // generic 0.35 kW per panel
    const solarDailyUnits = solarKW * 4; // generic 4 hrs of sun
    
    // We base savings on actual daily solar units generated
    const totalDailyUnits = (total * 8) / 1000;
    const effectiveSolarUnits = Math.min(solarDailyUnits, totalDailyUnits); // Can't save more than used in the basic calculation
    const monthlySaving = Math.round(effectiveSolarUnits * 30 * 6.5); // generic 6.5 INR per unit for simple calc
    const co2Saved = Math.round(effectiveSolarUnits * 365 * 0.82); // 0.82 kg CO2 per unit

    setText('stat-savings', '₹' + monthlySaving.toLocaleString());
    setText('stat-co2', co2Saved.toLocaleString() + ' kg/yr');

    updateBarChart(total, coverageRatio, effectiveSolarUnits, totalDailyUnits);
}

function updateBarChart(totalW, coverageRatio, effectiveSolarUnits, totalDailyUnits) {
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    const setWidth = (id, pct) => { const el = document.getElementById(id); if (el) el.style.width = pct; };

    // If effectiveSolarUnits is not passed (from older calls), calculate a generic one based on coverage ratio for fallback
    if (typeof effectiveSolarUnits === 'undefined' || typeof totalDailyUnits === 'undefined') {
        totalDailyUnits = (totalW * 8) / 1000;
        effectiveSolarUnits = totalDailyUnits * coverageRatio;
    }

    const solarPct = totalDailyUnits > 0 ? Math.round((effectiveSolarUnits / totalDailyUnits) * 100) : 0;
    const gridPct = 100 - solarPct;

    setWidth('grid-bar', Math.max(gridPct, 5) + '%');
    setText('grid-bar', gridPct + '%');

    setWidth('solar-bar', Math.max(solarPct, 5) + '%');
    setText('solar-bar', solarPct + '%');

    const gridCostDaily = Math.round((totalDailyUnits - effectiveSolarUnits) * 6.5); // generic 6.5 INR rate
    const solarSavingsDaily = Math.round(effectiveSolarUnits * 6.5);
    const monthlyBill = Math.round(gridCostDaily * 30);

    setText('calc-grid', '₹' + gridCostDaily);
    setText('calc-solar', '₹' + solarSavingsDaily);
    setText('calc-monthly', '₹' + monthlyBill);
}

// ═══════════════════════════════════════════════
//  TV TEXTURES
// ═══════════════════════════════════════════════
function createTvTexture(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 144;
    const ctx = canvas.getContext('2d');
    if (type === 'nature') {
        const grad = ctx.createLinearGradient(0, 0, 0, 144);
        grad.addColorStop(0, '#87CEEB'); grad.addColorStop(0.55, '#87CEEB');
        grad.addColorStop(0.55, '#228B22'); grad.addColorStop(1, '#006400');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, 256, 144);
        ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(200, 30, 18, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath(); ctx.arc(60, 35, 14, 0, Math.PI * 2); ctx.arc(78, 30, 17, 0, Math.PI * 2); ctx.arc(92, 35, 13, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1a5e1a';
        [40, 90, 150].forEach(tx => { ctx.beginPath(); ctx.moveTo(tx, 80); ctx.lineTo(tx - 15, 144); ctx.lineTo(tx + 15, 144); ctx.fill(); });
    } else {
        ctx.fillStyle = '#1a1a3e'; ctx.fillRect(0, 0, 256, 144);
        for (let i = 0; i < 8; i++) {
            const bh = 40 + Math.random() * 60;
            ctx.fillStyle = 'hsl(' + (220 + i * 5) + ', 30%, ' + (20 + i * 3) + '%)';
            ctx.fillRect(10 + i * 30, 144 - bh, 25, bh);
            ctx.fillStyle = '#FFD700';
            for (let wy = 144 - bh + 5; wy < 140; wy += 10) {
                for (let wx = 0; wx < 3; wx++) ctx.fillRect(14 + i * 30 + wx * 7, wy, 4, 5);
            }
        }
        ctx.fillStyle = '#cc0000'; ctx.fillRect(0, 130, 256, 14);
        ctx.fillStyle = '#ffffff'; ctx.font = '10px sans-serif';
        ctx.fillText('SOLAR ENERGY NEWS \u25cf Solar power saves \u20b95000/month!', 5, 141);
    }
    return new THREE.CanvasTexture(canvas);
}
const tvTextures = [createTvTexture('nature'), createTvTexture('city')];

// ═══════════════════════════════════════════════
//  APPLIANCE PANEL
// ═══════════════════════════════════════════════
function buildAppliancePanel() {
    const panel = document.getElementById('appliance-panel');
    const roomIcons = { 'Hall': '🏠', 'Kitchen': '🍳', 'Bedroom': '🛏️', 'Bedroom 1': '🛏️', 'Bedroom 2': '🛏️', 'Bathroom': '🚿' };
    let html = '<div class="panel-header"><span class="panel-header-icon">⚡</span> Appliances</div>';

    if (is2BHK) {
        const grouped = {};
        bhk2Appliances.forEach((a, i) => {
            if (!grouped[a.room]) grouped[a.room] = [];
            grouped[a.room].push({ ...a, idx: i });
        });
        for (const room in grouped) {
            html += '<div class="room-section"><div class="room-header"><span class="room-header-icon">' + (roomIcons[room] || '🏠') + '</span>' + room + '</div>';
            grouped[room].forEach(a => {
                const emoji = a.emoji || '';
                html += '<div class="appliance-row"><div class="app-info"><span class="app-emoji">' + emoji + '</span><div><span class="app-name">' + a.name + '</span><span class="app-watt">' + a.watt + 'W</span></div></div><label class="toggle"><input type="checkbox" ' + (a.on ? 'checked' : '') + ' onchange="toggleAppliance(' + a.idx + ',this.checked)"><span class="slider"></span></label></div>';
            });
            html += '</div>';
        }
    } else {
        const rooms = { 'Hall': [], 'Kitchen': [], 'Bedroom': [] };
        simpleAppliances.forEach((a, i) => {
            const room = a.room || 'Hall';
            if (!rooms[room]) rooms[room] = [];
            rooms[room].push({ ...a, idx: i });
        });
        for (const room in rooms) {
            if (rooms[room].length === 0) continue;
            html += '<div class="room-section"><div class="room-header"><span class="room-header-icon">' + (roomIcons[room] || '🏠') + '</span>' + room + '</div>';
            rooms[room].forEach(a => {
                const emoji = a.emoji || '';
                html += '<div class="appliance-row"><div class="app-info"><span class="app-emoji">' + emoji + '</span><div><span class="app-name">' + a.name + '</span><span class="app-watt">' + a.watt + 'W</span></div></div><label class="toggle"><input type="checkbox" ' + (a.on ? 'checked' : '') + ' onchange="toggleSimpleAppliance(' + a.idx + ',this.checked)"><span class="slider"></span></label></div>';
            });
            html += '</div>';
        }
    }

    // Total wattage footer
    let totalOn = 0;
    const list = is2BHK ? bhk2Appliances : simpleAppliances;
    list.forEach(a => { if (a.on) totalOn += a.watt; });
    html += '<div class="panel-footer"><span class="footer-label">Total Active</span><span class="footer-value">' + totalOn.toLocaleString() + ' W</span></div>';

    panel.innerHTML = html;
}

// ═══════════════════════════════════════════════
//  FOCUS HOUSE
// ═══════════════════════════════════════════════
function focusHouse(which) {
    if (which === 'simple') {
        is2BHK = false;
        controls.target.set(-22, 4, -4);
        camera.position.set(-22, 20, 31);
    } else {
        is2BHK = true;
        controls.target.set(24, 4, -4);
        camera.position.set(24, 20, 31);
    }
    controls.update();
    if (typeof positionSolarPanels === 'function') positionSolarPanels();
    buildAppliancePanel();
    buildRoomNavPanel();
    recalcWattage();
    document.getElementById('back-btn').classList.remove('visible');
}
function toggleUpgrade() { focusHouse('2bhk'); }

// ═══════════════════════════════════════════════
//  ROOM NAVIGATION PANEL
// ═══════════════════════════════════════════════
const bhk2RoomPositions = {
    'Hall': { target: new THREE.Vector3(29, 3.5, 4), camera: new THREE.Vector3(29, 12, 20) },
    'Bedroom 1': { target: new THREE.Vector3(17, 3.5, -8.5), camera: new THREE.Vector3(17, 12, 4) },
    'Bedroom 2': { target: new THREE.Vector3(31, 3.5, -8.5), camera: new THREE.Vector3(31, 12, 4) },
    'Kitchen': { target: new THREE.Vector3(14.5, 3.5, -1), camera: new THREE.Vector3(14.5, 12, 12) },
    'Bathroom': { target: new THREE.Vector3(14.5, 3.5, 7.5), camera: new THREE.Vector3(14.5, 12, 18) }
};

function buildRoomNavPanel() {
    const panel = document.getElementById('room-nav-panel');
    let rooms, roomIcons;

    if (is2BHK) {
        rooms = ['Hall', 'Bedroom 1', 'Bedroom 2', 'Kitchen', 'Bathroom'];
        roomIcons = { 'Hall': '🏠', 'Bedroom 1': '🛏️', 'Bedroom 2': '🛏️', 'Kitchen': '🍳', 'Bathroom': '🚿' };
    } else {
        rooms = ['Hall', 'Kitchen', 'Bedroom'];
        roomIcons = { 'Hall': '🏠', 'Kitchen': '🍳', 'Bedroom': '🛏️' };
    }

    let html = '<div class="room-nav-title">🏡 Navigate Rooms</div><div class="room-nav-grid">';
    rooms.forEach(room => {
        html += '<button class="room-nav-btn" onclick="zoomToRoom(\'' + room + '\')">' +
            '<span class="room-nav-icon">' + roomIcons[room] + '</span>' +
            '<span class="room-nav-label">' + room + '</span>' +
            '</button>';
    });
    html += '</div>';
    panel.innerHTML = html;
}

function zoomToRoom(roomName) {
    if (typeof boyState !== 'undefined') boyState.cameraFollow = false;

    const positions = is2BHK ? bhk2RoomPositions : bhk1RoomPositions;
    const pos = positions[roomName];
    if (!pos) return;

    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const endPos = pos.camera;
    const endTarget = pos.target;

    let progress = 0;
    const duration = 60;

    function animateZoom() {
        progress++;
        const t = Math.min(progress / duration, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        camera.position.lerpVectors(startPos, endPos, ease);
        controls.target.lerpVectors(startTarget, endTarget, ease);
        controls.update();

        if (t < 1) requestAnimationFrame(animateZoom);
    }
    animateZoom();

    document.getElementById('back-btn').classList.add('visible');
    document.querySelectorAll('.room-nav-btn').forEach(btn => btn.classList.remove('active'));
    const evt = (typeof event !== 'undefined') ? event : null;
    if (evt && evt.target) {
        const btn = evt.target.closest('.room-nav-btn');
        if (btn) btn.classList.add('active');
    }
}

function zoomOutToHouse() {
    if (is2BHK) {
        focusHouse('2bhk');
    } else {
        focusHouse('simple');
    }
    document.getElementById('back-btn').classList.remove('visible');
}

// ═══════════════════════════════════════════════
//  ENERGY CHART TOGGLE (Bug #3: Side-by-side 1BHK / 2BHK)
// ═══════════════════════════════════════════════
function toggleEnergyChart() {
    openEnergyModal();
}

function openEnergyModal() {
    // Remove existing if present
    let existing = document.getElementById('energy-compare-panel');
    if (existing) { existing.remove(); return; }

    const panel = document.createElement('div');
    panel.id = 'energy-compare-panel';

    // 1BHK room data
    const rooms1 = [
        { name: 'Hall', watts: 95, color: '#6C5CE7' },
        { name: 'Bedroom', watts: 90, color: '#A29BFE' },
        { name: 'Kitchen', watts: 230, color: '#0984E3' },
        { name: 'Bathroom', watts: 10, color: '#74B9FF' },
    ];
    const total1 = rooms1.reduce((s, r) => s + r.watts, 0);
    const daily1 = (total1 * 8 / 1000 * 8).toFixed(2);

    // 2BHK room data
    const rooms2 = [
        { name: 'Hall', watts: 95, color: '#00B894' },
        { name: 'Bedroom 1', watts: 90, color: '#55EFC4' },
        { name: 'Bedroom 2', watts: 75, color: '#81ECEC' },
        { name: 'Kitchen', watts: 230, color: '#00CEC9' },
        { name: 'Bathroom', watts: 10, color: '#FFEAA7' },
    ];
    const total2 = rooms2.reduce((s, r) => s + r.watts, 0);
    const daily2 = (total2 * 8 / 1000 * 8).toFixed(2);

    const maxW = Math.max(...rooms1.map(r => r.watts), ...rooms2.map(r => r.watts));
    const savings = total2 - total1;
    const yearlySavings = Math.round(savings * 8 / 1000 * 8 * 365);

    function makeBarChart(rooms, maxVal) {
        return rooms.map(r => {
            const pct = Math.round((r.watts / maxVal) * 100);
            return `<div class="ecp-bar-row">
                <span class="ecp-bar-label">${r.name}</span>
                <div class="ecp-bar-track">
                    <div class="ecp-bar-fill" style="width:${pct}%;background:${r.color}">${r.watts}W</div>
                </div>
            </div>`;
        }).join('');
    }

    panel.innerHTML = `
    <div class="ecp-close" onclick="document.getElementById('energy-compare-panel').remove()">✕</div>
    <div class="ecp-title">⚡ Energy Comparison</div>
    <div class="ecp-body">
        <div class="ecp-section ecp-1bhk">
            <div class="ecp-section-header ecp-header-1bhk">🏠 1BHK House</div>
            <div class="ecp-bars">${makeBarChart(rooms1, maxW)}</div>
            <div class="ecp-total">Total: <strong>${total1}W</strong></div>
            <div class="ecp-daily">≈ ₹${daily1} / day</div>
        </div>
        <div class="ecp-divider">
            <div class="ecp-vs-line"></div>
            <div class="ecp-vs-badge">VS</div>
            <div class="ecp-vs-line"></div>
        </div>
        <div class="ecp-section ecp-2bhk">
            <div class="ecp-section-header ecp-header-2bhk">🏘️ 2BHK House</div>
            <div class="ecp-bars">${makeBarChart(rooms2, maxW)}</div>
            <div class="ecp-total">Total: <strong>${total2}W</strong></div>
            <div class="ecp-daily">≈ ₹${daily2} / day</div>
        </div>
    </div>
    <div class="ecp-comparison">
        💡 1BHK saves <strong>${savings}W</strong> more than 2BHK — that's <strong>₹${yearlySavings.toLocaleString()}/year!</strong>
    </div>`;

    document.body.appendChild(panel);
    // Slide-in animation
    requestAnimationFrame(() => panel.classList.add('open'));
}

function toggleRoomNav() {
    const panel = document.getElementById('room-nav-panel');
    panel.classList.toggle('visible');
}

// ═══════════════════════════════════════════════
//  STREET OVERVIEW RESET
// ═══════════════════════════════════════════════
function resetToStreetOverview() {
    // Reset camera to standard overview
    if (typeof camera !== 'undefined' && typeof controls !== 'undefined') {
        camera.position.set(0, 20, 40);
        controls.target.set(0, 4, 0);
        controls.update();
    }

    // Hide house-specific UI elements
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.classList.remove('visible');

    const roomIndicator = document.getElementById('room-indicator');
    if (roomIndicator) roomIndicator.classList.remove('visible');

    const enterPrompt = document.getElementById('enter-prompt');
    if (enterPrompt) enterPrompt.classList.remove('visible');

    // Close panels if open
    const roomNav = document.getElementById('room-nav-panel');
    if (roomNav) roomNav.classList.remove('visible');

    // Ensure all houses are visible and environment is visible
    if (typeof environmentGroup !== 'undefined') environmentGroup.visible = true;
    if (typeof bhk2Group !== 'undefined') bhk2Group.visible = true;
    if (typeof houseGroup !== 'undefined') houseGroup.visible = true;
}

// ═══════════════════════════════════════════════
//  ROOM ENTRY POPUP HUD
//  Glassmorphism popup when character enters a room
// ═══════════════════════════════════════════════

// Room data for popups
const ROOM_DATA = {
    'Hall': {
        icon: '🛋️',
        name: 'LIVING HALL',
        appliances: [
            { name: 'Ceiling Fan', watts: 75, isOn: true },
            { name: 'LED Lights', watts: 20, isOn: true },
            { name: 'Television', watts: 150, isOn: false },
        ],
        tip: '💡 Using a 5-star fan saves ₹800/year!'
    },
    'Bedroom': {
        icon: '🛏️',
        name: 'BEDROOM',
        appliances: [
            { name: 'Ceiling Fan', watts: 75, isOn: true },
            { name: 'Bedside Lamp', watts: 15, isOn: true },
            { name: 'Air Conditioner', watts: 1500, isOn: false },
        ],
        tip: '❄️ Set AC to 24°C to save 6% energy per degree!'
    },
    'Bedroom 1': {
        icon: '🛏️',
        name: 'BEDROOM 1',
        appliances: [
            { name: 'Ceiling Fan', watts: 75, isOn: true },
            { name: 'LED Light', watts: 60, isOn: true },
            { name: 'Air Conditioner', watts: 1500, isOn: false },
        ],
        tip: '❄️ Set AC to 24°C to save 6% energy per degree!'
    },
    'Bedroom 2': {
        icon: '🛏️',
        name: 'BEDROOM 2',
        appliances: [
            { name: 'Ceiling Fan', watts: 75, isOn: true },
            { name: 'Table Fan', watts: 55, isOn: true },
            { name: 'LED Light', watts: 60, isOn: true },
        ],
        tip: '🌀 Using a fan instead of AC saves 95% energy!'
    },
    'Kitchen': {
        icon: '🍳',
        name: 'KITCHEN',
        appliances: [
            { name: 'Refrigerator', watts: 200, isOn: true },
            { name: 'Microwave', watts: 1200, isOn: false },
            { name: 'Exhaust Fan', watts: 30, isOn: true },
        ],
        tip: '🧊 Keep fridge 75% full for best efficiency!'
    },
    'Bathroom': {
        icon: '🚿',
        name: 'BATHROOM',
        appliances: [
            { name: 'Exhaust Fan', watts: 25, isOn: false },
            { name: 'Geyser/Heater', watts: 2000, isOn: false },
            { name: 'LED Light', watts: 10, isOn: true },
        ],
        tip: '🚿 A 5-min shower saves 50L water vs a bath!'
    }
};

// Map room display names (with emojis from getBoyRoom) to keys
function normalizeRoomName(roomName) {
    if (!roomName) return null;
    // Strip emoji prefix if present
    const stripped = roomName.replace(/^[^\w]+\s*/, '').trim();
    // Try exact match first
    if (ROOM_DATA[stripped]) return stripped;
    if (ROOM_DATA[roomName]) return roomName;
    // Fuzzy match
    for (const key in ROOM_DATA) {
        if (stripped.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(stripped.toLowerCase())) {
            return key;
        }
    }
    return stripped;
}

function showRoomPopup(roomName, houseId) {
    createRoomPopupElement();

    // Clear previous timers
    if (roomPopupTimeout) clearTimeout(roomPopupTimeout);
    if (roomPopupInterval) clearInterval(roomPopupInterval);

    const roomIcons = { 'Hall': '🏠', 'Kitchen': '🍳', 'Bedroom': '🛏️', 'Bedroom 1': '🛏️', 'Bedroom 2': '🛏️', 'Bathroom': '🚿' };
    const icon = roomIcons[roomName] || '🏠';

    function renderPopup() {
        const appList = houseId === '2bhk' ? bhk2Appliances : simpleAppliances;
        const roomAppliances = appList.filter(a => a.room === roomName);

        let totalWatts = 0;
        let appHtml = '';
        roomAppliances.forEach(a => {
            const status = a.on ? '<span class="rp-on">ON</span>' : '<span class="rp-off">OFF</span>';
            const wattDisplay = a.on ? a.watt : 0;
            if (a.on) totalWatts += a.watt;
            appHtml += '<div class="rp-appliance">' +
                '<span class="rp-emoji">' + (a.emoji || '') + '</span>' +
                '<span class="rp-name">' + a.name + '</span>' +
                status +
                '<span class="rp-watt">' + wattDisplay + 'W</span>' +
                '</div>';
        });

        const hourlyCost = (totalWatts / 1000 * 8).toFixed(2); // ₹8 per unit approx

        roomPopupEl.innerHTML =
            '<div class="rp-header">' +
            '<span class="rp-title">' + icon + ' ' + roomName + '</span>' +
            '<button class="rp-close" onclick="hideRoomPopup()">×</button>' +
            '</div>' +
            '<div class="rp-appliances">' + appHtml + '</div>' +
            '<div class="rp-footer">' +
            '<div class="rp-total">⚡ Total: <strong>' + totalWatts + 'W</strong></div>' +
            '<div class="rp-cost">💰 ~₹' + hourlyCost + '/hr</div>' +
            '</div>';
    }

    renderPopup();
    roomPopupEl.classList.add('visible');

    // Live update every second
    roomPopupInterval = setInterval(renderPopup, 1000);

    // Auto-dismiss after 5 seconds
    roomPopupTimeout = setTimeout(() => {
        hideRoomPopup();
    }, 5000);
}

function hideRoomPopup() {
    if (roomPopupEl) roomPopupEl.classList.remove('visible');
    if (roomPopupTimeout) { clearTimeout(roomPopupTimeout); roomPopupTimeout = null; }
    if (roomPopupInterval) { clearInterval(roomPopupInterval); roomPopupInterval = null; }
}

// ═══════════════════════════════════════════════
//  SOLAR PANEL HOUSE SELECTOR MODAL
// ═══════════════════════════════════════════════
let solarSelectorEl = null;

function createSolarSelector() {
    if (solarSelectorEl) return;
    solarSelectorEl = document.createElement('div');
    solarSelectorEl.id = 'solar-selector-modal';
    solarSelectorEl.innerHTML =
        '<div class="ssm-backdrop" onclick="closeSolarSelector()"></div>' +
        '<div class="ssm-content">' +
        '<button class="ssm-close" onclick="closeSolarSelector()">✕</button>' +
        '<h2 class="ssm-title">☀️ Select Solar Installation</h2>' +
        '<p class="ssm-subtitle">Choose which house to install solar panels on</p>' +
        '<div class="ssm-buttons">' +
        '<button class="ssm-btn ssm-1bhk" onclick="selectSolarHouseUI(\'1bhk\')">🏠 1BHK House</button>' +
        '<button class="ssm-btn ssm-2bhk" onclick="selectSolarHouseUI(\'2bhk\')">🏢 2BHK House</button>' +
        '<button class="ssm-btn ssm-both" onclick="selectSolarHouseUI(\'both\')">🏘️ Both Houses</button>' +
        '</div>' +
        '<button class="ssm-cancel" onclick="closeSolarSelector()">Cancel</button>' +
        '</div>';
    document.body.appendChild(solarSelectorEl);
}

function showSolarSelector() {
    createSolarSelector();
    solarSelectorEl.classList.add('visible');
}

function closeSolarSelector() {
    if (solarSelectorEl) solarSelectorEl.classList.remove('visible');
}

let solarTarget = null; // '1bhk', '2bhk', 'both'

// NOTE: selectSolarHouse is defined in solar.js — do NOT redefine here
// This was previously causing a conflict/freeze. The solar.js version
// handles per-house solar state (houseState) correctly.
function selectSolarHouseUI(target) {
    solarTarget = target;
    closeSolarSelector();
    // Delegate to the solar.js selectSolarHouse
    if (typeof selectSolarHouse === 'function') {
        selectSolarHouse(target === 'both' ? '1bhk' : target);
        if (target === 'both') selectSolarHouse('2bhk');
    }
}

function performSolarToggle(target) {
    isSolarMode = true;
    const btn = document.getElementById('solar-btn');
    const btnText = document.getElementById('solar-btn-text');
    const btnIcon = document.getElementById('solar-btn-icon');
    const panelCounter = document.getElementById('panel-counter');

    if (btn) btn.className = 'solar-mode bottom-action-btn';
    if (btnText) btnText.textContent = 'Remove Solar';
    if (btnIcon) btnIcon.textContent = '⚡';
    if (panelCounter) panelCounter.classList.add('visible');

    currentPanelCount = 0;
    solarPanels.forEach(p => { p.group.visible = false; p.group.position.y = p.targetY + 15; });

    if (typeof updatePowerLines === 'function') updatePowerLines();
    if (typeof updateStats === 'function') updateStats();
}

// ═══════════════════════════════════════════════
//  DYNAMIC ENERGY DATA (live updating)
// ═══════════════════════════════════════════════
const dynamicEnergy = { sessionStart: Date.now(), cumulativeWh: 0, lastTick: Date.now(), intervalId: null };
function startEnergyTracking() {
    if (dynamicEnergy.intervalId) return; dynamicEnergy.sessionStart = Date.now(); dynamicEnergy.cumulativeWh = 0; dynamicEnergy.lastTick = Date.now();
    dynamicEnergy.intervalId = setInterval(updateDynamicEnergy, 1000);
}
function updateDynamicEnergy() {
    const now = Date.now();
    const dtHours = (now - dynamicEnergy.lastTick) / 3600000; // ms to hours
    dynamicEnergy.lastTick = now;

    // Calculate current active wattage
    let activeWatts = 0;
    const list = is2BHK ? bhk2Appliances : simpleAppliances;
    list.forEach(a => { if (a.on) activeWatts += a.watt; });

    // Accumulate energy consumed in this interval
    dynamicEnergy.cumulativeWh += activeWatts * dtHours;

    // Per-minute = watts / 60 hours worth
    dynamicEnergy.perMinuteW = activeWatts;
    dynamicEnergy.perHourW = activeWatts;

    // Update stat displays if they exist
    const elMinute = document.getElementById('stat-per-minute');
    if (elMinute) elMinute.textContent = (activeWatts / 60).toFixed(2) + ' Wh/min';
    const elHour = document.getElementById('stat-per-hour');
    if (elHour) elHour.textContent = (activeWatts).toFixed(0) + ' W/hr';
    const elCumulative = document.getElementById('stat-cumulative');
    if (elCumulative) elCumulative.textContent = dynamicEnergy.cumulativeWh.toFixed(2) + ' Wh';

    // Track per-appliance duration for analytics
    if (typeof trackApplianceDuration === 'function') trackApplianceDuration();
}
window.addEventListener('DOMContentLoaded', () => { setTimeout(startEnergyTracking, 500); });

// ═══════════════════════════════════════════════
//  FLOOR SELECTOR FOR 2BHK
// ═══════════════════════════════════════════════
let current2BHKFloor = 1;
function showFloorSelector() {
    let el = document.getElementById('floor-selector');
    if (!el) { el = document.createElement('div'); el.id = 'floor-selector'; el.innerHTML = '<span class="fs-label">🏢 Floor:</span><button class="fs-btn active" id="fs-btn-1" onclick="selectFloor(1)">1st</button><button class="fs-btn" id="fs-btn-2" onclick="selectFloor(2)">2nd</button>'; document.body.appendChild(el); }
    el.classList.add('visible');
}
function hideFloorSelector() { const el = document.getElementById('floor-selector'); if (el) el.classList.remove('visible'); }
function selectFloor(n) {
    current2BHKFloor = n;
    document.getElementById('fs-btn-1').classList.toggle('active', n === 1); document.getElementById('fs-btn-2').classList.toggle('active', n === 2);
    if (typeof floor1Group !== 'undefined' && typeof floor2Group !== 'undefined') { floor1Group.visible = (n === 1); floor2Group.visible = (n === 2); }
    if (typeof boyState !== 'undefined' && boyState.mode === 'indoor' && boyState.insideHouse === '2bhk') { const yo = (n - 1) * (H + 0.3); boyGroup.position.y = 0.15 + yo; camera.position.y = boyGroup.position.y + 6; controls.target.y = boyGroup.position.y + 1.5; controls.update(); }
    buildAppliancePanel(); recalcWattage();
}

// ═══════════════════════════════════════════════
//  GAMIFIED TASK LIST & SAVINGS MODE
// ═══════════════════════════════════════════════
const savingsBaseline = { totalWatts: 3500, dailyCost: 224 };
const gameTasks = [
    { id: 'ac_off', text: 'Turn off AC when leaving room', done: false, icon: '❄️' },
    { id: 'solar_peak', text: 'Use solar during peak hours', done: false, icon: '☀️' },
    { id: 'led_switch', text: 'Switch to LED lights', done: true, icon: '💡' },
    { id: 'fan_off', text: 'Turn off fan when not needed', done: false, icon: '🌀' },
    { id: 'unplug', text: 'Unplug unused chargers', done: false, icon: '🔌' }
];
function buildSavingsPanel() {
    let aw = 0; (is2BHK ? bhk2Appliances : simpleAppliances).forEach(a => { if (a.on) aw += a.watt; });
    const dc = Math.round(aw * 8 / 1000 * 8), saved = Math.max(0, savingsBaseline.dailyCost - dc);
    let h = '<div class="savings-header">🌱 Savings Mode</div><div class="savings-compare"><div class="sc-item"><span class="sc-label">Baseline</span><span class="sc-value">₹' + savingsBaseline.dailyCost + '/day</span></div><div class="sc-item"><span class="sc-label">Current</span><span class="sc-value sc-current">₹' + dc + '/day</span></div><div class="sc-item sc-saved"><span class="sc-label">Weekly Saved</span><span class="sc-value">₹' + (saved * 7) + '</span></div></div><div class="game-tasks-header">🎮 Energy Challenges</div>';
    gameTasks.forEach(t => { h += '<div class="game-task ' + (t.done ? 'done' : '') + '"><span class="gt-icon">' + t.icon + '</span><span class="gt-text">' + t.text + '</span><span class="gt-check">' + (t.done ? '✓' : '○') + '</span></div>'; });
    return h;
}
function updateStats() { recalcWattage(); }

// ═══════════════════════════════════════════════
//  DOOR HINT
// ═══════════════════════════════════════════════
function showDoorHint(show, houseId) {
    let h = document.getElementById('door-hint');
    if (!h) { h = document.createElement('div'); h.id = 'door-hint'; h.innerHTML = '<span class="hint-key">E</span><span id="hint-text">Enter House</span>'; document.body.appendChild(h); }
    if (show && houseId) { const t = document.getElementById('hint-text'); if (t) t.textContent = houseId === '1bhk' ? 'Enter 1BHK House' : 'Enter 2BHK House'; h.className = ''; }
    else { h.className = 'hidden'; }
}

// ═══════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════
function showToast(msg, dur) {
    dur = dur || 3000;
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(window._toastTimer); window._toastTimer = setTimeout(() => t.classList.remove('show'), dur);
}

// ═══════════════════════════════════════════════
//  VIEW MODE BADGE
// ═══════════════════════════════════════════════
function createViewModeBadge() {
    const b = document.createElement('div'); b.id = 'view-mode-badge';
    b.innerHTML = '<span id="view-mode-icon">👁️</span><span id="view-mode-label">First Person</span><span class="view-mode-switch">⇄ Switch</span>';
    document.body.appendChild(b);
    b.addEventListener('click', () => {
        if (typeof window.gameState === 'undefined' || typeof window.STATE === 'undefined') return;
        if (window.gameState !== window.STATE.INSIDE) return;
        const next = window.cameraMode === 'firstperson' ? 'thirdperson' : 'firstperson';
        if (typeof window.setCameraMode === 'function') window.setCameraMode(next);
    });
}
function updateViewModeBadge(mode) {
    const i = document.getElementById('view-mode-icon'), l = document.getElementById('view-mode-label');
    if (!i || !l) return;
    i.textContent = mode === 'firstperson' ? '👁️' : '🎮';
    l.textContent = mode === 'firstperson' ? 'First Person' : 'Watch Boy';
    const b = document.getElementById('view-mode-badge');
    if (b) { b.classList.add('flash'); setTimeout(() => b.classList.remove('flash'), 400); }
}
function showViewModeBadge(v) { const b = document.getElementById('view-mode-badge'); if (b) b.style.display = v ? 'flex' : 'none'; }

// ═══════════════════════════════════════════════
//  ENERGY PANEL (legacy — kept for reference only)
// ═══════════════════════════════════════════════
function showEnergyPanel() {
    openEnergyModal();
}

// ═══════════════════════════════════════════════
//  INJECT CSS
// ═══════════════════════════════════════════════
(function () {
    const s = document.createElement('style');
    s.textContent = '#room-popup{position:fixed;bottom:80px;left:270px;width:260px;max-height:320px;background:linear-gradient(160deg,#3E2004,#6B3A0A);border:3px solid #C8860A;border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.7);padding:0;transform:translateY(120%);transition:transform .35s cubic-bezier(.34,1.56,.64,1);z-index:500;font-family:Georgia,serif}#room-popup.visible{transform:translateY(0)}#room-popup.hidden{display:none}.popup-banner{background:linear-gradient(90deg,#8B4513,#D2691E,#8B4513);border-radius:11px 11px 0 0;padding:8px 12px;display:flex;align-items:center;gap:8px}.popup-icon{font-size:1.2rem}.popup-title{font-size:0.95rem;font-weight:bold;color:#FFE066}.popup-body{padding:8px 12px}.appliance-item{display:flex;justify-content:space-between;font-size:.75rem;color:#F5DEB3;padding:2px 0;border-bottom:1px solid rgba(200,134,10,.2)}.status-on{color:#66FF88;font-weight:bold}.status-off{color:#888}.total-watts,.total-consumption{margin-top:6px;font-size:.85rem;color:#FFD700;font-weight:bold;text-align:center}.energy-tip{margin-top:4px;font-size:.72rem;color:#A8FFB0;font-style:italic;padding:4px 6px;background:rgba(0,100,0,.25);border-radius:6px}.popup-explore-btn{display:block;width:calc(100% - 16px);margin:6px 8px;padding:6px;background:linear-gradient(180deg,#FF9800,#E65100);border:2px solid #BF360C;border-radius:8px;color:#fff;font-size:.82rem;font-weight:bold;cursor:pointer;box-shadow:0 3px 0 #8B2000}#fade-overlay{position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:1500;transition:opacity .4s ease}#toast{position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-60px);background:rgba(0,0,0,.82);color:#FFE066;padding:9px 22px;border-radius:20px;font-family:Georgia,serif;font-size:.9rem;transition:transform .35s ease;z-index:1800;border:1px solid rgba(255,224,102,.3)}#toast.show{transform:translateX(-50%) translateY(0)}#view-mode-badge{position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#1a2a1a,#2d4a2d);border:2px solid #4CAF50;border-radius:24px;padding:8px 16px;display:none;align-items:center;gap:8px;cursor:pointer;z-index:800;font-family:Georgia,serif;box-shadow:0 4px 16px rgba(0,0,0,.5);transition:all .2s;user-select:none}#view-mode-badge:hover{border-color:#81C784;transform:scale(1.04)}#view-mode-icon{font-size:1.1rem}#view-mode-label{color:#FFE066;font-size:.82rem;font-weight:bold}.view-mode-switch{color:#81C784;font-size:.72rem;padding:2px 8px;border:1px solid #4CAF50;border-radius:10px}#view-mode-badge.flash{animation:badgeFlash .4s}@keyframes badgeFlash{0%{background:linear-gradient(135deg,#1a2a1a,#2d4a2d)}50%{background:linear-gradient(135deg,#2E7D32,#388E3C)}100%{background:linear-gradient(135deg,#1a2a1a,#2d4a2d)}}#energy-panel{position:fixed;right:-520px;top:50%;transform:translateY(-50%);width:500px;background:linear-gradient(160deg,#0d1f0d,#1a3a1a);border:2px solid #4CAF50;border-radius:16px 0 0 16px;padding:16px;transition:right .4s;z-index:900;box-shadow:-4px 0 30px rgba(0,0,0,.6)}#energy-panel.open{right:0}.ep-header{color:#FFE066;font-family:Georgia,serif;font-size:1rem;font-weight:bold;display:flex;justify-content:space-between;margin-bottom:12px}.ep-header button{background:none;border:none;color:#FFE066;font-size:1rem;cursor:pointer}.ep-charts{display:flex;gap:12px}.ep-chart-wrap{flex:1}.ep-chart-title{color:#A8D5A2;font-size:.8rem;text-align:center;margin-bottom:6px;font-family:Georgia,serif}' +
        /* Energy Comparison Panel */
        '#energy-compare-panel{position:fixed;right:-660px;top:50%;transform:translateY(-50%);width:620px;max-height:85vh;overflow-y:auto;background:linear-gradient(160deg,#0d1a2e,#1a2d4a);border:2px solid #6C5CE7;border-radius:18px 0 0 18px;padding:20px 22px;transition:right .45s cubic-bezier(.4,0,.2,1);z-index:1100;box-shadow:-6px 0 40px rgba(0,0,0,.7);font-family:Georgia,serif}' +
        '#energy-compare-panel.open{right:0}' +
        '.ecp-close{position:absolute;top:12px;right:14px;background:none;border:none;color:#FFE066;font-size:1.3rem;cursor:pointer;z-index:10}' +
        '.ecp-title{text-align:center;color:#FFE066;font-size:1.15rem;font-weight:bold;margin-bottom:14px}' +
        '.ecp-body{display:flex;gap:8px;align-items:flex-start}' +
        '.ecp-section{flex:1;background:rgba(255,255,255,.04);border-radius:12px;padding:10px 12px}' +
        '.ecp-section-header{padding:8px 12px;border-radius:8px;text-align:center;font-size:.9rem;font-weight:bold;margin-bottom:10px}' +
        '.ecp-header-1bhk{background:linear-gradient(135deg,#6C5CE7,#A29BFE);color:#fff}' +
        '.ecp-header-2bhk{background:linear-gradient(135deg,#00B894,#55EFC4);color:#1a1a2e}' +
        '.ecp-bar-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}' +
        '.ecp-bar-label{width:70px;font-size:.72rem;color:#ccc;text-align:right;flex-shrink:0}' +
        '.ecp-bar-track{flex:1;height:20px;background:rgba(255,255,255,.08);border-radius:6px;overflow:hidden}' +
        '.ecp-bar-fill{height:100%;border-radius:6px;display:flex;align-items:center;justify-content:flex-end;padding-right:6px;font-size:.65rem;color:#fff;font-weight:bold;transition:width .5s ease}' +
        '.ecp-total{text-align:center;color:#FFE066;font-size:.85rem;margin-top:10px;padding-top:6px;border-top:1px solid rgba(255,255,255,.1)}' +
        '.ecp-daily{text-align:center;color:#A8D5A2;font-size:.75rem;margin-top:4px}' +
        '.ecp-divider{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 4px;gap:6px}' +
        '.ecp-vs-line{width:2px;height:40px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.3),transparent)}' +
        '.ecp-vs-badge{background:linear-gradient(135deg,#FF6B35,#F7C948);color:#1a1a2e;font-size:.7rem;font-weight:bold;padding:4px 8px;border-radius:10px}' +
        '.ecp-comparison{margin-top:14px;text-align:center;color:#A8FFB0;font-size:.8rem;padding:10px;background:rgba(0,100,0,.2);border-radius:10px;border:1px solid rgba(76,175,80,.3)}' +
        '.ecp-comparison strong{color:#FFE066}';
    document.head.appendChild(s);
})();
