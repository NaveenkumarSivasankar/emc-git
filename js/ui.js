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
}

// ═══════════════════════════════════════════════
//  WATTAGE & BAR CHART
// ═══════════════════════════════════════════════
function recalcWattage() {
    let total = 0;
    if (is2BHK) {
        bhk2Appliances.forEach(a => { if (a.on) total += a.watt; });
    } else {
        simpleAppliances.forEach(a => { if (a.on) total += a.watt; });
    }
    const el = document.getElementById('stat-consumption');
    if (el) el.textContent = total.toLocaleString() + ' W';
    const panelsNeeded = Math.max(1, Math.ceil(total / 350));
    const statPanels = document.getElementById('stat-panels');
    if (statPanels) statPanels.textContent = currentPanelCount + ' / ' + panelsNeeded + ' needed';
    const coverageRatio = Math.min(currentPanelCount / panelsNeeded, 1);
    const monthlySaving = Math.round(coverageRatio * total * 0.72 * 30 / 1000 * 8);
    const co2Saved = Math.round(coverageRatio * total * 0.0007 * 365);
    const statSavings = document.getElementById('stat-savings');
    if (statSavings) statSavings.textContent = '₹' + monthlySaving.toLocaleString();
    const statCo2 = document.getElementById('stat-co2');
    if (statCo2) statCo2.textContent = co2Saved + ' kg/yr';
    updateBarChart(total, coverageRatio);
}

function updateBarChart(totalW, coverageRatio) {
    const solarPct = Math.round(coverageRatio * 100);
    const gridPct = 100 - solarPct;
    const gridBar = document.getElementById('grid-bar');
    if (gridBar) { gridBar.style.width = Math.max(gridPct, 5) + '%'; gridBar.textContent = gridPct + '%'; }
    const solarBar = document.getElementById('solar-bar');
    if (solarBar) { solarBar.style.width = Math.max(solarPct, 5) + '%'; solarBar.textContent = solarPct + '%'; }
    const dailyKwh = totalW * 8 / 1000;
    const gridCostDaily = Math.round(dailyKwh * (1 - coverageRatio) * 8);
    const solarSavingsDaily = Math.round(dailyKwh * coverageRatio * 8);
    const monthlyBill = Math.round(gridCostDaily * 30);
    const calcGrid = document.getElementById('calc-grid');
    if (calcGrid) calcGrid.textContent = '₹' + gridCostDaily;
    const calcSolar = document.getElementById('calc-solar');
    if (calcSolar) calcSolar.textContent = '₹' + solarSavingsDaily;
    const calcMonthly = document.getElementById('calc-monthly');
    if (calcMonthly) calcMonthly.textContent = '₹' + monthlyBill;
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
        controls.target.set(-22, 4, 0);
        camera.position.set(-22, 20, 35);
    } else {
        is2BHK = true;
        controls.target.set(24, 4, 0);
        camera.position.set(24, 20, 35);
    }
    controls.update();
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
//  ENERGY CHART TOGGLE
// ═══════════════════════════════════════════════
function toggleEnergyChart() {
    openEnergyModal();
}

function toggleRoomNav() {
    const panel = document.getElementById('room-nav-panel');
    panel.classList.toggle('visible');
}

// ═══════════════════════════════════════════════
//  ROOM ENTRY POPUP SYSTEM — Clash of Clans Style
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
    const normalizedName = normalizeRoomName(roomName);
    const data = ROOM_DATA[normalizedName];
    console.log('[UI] Room popup triggered: ' + roomName + ' → ' + normalizedName);

    let popup = document.getElementById('room-popup');
    if (!popup) { popup = document.createElement('div'); popup.id = 'room-popup'; document.body.appendChild(popup); }
    popup.classList.remove('hidden');

    let applianceList = [], totalWatts = 0, tip = '';
    if (data) {
        const gameAppliances = houseId === '2bhk' ? bhk2Appliances : simpleAppliances;
        const roomAppliances = gameAppliances.filter(a => normalizeRoomName(a.room) === normalizedName);
        if (roomAppliances.length > 0) {
            roomAppliances.forEach(a => { totalWatts += a.on ? a.watt : 0; applianceList.push({ name: a.name, watts: a.watt, isOn: a.on }); });
        } else {
            data.appliances.forEach(a => { totalWatts += a.isOn ? a.watts : 0; applianceList.push(a); });
        }
        tip = data.tip;
    } else { tip = '💡 Every watt saved helps the planet!'; }

    const appHTML = applianceList.map(a => {
        const isOn = a.isOn !== undefined ? a.isOn : a.on;
        const watts = a.watts !== undefined ? a.watts : a.watt;
        return '<div class="appliance-item"><span>' + a.name + '</span><span class="' + (isOn ? 'status-on' : 'status-off') + '">' + (isOn ? '✅ ' + watts + 'W' : '⬜ OFF') + '</span></div>';
    }).join('');

    popup.innerHTML = '<div class="popup-banner"><span class="popup-icon">' + (data ? data.icon : '🏠') + '</span><span class="popup-title">' + (data ? data.name : normalizedName) + '</span></div>' +
        '<div class="popup-body">' + appHTML + '<div class="total-watts">⚡ ' + totalWatts + 'W active</div><div class="energy-tip">💡 ' + tip + '</div></div>' +
        '<button class="popup-explore-btn" onclick="closeRoomPopup()">✨ EXPLORE!</button>';

    requestAnimationFrame(() => popup.classList.add('visible'));
    clearTimeout(window.popupTimer);
    window.popupTimer = setTimeout(closeRoomPopup, 6000);
}

function closeRoomPopup() {
    const p = document.getElementById('room-popup'); if (!p) return;
    p.classList.remove('visible'); setTimeout(() => p.classList.add('hidden'), 350);
    clearTimeout(window.popupTimer);
}
window.closeRoomPopup = closeRoomPopup;
function hideRoomPopup() { closeRoomPopup(); }

// ═══════════════════════════════════════════════
//  SOLAR SELECTOR
// ═══════════════════════════════════════════════
let solarSelectorEl = null;
function createSolarSelector() {
    if (solarSelectorEl) return;
    solarSelectorEl = document.createElement('div'); solarSelectorEl.id = 'solar-selector-modal';
    solarSelectorEl.innerHTML = '<div class="ssm-backdrop" onclick="closeSolarSelector()"></div><div class="ssm-content"><button class="ssm-close" onclick="closeSolarSelector()">✕</button><h2 class="ssm-title">☀️ Select Solar Installation</h2><p class="ssm-subtitle">Choose which house</p><div class="ssm-buttons"><button class="ssm-btn ssm-1bhk" onclick="selectSolarHouse(\'1bhk\')">🏠 1BHK</button><button class="ssm-btn ssm-2bhk" onclick="selectSolarHouse(\'2bhk\')">🏢 2BHK</button><button class="ssm-btn ssm-both" onclick="selectSolarHouse(\'both\')">🏘️ Both</button></div><button class="ssm-cancel" onclick="closeSolarSelector()">Cancel</button></div>';
    document.body.appendChild(solarSelectorEl);
}
function showSolarSelector() { createSolarSelector(); solarSelectorEl.classList.add('visible'); }
function closeSolarSelector() { if (solarSelectorEl) solarSelectorEl.classList.remove('visible'); }
let solarTarget = null;
function selectSolarHouse(target) { solarTarget = target; closeSolarSelector(); performSolarToggle(target); }
function performSolarToggle(target) {
    isSolarMode = true; solarTarget = target;
    const btn = document.getElementById('solar-btn'), btnText = document.getElementById('solar-btn-text'), btnIcon = document.getElementById('solar-btn-icon'), pc = document.getElementById('panel-counter');
    if (btn) btn.className = 'solar-mode bottom-action-btn'; if (btnText) btnText.textContent = 'Remove Solar'; if (btnIcon) btnIcon.textContent = '⚡'; if (pc) pc.classList.add('visible');
    currentPanelCount = 6; if (target === '1bhk') is2BHK = false; else if (target === '2bhk') is2BHK = true;
    layoutSolarPanels(currentPanelCount);
    if (typeof updatePowerLines === 'function') updatePowerLines(); if (typeof updateStats === 'function') updateStats();
}

// ═══════════════════════════════════════════════
//  DYNAMIC ENERGY
// ═══════════════════════════════════════════════
const dynamicEnergy = { sessionStart: Date.now(), cumulativeWh: 0, lastTick: Date.now(), intervalId: null };
function startEnergyTracking() {
    if (dynamicEnergy.intervalId) return; dynamicEnergy.sessionStart = Date.now(); dynamicEnergy.cumulativeWh = 0; dynamicEnergy.lastTick = Date.now();
    dynamicEnergy.intervalId = setInterval(updateDynamicEnergy, 1000);
}
function updateDynamicEnergy() {
    const now = Date.now(), dtH = (now - dynamicEnergy.lastTick) / 3600000; dynamicEnergy.lastTick = now;
    let aw = 0; (is2BHK ? bhk2Appliances : simpleAppliances).forEach(a => { if (a.on) aw += a.watt; });
    dynamicEnergy.cumulativeWh += aw * dtH;
    const em = document.getElementById('stat-per-minute'); if (em) em.textContent = (aw / 60).toFixed(2) + ' Wh/min';
    const eh = document.getElementById('stat-per-hour'); if (eh) eh.textContent = aw.toFixed(0) + ' W/hr';
    const ec = document.getElementById('stat-cumulative'); if (ec) ec.textContent = dynamicEnergy.cumulativeWh.toFixed(2) + ' Wh';
    if (typeof trackApplianceDuration === 'function') trackApplianceDuration();
}
window.addEventListener('DOMContentLoaded', () => { setTimeout(startEnergyTracking, 500); });

// ═══════════════════════════════════════════════
//  FLOOR SELECTOR
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
//  GAMIFIED SAVINGS
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
//  ENERGY PANEL (Chart.js)
// ═══════════════════════════════════════════════
function showEnergyPanel() {
    let p = document.getElementById('energy-panel');
    if (p) { p.classList.toggle('open'); return; }
    p = document.createElement('div'); p.id = 'energy-panel';
    p.innerHTML = '<div class="ep-header">📊 Energy Report<button onclick="document.getElementById(\'energy-panel\').classList.toggle(\'open\')">✕</button></div><div class="ep-charts"><div class="ep-chart-wrap"><div class="ep-chart-title">🏠 1BHK</div><canvas id="chart1bhk" width="220" height="180"></canvas></div><div class="ep-chart-wrap"><div class="ep-chart-title">🏘️ 2BHK</div><canvas id="chart2bhk" width="220" height="180"></canvas></div></div>';
    document.body.appendChild(p); setTimeout(() => p.classList.add('open'), 10);
    if (typeof Chart !== 'undefined') {
        const o = { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: '#FFE066', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { ticks: { color: '#FFE066', font: { size: 10 } }, grid: { display: false } } } };
        new Chart(document.getElementById('chart1bhk'), { type: 'bar', data: { labels: ['Hall', 'Bedroom', 'Kitchen', 'Bath'], datasets: [{ label: 'W', data: [95, 90, 230, 10], backgroundColor: ['#FF6B35', '#F7C948', '#4ECDC4', '#45B7D1'], borderRadius: 6 }] }, options: o });
        new Chart(document.getElementById('chart2bhk'), { type: 'bar', data: { labels: ['Hall', 'Bed1', 'Bed2', 'Kitchen', 'Bath'], datasets: [{ label: 'W', data: [95, 90, 75, 230, 10], backgroundColor: ['#FF6B35', '#F7C948', '#96CEB4', '#4ECDC4', '#45B7D1'], borderRadius: 6 }] }, options: o });
    }
}

// ═══════════════════════════════════════════════
//  INJECT CSS
// ═══════════════════════════════════════════════
(function () {
    const s = document.createElement('style');
    s.textContent = '#room-popup{position:fixed;bottom:20px;left:20px;width:280px;background:linear-gradient(160deg,#3E2004,#6B3A0A);border:3px solid #C8860A;border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.7);padding:0;transform:translateY(120%);transition:transform .35s cubic-bezier(.34,1.56,.64,1);z-index:1000;font-family:Georgia,serif}#room-popup.visible{transform:translateY(0)}#room-popup.hidden{display:none}.popup-banner{background:linear-gradient(90deg,#8B4513,#D2691E,#8B4513);border-radius:11px 11px 0 0;padding:10px 14px;display:flex;align-items:center;gap:8px}.popup-icon{font-size:1.4rem}.popup-title{font-size:1rem;font-weight:bold;color:#FFE066}.popup-body{padding:10px 14px}.appliance-item{display:flex;justify-content:space-between;font-size:.78rem;color:#F5DEB3;padding:3px 0;border-bottom:1px solid rgba(200,134,10,.2)}.status-on{color:#66FF88;font-weight:bold}.status-off{color:#888}.total-watts,.total-consumption{margin-top:8px;font-size:.85rem;color:#FFD700;font-weight:bold;text-align:center}.energy-tip{margin-top:6px;font-size:.72rem;color:#A8FFB0;font-style:italic;padding:5px 8px;background:rgba(0,100,0,.25);border-radius:6px}.popup-explore-btn{display:block;width:calc(100% - 20px);margin:8px 10px;padding:8px;background:linear-gradient(180deg,#FF9800,#E65100);border:2px solid #BF360C;border-radius:8px;color:#fff;font-size:.85rem;font-weight:bold;cursor:pointer;box-shadow:0 3px 0 #8B2000}#fade-overlay{position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:1500;transition:opacity .4s ease}#toast{position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-60px);background:rgba(0,0,0,.82);color:#FFE066;padding:9px 22px;border-radius:20px;font-family:Georgia,serif;font-size:.9rem;transition:transform .35s ease;z-index:1800;border:1px solid rgba(255,224,102,.3)}#toast.show{transform:translateX(-50%) translateY(0)}#view-mode-badge{position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#1a2a1a,#2d4a2d);border:2px solid #4CAF50;border-radius:24px;padding:8px 16px;display:none;align-items:center;gap:8px;cursor:pointer;z-index:800;font-family:Georgia,serif;box-shadow:0 4px 16px rgba(0,0,0,.5);transition:all .2s;user-select:none}#view-mode-badge:hover{border-color:#81C784;transform:scale(1.04)}#view-mode-icon{font-size:1.1rem}#view-mode-label{color:#FFE066;font-size:.82rem;font-weight:bold}.view-mode-switch{color:#81C784;font-size:.72rem;padding:2px 8px;border:1px solid #4CAF50;border-radius:10px}#view-mode-badge.flash{animation:badgeFlash .4s}@keyframes badgeFlash{0%{background:linear-gradient(135deg,#1a2a1a,#2d4a2d)}50%{background:linear-gradient(135deg,#2E7D32,#388E3C)}100%{background:linear-gradient(135deg,#1a2a1a,#2d4a2d)}}#energy-panel{position:fixed;right:-520px;top:50%;transform:translateY(-50%);width:500px;background:linear-gradient(160deg,#0d1f0d,#1a3a1a);border:2px solid #4CAF50;border-radius:16px 0 0 16px;padding:16px;transition:right .4s;z-index:900;box-shadow:-4px 0 30px rgba(0,0,0,.6)}#energy-panel.open{right:0}.ep-header{color:#FFE066;font-family:Georgia,serif;font-size:1rem;font-weight:bold;display:flex;justify-content:space-between;margin-bottom:12px}.ep-header button{background:none;border:none;color:#FFE066;font-size:1rem;cursor:pointer}.ep-charts{display:flex;gap:12px}.ep-chart-wrap{flex:1}.ep-chart-title{color:#A8D5A2;font-size:.8rem;text-align:center;margin-bottom:6px;font-family:Georgia,serif}';
    document.head.appendChild(s);
})();
