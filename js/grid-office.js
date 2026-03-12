// ═══════════════════════════════════════════════
//  GRID OFFICE — Power Grid Educational Center
//  Industrial-style building with control room,
//  animated power flow diagram, live grid displays
//  ALL WALLS SOLID
// ═══════════════════════════════════════════════

const gridOfficeGroup = new THREE.Group();
gridOfficeGroup.position.set(0, 0, -70);
scene.add(gridOfficeGroup);

// ── MATERIALS ──
const gridWallMat = new THREE.MeshStandardMaterial({ color: 0x78909C, roughness: 0.85, metalness: 0.1, transparent: false, opacity: 1.0, depthWrite: true });
const gridFloorMat = new THREE.MeshStandardMaterial({ color: 0x607D8B, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
const warningStripeMat = new THREE.MeshStandardMaterial({ color: 0xFFC107, roughness: 0.6, transparent: false, opacity: 1.0, depthWrite: true });
const metalGrey = new THREE.MeshStandardMaterial({ color: 0x9E9E9E, roughness: 0.4, metalness: 0.6, transparent: false, opacity: 1.0, depthWrite: true });
const darkPanel = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.5, metalness: 0.3, transparent: false, opacity: 1.0, depthWrite: true });

// ═══════════════════════════════════════════════
//  EXTERIOR — Industrial Power Authority Building
// ═══════════════════════════════════════════════

// Main building body
const gridBody = new THREE.Mesh(new THREE.BoxGeometry(26, 8, 20), gridWallMat);
gridBody.position.set(0, 4, 0); gridBody.castShadow = true; gridBody.receiveShadow = true;
gridOfficeGroup.add(gridBody);

// Flat industrial roof with edge trim
const gridRoof = new THREE.Mesh(new THREE.BoxGeometry(27, 0.3, 21), metalGrey);
gridRoof.position.set(0, 8.15, 0); gridRoof.castShadow = true; gridOfficeGroup.add(gridRoof);

// Warning stripes along base
for (let si = -12; si <= 12; si += 2) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 0.06), warningStripeMat);
    stripe.position.set(si, 0.3, 10.03); gridOfficeGroup.add(stripe);
}

// Main entrance (heavy steel door)
const gridDoor = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.5, 0.12), new THREE.MeshStandardMaterial({ color: 0x37474F, roughness: 0.4, metalness: 0.6, transparent: false, opacity: 1.0, depthWrite: true }));
gridDoor.position.set(0, 1.75, 10.06); gridOfficeGroup.add(gridDoor);
const gridWindowsDoor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.04), new THREE.MeshStandardMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.20, depthWrite: false }));
gridWindowsDoor.position.set(0, 2.5, 10.12); gridOfficeGroup.add(gridWindowsDoor);

// Sign: POWER GRID AUTHORITY
const gridSignCanvas = document.createElement('canvas');
gridSignCanvas.width = 600; gridSignCanvas.height = 100;
const gsCtx = gridSignCanvas.getContext('2d');
gsCtx.fillStyle = '#263238'; gsCtx.fillRect(0, 0, 600, 100);
gsCtx.strokeStyle = '#FFC107'; gsCtx.lineWidth = 3; gsCtx.strokeRect(5, 5, 590, 90);
gsCtx.fillStyle = '#FFC107'; gsCtx.font = 'bold 32px monospace'; gsCtx.textAlign = 'center';
gsCtx.fillText('⚡ POWER GRID AUTHORITY ⚡', 300, 62);
const gsTex = new THREE.CanvasTexture(gridSignCanvas);
const gridSign = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.3), new THREE.MeshStandardMaterial({ map: gsTex, emissive: 0x221100, emissiveIntensity: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
gridSign.position.set(0, 7, 10.04); gridOfficeGroup.add(gridSign);

// High-voltage transformer outside (right side)
const transformerGroup = new THREE.Group();
transformerGroup.position.set(16, 0, 3);
gridOfficeGroup.add(transformerGroup);
// Main transformer body
const xformerBody = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 2), new THREE.MeshStandardMaterial({ color: 0x546E7A, roughness: 0.5, metalness: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
xformerBody.position.set(0, 2, 0); xformerBody.castShadow = true; transformerGroup.add(xformerBody);
// 3 HV bushings
for (let bi = -1; bi <= 1; bi++) {
    const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 2, 8), new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
    bushing.position.set(bi * 0.5, 4.5, 0); transformerGroup.add(bushing);
    // Ceramic insulator rings
    for (let ri = 0; ri < 3; ri++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 12), new THREE.MeshStandardMaterial({ color: 0xEFEBE9, roughness: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
        ring.position.set(bi * 0.5, 3.8 + ri * 0.4, 0); ring.rotation.x = Math.PI / 2; transformerGroup.add(ring);
    }
}
// Glow around transformer
const xformerGlow = new THREE.PointLight(0x4FC3F7, 0.8, 8, 1.5);
xformerGlow.position.set(0, 3, 0); transformerGroup.add(xformerGlow);

// Chain-link fence around transformer
const fenceMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.7, transparent: true, opacity: 0.5, depthWrite: false });
for (const [fx, fz, fw, fd] of [[-2, 0, 0.05, 5], [2, 0, 0.05, 5], [0, -2.5, 4, 0.05], [0, 2.5, 4, 0.05]]) {
    const fence = new THREE.Mesh(new THREE.BoxGeometry(fw, 2.5, fd), fenceMat);
    fence.position.set(fx, 1.25, fz); transformerGroup.add(fence);
}

// Danger sign
const dangerCanvas = document.createElement('canvas');
dangerCanvas.width = 200; dangerCanvas.height = 200;
const dcCtx = dangerCanvas.getContext('2d');
dcCtx.fillStyle = '#FFFFFF'; dcCtx.fillRect(0, 0, 200, 200);
dcCtx.fillStyle = '#F44336'; dcCtx.font = 'bold 24px Arial'; dcCtx.textAlign = 'center';
dcCtx.fillText('⚠️ DANGER', 100, 50);
dcCtx.fillText('HIGH VOLTAGE', 100, 90);
dcCtx.fillText('33,000V', 100, 130);
dcCtx.fillStyle = '#FFC107'; dcCtx.font = '16px Arial';
dcCtx.fillText('KEEP OUT', 100, 170);
const dTex = new THREE.CanvasTexture(dangerCanvas);
const dangerSign = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshStandardMaterial({ map: dTex, transparent: false, opacity: 1.0, depthWrite: true }));
dangerSign.position.set(0, 1.8, 2.5); transformerGroup.add(dangerSign);

// Security booth
const boothGroup = new THREE.Group();
boothGroup.position.set(-14, 0, 12);
gridOfficeGroup.add(boothGroup);
const boothBody = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), new THREE.MeshStandardMaterial({ color: 0xECEFF1, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true }));
boothBody.position.set(0, 1.25, 0); boothBody.castShadow = true; boothGroup.add(boothBody);
const boothRoof = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 3), metalGrey);
boothRoof.position.set(0, 2.55, 0); boothGroup.add(boothRoof);
const boothWindow = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 0.04), new THREE.MeshStandardMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.20, depthWrite: false }));
boothWindow.position.set(0, 2, 1.26); boothGroup.add(boothWindow);

// Building label
const gridLabelDiv = document.createElement('div');
gridLabelDiv.className = 'appliance-label';
gridLabelDiv.innerHTML = '<span class="name" style="font-size:1.1rem;">⚡ Grid Office</span>';
const gridLabel = new THREE.CSS2DObject(gridLabelDiv);
gridLabel.position.set(0, 12, 0);
gridOfficeGroup.add(gridLabel);

// ═══════════════════════════════════════════════
//  CONTROL ROOM INTERIOR
// ═══════════════════════════════════════════════
const controlRoom = new THREE.Group();
controlRoom.position.set(0, 0.3, 0);
gridOfficeGroup.add(controlRoom);

// Floor
const crFloor = new THREE.Mesh(new THREE.PlaneGeometry(24, 18), gridFloorMat);
crFloor.rotation.x = -Math.PI / 2; crFloor.receiveShadow = true;
controlRoom.add(crFloor);

// ═══════════════════════════════════════════════
//  ANIMATED POWER FLOW DIAGRAM — Canvas (updates in animate loop)
// ═══════════════════════════════════════════════
const flowCanvas = document.createElement('canvas');
flowCanvas.width = 1200; flowCanvas.height = 400;
const flowCtx = flowCanvas.getContext('2d');
const flowTex = new THREE.CanvasTexture(flowCanvas);

function updatePowerFlowDiagram(time) {
    const ctx = flowCtx;
    ctx.clearRect(0, 0, 1200, 400);

    // Background
    ctx.fillStyle = '#0A0E1A';
    ctx.fillRect(0, 0, 1200, 400);

    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ HOW ELECTRICITY REACHES YOUR HOME ⚡', 600, 35);

    // Flow stages with animated connecting lines
    const stages = [
        { x: 80, label: 'Coal/Gas\nPower Plant', icon: '🏭', color: '#FF5722' },
        { x: 280, label: 'Generator\n20,000V', icon: '⚙️', color: '#FF9800' },
        { x: 480, label: 'Step-Up\nTransformer\n400,000V', icon: '🔺', color: '#FFC107' },
        { x: 680, label: 'Transmission\nLines', icon: '⚡', color: '#FFEB3B' },
        { x: 880, label: 'Step-Down\nTransformer\n240V', icon: '🔻', color: '#4CAF50' },
        { x: 1080, label: 'Your\nHome!', icon: '🏠', color: '#2196F3' },
    ];

    stages.forEach((s, i) => {
        // Stage circle
        ctx.beginPath();
        ctx.arc(s.x, 180, 45, 0, Math.PI * 2);
        ctx.fillStyle = s.color + '40'; ctx.fill();
        ctx.strokeStyle = s.color; ctx.lineWidth = 3; ctx.stroke();

        // Icon
        ctx.font = '28px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(s.icon, s.x, 186);

        // Label
        ctx.fillStyle = '#FFFFFF'; ctx.font = '11px monospace';
        const lines = s.label.split('\n');
        lines.forEach((l, li) => ctx.fillText(l, s.x, 240 + li * 16));

        // Animated connecting line
        if (i < stages.length - 1) {
            const nextS = stages[i + 1];
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.lineDashOffset = -(time * 50) % 10;
            ctx.beginPath();
            ctx.moveTo(s.x + 48, 180);
            ctx.lineTo(nextS.x - 48, 180);
            ctx.stroke();
            ctx.setLineDash([]);

            // Moving dot along the line
            const dotProgress = ((time * 0.3 + i * 0.2) % 1);
            const dotX = s.x + 48 + (nextS.x - 48 - s.x - 48) * dotProgress;
            ctx.beginPath();
            ctx.arc(dotX, 180, 4, 0, Math.PI * 2);
            ctx.fillStyle = s.color; ctx.fill();
        }
    });

    // Energy loss info at bottom
    ctx.fillStyle = '#FF6B6B'; ctx.font = '14px monospace'; ctx.textAlign = 'center';
    ctx.fillText('⚠️ Transmission Loss: ~22% of generated power is lost before reaching homes!', 600, 350);

    // CO₂ counter
    const co2 = Math.floor(time * 12.5);
    ctx.fillStyle = '#FF5722'; ctx.font = 'bold 16px monospace';
    ctx.fillText('CO₂ emitted: ' + co2 + ' g/kWh — Coal is the dirtiest fuel!', 600, 380);

    flowTex.needsUpdate = true;
}

// Initial render
updatePowerFlowDiagram(0);

const flowDisplay = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.3), new THREE.MeshStandardMaterial({ map: flowTex, emissive: 0x111111, emissiveIntensity: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
flowDisplay.position.set(0, 4.5, -9.8);
controlRoom.add(flowDisplay);

// ═══════════════════════════════════════════════
//  OPERATOR CONTROL PANELS (3 stations)
// ═══════════════════════════════════════════════
for (let pi = 0; pi < 3; pi++) {
    const px = -5 + pi * 5;
    const panelGroup = new THREE.Group();
    panelGroup.position.set(px, 0, 2);
    controlRoom.add(panelGroup);

    // Console desk
    const console = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 1), darkPanel);
    console.position.set(0, 0.6, 0); console.castShadow = true; panelGroup.add(console);

    // Angled display panel
    const displayPanel = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 0.08), darkPanel);
    displayPanel.position.set(0, 1.8, -0.3);
    displayPanel.rotation.x = -0.3;
    panelGroup.add(displayPanel);

    // Gauge (circle)
    const gaugeCanvas = document.createElement('canvas');
    gaugeCanvas.width = 200; gaugeCanvas.height = 200;
    const gCtx = gaugeCanvas.getContext('2d');
    gCtx.fillStyle = '#1A1A2E'; gCtx.fillRect(0, 0, 200, 200);
    gCtx.strokeStyle = '#333'; gCtx.lineWidth = 3;
    gCtx.beginPath(); gCtx.arc(100, 100, 80, 0, Math.PI * 2); gCtx.stroke();
    // Gauge arc
    gCtx.strokeStyle = '#4CAF50'; gCtx.lineWidth = 8;
    gCtx.beginPath(); gCtx.arc(100, 100, 70, Math.PI * 0.75, Math.PI * 0.75 + Math.PI * 1.2); gCtx.stroke();
    gCtx.strokeStyle = '#FFC107'; gCtx.beginPath(); gCtx.arc(100, 100, 70, Math.PI * 0.75 + Math.PI * 1.2, Math.PI * 0.75 + Math.PI * 1.35); gCtx.stroke();
    gCtx.strokeStyle = '#F44336'; gCtx.beginPath(); gCtx.arc(100, 100, 70, Math.PI * 0.75 + Math.PI * 1.35, Math.PI * 0.75 + Math.PI * 1.5); gCtx.stroke();
    // Needle
    const needleAngle = Math.PI * 0.75 + (0.3 + pi * 0.2) * Math.PI * 1.5;
    gCtx.strokeStyle = '#FF0000'; gCtx.lineWidth = 2;
    gCtx.beginPath(); gCtx.moveTo(100, 100);
    gCtx.lineTo(100 + Math.cos(needleAngle) * 55, 100 + Math.sin(needleAngle) * 55); gCtx.stroke();
    // Center dot
    gCtx.fillStyle = '#FF0000'; gCtx.beginPath(); gCtx.arc(100, 100, 5, 0, Math.PI * 2); gCtx.fill();
    gCtx.fillStyle = '#FFFFFF'; gCtx.font = '14px monospace'; gCtx.textAlign = 'center';
    const gaugeLabels = ['Load %', 'Frequency Hz', 'Voltage kV'];
    gCtx.fillText(gaugeLabels[pi], 100, 160);
    const gTex = new THREE.CanvasTexture(gaugeCanvas);
    const gauge = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshStandardMaterial({ map: gTex, emissive: 0x111111, emissiveIntensity: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
    gauge.position.set(-0.6, 1.75, -0.2);
    gauge.rotation.x = -0.3;
    panelGroup.add(gauge);

    // Status LEDs
    for (let li = 0; li < 4; li++) {
        const ledColor = [0x00FF00, 0x00FF00, 0xFFFF00, 0x00FF00][li];
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshStandardMaterial({ color: ledColor, emissive: ledColor, emissiveIntensity: 1.0, transparent: false, opacity: 1.0, depthWrite: true }));
        led.position.set(0.5 + li * 0.3, 1.3, 0.4); panelGroup.add(led);
    }

    // Chair
    const opChair = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 8), new THREE.MeshStandardMaterial({ color: 0x37474F, roughness: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
    opChair.position.set(0, 0.65, 1.5); panelGroup.add(opChair);
}

// ═══════════════════════════════════════════════
//  LARGE CENTRAL DISPLAY SCREEN (live grid status)
// ═══════════════════════════════════════════════
const mainScreenCanvas = document.createElement('canvas');
mainScreenCanvas.width = 800; mainScreenCanvas.height = 500;
const msCtx = mainScreenCanvas.getContext('2d');
const mainScreenTex = new THREE.CanvasTexture(mainScreenCanvas);

// Global grid load state
window.gridLoad = {
    totalWatts: 0,
    capacity: 10000,
    appliances: [],
    status: 'normal'
};

function updateMainScreen(time) {
    const ctx = msCtx;
    ctx.clearRect(0, 0, 800, 500);
    ctx.fillStyle = '#0A0E1A'; ctx.fillRect(0, 0, 800, 500);

    // Header
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'center';
    ctx.fillText('GRID CONTROL CENTER — LIVE STATUS', 400, 40);

    // Load bar
    const load = window.gridLoad;
    const pct = Math.min(load.totalWatts / load.capacity, 1);
    const barColor = pct < 0.6 ? '#4CAF50' : pct < 0.85 ? '#FFC107' : '#F44336';
    ctx.fillStyle = '#333'; ctx.fillRect(80, 70, 640, 30);
    ctx.fillStyle = barColor; ctx.fillRect(80, 70, 640 * pct, 30);
    ctx.fillStyle = '#FFF'; ctx.font = '14px monospace'; ctx.textAlign = 'center';
    ctx.fillText('Grid Load: ' + Math.round(pct * 100) + '% (' + load.totalWatts + 'W / ' + load.capacity + 'W)', 400, 92);

    // Status
    ctx.fillStyle = barColor; ctx.font = 'bold 20px monospace';
    const statusText = pct < 0.6 ? '🟢 NORMAL' : pct < 0.85 ? '🟡 HIGH LOAD' : '🔴 CRITICAL';
    ctx.fillText('Status: ' + statusText, 400, 140);

    // Grid stats
    ctx.fillStyle = '#BBDEFB'; ctx.font = '16px monospace'; ctx.textAlign = 'left';
    ctx.fillText('Frequency:    50.02 Hz', 80, 190);
    ctx.fillText('Voltage:      233.8 V', 80, 220);
    ctx.fillText('Power Factor: 0.92', 80, 250);
    ctx.fillText('CO₂ Rate:     820 g/kWh', 80, 280);

    // Cost calculator
    ctx.textAlign = 'right';
    const hourlyW = load.totalWatts;
    const dailyCost = Math.round(hourlyW * 8 / 1000 * 8);
    const monthlyCost = dailyCost * 30;
    ctx.fillText('Hourly Usage:  ' + hourlyW + ' W', 720, 190);
    ctx.fillText('Daily Cost:    ₹' + dailyCost, 720, 220);
    ctx.fillText('Monthly Cost:  ₹' + monthlyCost, 720, 250);

    // Animated pulse
    ctx.fillStyle = barColor + '40'; ctx.textAlign = 'center';
    const pulseRadius = 15 + Math.sin(time * 3) * 5;
    ctx.beginPath(); ctx.arc(400, 350, pulseRadius, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFF'; ctx.font = '12px monospace';
    ctx.fillText('LIVE', 400, 355);

    // Mini sine wave
    ctx.strokeStyle = '#4FC3F7'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 80; x <= 720; x++) {
        const y = 420 + Math.sin((x - 80) * 0.05 + time * 3) * 20;
        if (x === 80) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = '#4FC3F7'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
    ctx.fillText('50 Hz AC Waveform', 400, 470);

    mainScreenTex.needsUpdate = true;
}

updateMainScreen(0);

const mainScreen = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), new THREE.MeshStandardMaterial({ map: mainScreenTex, emissive: 0x111111, emissiveIntensity: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
mainScreen.position.set(0, 4.5, 9.8); mainScreen.rotation.y = Math.PI;
controlRoom.add(mainScreen);

// Frame around main screen
const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(8.5, 5.5, 0.1), metalGrey);
screenFrame.position.set(0, 4.5, 9.85); screenFrame.rotation.y = Math.PI;
controlRoom.add(screenFrame);

// ═══════════════════════════════════════════════
//  EDUCATIONAL PANELS (walls)
// ═══════════════════════════════════════════════
const eduPanels = [
    { title: 'AC vs DC Current', content: 'AC (Alternating Current)\nchanges direction 50x/sec\n\nDC (Direct Current)\nflows in one direction\n\nHomes use AC at 240V\nBatteries/Solar use DC', x: -12.9, z: 0, ry: Math.PI / 2 },
    { title: 'Why Power Cuts?', content: 'Demand > Supply = Outage\n\nPeak hours: 6-10 PM\nFactories + homes + ACs\n\nSolution: Solar reduces\npeak demand by 30%!', x: 12.9, z: 0, ry: -Math.PI / 2 },
    { title: 'Transmission Loss', content: 'From plant to home:\n\n5% at generator\n3% at step-up\n8% in transmission\n3% at step-down\n3% local distribution\n\n= 22% LOST as heat!', x: -12.9, z: -5, ry: Math.PI / 2 },
];
eduPanels.forEach(ep => {
    const c = document.createElement('canvas');
    c.width = 350; c.height = 500;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#1A237E'; ctx.fillRect(0, 0, 350, 500);
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 3; ctx.strokeRect(5, 5, 340, 490);
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center';
    ctx.fillText(ep.title, 175, 45);
    ctx.fillStyle = '#FFFFFF'; ctx.font = '14px Arial';
    ep.content.split('\n').forEach((line, i) => ctx.fillText(line, 175, 85 + i * 22));
    const t = new THREE.CanvasTexture(c);
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.0), new THREE.MeshStandardMaterial({ map: t, emissive: 0x111111, emissiveIntensity: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
    panel.position.set(ep.x, 3.5, ep.z); panel.rotation.y = ep.ry;
    controlRoom.add(panel);
});

// ═══════════════════════════════════════════════
//  3D TRANSFORMER MODEL (center of room)
// ═══════════════════════════════════════════════
const xformer3D = new THREE.Group();
xformer3D.position.set(0, 0, -4);
controlRoom.add(xformer3D);

// Core (E-shape laminated iron)
const coreMat = new THREE.MeshStandardMaterial({ color: 0x424242, roughness: 0.6, metalness: 0.4, transparent: false, opacity: 1.0, depthWrite: true });
const coreFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.0, 0.3), coreMat);
coreFrame.position.set(0, 1.5, 0); xformer3D.add(coreFrame);
const coreTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 0.3), coreMat);
coreTop.position.set(0, 2.6, 0); xformer3D.add(coreTop);
const coreBot = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 0.3), coreMat);
coreBot.position.set(0, 0.5, 0); xformer3D.add(coreBot);
// Primary coil (left - more turns)
const primCoil = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 8, 24), new THREE.MeshStandardMaterial({ color: 0xF44336, roughness: 0.3, metalness: 0.4, transparent: false, opacity: 1.0, depthWrite: true }));
primCoil.position.set(-0.6, 1.5, 0); xformer3D.add(primCoil);
// Secondary coil (right - fewer turns)
const secCoil = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.06, 8, 18), new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.3, metalness: 0.4, transparent: false, opacity: 1.0, depthWrite: true }));
secCoil.position.set(0.6, 1.5, 0); xformer3D.add(secCoil);

// Labels
const primLabel = document.createElement('div');
primLabel.className = 'appliance-label';
primLabel.innerHTML = '<span class="name" style="font-size:0.7rem;color:#FF5722;">Primary Coil<br>11,000V</span>';
const primCSS = new THREE.CSS2DObject(primLabel);
primCSS.position.set(-0.6, 3.2, 0); xformer3D.add(primCSS);
const secLabel = document.createElement('div');
secLabel.className = 'appliance-label';
secLabel.innerHTML = '<span class="name" style="font-size:0.7rem;color:#2196F3;">Secondary Coil<br>240V</span>';
const secCSS = new THREE.CSS2DObject(secLabel);
secCSS.position.set(0.6, 3.2, 0); xformer3D.add(secCSS);

// ═══════════════════════════════════════════════
//  LIGHTING & SOUND
// ═══════════════════════════════════════════════
const controlRoomLight1 = new THREE.PointLight(0x4FC3F7, 1.5, 20, 1.2);
controlRoomLight1.position.set(0, 7, 0); controlRoomLight1.castShadow = true;
controlRoom.add(controlRoomLight1);
const controlRoomLight2 = new THREE.PointLight(0xFFFFFF, 0.8, 15, 1.5);
controlRoomLight2.position.set(-6, 6, 4); controlRoom.add(controlRoomLight2);
const controlRoomLight3 = new THREE.PointLight(0xFFFFFF, 0.8, 15, 1.5);
controlRoomLight3.position.set(6, 6, 4); controlRoom.add(controlRoomLight3);

// Web Audio API — 50Hz hum
let gridAudioCtx, gridHumOsc;
function startGridHum() {
    try {
        gridAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gridHumOsc = gridAudioCtx.createOscillator();
        const gainNode = gridAudioCtx.createGain();
        gridHumOsc.type = 'sine';
        gridHumOsc.frequency.value = 50;
        gainNode.gain.value = 0.02; // Very quiet
        gridHumOsc.connect(gainNode);
        gainNode.connect(gridAudioCtx.destination);
        gridHumOsc.start();
    } catch (e) { /* Audio not available */ }
}

// ═══════════════════════════════════════════════
//  LIVE GRID RESPONSIVENESS — appliance toggle listener
// ═══════════════════════════════════════════════
window.addEventListener('applianceToggled', (e) => {
    if (!e.detail) return;
    const { name, watt, isOn } = e.detail;
    if (isOn) {
        window.gridLoad.totalWatts += watt;
        window.gridLoad.appliances.push(name);
    } else {
        window.gridLoad.totalWatts = Math.max(0, window.gridLoad.totalWatts - watt);
        const idx = window.gridLoad.appliances.indexOf(name);
        if (idx !== -1) window.gridLoad.appliances.splice(idx, 1);
    }
    window.gridLoad.status = window.gridLoad.totalWatts / window.gridLoad.capacity < 0.6 ? 'normal' :
        window.gridLoad.totalWatts / window.gridLoad.capacity < 0.85 ? 'high' : 'critical';
});

// Export update functions for animate loop
window.updateGridDisplays = function (time) {
    updatePowerFlowDiagram(time);
    updateMainScreen(time);
};

// ═══════════════════════════════════════════════
//  DOOR TRIGGER
// ═══════════════════════════════════════════════
const GRID_OFFICE_DOOR = {
    position: new THREE.Vector3(0, 0, -70 + 12),
    radius: 2.5,
    label: '⚡ Grid Office',
    houseId: 'grid-office'
};
window.GRID_OFFICE_DOOR = GRID_OFFICE_DOOR;

console.log('[GRID_OFFICE] Built — Control room with animated power flow, live grid display, 3D transformer model');
