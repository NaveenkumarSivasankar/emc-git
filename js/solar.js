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

    // Mounting brackets — 2 small cylinders per panel
    const bracketGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.06, 6);
    const bracketMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    [-0.5, 0.5].forEach(lx => {
        const bracket = new THREE.Mesh(bracketGeo, bracketMat);
        bracket.position.set(lx, -PANEL_THICKNESS / 2 - 0.03, 0);
        g.add(bracket);
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
//  PANEL LAYOUT — ROOF-FLUSH PLACEMENT (Bug #5 fix)
// ═══════════════════════════════════════════════
function layoutSolarPanelsOnRoof(count, roof, targetHouse, houseLabel) {
    if (count === 0) {
        solarPanels.forEach(p => {
            if (p.group.parent) p.group.parent.remove(p.group);
            p.group.visible = false;
        });
        removeEnergyFlow();
        return;
    }

    // Calculate grid layout: 3 columns x 4 rows = 12 max panels
    const cols = 3;
    const rows = Math.ceil(count / cols);

    // Total array dimensions
    const totalWidth = cols * PANEL_W + (cols - 1) * GAP;
    const totalDepth = rows * PANEL_H + (rows - 1) * GAP;

    const offsetX = -totalWidth / 2 + PANEL_W / 2;
    const offsetZ = -totalDepth / 2 + PANEL_H / 2;

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

            // Y position: sit flush on roof surface
            // Panel sits at roofY + half panel thickness (accounting for slope)
            const slopeOffset = Math.sin(roof.slopeAngle) * pz;
            const localY = roof.y + PANEL_THICKNESS / 2 * Math.cos(roof.slopeAngle) + slopeOffset * 0.1;

            p.targetY = localY;

            // Tilt panel to match roof slope
            p.group.rotation.x = -roof.slopeAngle;
            p.group.rotation.z = 0;

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
    createEnergyFlow(houseLabel);

    console.log(`[SOLAR] Panels placed on ${houseLabel}: ${count} panels (flush on roof)`);
}

function layoutSolarPanels(count) {
    const roof = is2BHK ? ROOF_2BHK : ROOF_1BHK;
    const targetHouse = is2BHK
        ? (typeof roomGroups !== 'undefined' && roomGroups['Structure'] ? roomGroups['Structure'] : (typeof bhk2Group !== 'undefined' ? bhk2Group : scene))
        : (typeof houseGroup !== 'undefined' ? houseGroup : scene);
    const label = is2BHK ? '2bhk' : '1bhk';
    layoutSolarPanelsOnRoof(count, roof, targetHouse, label);
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

let solarSelectorEl = null;
let solarHouseState = { '1bhk': false, '2bhk': false }; // track which houses have panels

function createSolarSelector() {
    if (solarSelectorEl) { solarSelectorEl.remove(); solarSelectorEl = null; }

    solarSelectorEl = document.createElement('div');
    solarSelectorEl.id = 'solar-selector-modal';

    // Determine button labels based on current state (toggle)
    const label1 = solarHouseState['1bhk'] ? '❌ Remove from 1BHK' : '🏠 1BHK House';
    const label2 = solarHouseState['2bhk'] ? '❌ Remove from 2BHK' : '🏨 2BHK House';
    const labelBoth = (solarHouseState['1bhk'] && solarHouseState['2bhk']) ? '❌ Remove from Both' : '🏠🏨 Both Houses';

    solarSelectorEl.innerHTML = `
    <div class="ssm-backdrop" onclick="closeSolarSelector()"></div>
    <div class="ssm-content">
        <button class="ssm-close" onclick="closeSolarSelector()">✕</button>
        <h2 class="ssm-title">☀️ Select Solar Installation</h2>
        <p class="ssm-subtitle">Choose which house to add (or remove) panels</p>
        <div class="ssm-buttons">
            <button class="ssm-btn ssm-1bhk" onclick="selectSolarHouse('1bhk')">${label1}</button>
            <button class="ssm-btn ssm-2bhk" onclick="selectSolarHouse('2bhk')">${label2}</button>
            <button class="ssm-btn ssm-both" onclick="selectSolarHouse('both')">${labelBoth}</button>
        </div>
        <button class="ssm-cancel" onclick="closeSolarSelector()">Cancel</button>
    </div>`;
    document.body.appendChild(solarSelectorEl);
}

function showSolarSelector() { createSolarSelector(); setTimeout(() => solarSelectorEl.classList.add('visible'), 10); }
function closeSolarSelector() { if (solarSelectorEl) solarSelectorEl.classList.remove('visible'); }
let solarTarget = null;

function selectSolarHouse(target) {
    solarTarget = target;
    closeSolarSelector();
    performSolarToggle(target);
}

function performSolarToggle(target) {
    if (target === '1bhk') {
        solarHouseState['1bhk'] = !solarHouseState['1bhk'];
        is2BHK = false;
        if (solarHouseState['1bhk']) {
            isSolarMode = true;
            currentPanelCount = 6;
            layoutSolarPanels(currentPanelCount);
            if (typeof showToast === 'function') showToast('☀️ Solar panels added to 1BHK!');
        } else {
            currentPanelCount = 0;
            layoutSolarPanels(0);
            if (typeof showToast === 'function') showToast('❌ Solar panels removed from 1BHK');
        }
    } else if (target === '2bhk') {
        solarHouseState['2bhk'] = !solarHouseState['2bhk'];
        is2BHK = true;
        if (solarHouseState['2bhk']) {
            isSolarMode = true;
            currentPanelCount = 6;
            layoutSolarPanels(currentPanelCount);
            if (typeof showToast === 'function') showToast('☀️ Solar panels added to 2BHK!');
        } else {
            currentPanelCount = 0;
            layoutSolarPanels(0);
            if (typeof showToast === 'function') showToast('❌ Solar panels removed from 2BHK');
        }
    } else if (target === 'both') {
        const bothOn = solarHouseState['1bhk'] && solarHouseState['2bhk'];
        if (bothOn) {
            // Remove from both
            solarHouseState['1bhk'] = false; solarHouseState['2bhk'] = false;
            is2BHK = false; currentPanelCount = 0; layoutSolarPanels(0);
            is2BHK = true; layoutSolarPanels(0);
            isSolarMode = false;
            if (typeof showToast === 'function') showToast('❌ Solar panels removed from both houses');
        } else {
            // Add to both
            isSolarMode = true;
            solarHouseState['1bhk'] = true; solarHouseState['2bhk'] = true;
            is2BHK = false; currentPanelCount = 6; layoutSolarPanels(6);
            is2BHK = true; layoutSolarPanels(6);
            if (typeof showToast === 'function') showToast('☀️ Solar panels added to both houses!');
        }
    }

    // Update button state
    isSolarMode = solarHouseState['1bhk'] || solarHouseState['2bhk'];
    const btn = document.getElementById('solar-btn');
    const btnText = document.getElementById('solar-btn-text');
    const btnIcon = document.getElementById('solar-btn-icon');
    const pc = document.getElementById('panel-counter');
    if (isSolarMode) {
        if (btn) btn.className = 'solar-mode bottom-action-btn';
        if (btnText) btnText.textContent = 'Remove Solar';
        if (btnIcon) btnIcon.textContent = '⚡';
        if (pc) pc.classList.add('visible');
    } else {
        if (btn) btn.className = 'grid-mode bottom-action-btn';
        if (btnText) btnText.textContent = 'Add Solar Panels';
        if (btnIcon) btnIcon.textContent = '☀️';
        if (pc) pc.classList.remove('visible');
    }
    if (typeof updatePowerLines === 'function') updatePowerLines();
    if (typeof updateStats === 'function') updateStats();
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

// ═══════════════════════════════════════════════
//  addSolarPanels — Safe wrapper with try-catch (Bug B fix)
// ═══════════════════════════════════════════════
function addSolarPanels(houseId) {
    try {
        console.log('[SOLAR] addSolarPanels called for:', houseId);
        const roof = houseId === '1bhk' ? window.ROOF_1BHK : window.ROOF_2BHK;
        if (!roof) {
            console.error('[SOLAR] ERROR: No roof data for', houseId);
            if (typeof showToast === 'function') showToast('❌ Roof data missing — check house files');
            return;
        }
        console.log('[SOLAR] Roof data found:', JSON.stringify(roof));
        // Use the existing layout system
        is2BHK = (houseId === '2bhk');
        solarHouseState[houseId] = true;
        isSolarMode = true;
        currentPanelCount = 6;
        layoutSolarPanels(currentPanelCount);
        updatePowerLines();
        updateStats();
        if (typeof showToast === 'function') showToast('☀️ Solar panels added to ' + (houseId === '1bhk' ? '1BHK' : '2BHK') + '!');
    } catch (err) {
        console.error('[SOLAR] CRASH:', err);
        if (typeof showToast === 'function') showToast('❌ Solar panel error: ' + err.message);
    }
}

// ═══════════════════════════════════════════════
//  Window-level exports for cross-file compatibility
// ═══════════════════════════════════════════════
window.handleSolarSelect = function (choice) {
    closeSolarSelector();
    console.log('[SOLAR] User selected:', choice);
    if (choice === 'both') {
        addSolarPanels('1bhk');
        setTimeout(() => addSolarPanels('2bhk'), 300);
    } else {
        addSolarPanels(choice);
    }
};

window.closeSolarModal = function () {
    closeSolarSelector();
};

console.log('[SOLAR] Solar panel system initialized');

