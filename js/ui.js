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

    const popup = document.getElementById('room-popup');
    if (!popup) return;

    popup.classList.remove('hidden');

    // Use actual appliance data from the game if available
    let applianceList = [];
    let totalWatts = 0;
    let tip = '';

    if (data) {
        // Try to use live appliance data
        const gameAppliances = houseId === '2bhk' ? bhk2Appliances : simpleAppliances;
        const roomAppliances = gameAppliances.filter(a => {
            const aRoom = normalizeRoomName(a.room);
            return aRoom === normalizedName;
        });

        if (roomAppliances.length > 0) {
            roomAppliances.forEach(a => {
                const watts = a.on ? a.watt : 0;
                totalWatts += watts;
                applianceList.push({ name: a.name, watts: a.watt, isOn: a.on });
            });
        } else {
            // Fall back to static data
            data.appliances.forEach(a => {
                const watts = a.isOn ? a.watts : 0;
                totalWatts += watts;
                applianceList.push(a);
            });
        }
        tip = data.tip;
    } else {
        tip = '💡 Every watt saved helps the planet!';
    }

    // Set icon and title
    const iconEl = popup.querySelector('.popup-icon');
    const titleEl = popup.querySelector('.popup-title');
    if (iconEl) iconEl.textContent = data ? data.icon : '🏠';
    if (titleEl) titleEl.textContent = data ? data.name : normalizedName;

    // Build appliance list
    const listEl = popup.querySelector('.appliance-list');
    if (listEl) {
        listEl.innerHTML = '';
        applianceList.forEach(a => {
            const item = document.createElement('div');
            item.className = 'appliance-item';
            const isOn = a.isOn !== undefined ? a.isOn : a.on;
            const watts = a.watts !== undefined ? a.watts : a.watt;
            item.innerHTML =
                '<span>' + (a.name || '') + '</span>' +
                '<span class="' + (isOn ? 'status-on' : 'status-off') + '">' +
                (isOn ? '✅ ' + watts + 'W' : '⬜ OFF') +
                '</span>';
            listEl.appendChild(item);
        });
    }

    // Total consumption
    const totalEl = popup.querySelector('.total-consumption');
    if (totalEl) totalEl.textContent = '⚡ Room consuming: ' + totalWatts + 'W right now';

    // Energy tip
    const tipEl = popup.querySelector('.energy-tip');
    if (tipEl) tipEl.textContent = tip;

    // Trigger slide-up animation
    requestAnimationFrame(() => {
        popup.classList.add('visible');
    });

    console.log('[UI] Popup shown for ' + normalizedName);

    // Auto-dismiss after 6 seconds
    clearTimeout(window.popupTimer);
    window.popupTimer = setTimeout(closeRoomPopup, 6000);
}

function closeRoomPopup() {
    const popup = document.getElementById('room-popup');
    if (!popup) return;
    popup.classList.remove('visible');
    setTimeout(() => popup.classList.add('hidden'), 400);
    clearTimeout(window.popupTimer);
}

// Legacy alias
function hideRoomPopup() {
    closeRoomPopup();
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

let solarTarget = null;

// NOTE: selectSolarHouse is defined in solar.js — do NOT redefine here
// This was previously causing a conflict/freeze. The solar.js version
// handles per-house solar state (houseState) correctly.
function selectSolarHouseUI(target) {
    solarTarget = target;
    closeSolarSelector();
    performSolarToggle(target);
}

function performSolarToggle(target) {
    isSolarMode = true;
    solarTarget = target;
    const btn = document.getElementById('solar-btn');
    const btnText = document.getElementById('solar-btn-text');
    const btnIcon = document.getElementById('solar-btn-icon');
    const panelCounter = document.getElementById('panel-counter');

    if (btn) btn.className = 'solar-mode bottom-action-btn';
    if (btnText) btnText.textContent = 'Remove Solar';
    if (btnIcon) btnIcon.textContent = '⚡';
    if (panelCounter) panelCounter.classList.add('visible');

    currentPanelCount = 6;
    if (target === '1bhk') {
        is2BHK = false;
    } else if (target === '2bhk') {
        is2BHK = true;
    }
    layoutSolarPanels(currentPanelCount);

    if (typeof updatePowerLines === 'function') updatePowerLines();
    if (typeof updateStats === 'function') updateStats();
}

// ═══════════════════════════════════════════════
//  DYNAMIC ENERGY DATA (live updating)
// ═══════════════════════════════════════════════
const dynamicEnergy = {
    sessionStart: Date.now(),
    cumulativeWh: 0,
    lastTick: Date.now(),
    perMinuteW: 0,
    perHourW: 0,
    intervalId: null
};

function startEnergyTracking() {
    if (dynamicEnergy.intervalId) return;
    dynamicEnergy.sessionStart = Date.now();
    dynamicEnergy.cumulativeWh = 0;
    dynamicEnergy.lastTick = Date.now();

    dynamicEnergy.intervalId = setInterval(() => {
        updateDynamicEnergy();
    }, 1000);
}

function updateDynamicEnergy() {
    const now = Date.now();
    const dtHours = (now - dynamicEnergy.lastTick) / 3600000;
    dynamicEnergy.lastTick = now;

    let activeWatts = 0;
    const list = is2BHK ? bhk2Appliances : simpleAppliances;
    list.forEach(a => { if (a.on) activeWatts += a.watt; });

    dynamicEnergy.cumulativeWh += activeWatts * dtHours;
    dynamicEnergy.perMinuteW = activeWatts;
    dynamicEnergy.perHourW = activeWatts;

    const elMinute = document.getElementById('stat-per-minute');
    if (elMinute) elMinute.textContent = (activeWatts / 60).toFixed(2) + ' Wh/min';
    const elHour = document.getElementById('stat-per-hour');
    if (elHour) elHour.textContent = (activeWatts).toFixed(0) + ' W/hr';
    const elCumulative = document.getElementById('stat-cumulative');
    if (elCumulative) elCumulative.textContent = dynamicEnergy.cumulativeWh.toFixed(2) + ' Wh';

    if (typeof trackApplianceDuration === 'function') trackApplianceDuration();
}

// Start tracking on load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(startEnergyTracking, 500);
});

// ═══════════════════════════════════════════════
//  FLOOR SELECTOR FOR 2BHK
// ═══════════════════════════════════════════════
let current2BHKFloor = 1;

function showFloorSelector() {
    let el = document.getElementById('floor-selector');
    if (!el) {
        el = document.createElement('div');
        el.id = 'floor-selector';
        el.innerHTML =
            '<span class="fs-label">🏢 Floor:</span>' +
            '<button class="fs-btn active" id="fs-btn-1" onclick="selectFloor(1)">1st Floor</button>' +
            '<button class="fs-btn" id="fs-btn-2" onclick="selectFloor(2)">2nd Floor</button>';
        document.body.appendChild(el);
    }
    el.classList.add('visible');
}

function hideFloorSelector() {
    const el = document.getElementById('floor-selector');
    if (el) el.classList.remove('visible');
}

function selectFloor(floorNum) {
    current2BHKFloor = floorNum;
    document.getElementById('fs-btn-1').classList.toggle('active', floorNum === 1);
    document.getElementById('fs-btn-2').classList.toggle('active', floorNum === 2);

    if (typeof floor1Group !== 'undefined' && typeof floor2Group !== 'undefined') {
        floor1Group.visible = (floorNum === 1);
        floor2Group.visible = (floorNum === 2);
    }

    if (typeof boyState !== 'undefined' && boyState.mode === 'indoor' && boyState.insideHouse === '2bhk') {
        const yOffset = (floorNum - 1) * (H + 0.3);
        boyGroup.position.y = 0.15 + yOffset;
        camera.position.y = boyGroup.position.y + 6;
        controls.target.y = boyGroup.position.y + 1.5;
        controls.update();
    }

    buildAppliancePanel();
    recalcWattage();
}

// ═══════════════════════════════════════════════
//  GAMIFIED TASK LIST & SAVINGS MODE
// ═══════════════════════════════════════════════
const savingsBaseline = {
    totalWatts: 3500,
    dailyCost: 224
};

const gameTasks = [
    { id: 'ac_off', text: 'Turn off AC when leaving room', done: false, icon: '❄️' },
    { id: 'solar_peak', text: 'Use solar during peak hours', done: false, icon: '☀️' },
    { id: 'led_switch', text: 'Switch to LED lights', done: true, icon: '💡' },
    { id: 'fan_off', text: 'Turn off fan when not needed', done: false, icon: '🌀' },
    { id: 'unplug', text: 'Unplug unused chargers', done: false, icon: '🔌' }
];

function buildSavingsPanel() {
    let activeW = 0;
    const list = is2BHK ? bhk2Appliances : simpleAppliances;
    list.forEach(a => { if (a.on) activeW += a.watt; });

    const currentDailyCost = Math.round(activeW * 8 / 1000 * 8);
    const saved = Math.max(0, savingsBaseline.dailyCost - currentDailyCost);
    const weeklySaved = saved * 7;

    let html = '<div class="savings-header">🌱 Savings Mode</div>';
    html += '<div class="savings-compare">';
    html += '<div class="sc-item"><span class="sc-label">Baseline</span><span class="sc-value">₹' + savingsBaseline.dailyCost + '/day</span></div>';
    html += '<div class="sc-item"><span class="sc-label">Current</span><span class="sc-value sc-current">₹' + currentDailyCost + '/day</span></div>';
    html += '<div class="sc-item sc-saved"><span class="sc-label">Weekly Saved</span><span class="sc-value">₹' + weeklySaved + '</span></div>';
    html += '</div>';

    html += '<div class="game-tasks-header">🎮 Energy Challenges</div>';
    gameTasks.forEach(t => {
        html += '<div class="game-task ' + (t.done ? 'done' : '') + '">' +
            '<span class="gt-icon">' + t.icon + '</span>' +
            '<span class="gt-text">' + t.text + '</span>' +
            '<span class="gt-check">' + (t.done ? '✓' : '○') + '</span>' +
            '</div>';
    });

    return html;
}

// ═══════════════════════════════════════════════
//  UPDATE STATS (safe wrapper)
// ═══════════════════════════════════════════════
function updateStats() {
    recalcWattage();
}
