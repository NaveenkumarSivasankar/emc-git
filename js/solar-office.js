// ═══════════════════════════════════════════════
//  SOLAR OFFICE — Green Energy Research Center
//  Exterior with solar panels + Interior solar learning lab
//  Photon-to-electricity animation, 3D cutaway model
//  ALL WALLS SOLID
// ═══════════════════════════════════════════════

const solarOfficeGroup = new THREE.Group();
solarOfficeGroup.position.set(0, 0, -100);
scene.add(solarOfficeGroup);

// ── MATERIALS ──
const solarWallMat = new THREE.MeshStandardMaterial({ color: 0xE8F5E9, roughness: 0.85, transparent: false, opacity: 1.0, depthWrite: true });
const solarRoofMat = new THREE.MeshStandardMaterial({ color: 0xC8E6C9, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
const solarGlassMat = new THREE.MeshStandardMaterial({ color: 0xB3E5FC, transparent: true, opacity: 0.20, roughness: 0.1, metalness: 0.3, depthWrite: false });
const panelBlueMat = new THREE.MeshStandardMaterial({ color: 0x1565C0, roughness: 0.4, metalness: 0.3, transparent: false, opacity: 1.0, depthWrite: true });
const panelFrameMat = new THREE.MeshStandardMaterial({ color: 0xBDBDBD, roughness: 0.4, metalness: 0.6, transparent: false, opacity: 1.0, depthWrite: true });
const labFloorMat = new THREE.MeshStandardMaterial({ color: 0xE0E0E0, roughness: 0.6, transparent: false, opacity: 1.0, depthWrite: true });

// ═══════════════════════════════════════════════
//  EXTERIOR — Green Research Center
// ═══════════════════════════════════════════════

// Main building body
const solarBody = new THREE.Mesh(new THREE.BoxGeometry(28, 8, 20), solarWallMat);
solarBody.position.set(0, 4, 0); solarBody.castShadow = true; solarBody.receiveShadow = true;
solarOfficeGroup.add(solarBody);

// Flat green roof
const solarRoof = new THREE.Mesh(new THREE.BoxGeometry(29, 0.3, 21), solarRoofMat);
solarRoof.position.set(0, 8.15, 0); solarRoof.castShadow = true;
solarOfficeGroup.add(solarRoof);

// Roof solar panels (12 panels in a 3×4 grid)
for (let px = 0; px < 4; px++) {
    for (let pz = 0; pz < 3; pz++) {
        const panelGroup = new THREE.Group();
        panelGroup.position.set(-7 + px * 5, 8.5, -6 + pz * 5);
        panelGroup.rotation.x = -0.3; // Tilted toward sun
        solarOfficeGroup.add(panelGroup);
        // Panel cell
        const cell = new THREE.Mesh(new THREE.BoxGeometry(3, 0.08, 2), panelBlueMat);
        panelGroup.add(cell);
        // Metal frame
        const frame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.05, 2.2), panelFrameMat);
        frame.position.y = -0.05; panelGroup.add(frame);
        // Grid lines on panel
        for (let gi = 0; gi < 6; gi++) {
            const gline = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.01, 2), panelFrameMat);
            gline.position.set(-1.2 + gi * 0.5, 0.05, 0); panelGroup.add(gline);
        }
    }
}

// Large south-facing glass facade
for (let wi = 0; wi < 5; wi++) {
    const glass = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 0.06), solarGlassMat);
    glass.position.set(-8 + wi * 4, 4, 10.03); solarOfficeGroup.add(glass);
    // Glass frame
    const gframe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 6, 0.08), panelFrameMat);
    gframe.position.set(-8 + wi * 4 + 2, 4, 10.04); solarOfficeGroup.add(gframe);
}

// Entrance
const solarDoor = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.5, 0.1), new THREE.MeshStandardMaterial({ color: 0xA5D6A7, roughness: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
solarDoor.position.set(0, 1.75, 10.06); solarOfficeGroup.add(solarDoor);

// Sign
const solarSignCanvas = document.createElement('canvas');
solarSignCanvas.width = 600; solarSignCanvas.height = 100;
const ssCtx = solarSignCanvas.getContext('2d');
ssCtx.fillStyle = '#1B5E20'; ssCtx.fillRect(0, 0, 600, 100);
ssCtx.fillStyle = '#FFD700'; ssCtx.font = 'bold 28px Georgia'; ssCtx.textAlign = 'center';
ssCtx.fillText('☀️ SOLAR ENERGY RESEARCH CENTER ☀️', 300, 60);
const ssTex = new THREE.CanvasTexture(solarSignCanvas);
const solarSign = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.2), new THREE.MeshStandardMaterial({ map: ssTex, emissive: 0x112200, emissiveIntensity: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
solarSign.position.set(0, 7, 10.04); solarOfficeGroup.add(solarSign);

// Outdoor solar demo array (3 panels on stands)
for (let ds = 0; ds < 3; ds++) {
    const demoGroup = new THREE.Group();
    demoGroup.position.set(-5 + ds * 5, 0, 14);
    solarOfficeGroup.add(demoGroup);
    // Stand
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 2, 8), panelFrameMat);
    stand.position.set(0, 1, 0); demoGroup.add(stand);
    // Panel
    const dp = new THREE.Mesh(new THREE.BoxGeometry(2, 0.06, 1.2), panelBlueMat);
    dp.position.set(0, 2.2, 0); dp.rotation.x = -0.4;
    demoGroup.add(dp);
    // Frame
    const df = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 1.4), panelFrameMat);
    df.position.set(0, 2.15, 0); df.rotation.x = -0.4;
    demoGroup.add(df);
}

// Solar inverter box
const inverter = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.4), new THREE.MeshStandardMaterial({ color: 0x616161, roughness: 0.4, metalness: 0.4, transparent: false, opacity: 1.0, depthWrite: true }));
inverter.position.set(13, 2, 9.5); solarOfficeGroup.add(inverter);
const invLabel = document.createElement('div');
invLabel.className = 'appliance-label';
invLabel.innerHTML = '<span class="name" style="font-size:0.7rem">Solar Inverter<br>5kW</span>';
const invCSS = new THREE.CSS2DObject(invLabel);
invCSS.position.set(13, 3.5, 9.5); solarOfficeGroup.add(invCSS);

// Building label
const solarLabelDiv = document.createElement('div');
solarLabelDiv.className = 'appliance-label';
solarLabelDiv.innerHTML = '<span class="name" style="font-size:1.1rem;">☀️ Solar Office</span>';
const solarLabel = new THREE.CSS2DObject(solarLabelDiv);
solarLabel.position.set(0, 12, 0);
solarOfficeGroup.add(solarLabel);

// ═══════════════════════════════════════════════
//  INTERIOR — SOLAR LEARNING LAB
// ═══════════════════════════════════════════════
const solarLab = new THREE.Group();
solarLab.position.set(0, 0.3, 0);
solarOfficeGroup.add(solarLab);

// Floor
const labFloor = new THREE.Mesh(new THREE.PlaneGeometry(26, 18), labFloorMat);
labFloor.rotation.x = -Math.PI / 2; labFloor.receiveShadow = true;
solarLab.add(labFloor);

// ═══════════════════════════════════════════════
//  ANIMATED PHOTON-TO-ELECTRICITY DIAGRAM (Wall canvas)
// ═══════════════════════════════════════════════
const photonCanvas = document.createElement('canvas');
photonCanvas.width = 1200; photonCanvas.height = 800;
const phCtx = photonCanvas.getContext('2d');
const photonTex = new THREE.CanvasTexture(photonCanvas);

// Photon particles state
const photonParticles = [];
for (let i = 0; i < 12; i++) {
    photonParticles.push({
        x: 100 + Math.random() * 1000,
        y: -20 - Math.random() * 100,
        speed: 1.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        converted: false,
        electronX: 0,
        holeX: 0
    });
}

function updatePhotonAnimation(time) {
    const ctx = phCtx;
    ctx.clearRect(0, 0, 1200, 800);

    // Background — dark gradient
    const bg = ctx.createLinearGradient(0, 0, 0, 800);
    bg.addColorStop(0, '#0D1B2A');
    bg.addColorStop(1, '#1B2838');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1200, 800);

    // Title
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 24px Georgia'; ctx.textAlign = 'center';
    ctx.fillText('☀️ HOW SOLAR CELLS CONVERT SUNLIGHT TO ELECTRICITY', 600, 35);

    // Sun at top
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.arc(600, 80, 35, 0, Math.PI * 2); ctx.fill();
    // Sun rays
    for (let r = 0; r < 8; r++) {
        const angle = (r / 8) * Math.PI * 2 + time * 0.5;
        ctx.strokeStyle = '#FFEB3B'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(600 + Math.cos(angle) * 40, 80 + Math.sin(angle) * 40);
        ctx.lineTo(600 + Math.cos(angle) * 55, 80 + Math.sin(angle) * 55);
        ctx.stroke();
    }

    // Solar cell cross-section layers
    const cellTop = 190;
    const layerHeight = 60;
    const cellLeft = 200, cellRight = 1000;
    const cellWidth = cellRight - cellLeft;

    // Anti-reflection coating
    ctx.fillStyle = '#1A237E44';
    ctx.fillRect(cellLeft, cellTop, cellWidth, 15);
    ctx.fillStyle = '#B3E5FC'; ctx.font = '12px monospace'; ctx.textAlign = 'right';
    ctx.fillText('Anti-Reflection Coating', cellLeft - 10, cellTop + 12);

    // N-type silicon (blue)
    const nGrad = ctx.createLinearGradient(cellLeft, cellTop + 15, cellLeft, cellTop + 15 + layerHeight);
    nGrad.addColorStop(0, '#1565C0');
    nGrad.addColorStop(1, '#0D47A1');
    ctx.fillStyle = nGrad;
    ctx.fillRect(cellLeft, cellTop + 15, cellWidth, layerHeight);
    ctx.fillStyle = '#BBDEFB'; ctx.textAlign = 'right';
    ctx.fillText('N-Type Silicon', cellLeft - 10, cellTop + 50);
    ctx.fillText('(Electrons)', cellLeft - 10, cellTop + 68);

    // P-N Junction line (depletion zone)
    ctx.strokeStyle = '#FF5722'; ctx.lineWidth = 3; ctx.setLineDash([8, 4]);
    ctx.beginPath(); ctx.moveTo(cellLeft, cellTop + 15 + layerHeight); ctx.lineTo(cellRight, cellTop + 15 + layerHeight); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#FF8A65'; ctx.textAlign = 'right';
    ctx.fillText('P-N Junction', cellLeft - 10, cellTop + 15 + layerHeight + 5);
    ctx.fillText('(Depletion Zone)', cellLeft - 10, cellTop + 15 + layerHeight + 23);

    // P-type silicon (red)
    const pGrad = ctx.createLinearGradient(cellLeft, cellTop + 15 + layerHeight, cellLeft, cellTop + 15 + layerHeight * 2);
    pGrad.addColorStop(0, '#C62828');
    pGrad.addColorStop(1, '#B71C1C');
    ctx.fillStyle = pGrad;
    ctx.fillRect(cellLeft, cellTop + 15 + layerHeight, cellWidth, layerHeight);
    ctx.fillStyle = '#FFCDD2'; ctx.textAlign = 'right';
    ctx.fillText('P-Type Silicon', cellLeft - 10, cellTop + 15 + layerHeight + 40);
    ctx.fillText('(Holes)', cellLeft - 10, cellTop + 15 + layerHeight + 58);

    // Metal contacts
    ctx.fillStyle = '#9E9E9E';
    ctx.fillRect(cellLeft, cellTop + 15 + layerHeight * 2, cellWidth, 8);
    ctx.fillStyle = '#E0E0E0'; ctx.textAlign = 'right';
    ctx.fillText('Metal Contact', cellLeft - 10, cellTop + 15 + layerHeight * 2 + 8);

    // Animate photon particles
    photonParticles.forEach(p => {
        p.y += p.speed;

        if (!p.converted && p.y > cellTop + 15 + layerHeight - 5) {
            // Hit the P-N junction — convert!
            p.converted = true;
            p.electronX = p.x;
            p.holeX = p.x;
        }

        if (p.converted) {
            // Electron goes up (through external circuit)
            p.electronX += 2;
            // Hole goes down
            p.holeX -= 1.5;

            // Electron (blue dot moving up then right)
            ctx.fillStyle = '#2196F3';
            ctx.beginPath();
            const ey = cellTop; // moves along top
            const ex = Math.min(p.electronX, cellRight + 20);
            ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#BBDEFB'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
            ctx.fillText('e⁻', ex, ey - 8);

            // Hole (red dot moving down)
            ctx.fillStyle = '#F44336';
            ctx.beginPath();
            const hy = cellTop + 15 + layerHeight + 30;
            const hx = Math.max(p.holeX, cellLeft - 20);
            ctx.arc(hx, hy, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFCDD2'; ctx.font = '9px monospace';
            ctx.fillText('h⁺', hx, hy - 8);

            // Reset when off screen
            if (p.electronX > cellRight + 50) {
                p.y = -20 - Math.random() * 100;
                p.x = 200 + Math.random() * 800;
                p.converted = false;
                p.electronX = 0;
                p.holeX = 0;
            }
        } else {
            // Photon falling (yellow dot with wavy motion)
            const wx = p.x + Math.sin(p.y * 0.03 + p.phase) * 10;
            ctx.fillStyle = '#FFD700';
            ctx.beginPath(); ctx.arc(wx, p.y, 6, 0, Math.PI * 2); ctx.fill();
            // Photon label
            ctx.fillStyle = '#FFEB3B'; ctx.font = '8px monospace'; ctx.textAlign = 'center';
            ctx.fillText('γ', wx, p.y - 9);
        }

        // Reset photons that go below
        if (p.y > 500 && !p.converted) {
            p.y = -20 - Math.random() * 100;
            p.x = 200 + Math.random() * 800;
        }
    });

    // External circuit (right side)
    ctx.strokeStyle = '#4CAF50'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cellRight + 10, cellTop);
    ctx.lineTo(cellRight + 60, cellTop);
    ctx.lineTo(cellRight + 60, cellTop + 15 + layerHeight * 2 + 8);
    ctx.lineTo(cellRight + 10, cellTop + 15 + layerHeight * 2 + 8);
    ctx.stroke();

    // Light bulb in circuit
    const bulbX = cellRight + 60, bulbY = cellTop + layerHeight;
    ctx.fillStyle = '#FFF9C4';
    ctx.beginPath(); ctx.arc(bulbX, bulbY, 15, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#FFC107'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#FF9800'; ctx.font = '18px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('💡', bulbX, bulbY + 6);

    // ══════════════════════════════════════
    //  BOTTOM: Complete Solar System Diagram
    // ══════════════════════════════════════
    const sysY = 480;
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center';
    ctx.fillText('Complete Solar Power System', 600, sysY);

    const sysStages = [
        { x: 100, label: 'Solar\nPanels', icon: '☀️', color: '#FFD700' },
        { x: 300, label: 'Charge\nController', icon: '🔌', color: '#4CAF50' },
        { x: 500, label: 'Battery\nBank', icon: '🔋', color: '#2196F3' },
        { x: 700, label: 'Inverter\nDC→AC', icon: '⚡', color: '#FF9800' },
        { x: 900, label: 'Your\nHome!', icon: '🏠', color: '#9C27B0' },
    ];

    sysStages.forEach((s, i) => {
        ctx.beginPath(); ctx.arc(s.x, sysY + 80, 35, 0, Math.PI * 2);
        ctx.fillStyle = s.color + '30'; ctx.fill();
        ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.stroke();
        ctx.font = '24px sans-serif'; ctx.fillText(s.icon, s.x, sysY + 88);
        ctx.fillStyle = '#FFF'; ctx.font = '11px monospace';
        s.label.split('\n').forEach((l, li) => ctx.fillText(l, s.x, sysY + 130 + li * 15));

        if (i < sysStages.length - 1) {
            const next = sysStages[i + 1];
            ctx.strokeStyle = s.color; ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.lineDashOffset = -(time * 40) % 8;
            ctx.beginPath();
            ctx.moveTo(s.x + 38, sysY + 80);
            ctx.lineTo(next.x - 38, sysY + 80);
            ctx.stroke();
            ctx.setLineDash([]);
            // Moving dot
            const dp = ((time * 0.4 + i * 0.25) % 1);
            const dx = s.x + 38 + (next.x - 38 - s.x - 38) * dp;
            ctx.beginPath(); ctx.arc(dx, sysY + 80, 4, 0, Math.PI * 2);
            ctx.fillStyle = s.color; ctx.fill();
        }
    });

    // Key facts
    ctx.fillStyle = '#A5D6A7'; ctx.font = '14px monospace'; ctx.textAlign = 'center';
    ctx.fillText('🌞 Zero CO₂ emissions  |  ☀️ Free fuel for 25+ years  |  💰 Save ₹60,000/year!', 600, sysY + 200);

    // Solar vs Grid comparison
    ctx.fillStyle = '#4CAF50'; ctx.font = '13px monospace';
    ctx.fillText('Solar: ₹2.5/kWh    vs    Grid: ₹8/kWh    →    68% savings!', 600, sysY + 230);

    photonTex.needsUpdate = true;
}

updatePhotonAnimation(0);

const photonDisplay = new THREE.Mesh(new THREE.PlaneGeometry(12, 8), new THREE.MeshStandardMaterial({ map: photonTex, emissive: 0x111111, emissiveIntensity: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
photonDisplay.position.set(0, 4.5, -9.8);
solarLab.add(photonDisplay);

// ═══════════════════════════════════════════════
//  3D SOLAR PANEL CROSS-SECTION MODEL
// ═══════════════════════════════════════════════
const solarModelGroup = new THREE.Group();
solarModelGroup.position.set(-6, 0, 2);
solarLab.add(solarModelGroup);

// Layers (bottom to top)
const modelLayers = [
    { name: 'Backsheet', color: 0x616161, h: 0.15, y: 0.075 },
    { name: 'Metal Contact', color: 0xBDBDBD, h: 0.08, y: 0.19 },
    { name: 'P-Type Silicon', color: 0xC62828, h: 0.4, y: 0.43 },
    { name: 'P-N Junction', color: 0xFF5722, h: 0.05, y: 0.655 },
    { name: 'N-Type Silicon', color: 0x1565C0, h: 0.4, y: 0.88 },
    { name: 'Anti-Reflection', color: 0x1A237E, h: 0.08, y: 1.12 },
    { name: 'Glass Cover', color: 0xB3E5FC, h: 0.1, y: 1.21 },
];

modelLayers.forEach((layer, i) => {
    const mat = new THREE.MeshStandardMaterial({
        color: layer.color, roughness: 0.6,
        transparent: layer.name === 'Glass Cover' || layer.name === 'Anti-Reflection',
        opacity: layer.name === 'Glass Cover' ? 0.3 : 1.0,
        depthWrite: layer.name !== 'Glass Cover'
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(3, layer.h, 2), mat);
    mesh.position.y = layer.y; mesh.castShadow = true; solarModelGroup.add(mesh);

    // Labels
    const labelDiv = document.createElement('div');
    labelDiv.className = 'appliance-label';
    labelDiv.innerHTML = '<span class="name" style="font-size:0.65rem;color:' + '#' + layer.color.toString(16).padStart(6, '0') + '">' + layer.name + '</span>';
    const labelCSS = new THREE.CSS2DObject(labelDiv);
    labelCSS.position.set(2, layer.y, 0); solarModelGroup.add(labelCSS);
});

// Model title
const modelTitle = document.createElement('div');
modelTitle.className = 'appliance-label';
modelTitle.innerHTML = '<span class="name" style="font-size:0.8rem">📐 Solar Cell Cross-Section</span>';
const modelTitleCSS = new THREE.CSS2DObject(modelTitle);
modelTitleCSS.position.set(0, 2.0, 0); solarModelGroup.add(modelTitleCSS);

// ═══════════════════════════════════════════════
//  BATTERY STORAGE DISPLAY
// ═══════════════════════════════════════════════
const batteryGroup = new THREE.Group();
batteryGroup.position.set(6, 0, 4);
solarLab.add(batteryGroup);

// 4 battery units
for (let bi = 0; bi < 4; bi++) {
    const battMat = new THREE.MeshStandardMaterial({
        color: bi < 3 ? 0x4CAF50 : 0xFFC107,
        roughness: 0.4, metalness: 0.3,
        transparent: false, opacity: 1.0, depthWrite: true
    });
    const batt = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.5, 0.6), battMat);
    batt.position.set(bi * 1.1 - 1.5, 0.75, 0); batt.castShadow = true; batteryGroup.add(batt);

    // Charge indicator LED
    const ledColor = bi < 3 ? 0x00FF00 : 0xFFFF00;
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8),
        new THREE.MeshStandardMaterial({ color: ledColor, emissive: ledColor, emissiveIntensity: 1.0, transparent: false, opacity: 1.0, depthWrite: true }));
    led.position.set(bi * 1.1 - 1.5, 1.55, 0.31); batteryGroup.add(led);
}

// Battery info label
const battLabel = document.createElement('div');
battLabel.className = 'appliance-label';
battLabel.innerHTML = '<span class="name" style="font-size:0.75rem">🔋 Battery Bank<br>10 kWh capacity<br>75% charged</span>';
const battCSS = new THREE.CSS2DObject(battLabel);
battCSS.position.set(0, 2.5, 0); batteryGroup.add(battCSS);

// ═══════════════════════════════════════════════
//  SOLAR IRRADIANCE MAP OF INDIA
// ═══════════════════════════════════════════════
const mapCanvas = document.createElement('canvas');
mapCanvas.width = 400; mapCanvas.height = 500;
const mapCtx = mapCanvas.getContext('2d');
mapCtx.fillStyle = '#0D1B2A'; mapCtx.fillRect(0, 0, 400, 500);
mapCtx.fillStyle = '#FFD700'; mapCtx.font = 'bold 18px Arial'; mapCtx.textAlign = 'center';
mapCtx.fillText('☀️ Solar Irradiance Map', 200, 30);
// Simplified India shape (rounded rect)
const indGrad = mapCtx.createLinearGradient(100, 60, 100, 450);
indGrad.addColorStop(0, '#FF5722'); // North - moderate
indGrad.addColorStop(0.3, '#FF9800'); // Central - good
indGrad.addColorStop(0.6, '#FFC107'); // South-Central - excellent
indGrad.addColorStop(1, '#FFEB3B'); // South - excellent
mapCtx.fillStyle = indGrad;
mapCtx.beginPath();
mapCtx.moveTo(200, 60);
mapCtx.quadraticCurveTo(310, 100, 280, 200);
mapCtx.quadraticCurveTo(320, 280, 280, 350);
mapCtx.quadraticCurveTo(230, 460, 200, 450);
mapCtx.quadraticCurveTo(170, 460, 130, 350);
mapCtx.quadraticCurveTo(90, 280, 120, 200);
mapCtx.quadraticCurveTo(100, 100, 200, 60);
mapCtx.fill();
// City dots
mapCtx.fillStyle = '#FFF';
const cities = [
    { name: 'Delhi', x: 200, y: 130 },
    { name: 'Mumbai', x: 140, y: 280 },
    { name: 'Chennai', x: 230, y: 380 },
    { name: 'Rajasthan', x: 160, y: 180 },
];
cities.forEach(c => {
    mapCtx.beginPath(); mapCtx.arc(c.x, c.y, 4, 0, Math.PI * 2); mapCtx.fill();
    mapCtx.font = '10px Arial'; mapCtx.fillText(c.name, c.x + 8, c.y + 4);
});
// Legend
mapCtx.fillStyle = '#FF5722'; mapCtx.fillRect(300, 80, 20, 15); mapCtx.fillStyle = '#FFF'; mapCtx.font = '10px Arial'; mapCtx.textAlign = 'left'; mapCtx.fillText('4-5 kWh/m²', 325, 92);
mapCtx.fillStyle = '#FFC107'; mapCtx.fillRect(300, 100, 20, 15); mapCtx.fillText('5-6 kWh/m²', 325, 112);
mapCtx.fillStyle = '#FFEB3B'; mapCtx.fillRect(300, 120, 20, 15); mapCtx.fillText('6+ kWh/m²', 325, 132);

const mapTex = new THREE.CanvasTexture(mapCanvas);
const irradianceMap = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 3.2), new THREE.MeshStandardMaterial({ map: mapTex, transparent: false, opacity: 1.0, depthWrite: true }));
irradianceMap.position.set(12.8, 3.5, 0); irradianceMap.rotation.y = -Math.PI / 2;
solarLab.add(irradianceMap);

// ═══════════════════════════════════════════════
//  COST SAVINGS CALCULATOR DISPLAY
// ═══════════════════════════════════════════════
const calcCanvas = document.createElement('canvas');
calcCanvas.width = 500; calcCanvas.height = 400;
const clCtx = calcCanvas.getContext('2d');
clCtx.fillStyle = '#1B5E20'; clCtx.fillRect(0, 0, 500, 400);
clCtx.fillStyle = '#FFD700'; clCtx.font = 'bold 22px Georgia'; clCtx.textAlign = 'center';
clCtx.fillText('💰 Solar Savings Calculator', 250, 40);
clCtx.fillStyle = '#FFFFFF'; clCtx.font = '16px monospace';
clCtx.fillText('Monthly Grid Bill:      ₹3,500', 250, 90);
clCtx.fillText('With Solar (5kW):       ₹700', 250, 125);
clCtx.fillStyle = '#4CAF50'; clCtx.font = 'bold 20px monospace';
clCtx.fillText('Monthly Savings: ₹2,800', 250, 175);
clCtx.fillText('Yearly Savings:  ₹33,600', 250, 210);
clCtx.fillStyle = '#FFD700'; clCtx.font = '14px monospace';
clCtx.fillText('System Cost: ₹2,50,000', 250, 260);
clCtx.fillText('Govt Subsidy: ₹94,000', 250, 290);
clCtx.fillText('Net Cost: ₹1,56,000', 250, 320);
clCtx.fillStyle = '#A5D6A7'; clCtx.font = 'bold 18px monospace';
clCtx.fillText('ROI: 4.6 years ✅', 250, 370);
const clTex = new THREE.CanvasTexture(calcCanvas);
const calcBoard = new THREE.Mesh(new THREE.PlaneGeometry(3, 2.4), new THREE.MeshStandardMaterial({ map: clTex, emissive: 0x112211, emissiveIntensity: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
calcBoard.position.set(-12.8, 3.5, 0); calcBoard.rotation.y = Math.PI / 2;
solarLab.add(calcBoard);

// ═══════════════════════════════════════════════
//  4 INTERACTIVE LEARNING STATIONS
// ═══════════════════════════════════════════════
const stationTopics = [
    { title: 'Silicon\nCrystals', icon: '🔬', color: '#2196F3' },
    { title: 'Photon\nAbsorption', icon: '☀️', color: '#FFD700' },
    { title: 'Electron\nFlow', icon: '⚡', color: '#4CAF50' },
    { title: 'Energy\nStorage', icon: '🔋', color: '#FF9800' },
];

stationTopics.forEach((st, i) => {
    const sg = new THREE.Group();
    sg.position.set(-4 + i * 3, 0, 6);
    solarLab.add(sg);
    // Kiosk base
    const kiosk = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 0.5), new THREE.MeshStandardMaterial({ color: 0x424242, roughness: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
    kiosk.position.set(0, 0.5, 0); kiosk.castShadow = true; sg.add(kiosk);
    // Screen
    const sc = document.createElement('canvas');
    sc.width = 200; sc.height = 250;
    const sctx = sc.getContext('2d');
    sctx.fillStyle = '#0A0E1A'; sctx.fillRect(0, 0, 200, 250);
    sctx.fillStyle = st.color; sctx.font = '36px sans-serif'; sctx.textAlign = 'center';
    sctx.fillText(st.icon, 100, 60);
    sctx.fillStyle = '#FFF'; sctx.font = 'bold 14px Arial';
    st.title.split('\n').forEach((l, li) => sctx.fillText(l, 100, 110 + li * 20));
    sctx.fillStyle = '#888'; sctx.font = '10px Arial';
    sctx.fillText('Touch to learn!', 100, 200);
    const stTex = new THREE.CanvasTexture(sc);
    const stScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.9), new THREE.MeshStandardMaterial({ map: stTex, emissive: 0x111111, emissiveIntensity: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
    stScreen.position.set(0, 1.2, 0.26); sg.add(stScreen);
});

// ═══════════════════════════════════════════════
//  LIGHTING
// ═══════════════════════════════════════════════
const solarLabLight1 = new THREE.PointLight(0xFFF4E0, 1.5, 25, 1.2);
solarLabLight1.position.set(0, 7, 0); solarLabLight1.castShadow = true;
solarLab.add(solarLabLight1);
const solarLabLight2 = new THREE.PointLight(0xFFF4E0, 0.8, 15, 1.5);
solarLabLight2.position.set(-8, 6, -5); solarLab.add(solarLabLight2);
const solarLabLight3 = new THREE.PointLight(0xFFF4E0, 0.8, 15, 1.5);
solarLabLight3.position.set(8, 6, 5); solarLab.add(solarLabLight3);

// Warm sunlight through glass facade
const sunFacade = new THREE.DirectionalLight(0xFFD700, 0.5);
sunFacade.position.set(0, 5, 12); solarLab.add(sunFacade);

// Export update function for animate loop
window.updateSolarDisplays = function (time) {
    updatePhotonAnimation(time);
};

// ═══════════════════════════════════════════════
//  DOOR TRIGGER
// ═══════════════════════════════════════════════
const SOLAR_OFFICE_DOOR = {
    position: new THREE.Vector3(0, 0, -100 + 14),
    radius: 2.5,
    label: '☀️ Solar Office',
    houseId: 'solar-office'
};
window.SOLAR_OFFICE_DOOR = SOLAR_OFFICE_DOOR;

console.log('[SOLAR_OFFICE] Built — Solar learning lab with photon animation, 3D cross-section model, battery bank, irradiance map, cost calculator, 4 learning stations');
