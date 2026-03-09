// ═══════════════════════════════════════════════
//  SOLAR PANELS (adjusted for enlarged 1BHK)
// ═══════════════════════════════════════════════
const solarPanels = [];
const houseState = {
    '1bhk': { panels: [], count: 0, max: 0, isSolarMode: false },
    '2bhk': { panels: [], count: 0, max: 0, isSolarMode: false }
};

const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.25, metalness: 0.8 });
const panelFrameMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.3 });

function createSolarPanel() {
    const g = new THREE.Group();
    const panel = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.10, 1.8), panelMat);
    g.add(panel);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x283593 });
    for (let i = -3; i <= 3; i++) {
        const hLine = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.01, 0.02), gridMat);
        hLine.position.set(0, 0.06, i * 0.25); g.add(hLine);
    }
    for (let i = -4; i <= 4; i++) {
        const vLine = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.01, 1.75), gridMat);
        vLine.position.set(i * 0.29, 0.06, 0); g.add(vLine);
    }
    const frameParts = [
        new THREE.BoxGeometry(2.65, 0.14, 0.06), new THREE.BoxGeometry(2.65, 0.14, 0.06),
        new THREE.BoxGeometry(0.06, 0.14, 1.8), new THREE.BoxGeometry(0.06, 0.14, 1.8)
    ];
    const framePositions = [[0, 0, 0.9], [0, 0, -0.9], [-1.3, 0, 0], [1.3, 0, 0]];
    frameParts.forEach((geo, i) => {
        const mesh = new THREE.Mesh(geo, panelFrameMat);
        mesh.position.set(...framePositions[i]); g.add(mesh);
    });

    // ── MOUNTING STAND (two support legs) ──
    const standMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.4 });
    // Front leg (shorter — panel tilts toward sun)
    const frontLeg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), standMat);
    frontLeg.position.set(0, -0.22, 0.6); g.add(frontLeg);
    // Back leg (taller — supports the high side)
    const backLeg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.08), standMat);
    backLeg.position.set(0, -0.32, -0.6); g.add(backLeg);
    // Cross rail connecting both legs at the base
    const crossRail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.4), standMat);
    crossRail.position.set(0, -0.45, 0); g.add(crossRail);
    // Two additional side supports for stability
    const sideLegL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.06), standMat);
    sideLegL.position.set(-0.9, -0.25, 0); g.add(sideLegL);
    const sideLegR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.06), standMat);
    sideLegR.position.set(0.9, -0.25, 0); g.add(sideLegR);

    g.visible = false;
    return g;
}

function getRoofConfig(houseKey) {
    let roofWidthHalf, roofDepthHalf, startX, startZ, slopeAngle, baseRoofH, targetGroup, isLeft;

    if (houseKey === '2bhk') {
        roofWidthHalf = W2 / 2 + 0.8;
        roofDepthHalf = D2 / 2 + 0.8;
        startX = 1.0;
        startZ = -roofDepthHalf + 1.2;
        slopeAngle = Math.atan2(roofH + 1, roofWidthHalf);
        baseRoofH = roofH + 1;
        targetGroup = typeof bhk2Group !== 'undefined' ? bhk2Group : new THREE.Group();
    } else {
        const w = typeof W !== 'undefined' ? W : 28;
        const d = typeof D !== 'undefined' ? D : 22;
        const rh = typeof roofH !== 'undefined' ? roofH : 4.5;
        roofWidthHalf = w / 2 + 0.8;
        roofDepthHalf = d / 2 + 0.8;
        startX = 1.0;
        startZ = -roofDepthHalf + 1.2;
        slopeAngle = Math.atan2(rh, roofWidthHalf);
        baseRoofH = rh;
        targetGroup = typeof houseGroup !== 'undefined' ? houseGroup : new THREE.Group();
    }

    const panelGapX = 2.0;
    const panelGapZ = 1.4;
    const colsPerSide = Math.floor((roofWidthHalf - startX) / panelGapX);
    const rows = Math.floor((roofDepthHalf * 2 - 2.0) / panelGapZ);
    const max = colsPerSide * rows * 2;
    return { roofWidthHalf, roofDepthHalf, startX, startZ, slopeAngle, baseRoofH, targetGroup, panelGapX, panelGapZ, colsPerSide, rows, max };
}

function initializeHouseSolar(houseKey) {
    const state = houseState[houseKey];
    const config = getRoofConfig(houseKey);
    state.max = config.max;
}

setTimeout(() => {
    initializeHouseSolar('1bhk');
    initializeHouseSolar('2bhk');
}, 500);

// ═══════════════════════════════════════════════
//  ADD SOLAR PANEL BUTTONS ON HOUSES
// ═══════════════════════════════════════════════
(function createSolarButtons() {
    function makeSolarBtn(houseKey, targetGroup, yPos) {
        const btn = document.createElement('button');
        btn.className = 'add-solar-btn';
        btn.innerHTML = '☀️ Add Solar';
        btn.onclick = (e) => {
            e.stopPropagation();
            selectSolarHouse(houseKey);
        };
        const obj = new THREE.CSS2DObject(btn);
        obj.position.set(0, yPos, 0);
        targetGroup.add(obj);
        return obj;
    }

    setTimeout(() => {
        if (typeof houseGroup !== 'undefined') {
            makeSolarBtn('1bhk', houseGroup, H + roofH + 1.5);
        }
        if (typeof bhk2Group !== 'undefined') {
            makeSolarBtn('2bhk', bhk2Group, H + roofH + 2);
        }
    }, 600);
})();



// ═══════════════════════════════════════════════
//  SOLAR / GRID TOGGLE (Modal interaction handles specific house)
// ═══════════════════════════════════════════════
const funFacts = [
    "The sun produces enough energy in 1 hour to power the entire Earth for a year!",
    "Solar panels can last 25-30 years or more!",
    "A single solar panel can prevent 1 ton of CO₂ per year!",
    "India receives about 300 sunny days per year — perfect for solar!",
    "Solar energy is the most abundant energy source on Earth!",
    "The cost of solar panels has dropped by 99% since 1977!",
    "Solar panels work even on cloudy days — they use light, not heat!",
    "One solar panel can charge 120 smartphones in a day!"
];

function updateStats() {
    let total = 0;
    const activeKey = typeof is2BHK !== 'undefined' && is2BHK ? '2bhk' : '1bhk';
    const list = activeKey === '2bhk' ? bhk2Appliances : simpleAppliances;

    list.forEach(a => { if (a.on) total += a.watt; });

    const panelsNeeded = Math.max(1, Math.ceil(total / 350));
    const activeState = houseState[activeKey];

    const statConsumption = document.getElementById('stat-consumption');
    if (statConsumption) statConsumption.textContent = total.toLocaleString() + ' W';

    const statPanels = document.getElementById('stat-panels');
    if (statPanels) statPanels.textContent = activeState.count + ' / ' + panelsNeeded + ' needed';

    const coverageRatio = Math.min(activeState.count / panelsNeeded, 1);
    const monthlySaving = Math.round(coverageRatio * total * 0.72 * 30 / 1000 * 8);
    const co2Saved = Math.round(coverageRatio * total * 0.0007 * 365);

    const statSavings = document.getElementById('stat-savings');
    if (statSavings) statSavings.textContent = '₹' + monthlySaving.toLocaleString();

    const statCo2 = document.getElementById('stat-co2');
    if (statCo2) statCo2.textContent = co2Saved + ' kg/yr';

    const statFact = document.getElementById('stat-fact');
    if (statFact) statFact.textContent = funFacts[Math.floor(Math.random() * funFacts.length)];

    const panelNum = document.getElementById('panel-num');
    if (panelNum) panelNum.textContent = activeState.count;

    const btnText = document.getElementById('solar-btn-text');
    const btnIcon = document.getElementById('solar-btn-icon');
    const btn = document.getElementById('solar-btn');
    const panelCounter = document.getElementById('panel-counter');

    if (activeState.isSolarMode) {
        if (btn) btn.className = 'solar-mode bottom-action-btn';
        if (btnText) btnText.textContent = 'Remove Solar (' + activeKey.toUpperCase() + ')';
        if (btnIcon) btnIcon.textContent = '⚡';
        if (panelCounter) panelCounter.classList.add('visible');

    } else {
        if (btn) btn.className = 'grid-mode bottom-action-btn';
        if (btnText) btnText.textContent = 'Add Solar Panels';
        if (btnIcon) btnIcon.textContent = '☀️';
        if (panelCounter) panelCounter.classList.remove('visible');

    }

    updateBarChart(total, coverageRatio);
}

function openSolarModal() {
    document.getElementById('solar-selection-modal').classList.remove('modal-hidden');
}

function closeSolarModal() {
    document.getElementById('solar-selection-modal').classList.add('modal-hidden');
}

function selectSolarHouse(houseKey) {
    closeSolarModal();
    const state = houseState[houseKey];

    // Set the active house flag without camera manipulation
    // This avoids freezing when the boy is indoors or mid-transition
    if (typeof is2BHK !== 'undefined') {
        is2BHK = (houseKey === '2bhk');
    }

    // Only reposition camera if boy is NOT indoors (avoid disrupting indoor navigation)
    if (typeof boyState === 'undefined' || boyState.mode !== 'indoor') {
        if (typeof focusHouse === 'function') {
            focusHouse(houseKey === '2bhk' ? '2bhk' : 'simple');
        }
    }

    state.isSolarMode = true;

    // Clear any existing panels visually before resetting
    state.panels.forEach((p) => {
        if (p.group.parent) p.group.parent.remove(p.group);
    });

    state.panels = [];
    state.count = 0; // Initialize roof as purely empty

    if (typeof updatePowerLines === 'function') updatePowerLines();
    if (typeof updateStats === 'function') updateStats();
    if (typeof buildAppliancePanel === 'function') buildAppliancePanel();
    if (typeof recalcWattage === 'function') recalcWattage();
}

// Override original toggleSolar directly for our new button
function toggleSolar() {
    const activeKey = typeof is2BHK !== 'undefined' && is2BHK ? '2bhk' : '1bhk';
    const state = houseState[activeKey];

    if (state.isSolarMode) {
        state.isSolarMode = false;
        state.count = 0;
        state.panels.forEach(p => {
            p.group.visible = false;
            p.group.position.y = p.targetY + 15;
            p.animating = false;
        });
        if (typeof poleGroup !== 'undefined') poleGroup.children.forEach(child => { if (child.material) child.material.opacity = 1; });
        updatePowerLines();
        updateStats();
    } else {
        openSolarModal();
    }
}

function updatePowerLines() {
    if (typeof poleGroup === 'undefined') return;

    // Check BOTH houses for solar mode — grid should only fade based on combined coverage
    const state1 = houseState['1bhk'];
    const state2 = houseState['2bhk'];
    const anySolarMode = state1.isSolarMode || state2.isSolarMode;

    if (!anySolarMode) {
        // No solar on either house — grid fully visible
        poleGroup.children.forEach(child => {
            if (child.material) { child.material.transparent = true; child.material.opacity = 1; }
        });
        return;
    }

    // Calculate combined coverage from both houses
    let total1 = 0, total2 = 0;
    simpleAppliances.forEach(a => { if (a.on) total1 += a.watt; });
    bhk2Appliances.forEach(a => { if (a.on) total2 += a.watt; });
    const totalWatt = total1 + total2;

    const totalPanelsNeeded = Math.max(1, Math.ceil(totalWatt / 350));
    const totalPanels = state1.count + state2.count;
    const overallCoverage = Math.min(totalPanels / totalPanelsNeeded, 1);

    // Grid fades proportionally to overall solar coverage, minimum 0.3 so it stays visible
    const poleOpacity = Math.max(0.3, 1 - overallCoverage * 0.7);

    poleGroup.children.forEach(child => {
        if (child.material) { child.material.transparent = true; child.material.opacity = poleOpacity; }
    });
}


function changePanelCount(delta) {
    const activeKey = typeof is2BHK !== 'undefined' && is2BHK ? '2bhk' : '1bhk';
    const state = houseState[activeKey];

    if (!state.isSolarMode) return;

    const newCount = Math.max(0, Math.min(state.max, state.count + delta));
    if (newCount === state.count) {
        if (newCount === state.max && delta > 0) {
            alert("Maximum solar panels reached for this house.");
        }
        return;
    }

    const config = getRoofConfig(activeKey);

    if (delta > 0) {
        const idx = state.count; // the zero-based index of the panel being added
        const side = idx % 2 === 0 ? 1 : -1; // 1 for right, -1 for left
        const pairIdx = Math.floor(idx / 2);
        const row = pairIdx % config.rows;
        const col = Math.floor(pairIdx / config.rows);

        const g = createSolarPanel();

        // Calculate position dynamically
        const xOffset = config.startX + col * config.panelGapX * 1.05 + 0.9;
        const xPos = xOffset * side;
        const zPos = config.startZ + row * config.panelGapZ * 1.05 + 1.25;

        const hFallback = typeof H !== 'undefined' ? H : 7;
        const roofLocalY = hFallback + 0.3 + config.baseRoofH - Math.abs(xPos) * (config.baseRoofH / config.roofWidthHalf);

        g.rotation.set(0, 0, side * -config.slopeAngle);
        g.position.set(xPos, roofLocalY - 0.2, zPos);
        g.translateY(0.15); // float off roof slightly

        config.targetGroup.add(g);
        g.visible = true;

        const targetY = g.position.y;
        g.position.y = targetY + 15; // start from above for drop animation

        state.panels.push({ group: g, targetY: targetY, animating: true, frame: 0, delay: 0 });
    } else {
        const lastPanel = state.panels.pop();
        if (lastPanel && lastPanel.group && lastPanel.group.parent) {
            lastPanel.group.parent.remove(lastPanel.group);
        }
    }

    state.count = newCount;
    updatePowerLines();
    updateStats();
}

// Ensure the main animation loop can animate all panels if needed
if (!window.solarPanelsAnimHook) {
    window.solarPanelsAnimHook = true;
    const originalAnimate = window.animate;
}
// Continuously flush all active panels back into global `solarPanels` for animation 
setInterval(() => {
    solarPanels.length = 0;
    houseState['1bhk'].panels.forEach(p => solarPanels.push(p));
    houseState['2bhk'].panels.forEach(p => solarPanels.push(p));
}, 100);

function refreshSolarPanelsPlacement() {
    if (typeof houseState !== 'undefined') {
        // Re-sync panel counts
    }
}
