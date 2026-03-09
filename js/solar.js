// ═══════════════════════════════════════════════
//  SOLAR PANELS — Photorealistic PV Cells + Roof Placement
// ═══════════════════════════════════════════════
const solarPanels = [];
const maxPanels = 10;

// ═══════════════════════════════════════════════
//  ROOF DATA CONSTANTS
// ═══════════════════════════════════════════════
const ROOF_1BHK = {
    centerX: -22,
    centerZ: 0,
    y: 7.3,
    width: 28,
    depth: 22,
    slopeAngle: 0.35,
    slopeAxis: 'x',
};

const ROOF_2BHK = {
    centerX: 24,
    centerZ: 0,
    y: 7.3,
    width: 28,
    depth: 24,
    slopeAngle: 0.35,
    slopeAxis: 'x',
};

// ═══════════════════════════════════════════════
//  PV CELL CANVAS TEXTURE
// ═══════════════════════════════════════════════
function createPVTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 308;
    const ctx = canvas.getContext('2d');

    // Dark blue base
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, 512, 308);

    // Individual PV cells (6x10 grid)
    const cellW = 512 / 10 - 2;
    const cellH = 308 / 6 - 2;
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 10; col++) {
            const x = col * (512 / 10) + 1;
            const y = row * (308 / 6) + 1;
            // Cell with slight blue variation
            const shade = 15 + Math.random() * 8;
            ctx.fillStyle = `rgb(${Math.floor(shade)}, ${Math.floor(shade + 10)}, ${Math.floor(shade + 35)})`;
            ctx.fillRect(x, y, cellW, cellH);

            // Cell border lines (finger electrodes)
            ctx.strokeStyle = '#1a3a6e';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x, y, cellW, cellH);

            // Subtle cell shimmer
            const shimmer = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
            shimmer.addColorStop(0, 'rgba(40, 80, 140, 0.15)');
            shimmer.addColorStop(0.5, 'rgba(60, 100, 160, 0.05)');
            shimmer.addColorStop(1, 'rgba(30, 60, 120, 0.15)');
            ctx.fillStyle = shimmer;
            ctx.fillRect(x, y, cellW, cellH);
        }
    }

    // Silver busbars (horizontal)
    ctx.strokeStyle = '#8899AA';
    ctx.lineWidth = 1.5;
    [0.33, 0.66].forEach(f => {
        ctx.beginPath();
        ctx.moveTo(0, 308 * f);
        ctx.lineTo(512, 308 * f);
        ctx.stroke();
    });

    // Vertical busbars every cell
    ctx.lineWidth = 0.8;
    for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 51.2, 0);
        ctx.lineTo(i * 51.2, 308);
        ctx.stroke();
    }

    // Metallic frame
    ctx.strokeStyle = '#C0C8D0';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 504, 300);

    // Inner frame bevel
    ctx.strokeStyle = '#A0AAB0';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, 496, 292);

    return new THREE.CanvasTexture(canvas);
}

const panelTexture = createPVTexture();
const panelMat = new THREE.MeshStandardMaterial({
    map: panelTexture,
    roughness: 0.15,
    metalness: 0.4,
    envMapIntensity: 0.8,
});
const panelFrameMat = new THREE.MeshStandardMaterial({
    color: 0xC0C8D0,
    metalness: 0.7,
    roughness: 0.3
});
const panelBackMat = new THREE.MeshStandardMaterial({
    color: 0xC0C8D0,
    roughness: 0.5,
    metalness: 0.6
});

// ═══════════════════════════════════════════════
//  CREATE SOLAR PANEL WITH MOUNTING
// ═══════════════════════════════════════════════
const PANEL_W = 1.65;
const PANEL_H = 0.992;
const PANEL_THICKNESS = 0.04;
const GAP = 0.06;

function createSolarPanel() {
    const g = new THREE.Group();

    // Panel body
    const panel = new THREE.Mesh(
        new THREE.BoxGeometry(PANEL_W, PANEL_THICKNESS, PANEL_H),
        panelMat
    );
    panel.castShadow = true;
    panel.receiveShadow = true;
    g.add(panel);

    // Frame edges
    const frameGeo = [
        new THREE.BoxGeometry(PANEL_W + 0.04, PANEL_THICKNESS + 0.02, 0.04),
        new THREE.BoxGeometry(PANEL_W + 0.04, PANEL_THICKNESS + 0.02, 0.04),
        new THREE.BoxGeometry(0.04, PANEL_THICKNESS + 0.02, PANEL_H),
        new THREE.BoxGeometry(0.04, PANEL_THICKNESS + 0.02, PANEL_H)
    ];
    const framePositions = [
        [0, 0, PANEL_H / 2], [0, 0, -PANEL_H / 2],
        [-PANEL_W / 2, 0, 0], [PANEL_W / 2, 0, 0]
    ];
    frameGeo.forEach((geo, i) => {
        const mesh = new THREE.Mesh(geo, panelFrameMat);
        mesh.position.set(...framePositions[i]);
        mesh.castShadow = true;
        g.add(mesh);
    });

    // Mounting legs
    const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.12, 6);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    [-0.5, 0.5].forEach(lx => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(lx, -PANEL_THICKNESS / 2 - 0.06, 0);
        g.add(leg);
    });

    return g;
}

// Pre-create panels
for (let i = 0; i < maxPanels; i++) {
    solarPanels.push({
        group: createSolarPanel(),
        targetY: 0,
        animating: false,
        frame: 0,
        delay: 0
    });
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

    // Update sky shader
    if (typeof sky !== 'undefined' && sky.material.uniforms) {
        if (isDayTime) {
            sky.material.uniforms.topColor.value.set(0x0a1628);
            sky.material.uniforms.bottomColor.value.set(0x87CEEB);
            sky.material.uniforms.horizonColor.value.set(0xffecd2);
        } else {
            sky.material.uniforms.topColor.value.set(0x000011);
            sky.material.uniforms.bottomColor.value.set(0x0a1628);
            sky.material.uniforms.horizonColor.value.set(0x1a1a3e);
        }
    }

    // Adjust lighting
    if (typeof ambientLight !== 'undefined') {
        ambientLight.intensity = isDayTime ? 0.6 : 0.12;
    }
    if (typeof sunLight !== 'undefined') {
        sunLight.intensity = isDayTime ? 2.5 : 0.08;
    }

    // Fog
    if (typeof scene !== 'undefined' && scene.fog) {
        scene.fog.color.set(isDayTime ? 0x87CEEB : 0x0a1628);
    }

    updateStats();
}

window.addEventListener('DOMContentLoaded', () => { setTimeout(createDayNightToggle, 200); });

// ═══════════════════════════════════════════════
//  ENERGY FLOW VISUALIZATION
// ═══════════════════════════════════════════════
let energyFlowLine = null;
let energyFlowSphere = null;
let energyFlowProgress = 0;
let energyFlowTube = null;
let energyFlowOrb = null;
let energyFlowOrbLight = null;
let energyFlowCurve = null;

function createEnergyFlow(targetHouse) {
    removeEnergyFlow();

    const houseX = targetHouse === '2bhk' ? 24 : -22;

    // CatmullRom curve from sun → panels → house
    const points = [
        new THREE.Vector3(houseX, 35, -5),    // sun position
        new THREE.Vector3(houseX, 12, 0),     // above roof
        new THREE.Vector3(houseX, 7.5, 0),    // panel center
        new THREE.Vector3(houseX + 2, 4, 4),  // down wall
        new THREE.Vector3(houseX + 2, 1, 8),  // to meter box
    ];

    energyFlowCurve = new THREE.CatmullRomCurve3(points);

    // Glowing tube
    const tubeGeo = new THREE.TubeGeometry(energyFlowCurve, 40, 0.03, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
        color: 0xFFD700,
        transparent: true,
        opacity: 0.5
    });
    energyFlowTube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(energyFlowTube);

    // Line (legacy)
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
        color: 0xFFD700,
        transparent: true,
        opacity: 0.4,
        linewidth: 2
    });
    energyFlowLine = new THREE.Line(lineGeo, lineMat);
    scene.add(energyFlowLine);

    // Glowing orb
    const orbGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    energyFlowOrb = new THREE.Mesh(orbGeo, orbMat);
    scene.add(energyFlowOrb);

    // Orb light
    energyFlowOrbLight = new THREE.PointLight(0xFFD700, 0.6, 3);
    energyFlowOrb.add(energyFlowOrbLight);

    // Legacy sphere
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
    if (energyFlowTube) { scene.remove(energyFlowTube); energyFlowTube = null; }
    if (energyFlowOrb) { scene.remove(energyFlowOrb); energyFlowOrb = null; }
    energyFlowCurve = null;
}

function updateEnergyFlow(delta) {
    if (!energyFlowSphere || !energyFlowSphere.userData.points) return;
    if (!isDayTime || !isSolarMode || currentPanelCount === 0) {
        if (energyFlowLine) energyFlowLine.visible = false;
        if (energyFlowTube) energyFlowTube.visible = false;
        if (energyFlowOrb) energyFlowOrb.visible = false;
        energyFlowSphere.visible = false;
        return;
    }

    if (energyFlowLine) energyFlowLine.visible = true;
    if (energyFlowTube) energyFlowTube.visible = true;
    if (energyFlowOrb) energyFlowOrb.visible = true;
    energyFlowSphere.visible = true;

    energyFlowProgress += delta * 0.5;
    if (energyFlowProgress > 1) energyFlowProgress = 0;

    // Animate orb along curve
    if (energyFlowCurve && energyFlowOrb) {
        const pos = energyFlowCurve.getPoint(energyFlowProgress);
        energyFlowOrb.position.copy(pos);
        energyFlowOrb.scale.setScalar(0.8 + Math.sin(energyFlowProgress * Math.PI * 4) * 0.3);
    }

    // Legacy sphere animation
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
//  SPARKLE PARTICLES ON PANEL PLACEMENT
// ═══════════════════════════════════════════════
function spawnSparkles(position) {
    const particleCount = 8;
    const sparkleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = position.x + (Math.random() - 0.5) * 1;
        positions[i * 3 + 1] = position.y + Math.random() * 0.5;
        positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 1;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const sparkleMat = new THREE.PointsMaterial({
        color: 0xFFD700,
        size: 0.15,
        transparent: true,
        opacity: 1,
    });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparkles);

    // Fade out and remove
    let startTime = Date.now();
    function animateSparkles() {
        const t = (Date.now() - startTime) / 1000;
        if (t > 1.5) {
            scene.remove(sparkles);
            return;
        }
        sparkleMat.opacity = 1 - t / 1.5;
        const posArr = sparkleGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            posArr[i * 3 + 1] += 0.02;
        }
        sparkleGeo.attributes.position.needsUpdate = true;
        requestAnimationFrame(animateSparkles);
    }
    animateSparkles();
}

// ═══════════════════════════════════════════════
//  PANEL LAYOUT — ROOF-ACCURATE PLACEMENT
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

    const roof = is2BHK ? ROOF_2BHK : ROOF_1BHK;
    const targetHouse = is2BHK ? roomGroups['Structure'] : houseGroup;

    // Calculate grid layout
    const cols = Math.floor((roof.width * 0.6) / (PANEL_W + GAP));
    const rows = Math.floor((roof.depth * 0.35) / (PANEL_H + GAP));

    const offsetX = -(Math.min(cols, count) * (PANEL_W + GAP)) / 2 + PANEL_W / 2;
    const offsetZ = -(Math.min(rows, Math.ceil(count / cols)) * (PANEL_H + GAP)) / 2 + PANEL_H / 2;

    let placed = 0;
    for (let i = 0; i < maxPanels; i++) {
        const p = solarPanels[i];

        if (i < count) {
            if (p.group.parent !== targetHouse) {
                if (p.group.parent) p.group.parent.remove(p.group);
                targetHouse.add(p.group);
            }

            const col = placed % cols;
            const row = Math.floor(placed / cols);

            const px = offsetX + col * (PANEL_W + GAP);
            const pz = offsetZ + row * (PANEL_H + GAP);

            // Y position based on roof slope
            const roofSlope = Math.sin(roof.slopeAngle);
            const distFromCenter = Math.abs(px);
            const localY = roof.y + 0.15 - distFromCenter * roofSlope * 0.15;

            p.targetY = localY;
            p.group.rotation.x = -roof.slopeAngle * 0.6;
            p.group.rotation.z = px > 0 ? -roof.slopeAngle * 0.3 : roof.slopeAngle * 0.3;

            // Rise-up animation
            p.group.position.set(px, p.targetY + 15, pz);
            p.group.visible = true;
            p.animating = true;
            p.frame = 0;
            p.delay = i * 8;

            placed++;
        } else {
            if (p.group.parent) p.group.parent.remove(p.group);
            p.group.visible = false;
        }
    }

    // Create energy flow
    createEnergyFlow(is2BHK ? '2bhk' : '1bhk');

    console.log(`[SOLAR] Panels placed on ${is2BHK ? '2BHK' : '1BHK'}: ${count} panels`);
}

// ═══════════════════════════════════════════════
//  STATS & TOGGLE
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
