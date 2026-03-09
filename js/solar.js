// ═══════════════════════════════════════════════
//  SOLAR PANELS (enhanced with house selector + animations)
// ═══════════════════════════════════════════════
const solarPanels = [];
const maxPanels = 10;

const panelMat = new THREE.MeshStandardMaterial({ color: 0x0d1b4b, roughness: 0.25, metalness: 0.8 });
const panelFrameMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.3 });

function createSolarPanel() {
    const g = new THREE.Group();
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 1.2), panelMat);
    g.add(panel);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x1a3366 });
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
    solarPanels.push({ group: createSolarPanel(), targetY: 0, animating: false, frame: 0, delay: 0 });
}

// ═══════════════════════════════════════════════
//  DAY / NIGHT TOGGLE
// ═══════════════════════════════════════════════
let isDayTime = true;

function createDayNightToggle() {
    let btn = document.getElementById('daynight-btn');
    if (btn) return;
    btn = document.createElement('button');
    btn.id = 'daynight-btn';
    btn.className = 'bottom-action-btn';
    btn.innerHTML = '🌙 Night Mode';
    btn.onclick = toggleDayNight;
    btn.style.cssText = 'pointer-events:auto;';
    const controls = document.getElementById('bottom-controls');
    if (controls) controls.appendChild(btn);
}

function toggleDayNight() {
    isDayTime = !isDayTime;
    const btn = document.getElementById('daynight-btn');
    if (btn) {
        btn.innerHTML = isDayTime ? '🌙 Night Mode' : '☀️ Day Mode';
    }
    // Adjust ambient lighting
    if (typeof ambientLight !== 'undefined') {
        ambientLight.intensity = isDayTime ? 0.7 : 0.15;
    }
    if (typeof sunLight !== 'undefined') {
        sunLight.intensity = isDayTime ? 1.4 : 0.1;
    }
    // Adjust sky
    if (typeof scene !== 'undefined' && scene.background) {
        if (!isDayTime) {
            const nightCanvas = document.createElement('canvas');
            nightCanvas.width = 2; nightCanvas.height = 512;
            const ctx = nightCanvas.getContext('2d');
            const grad = ctx.createLinearGradient(0, 0, 0, 512);
            grad.addColorStop(0, '#000011');
            grad.addColorStop(0.5, '#0a1628');
            grad.addColorStop(1, '#1a1a3e');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 2, 512);
            scene.background = new THREE.CanvasTexture(nightCanvas);
        } else {
            const dayCanvas = document.createElement('canvas');
            dayCanvas.width = 2; dayCanvas.height = 512;
            const ctx = dayCanvas.getContext('2d');
            const grad = ctx.createLinearGradient(0, 0, 0, 512);
            grad.addColorStop(0, '#0a1628');
            grad.addColorStop(0.3, '#1a3a5c');
            grad.addColorStop(0.5, '#3d7ab5');
            grad.addColorStop(0.7, '#7ec8e3');
            grad.addColorStop(0.85, '#c9e8f5');
            grad.addColorStop(1, '#ffecd2');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 2, 512);
            scene.background = new THREE.CanvasTexture(dayCanvas);
        }
    }
    updateStats();
}

// Create button on load
window.addEventListener('DOMContentLoaded', () => { setTimeout(createDayNightToggle, 200); });

// ═══════════════════════════════════════════════
//  ENERGY FLOW VISUALIZATION
// ═══════════════════════════════════════════════
let energyFlowLine = null;
let energyFlowSphere = null;
let energyFlowProgress = 0;

function createEnergyFlow(targetHouse) {
    removeEnergyFlow();

    const houseX = targetHouse === '2bhk' ? 24 : -22;
    const sunPos = new THREE.Vector3(houseX, 35, -5);
    const roofPos = new THREE.Vector3(houseX, 8, 0);
    const meterPos = new THREE.Vector3(houseX, 2, 12);

    const points = [sunPos, roofPos, meterPos];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
        color: 0xFFD700,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
    });
    energyFlowLine = new THREE.Line(lineGeo, lineMat);
    scene.add(energyFlowLine);

    const sphereGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xFFD700,
        emissive: 0xFFAA00,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });
    energyFlowSphere = new THREE.Mesh(sphereGeo, sphereMat);
    energyFlowSphere.userData.points = points;
    scene.add(energyFlowSphere);
    energyFlowProgress = 0;
}

function removeEnergyFlow() {
    if (energyFlowLine) { scene.remove(energyFlowLine); energyFlowLine = null; }
    if (energyFlowSphere) { scene.remove(energyFlowSphere); energyFlowSphere = null; }
}

function updateEnergyFlow(delta) {
    if (!energyFlowSphere || !energyFlowSphere.userData.points) return;
    if (!isDayTime || !isSolarMode || currentPanelCount === 0) {
        if (energyFlowLine) energyFlowLine.visible = false;
        energyFlowSphere.visible = false;
        return;
    }
    if (energyFlowLine) energyFlowLine.visible = true;
    energyFlowSphere.visible = true;

    energyFlowProgress += delta * 0.5;
    if (energyFlowProgress > 1) energyFlowProgress = 0;

    const pts = energyFlowSphere.userData.points;
    const totalSegments = pts.length - 1;
    const segProgress = energyFlowProgress * totalSegments;
    const segIndex = Math.min(Math.floor(segProgress), totalSegments - 1);
    const segT = segProgress - segIndex;

    const p = new THREE.Vector3().lerpVectors(pts[segIndex], pts[segIndex + 1], segT);
    energyFlowSphere.position.copy(p);
    energyFlowSphere.scale.setScalar(0.8 + Math.sin(energyFlowProgress * Math.PI * 4) * 0.3);
}

// ═══════════════════════════════════════════════
//  PANEL LAYOUT AND ANIMATION
// ═══════════════════════════════════════════════
function layoutSolarPanels(count) {
    if (count === 0) {
        solarPanels.forEach(p => {
            if (p.group.parent) p.group.parent.remove(p.group);
            p.group.visible = false;
        });
        removeEnergyFlow();
        return;
    }

    const targetHouse = is2BHK ? roomGroups['Structure'] : houseGroup;
    const houseW = 20;
    const roofBaseY = 7 + 0.3;
    const peakH = 4.5;
    const slopeAngle = Math.atan2(peakH, houseW / 2 + 0.8);

    for (let i = 0; i < maxPanels; i++) {
        const p = solarPanels[i];

        if (i < count) {
            if (p.group.parent !== targetHouse) {
                if (p.group.parent) p.group.parent.remove(p.group);
                targetHouse.add(p.group);
            }

            const side = i % 2 === 0 ? 1 : -1;
            const depthIndex = Math.floor(i / 2);

            const xPos = side * (1.8 + (depthIndex % 2) * 2.2);
            const zStart = is2BHK ? (-16 / 2 - 0.8) : (-15 / 2 - 0.8);
            const zPos = zStart + 3 + Math.floor(depthIndex / 2) * 2.8;

            const roofY = roofBaseY + peakH - Math.abs(xPos) * (peakH / (houseW / 2 + 0.8));
            p.targetY = roofY + 0.15;

            p.group.rotation.x = -slopeAngle * side * 0.5;
            p.group.rotation.z = side > 0 ? -slopeAngle * 0.3 : slopeAngle * 0.3;

            // Rise-up animation
            p.group.position.set(xPos, p.targetY + 15, zPos);
            p.group.visible = true;
            p.animating = true;
            p.frame = 0;
            p.delay = i * 8; // stagger each panel

        } else {
            if (p.group.parent) p.group.parent.remove(p.group);
            p.group.visible = false;
        }
    }

    // Create energy flow for the selected house
    createEnergyFlow(is2BHK ? '2bhk' : '1bhk');
}

// ═══════════════════════════════════════════════
//  SOLAR / GRID TOGGLE (with house selector)
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

    // Solar only generates during day
    const solarActive = isDayTime && isSolarMode && currentPanelCount > 0;
    const coverageRatio = solarActive ? Math.min(currentPanelCount / panelsNeeded, 1) : 0;
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
    if (isSolarMode) {
        // Remove solar
        isSolarMode = false;
        const btn = document.getElementById('solar-btn');
        const btnText = document.getElementById('solar-btn-text');
        const btnIcon = document.getElementById('solar-btn-icon');
        const panelCounter = document.getElementById('panel-counter');
        if (btn) btn.className = 'grid-mode bottom-action-btn';
        if (btnText) btnText.textContent = 'Add Solar Panels';
        if (btnIcon) btnIcon.textContent = '☀️';
        if (panelCounter) panelCounter.classList.remove('visible');
        currentPanelCount = 0;
        layoutSolarPanels(0);
        removeEnergyFlow();
        poleGroup.children.forEach(child => { if (child.material) child.material.opacity = 1; });
        updatePowerLines();
        updateStats();
    } else {
        // Show house selector modal
        showSolarSelector();
    }
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
