// ═══════════════════════════════════════════════
//  SOLAR PANELS (adjusted for enlarged 1BHK)
// ═══════════════════════════════════════════════
const solarPanels = [];
const maxPanels = 10;

const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.25, metalness: 0.8 });
const panelFrameMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.3 });

function createSolarPanel(index) {
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

    const col = index % 5;
    const row = Math.floor(index / 5);
    const xPos = -4.0 + col * 2.2;
    const zPos = -2.5 + row * 2.8;
    const slopeAngle = Math.atan2(roofH, W / 2 + 0.8);
    const roofY = H + 0.3 + roofH - Math.abs(xPos) * (roofH / (W / 2 + 0.8));

    g.position.set(xPos, roofY + 15, zPos);
    g.rotation.x = -slopeAngle * (xPos >= 0 ? 1 : -1) * 0.5;
    g.rotation.z = xPos >= 0 ? -slopeAngle * 0.3 : slopeAngle * 0.3;
    g.visible = false;
    houseGroup.add(g);
    solarPanels.push({ group: g, targetY: roofY + 0.15, animating: false });
    return g;
}

for (let i = 0; i < maxPanels; i++) { createSolarPanel(i); }

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
    document.getElementById('stat-consumption').textContent = total.toLocaleString() + ' W';
    document.getElementById('stat-panels').textContent = currentPanelCount + ' / ' + panelsNeeded + ' needed';
    const coverageRatio = Math.min(currentPanelCount / panelsNeeded, 1);
    const monthlySaving = Math.round(coverageRatio * total * 0.72 * 30 / 1000 * 8);
    const co2Saved = Math.round(coverageRatio * total * 0.0007 * 365);
    document.getElementById('stat-savings').textContent = '₹' + monthlySaving.toLocaleString();
    document.getElementById('stat-co2').textContent = co2Saved + ' kg/yr';
    document.getElementById('stat-fact').textContent = funFacts[Math.floor(Math.random() * funFacts.length)];
    document.getElementById('panel-num').textContent = currentPanelCount;
    updateBarChart(total, coverageRatio);
}

function toggleSolar() {
    isSolarMode = !isSolarMode;
    const btn = document.getElementById('solar-btn');
    const btnText = document.getElementById('solar-btn-text');
    const btnIcon = document.getElementById('solar-btn-icon');
    const panelCounter = document.getElementById('panel-counter');

    if (isSolarMode) {
        btn.className = 'solar-mode bottom-action-btn';
        btnText.textContent = 'Remove Solar';
        btnIcon.textContent = '⚡';
        panelCounter.classList.add('visible');
        currentPanelCount = 0;
        solarPanels.forEach(p => { p.group.visible = false; p.group.position.y = p.targetY + 15; });
    } else {
        btn.className = 'grid-mode bottom-action-btn';
        btnText.textContent = 'Add Solar Panels';
        btnIcon.textContent = '☀️';
        panelCounter.classList.remove('visible');
        currentPanelCount = 0;
        solarPanels.forEach(p => { p.group.visible = false; p.group.position.y = p.targetY + 15; });
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
    solarPanels.forEach((p, i) => {
        if (i < count) {
            p.group.visible = true; p.group.position.y = p.targetY + 15;
            p.animating = true; p.delay = i * 8; p.frame = 0;
        } else {
            p.group.visible = false; p.group.position.y = p.targetY + 15;
        }
    });
}

function changePanelCount(delta) {
    if (!isSolarMode) return;
    const newCount = Math.max(0, Math.min(maxPanels, currentPanelCount + delta));
    if (newCount === currentPanelCount) return;

    if (delta > 0) {
        const idx = currentPanelCount;
        solarPanels[idx].group.visible = true;
        solarPanels[idx].group.position.y = solarPanels[idx].targetY + 15;
        solarPanels[idx].animating = true;
        solarPanels[idx].delay = 0;
        solarPanels[idx].frame = 0;
    } else {
        const idx = currentPanelCount - 1;
        solarPanels[idx].group.visible = false;
        solarPanels[idx].group.position.y = solarPanels[idx].targetY + 15;
        solarPanels[idx].animating = false;
    }

    currentPanelCount = newCount;
    updatePowerLines();
    updateStats();
}
