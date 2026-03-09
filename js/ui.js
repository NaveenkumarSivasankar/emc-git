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
    // 'generic', 'fridge', 'tablefan' kinds: no mesh toggle needed
    recalcWattage();
    buildAppliancePanel();
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
    // 'generic' kind: no mesh toggle needed
    recalcWattage();
    buildAppliancePanel();
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
    const monthlySaving = Math.round(coverageRatio * total * 0.72 * 30 / 1000 * 8);
    const co2Saved = Math.round(coverageRatio * total * 0.0007 * 365);

    setText('stat-savings', '₹' + monthlySaving.toLocaleString());
    setText('stat-co2', co2Saved + ' kg/yr');

    updateBarChart(total, coverageRatio);
}

function updateBarChart(totalW, coverageRatio) {
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    const setWidth = (id, pct) => { const el = document.getElementById(id); if (el) el.style.width = pct; };

    const solarPct = Math.round(coverageRatio * 100);
    const gridPct = 100 - solarPct;

    setWidth('grid-bar', Math.max(gridPct, 5) + '%');
    setText('grid-bar', gridPct + '%');

    setWidth('solar-bar', Math.max(solarPct, 5) + '%');
    setText('solar-bar', solarPct + '%');

    const dailyKwh = totalW * 8 / 1000;
    const gridCostDaily = Math.round(dailyKwh * (1 - coverageRatio) * 8);
    const solarSavingsDaily = Math.round(dailyKwh * coverageRatio * 8);
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
        controls.target.set(-22, 4, 0);
        camera.position.set(-22, 20, 35);
    } else {
        is2BHK = true;
        controls.target.set(24, 4, 0);
        camera.position.set(24, 20, 35);
    }
    controls.update();
    if (typeof positionSolarPanels === 'function') positionSolarPanels();
    buildAppliancePanel();
    buildRoomNavPanel();
    recalcWattage();
    // Hide back button when switching houses
    document.getElementById('back-btn').classList.remove('visible');
}
function toggleUpgrade() { focusHouse('2bhk'); }

// ═══════════════════════════════════════════════
//  ROOM NAVIGATION PANEL
// ═══════════════════════════════════════════════
// 2BHK room zoom positions
const bhk2RoomPositions = {
    'Hall': { target: new THREE.Vector3(29, 3.5, 4), camera: new THREE.Vector3(29, 12, 20) },
    'Bedroom 1': { target: new THREE.Vector3(17, 3.5, -8.5), camera: new THREE.Vector3(17, 12, 4) },
    'Bedroom 2': { target: new THREE.Vector3(31, 3.5, -8.5), camera: new THREE.Vector3(31, 12, 4) },
    'Kitchen': { target: new THREE.Vector3(14.5, 3.5, -1), camera: new THREE.Vector3(14.5, 12, 12) },
    'Bathroom': { target: new THREE.Vector3(14.5, 3.5, 7.5), camera: new THREE.Vector3(14.5, 12, 18) }
};

function buildRoomNavPanel() {
    const panel = document.getElementById('room-nav-panel');
    let rooms;
    let roomIcons;

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
    const positions = is2BHK ? bhk2RoomPositions : bhk1RoomPositions;
    const pos = positions[roomName];
    if (!pos) return;

    // Smooth camera animation
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const endPos = pos.camera;
    const endTarget = pos.target;

    let progress = 0;
    const duration = 60; // frames

    function animateZoom() {
        progress++;
        const t = Math.min(progress / duration, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease in-out

        camera.position.lerpVectors(startPos, endPos, ease);
        controls.target.lerpVectors(startTarget, endTarget, ease);
        controls.update();

        if (t < 1) {
            requestAnimationFrame(animateZoom);
        }
    }
    animateZoom();

    // Show back button
    document.getElementById('back-btn').classList.add('visible');

    // Highlight active room button
    document.querySelectorAll('.room-nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.room-nav-btn').classList.add('active');
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
