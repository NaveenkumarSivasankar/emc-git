// ═══════════════════════════════════════════════
//  OFFICE BUILDING — Modern 3-Floor Office Tower
//  Exterior + 3 Interior Rooms
//  ALL WALLS SOLID except glass facade
// ═══════════════════════════════════════════════

const officeGroup = new THREE.Group();
officeGroup.position.set(20, 0, -40);
scene.add(officeGroup);

// ── MATERIALS ──
const officeFloorMats = [
    new THREE.MeshStandardMaterial({ color: 0xECEFF1, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true }),
    new THREE.MeshStandardMaterial({ color: 0xCFD8DC, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true }),
    new THREE.MeshStandardMaterial({ color: 0xB0BEC5, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true }),
];
const officeGlassMat = new THREE.MeshStandardMaterial({ color: 0xB3E5FC, transparent: true, opacity: 0.20, roughness: 0.1, metalness: 0.3, depthWrite: false });
const officeDeskMat = new THREE.MeshStandardMaterial({ color: 0xD7CCC8, roughness: 0.6, transparent: false, opacity: 1.0, depthWrite: true });
const officeChairMat = new THREE.MeshStandardMaterial({ color: 0x37474F, roughness: 0.5, transparent: false, opacity: 1.0, depthWrite: true });
const partitionMat = new THREE.MeshStandardMaterial({ color: 0xBDBDBD, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.5, transparent: false, opacity: 1.0, depthWrite: true });
const serverBlack = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.3, metalness: 0.5, transparent: false, opacity: 1.0, depthWrite: true });

// ═══════════════════════════════════════════════
//  EXTERIOR — 3-Floor Tower
// ═══════════════════════════════════════════════
for (let fl = 0; fl < 3; fl++) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(22, 3.5, 16), officeFloorMats[fl]);
    body.position.set(0, 1.75 + fl * 3.5, 0); body.castShadow = true; body.receiveShadow = true;
    officeGroup.add(body);

    // Glass facade on front
    for (let wi = 0; wi < 4; wi++) {
        const gx = -6 + wi * 4;
        const glass = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.0, 0.08), officeGlassMat);
        glass.position.set(gx, 1.75 + fl * 3.5, 8.04); officeGroup.add(glass);
    }

    // Floor slab separator
    if (fl > 0) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(22.5, 0.15, 16.5),
            new THREE.MeshStandardMaterial({ color: 0x9E9E9E, roughness: 0.8, transparent: false, opacity: 1.0, depthWrite: true }));
        slab.position.set(0, fl * 3.5, 0); officeGroup.add(slab);
    }
}

// Office sign on roof
const offSignCanvas = document.createElement('canvas');
offSignCanvas.width = 500; offSignCanvas.height = 80;
const osCtx = offSignCanvas.getContext('2d');
osCtx.fillStyle = '#1565C0'; osCtx.fillRect(0, 0, 500, 80);
osCtx.fillStyle = '#FFFFFF'; osCtx.font = 'bold 28px Arial';
osCtx.textAlign = 'center';
osCtx.fillText('⚡ SUSTAIN-ED ENERGY CORP', 250, 52);
const osTex = new THREE.CanvasTexture(offSignCanvas);
const officeSign = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.8), new THREE.MeshStandardMaterial({ map: osTex, emissive: 0x112244, emissiveIntensity: 0.4, transparent: false, opacity: 1.0, depthWrite: true }));
officeSign.position.set(0, 11.2, 8.04); officeGroup.add(officeSign);

// Entrance
const offDoor = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.0, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x455A64, roughness: 0.4, metalness: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
offDoor.position.set(0, 1.5, 8.06); officeGroup.add(offDoor);

// Parking lot
const parkingCanvas = document.createElement('canvas');
parkingCanvas.width = 256; parkingCanvas.height = 256;
const pkCtx = parkingCanvas.getContext('2d');
pkCtx.fillStyle = '#555555'; pkCtx.fillRect(0, 0, 256, 256);
pkCtx.strokeStyle = '#FFFFFF'; pkCtx.lineWidth = 2;
for (let i = 0; i < 5; i++) {
    pkCtx.strokeRect(10 + i * 48, 20, 40, 80);
}
const pkTex = new THREE.CanvasTexture(parkingCanvas);
const parking = new THREE.Mesh(new THREE.PlaneGeometry(12, 8), new THREE.MeshStandardMaterial({ map: pkTex, roughness: 0.9, transparent: false, opacity: 1.0, depthWrite: true }));
parking.rotation.x = -Math.PI / 2; parking.position.set(0, 0.02, 14);
officeGroup.add(parking);

// 2 parked cars (simplified)
for (let ci = 0; ci < 2; ci++) {
    const carBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 3.5),
        new THREE.MeshStandardMaterial({ color: ci === 0 ? 0x1565C0 : 0xD32F2F, roughness: 0.4, metalness: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
    carBody.position.set(-3 + ci * 6, 0.6, 14); officeGroup.add(carBody);
    const carTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 2),
        new THREE.MeshStandardMaterial({ color: ci === 0 ? 0x1976D2 : 0xE53935, roughness: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
    carTop.position.set(-3 + ci * 6, 1.2, 14); officeGroup.add(carTop);
}

// Landscaping bushes
for (let bi = 0; bi < 6; bi++) {
    const bush = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.9, transparent: false, opacity: 1.0, depthWrite: true }));
    bush.position.set(-8 + bi * 3.2, 0.5, 10.5 + (bi % 2) * 0.3); officeGroup.add(bush);
}

// Office label
const officeLabelDiv = document.createElement('div');
officeLabelDiv.className = 'appliance-label';
officeLabelDiv.innerHTML = '<span class="name" style="font-size:1.1rem;">🏢 Office</span>';
const officeLabel = new THREE.CSS2DObject(officeLabelDiv);
officeLabel.position.set(0, 14, 0);
officeGroup.add(officeLabel);

// ═══════════════════════════════════════════════
//  OPEN PLAN OFFICE FLOOR (main interior)
// ═══════════════════════════════════════════════
const openOfficeGroup = new THREE.Group();
openOfficeGroup.position.set(0, 0.3, 0);
officeGroup.add(openOfficeGroup);

// Carpet floor texture
const carpetCanvas = document.createElement('canvas');
carpetCanvas.width = 256; carpetCanvas.height = 256;
const cpCtx = carpetCanvas.getContext('2d');
cpCtx.fillStyle = '#424242'; cpCtx.fillRect(0, 0, 256, 256);
for (let i = 0; i < 500; i++) {
    cpCtx.fillStyle = `rgba(${80 + Math.random() * 40}, ${80 + Math.random() * 40}, ${80 + Math.random() * 40}, 0.5)`;
    cpCtx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
}
const cpTex = new THREE.CanvasTexture(carpetCanvas);
cpTex.wrapS = THREE.RepeatWrapping; cpTex.wrapT = THREE.RepeatWrapping;
cpTex.repeat.set(4, 4);
const carpetFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 14), new THREE.MeshStandardMaterial({ map: cpTex, roughness: 0.9, transparent: false, opacity: 1.0, depthWrite: true }));
carpetFloor.rotation.x = -Math.PI / 2; carpetFloor.receiveShadow = true;
openOfficeGroup.add(carpetFloor);

// 8 cubicles (2 rows × 4)
for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
        const cx = -6 + col * 4;
        const cz = -3 + row * 5;
        // Partition walls (L-shape)
        const pw1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.5, 1.8), partitionMat);
        pw1.position.set(cx - 0.7, 0.75, cz); openOfficeGroup.add(pw1);
        const pw2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.5, 0.05), partitionMat);
        pw2.position.set(cx, 0.75, cz + 0.9); openOfficeGroup.add(pw2);
        // Desk
        const desk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.7), officeDeskMat);
        desk.position.set(cx, 1.0, cz - 0.1); openOfficeGroup.add(desk);
        // Monitor
        const mon = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.28, 0.03), new THREE.MeshStandardMaterial({ color: 0x1A1A2E, emissive: 0x1565C0, emissiveIntensity: 0.4, transparent: false, opacity: 1.0, depthWrite: true }));
        mon.position.set(cx, 1.3, cz - 0.3); openOfficeGroup.add(mon);
        // Chair
        const chair = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.05, 8), officeChairMat);
        chair.position.set(cx, 0.7, cz + 0.3); openOfficeGroup.add(chair);
    }
}

// Pendant lights (modern office)
for (let li = 0; li < 8; li++) {
    const lx = -7 + li * 2;
    const pendant = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 12),
        new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xFFF4E0, emissiveIntensity: 0.6, transparent: false, opacity: 1.0, depthWrite: true }));
    pendant.position.set(lx, 3.2, 0); openOfficeGroup.add(pendant);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3, 4),
        new THREE.MeshStandardMaterial({ color: 0x888888, transparent: false, opacity: 1.0, depthWrite: true }));
    rod.position.set(lx, 3.37, 0); openOfficeGroup.add(rod);
}

// Energy meter display
const emCanvas = document.createElement('canvas');
emCanvas.width = 400; emCanvas.height = 300;
const emCtx = emCanvas.getContext('2d');
emCtx.fillStyle = '#0D1B2A'; emCtx.fillRect(0, 0, 400, 300);
emCtx.fillStyle = '#00FF88'; emCtx.font = 'bold 20px monospace'; emCtx.textAlign = 'center';
emCtx.fillText('Office Power Monitor', 200, 35);
emCtx.fillStyle = '#FFD700'; emCtx.font = '18px monospace';
emCtx.fillText('Current Load: 2,450W', 200, 80);
emCtx.fillText('Today: 18.2 kWh', 200, 115);
emCtx.fillStyle = '#FF6B6B'; emCtx.fillText('Cost Today: ₹145.60', 200, 150);
// Status indicator
emCtx.fillStyle = '#4CAF50'; emCtx.beginPath(); emCtx.arc(200, 200, 25, 0, Math.PI * 2); emCtx.fill();
emCtx.fillStyle = '#FFFFFF'; emCtx.font = 'bold 14px monospace'; emCtx.fillText('OK', 200, 205);
emCtx.fillStyle = '#888'; emCtx.font = '12px monospace';
emCtx.fillText('🟢 < 60% | 🟡 60-85% | 🔴 > 85%', 200, 260);
const emTex = new THREE.CanvasTexture(emCanvas);
const energyMeter = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.8), new THREE.MeshStandardMaterial({ map: emTex, emissive: 0x111111, emissiveIntensity: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
energyMeter.position.set(-9.8, 2.5, 0); energyMeter.rotation.y = Math.PI / 2;
openOfficeGroup.add(energyMeter);

const openOfficeLight = new THREE.PointLight(0xFFF4E0, 1.5, 25, 1.2);
openOfficeLight.position.set(0, 3, 0); openOfficeLight.castShadow = true;
openOfficeGroup.add(openOfficeLight);

// ═══════════════════════════════════════════════
//  MEETING ROOM
// ═══════════════════════════════════════════════
const meetingGroup = new THREE.Group();
meetingGroup.position.set(6, 3.8, -3);
officeGroup.add(meetingGroup);

// Conference table
const confTable = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 1.4), darkWoodMat);
confTable.position.set(0, 0.75, 0); confTable.castShadow = true; meetingGroup.add(confTable);
for (let lx of [-1.5, 1.5]) for (let lz of [-0.5, 0.5]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 6), darkWoodMat);
    leg.position.set(lx, 0.35, lz); meetingGroup.add(leg);
}

// 8 chairs around table
for (let ci = 0; ci < 8; ci++) {
    const angle = (ci / 8) * Math.PI * 2;
    const cx = Math.cos(angle) * 1.8;
    const cz = Math.sin(angle) * 0.9;
    const chair = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 8), officeChairMat);
    chair.position.set(cx, 0.6, cz); meetingGroup.add(chair);
}

// Whiteboard with text
const wbCanvas = document.createElement('canvas');
wbCanvas.width = 400; wbCanvas.height = 250;
const wbCtx = wbCanvas.getContext('2d');
wbCtx.fillStyle = '#FAFAFA'; wbCtx.fillRect(0, 0, 400, 250);
wbCtx.strokeStyle = '#BDBDBD'; wbCtx.lineWidth = 4; wbCtx.strokeRect(2, 2, 396, 246);
wbCtx.fillStyle = '#1565C0'; wbCtx.font = 'bold 22px Arial'; wbCtx.textAlign = 'center';
wbCtx.fillText('Energy Audit Q1 2025', 200, 50);
wbCtx.fillStyle = '#333'; wbCtx.font = '16px Arial';
wbCtx.fillText('Solar ROI: 4.2 years', 200, 100);
wbCtx.fillText('Grid cost: ₹8/kWh', 200, 135);
wbCtx.fillText('Solar cost: ₹2.5/kWh', 200, 170);
wbCtx.fillStyle = '#4CAF50'; wbCtx.font = 'bold 18px Arial';
wbCtx.fillText('✅ Recommend solar!', 200, 220);
const wbTex = new THREE.CanvasTexture(wbCanvas);
const whiteboard = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.8), new THREE.MeshStandardMaterial({ map: wbTex, transparent: false, opacity: 1.0, depthWrite: true }));
whiteboard.position.set(0, 2.5, -2.5); meetingGroup.add(whiteboard);

// Projector screen (rolled up)
const projScreen = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3, 8),
    new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
projScreen.rotation.z = Math.PI / 2; projScreen.position.set(0, 3.3, -2.4); meetingGroup.add(projScreen);

const meetingLight = new THREE.PointLight(0xFFFFFF, 1.3, 12, 1.2);
meetingLight.position.set(0, 3, 0); meetingGroup.add(meetingLight);

// ═══════════════════════════════════════════════
//  SERVER ROOM
// ═══════════════════════════════════════════════
const serverGroup = new THREE.Group();
serverGroup.position.set(-6, 3.8, -3);
officeGroup.add(serverGroup);

// 4 server racks
for (let ri = 0; ri < 4; ri++) {
    const rx = -2 + ri * 1.5;
    const rack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.0, 0.8), serverBlack);
    rack.position.set(rx, 1.0, 0); rack.castShadow = true; serverGroup.add(rack);
    // Blinking LEDs (static representation)
    for (let led = 0; led < 6; led++) {
        const ledColor = [0x00FF00, 0x00FF00, 0xFFFF00, 0x00FF00, 0xFF0000, 0x00FF00][led];
        const ledMesh = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6),
            new THREE.MeshStandardMaterial({ color: ledColor, emissive: ledColor, emissiveIntensity: 1.0, transparent: false, opacity: 1.0, depthWrite: true }));
        ledMesh.position.set(rx + 0.28, 0.4 + led * 0.25, 0.41);
        serverGroup.add(ledMesh);
    }
}

// Warning sign
const warnCanvas = document.createElement('canvas');
warnCanvas.width = 200; warnCanvas.height = 80;
const warnCtx = warnCanvas.getContext('2d');
warnCtx.fillStyle = '#F44336'; warnCtx.fillRect(0, 0, 200, 80);
warnCtx.fillStyle = '#FFFFFF'; warnCtx.font = 'bold 12px Arial'; warnCtx.textAlign = 'center';
warnCtx.fillText('⚠️ AUTHORIZED', 100, 30);
warnCtx.fillText('PERSONNEL ONLY', 100, 55);
const warnTex = new THREE.CanvasTexture(warnCanvas);
const warnSign = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.3), new THREE.MeshStandardMaterial({ map: warnTex, transparent: false, opacity: 1.0, depthWrite: true }));
warnSign.position.set(0, 2.5, 1.5); serverGroup.add(warnSign);

// Energy note
const enCanvas = document.createElement('canvas');
enCanvas.width = 300; enCanvas.height = 200;
const enCtx = enCanvas.getContext('2d');
enCtx.fillStyle = '#1A237E'; enCtx.fillRect(0, 0, 300, 200);
enCtx.fillStyle = '#FFD700'; enCtx.font = 'bold 14px Arial'; enCtx.textAlign = 'center';
enCtx.fillText('Server rooms use 40×', 150, 35);
enCtx.fillText('more energy per sqft', 150, 55);
enCtx.fillText('than offices', 150, 75);
enCtx.fillStyle = '#FF6B6B'; enCtx.font = 'bold 16px Arial';
enCtx.fillText('This room: 8,000W', 150, 120);
enCtx.fillText("That's ₹1,728/day!", 150, 150);
enCtx.fillStyle = '#4CAF50'; enCtx.font = '12px Arial';
enCtx.fillText('Solar can offset 60%', 150, 185);
const enTex = new THREE.CanvasTexture(enCanvas);
const energyNote = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0), new THREE.MeshStandardMaterial({ map: enTex, emissive: 0x111111, emissiveIntensity: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
energyNote.position.set(3, 1.5, 0); energyNote.rotation.y = -Math.PI / 2;
serverGroup.add(energyNote);

// Blue-white cool lighting
const serverLight = new THREE.PointLight(0xBBDDFF, 1.5, 12, 1.2);
serverLight.position.set(0, 2.8, 0); serverGroup.add(serverLight);

// ═══════════════════════════════════════════════
//  OFFICE DOOR TRIGGER
// ═══════════════════════════════════════════════
const OFFICE_DOOR = {
    position: new THREE.Vector3(20, 0, -40 + 14),
    radius: 2.5,
    label: '🏢 Office',
    houseId: 'office'
};
window.OFFICE_DOOR = OFFICE_DOOR;

console.log('[OFFICE] Built — 3 rooms: Open Plan Office, Meeting Room, Server Room');
