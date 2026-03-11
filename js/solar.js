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

    // Main dark blue panel body
    const panelMat = new THREE.MeshStandardMaterial({
        color: 0x1a2744,
        roughness: 0.3,
        metalness: 0.7
    });
    const panel = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.09, 2.7), panelMat);
    g.add(panel);

    // Blue tinted glass overlay
    const glassMat = new THREE.MeshStandardMaterial({
        color: 0x2255aa,
        roughness: 0.1,
        metalness: 0.6,
        transparent: true,
        opacity: 0.75
    });
    const glass = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.022, 2.6), glassMat);
    glass.position.y = 0.055;
    g.add(glass);

    // Silver cell grid lines horizontal
    const gridMat = new THREE.MeshStandardMaterial({ color: 0x8899bb, roughness: 0.2, metalness: 0.8 });
    for (let i = -2; i <= 2; i++) {
        const h = new THREE.Mesh(new THREE.BoxGeometry(3.76, 0.016, 0.013), gridMat);
        h.position.set(0, 0.061, i * 0.48);
        g.add(h);
    }
    for (let i = -3; i <= 3; i++) {
        const v = new THREE.Mesh(new THREE.BoxGeometry(0.013, 0.016, 2.56), gridMat);
        v.position.set(i * 0.52, 0.061, 0);
        g.add(v);
    }

    // Silver aluminium frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xbbccdd, metalness: 0.95, roughness: 0.1 });
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.11, 0.09), frameMat);
    topBar.position.set(0, 0.01, 1.4); g.add(topBar);
    const botBar = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.11, 0.09), frameMat);
    botBar.position.set(0, 0.01, -1.4); g.add(botBar);
    const leftBar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 2.9), frameMat);
    leftBar.position.set(-1.99, 0.01, 0); g.add(leftBar);
    const rightBar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 2.9), frameMat);
    rightBar.position.set(1.99, 0.01, 0); g.add(rightBar);

    // ── MOUNTING LEG SYSTEM — firmly attached to roof ──
    const legMat2 = new THREE.MeshStandardMaterial({
        color: 0x777e88,
        metalness: 0.92,
        roughness: 0.15
    });

    // Two horizontal mounting rails running across full panel width
    const frontRail = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.07, 0.07), legMat2);
    frontRail.position.set(0, -0.06, 0.8);
    g.add(frontRail);

    const backRail = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.07, 0.07), legMat2);
    backRail.position.set(0, -0.06, -0.8);
    g.add(backRail);

    // Four L-shaped leg brackets — two front two back
    const bracketMat = new THREE.MeshStandardMaterial({
        color: 0x666e78,
        metalness: 0.95,
        roughness: 0.1
    });

    [[-1.5, 0.8], [1.5, 0.8], [-1.5, -0.8], [1.5, -0.8]].forEach(([x, z]) => {
        // Vertical part of L-bracket
        const legV = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.32, 0.07), bracketMat);
        legV.position.set(x, -0.22, z);
        g.add(legV);

        // Horizontal foot of L-bracket — presses flat on roof
        const legH = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.28), bracketMat);
        legH.position.set(x, -0.37, z + (z > 0 ? 0.1 : -0.1));
        g.add(legH);

        // Roof clamp — grips directly onto roof surface
        const clampBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.28, 0.06, 0.45),
            new THREE.MeshStandardMaterial({ color: 0x444a52, metalness: 0.92, roughness: 0.2 })
        );
        clampBase.position.set(x, -0.76, 0.0);
        g.add(clampBase);

        // Clamp top jaw — presses down on roof
        const clampTop = new THREE.Mesh(
            new THREE.BoxGeometry(0.32, 0.05, 0.48),
            new THREE.MeshStandardMaterial({ color: 0x555c64, metalness: 0.9, roughness: 0.2 })
        );
        clampTop.position.set(x, -0.71, 0.0);
        g.add(clampTop);

        // Two tightening bolts on clamp
        [-0.12, 0.12].forEach(bz => {
            const bShaft = new THREE.Mesh(
                new THREE.CylinderGeometry(0.022, 0.022, 0.14, 8),
                new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 1.0, roughness: 0.05 })
            );
            bShaft.position.set(x, -0.70, bz);
            g.add(bShaft);

            const bHead = new THREE.Mesh(
                new THREE.CylinderGeometry(0.042, 0.042, 0.035, 6),
                new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 1.0, roughness: 0.08 })
            );
            bHead.position.set(x, -0.64, bz);
            g.add(bHead);
        });

        // Rubber grip strip on bottom of clamp
        const grip = new THREE.Mesh(
            new THREE.BoxGeometry(0.26, 0.022, 0.43),
            new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.95, metalness: 0.0 })
        );
        grip.position.set(x, -0.79, 0.0);
        g.add(grip);
    });

    // Mid support bracket — center of panel for extra rigidity
    const midBracketL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.06), bracketMat);
    midBracketL.position.set(0, -0.20, 0.65);
    g.add(midBracketL);

    const midBracketR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.06), bracketMat);
    midBracketR.position.set(0, -0.20, -0.65);
    g.add(midBracketR);

    // Cable management clip on back rail
    const clipMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    [-0.8, 0, 0.8].forEach(x => {
        const clip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.07), clipMat);
        clip.position.set(x, -0.065, -0.68);
        g.add(clip);
    });

    g.visible = false;
    return g;
}

function flashPanelGlint(panelGroup) {
    // Find the glass surface mesh (second child)
    const glass = panelGroup.children[1];
    if (!glass || !glass.material) return;

    const originalEmissive = glass.material.emissive
        ? glass.material.emissive.getHex()
        : 0x000000;

    glass.material.emissive = new THREE.Color(0x4488ff);
    glass.material.emissiveIntensity = 1.2;

    let glintFrame = 0;
    const glintAnim = setInterval(() => {
        glintFrame++;
        glass.material.emissiveIntensity = Math.max(0, 1.2 - glintFrame * 0.12);
        if (glintFrame >= 10) {
            glass.material.emissiveIntensity = 0;
            clearInterval(glintAnim);
        }
    }, 30);
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

    const panelGapX = 3.6;
    const panelGapZ = 3.8;
    const colsPerSide = 4;
    const rows = Math.floor((roofDepthHalf * 2 - 2.0) / panelGapZ);
    const maxRows = Math.floor((roofDepthHalf * 2 - 2.5) / panelGapZ);
    const max = 3 * maxRows * 2;
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
        const idx = state.count;
        const config = getRoofConfig(activeKey);

        const hFallback = typeof H !== 'undefined' ? H : 7;
        const roofHval = typeof roofH !== 'undefined' ? roofH : 4.5;
        const ridgeY = hFallback + roofHval; // absolute Y of roof ridge peak

        const panelsPerRow = 3;
        const colSpacing = 3.0;
        const rowSpacing = 2.5;
        const maxRows = Math.floor((config.roofDepthHalf * 2 - 2.5) / rowSpacing);
        const panelsPerSide = panelsPerRow * maxRows;

        const isLeft = idx < panelsPerSide;
        const sideIdx = isLeft ? idx : idx - panelsPerSide;
        const col = sideIdx % panelsPerRow;
        const row = Math.floor(sideIdx / panelsPerRow);

        // X position — spread evenly on each slope half
        const xSign = isLeft ? -1 : 1;
        const xStart = 1.8;
        const xPos = xSign * (xStart + col * colSpacing);

        // Hard clamp so panel never goes past roof edge
        const clampedX = Math.max(
            -(config.roofWidthHalf - 1.0),
            Math.min(config.roofWidthHalf - 1.0, xPos)
        );

        // Z position — rows from front to back
        const zPos = -(config.roofDepthHalf - 1.8) + row * rowSpacing;
        const clampedZ = Math.max(
            -(config.roofDepthHalf - 1.0),
            Math.min(config.roofDepthHalf - 1.0, zPos)
        );

        // ── CRITICAL Y FIX ──
        const distFromRidge = Math.abs(clampedX);
        const surfaceY = ridgeY - (distFromRidge / config.roofWidthHalf) * roofHval;

        // Different Y offset for each house to account for different roof heights
        const mountOffset = activeKey === '2bhk' ? 1.1 : 0.80;
        const yPos = surfaceY + mountOffset;

        // Tilt panel to match roof slope angle exactly
        const slopeAngle = Math.atan2(roofHval, config.roofWidthHalf);
        const tiltZ = isLeft ? slopeAngle : -slopeAngle;

        const g = createSolarPanel();
        g.rotation.set(0, 0, tiltZ);
        g.position.set(clampedX, yPos, clampedZ);

        config.targetGroup.add(g);
        g.visible = true;

        const targetY = g.position.y;
        g.position.y = targetY + 10; // drop from above

        state.panels.push({
            group: g,
            targetY,
            animating: true,
            frame: 0
        });

        if (typeof syncSolarPanels === 'function') syncSolarPanels();
    } else {
        const lastPanel = state.panels.pop();
        if (lastPanel && lastPanel.group && lastPanel.group.parent) {
            lastPanel.group.parent.remove(lastPanel.group);
        }
    }

    state.count = newCount;

    // Calculate required panels
    let totalWatt = 0;
    const appList = activeKey === '2bhk' ? bhk2Appliances : simpleAppliances;
    appList.forEach(a => { if (a.on) totalWatt += a.watt; });
    const required = Math.max(1, Math.ceil(totalWatt / 350));

    // Show message
    let msg = '';
    let msgColor = '#2ECC8B';

    if (state.count === 0) {
        msg = '';
    } else if (state.count < required) {
        const still = required - state.count;
        msg = `\u2600\uFE0F ${activeKey.toUpperCase()}: ${state.count} panel${state.count > 1 ? 's' : ''} added \u2014 need ${still} more to fully cover your usage`;
        msgColor = '#F5A623';
    } else if (state.count === required) {
        msg = `\u2705 ${activeKey.toUpperCase()}: Perfect! ${state.count} panels fully cover your electricity needs!`;
        msgColor = '#2ECC8B';
    } else if (state.count >= state.max) {
        msg = `\uD83D\uDD34 ${activeKey.toUpperCase()}: Maximum panels reached! Roof is fully covered.`;
        msgColor = '#FF6B6B';
    } else {
        msg = `\u26A1 ${activeKey.toUpperCase()}: ${state.count} panels \u2014 generating more than needed! Great investment.`;
        msgColor = '#5B8DEF';
    }

    if (msg) showSolarMessage(msg, msgColor);

    updatePowerLines();
    updateStats();
    syncSolarPanels();
}

// Ensure the main animation loop can animate all panels if needed
if (!window.solarPanelsAnimHook) {
    window.solarPanelsAnimHook = true;
    const originalAnimate = window.animate;
}
function syncSolarPanels() {
    solarPanels.length = 0;
    houseState['1bhk'].panels.forEach(p => solarPanels.push(p));
    houseState['2bhk'].panels.forEach(p => solarPanels.push(p));
}
window.syncSolarPanels = syncSolarPanels;

function refreshSolarPanelsPlacement() {
    if (typeof houseState !== 'undefined') {
        // Re-sync panel counts
    }
}

(function addSolarLight() {
    if (typeof scene === 'undefined') return;
    const solarLight = new THREE.DirectionalLight(0xaaccff, 1.2);
    solarLight.position.set(0, 30, 10);
    scene.add(solarLight);
    const ambBoost = new THREE.AmbientLight(0x88aacc, 0.4);
    scene.add(ambBoost);
})();

function showSolarMessage(text, color) {
    let box = document.getElementById('solar-msg-box');
    if (!box) {
        box = document.createElement('div');
        box.id = 'solar-msg-box';
        box.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a1a2e;
            border: 2px solid ${color};
            color: ${color};
            padding: 10px 24px;
            border-radius: 30px;
            font-size: 0.88rem;
            font-weight: 700;
            font-family: 'Courier New', monospace;
            z-index: 9999;
            pointer-events: none;
            text-align: center;
            max-width: 480px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            transition: opacity 0.4s ease;
        `;
        document.body.appendChild(box);
    }
    box.style.borderColor = color;
    box.style.color = color;
    box.textContent = text;
    box.style.opacity = '1';
    clearTimeout(box._timer);
    box._timer = setTimeout(() => { box.style.opacity = '0'; }, 3500);
}
