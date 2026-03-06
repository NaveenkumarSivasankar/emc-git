// ═══════════════════════════════════════════════
//  SOLAR PANELS (adjusted for enlarged 1BHK)
// ═══════════════════════════════════════════════
const solarPanels = [];
const maxPanels = 10;

const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.25, metalness: 0.8 });
const panelFrameMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.3 });

function createSolarPanel() {
    const g = new THREE.Group();
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 1.2), panelMat);
    g.add(panel);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x283593 });
    for (let i = -2; i <= 2; i++) {
        const hLine = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.01, 0.02), gridMat);
        hLine.position.set(0, 0.05, i * 0.24); g.add(hLine);
    }
    for (let i = -3; i <= 3; i++) {
        const vLine = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.01, 1.15), gridMat);
        vLine.position.set(i * 0.25, 0.05, 0); g.add(vLine);
    }
    const frameParts = [
        new THREE.BoxGeometry(1.85, 0.12, 0.06), new THREE.BoxGeometry(1.85, 0.12, 0.06),
        new THREE.BoxGeometry(0.06, 0.12, 1.2), new THREE.BoxGeometry(0.06, 0.12, 1.2)
    ];
    const framePositions = [[0, 0, 0.6], [0, 0, -0.6], [-0.9, 0, 0], [0.9, 0, 0]];
    frameParts.forEach((geo, i) => {
        const mesh = new THREE.Mesh(geo, panelFrameMat);
        mesh.position.set(...framePositions[i]); g.add(mesh);
    });
    return g;
}

// Create 10 reusable panel objects initially
for (let i = 0; i < maxPanels; i++) {
    solarPanels.push({ group: createSolarPanel(), targetY: 0, animating: false });
}

function layoutSolarPanels(count) {
    if (count === 0) {
        solarPanels.forEach(p => {
            if (p.group.parent) p.group.parent.remove(p.group);
            p.group.visible = false;
        });
        return;
    }

    const targetHouse = is2BHK ? roomGroups['Structure'] : houseGroup;
    const houseW = is2BHK ? 20 : 20; // W2 = 20, W = 20
    const roofBaseY = is2BHK ? 7 + 0.3 : 7 + 0.3; // H + 0.3
    const peakH = 4.5; // roofH
    const slopeAngle = Math.atan2(peakH, houseW / 2 + 0.8);

    // We'll distribute panels in a grid.
    // For up to 10 panels, we can put 5 on the front-facing slope (z > 0)
    // and 5 on the back-facing slope (z < 0), or just spread them across the X axis.
    // The previous logic used X and Z grids. Let's arrange them dynamically starting from center.

    for (let i = 0; i < maxPanels; i++) {
        const p = solarPanels[i];

        if (i < count) {
            if (p.group.parent !== targetHouse) {
                if (p.group.parent) p.group.parent.remove(p.group);
                targetHouse.add(p.group);
            }

            // Grid layout: Up to 5 panels per row, 2 rows (front and back of the roof peak)
            const col = i % 5;
            const row = Math.floor(i / 5); // 0 = front slope (positive z), 1 = back slope (negative z)

            // Spread panels across the X axis (width of the roof)
            const xOffset = (col - Math.min(count - row * 5, 5) / 2 + 0.5) * 2.2;

            // Place on the positive or negative Z slope
            const zSlopeScale = is2BHK ? 1.0 : 1.0;
            const zStart = is2BHK ? (-16 / 2 - 0.8) : (-15 / 2 - 0.8); // Center point of roof in Z

            // We want panels to be on the slope.
            // X distance from center determines the Y height on the slope.
            // Wait, the roof slope is along X. The peak is at X=0.
            // So X determines the Y height. Z is just depth along the roof.

            // X positions: Since the peak is at x=0, we should put panels on the left (x < 0) or right (x > 0) slope.
            // Let's divide them: even index on left, odd on right, or distribute evenly.
            const side = i % 2 === 0 ? 1 : -1; // 1 = right, -1 = left
            const depthIndex = Math.floor(i / 2); // 0, 0, 1, 1, 2, 2...

            const xPos = side * (1.8 + (depthIndex % 2) * 2.2); // Spread them outward from peak
            const zPos = zStart + 3 + Math.floor(depthIndex / 2) * 2.8;

            const roofY = roofBaseY + peakH - Math.abs(xPos) * (peakH / (houseW / 2 + 0.8));

            p.targetY = roofY + 0.15;

            // Set rotation
            p.group.rotation.x = -slopeAngle * side * 0.5;
            p.group.rotation.z = side > 0 ? -slopeAngle * 0.3 : slopeAngle * 0.3;

            p.group.position.set(xPos, p.targetY, zPos);
            p.group.visible = true;

        } else {
            if (p.group.parent) p.group.parent.remove(p.group);
            p.group.visible = false;
        }
    }
}

// ═══════════════════════════════════════════════
//  SOLAR / GRID TOGGLE
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
    const list = is2BHK ? bhk2Appliances : simpleAppliances;
    list.forEach(a => { if (a.on) total += a.watt; });
    const panelsNeeded = Math.max(1, Math.ceil(total / 350));
    const statConsumption = document.getElementById('stat-consumption');
    if (statConsumption) statConsumption.textContent = total.toLocaleString() + ' W';
    const statPanels = document.getElementById('stat-panels');
    if (statPanels) statPanels.textContent = currentPanelCount + ' / ' + panelsNeeded + ' needed';
    const coverageRatio = Math.min(currentPanelCount / panelsNeeded, 1);
    const monthlySaving = Math.round(coverageRatio * total * 0.72 * 30 / 1000 * 8);
    const co2Saved = Math.round(coverageRatio * total * 0.0007 * 365);
    const statSavings = document.getElementById('stat-savings');
    if (statSavings) statSavings.textContent = '₹' + monthlySaving.toLocaleString();
    const statCo2 = document.getElementById('stat-co2');
    if (statCo2) statCo2.textContent = co2Saved + ' kg/yr';
    const statFact = document.getElementById('stat-fact');
    if (statFact) statFact.textContent = funFacts[Math.floor(Math.random() * funFacts.length)];
    const panelNum = document.getElementById('panel-num');
    if (panelNum) panelNum.textContent = currentPanelCount;
    updateBarChart(total, coverageRatio);
}

function toggleSolar() {
    isSolarMode = !isSolarMode;
    const btn = document.getElementById('solar-btn');
    const btnText = document.getElementById('solar-btn-text');
    const btnIcon = document.getElementById('solar-btn-icon');
    const panelCounter = document.getElementById('panel-counter');

    if (isSolarMode) {
        if (btn) btn.className = 'solar-mode bottom-action-btn';
        if (btnText) btnText.textContent = 'Remove Solar';
        if (btnIcon) btnIcon.textContent = '⚡';
        if (panelCounter) panelCounter.classList.add('visible');
        currentPanelCount = 0;
        layoutSolarPanels(0);
    } else {
        if (btn) btn.className = 'grid-mode bottom-action-btn';
        if (btnText) btnText.textContent = 'Add Solar Panels';
        if (btnIcon) btnIcon.textContent = '☀️';
        if (panelCounter) panelCounter.classList.remove('visible');
        currentPanelCount = 0;
        layoutSolarPanels(0);
        poleGroup.children.forEach(child => { if (child.material) child.material.opacity = 1; });
    }
    updatePowerLines();
    updateStats();
}

function updatePowerLines() {
    const panelsNeeded = Math.ceil(totalWatt / 350);
    const coverage = panelsNeeded > 0 ? Math.min(currentPanelCount / panelsNeeded, 1) : 0;
    const poleOpacity = isSolarMode ? Math.max(0.1, 1 - coverage) : 1;
    poleGroup.children.forEach(child => {
        if (child.material) { child.material.transparent = true; child.material.opacity = poleOpacity; }
    });
}

function animatePanelsIn(count) {
    layoutSolarPanels(count);
}

function changePanelCount(delta) {
    if (!isSolarMode) return;
    const newCount = Math.max(0, Math.min(maxPanels, currentPanelCount + delta));
    if (newCount === currentPanelCount) return;

    currentPanelCount = newCount;
    layoutSolarPanels(currentPanelCount);
    updatePowerLines();
    updateStats();
}

function refreshSolarPanelsPlacement() {
    if (isSolarMode && currentPanelCount > 0) {
        layoutSolarPanels(currentPanelCount);
    }
}
