// ═══════════════════════════════════════════════
//  SCHOOL BUILDING — Educational Institution
//  Exterior + 3 Interior Rooms (Classrooms + Assembly Hall)
//  ALL WALLS SOLID: transparent:false, opacity:1.0, depthWrite:true
// ═══════════════════════════════════════════════

const schoolGroup = new THREE.Group();
schoolGroup.position.set(-20, 0, -40);
scene.add(schoolGroup);

// ── MATERIALS ──
const schoolWallMat = new THREE.MeshStandardMaterial({ color: 0xF5E6C8, roughness: 0.9, metalness: 0.0, transparent: false, opacity: 1.0, depthWrite: true });
const schoolRoofMat = new THREE.MeshStandardMaterial({ color: 0xC8B89A, roughness: 0.85, transparent: false, opacity: 1.0, depthWrite: true });
const schoolStepMat = new THREE.MeshStandardMaterial({ color: 0xD4C4A8, roughness: 0.8, transparent: false, opacity: 1.0, depthWrite: true });
const schoolDoorMat = new THREE.MeshStandardMaterial({ color: 0x5D3A1A, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
const schoolFrameMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.6, transparent: false, opacity: 1.0, depthWrite: true });
const schoolGlassMat = new THREE.MeshStandardMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.20, roughness: 0.1, metalness: 0.3, depthWrite: false });
const schoolWhiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, transparent: false, opacity: 1.0, depthWrite: true });
const schoolFloorMat = new THREE.MeshStandardMaterial({ color: 0x9E9E8E, roughness: 0.8, transparent: false, opacity: 1.0, depthWrite: true });

// ═══════════════════════════════════════════════
//  EXTERIOR
// ═══════════════════════════════════════════════

// Main building body
const schoolBody = new THREE.Mesh(new THREE.BoxGeometry(28, 7, 18), schoolWallMat);
schoolBody.position.set(0, 3.5, 0); schoolBody.castShadow = true; schoolBody.receiveShadow = true;
schoolGroup.add(schoolBody);

// Flat concrete roof
const schoolRoof = new THREE.Mesh(new THREE.BoxGeometry(29, 0.4, 19), schoolRoofMat);
schoolRoof.position.set(0, 7.2, 0); schoolRoof.castShadow = true;
schoolGroup.add(schoolRoof);

// Entrance porch
const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(8, 0.3, 3.5), schoolRoofMat);
porchRoof.position.set(0, 5.5, 10.5); schoolGroup.add(porchRoof);
// 2 pillars
for (let px of [-3, 3]) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 4.5, 12), schoolWhiteMat);
    pillar.position.set(px, 3, 10.5); pillar.castShadow = true; schoolGroup.add(pillar);
}
// 3 steps
for (let si = 0; si < 3; si++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(5, 0.25, 1), schoolStepMat);
    step.position.set(0, 0.125 + si * 0.25, 11 + si * 0.8); step.receiveShadow = true; schoolGroup.add(step);
}

// 6 windows on front face
for (let wi = 0; wi < 6; wi++) {
    const wx = -10.5 + wi * 4.2;
    if (Math.abs(wx) < 2) continue; // skip door area
    const wg = new THREE.Group();
    // Frame
    wg.add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.0, 0.12), schoolFrameMat));
    // Glass panes (4 per window — 2×2 grid)
    for (let gx = 0; gx < 2; gx++) for (let gy = 0; gy < 2; gy++) {
        const pane = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.88, 0.05), schoolGlassMat);
        pane.position.set(-0.42 + gx * 0.84, -0.48 + gy * 0.96, 0.05); wg.add(pane);
    }
    // Sill
    const sill = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.2), schoolFrameMat);
    sill.position.set(0, -1.05, 0.08); wg.add(sill);
    wg.position.set(wx, 4.5, 9.08);
    schoolGroup.add(wg);
}

// Double door
const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.2, 0.12), schoolDoorMat);
doorFrame.position.set(0, 1.6, 9.05); schoolGroup.add(doorFrame);
const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.9, 0.06), new THREE.MeshStandardMaterial({ color: 0x7B4F2A, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true }));
leftDoor.position.set(-0.6, 1.5, 9.1); schoolGroup.add(leftDoor);
const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.9, 0.06), new THREE.MeshStandardMaterial({ color: 0x7B4F2A, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true }));
rightDoor.position.set(0.6, 1.5, 9.1); schoolGroup.add(rightDoor);
// Door handles
for (let hx of [-0.2, 0.2]) {
    const dh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshStandardMaterial({ color: 0xC0C0C0, metalness: 0.8, roughness: 0.2, transparent: false, opacity: 1.0, depthWrite: true }));
    dh.position.set(hx, 1.5, 9.15); schoolGroup.add(dh);
}

// School sign
const signCanvas = document.createElement('canvas');
signCanvas.width = 600; signCanvas.height = 120;
const signCtx = signCanvas.getContext('2d');
signCtx.fillStyle = '#1A237E'; signCtx.fillRect(0, 0, 600, 120);
signCtx.fillStyle = '#FFFFFF'; signCtx.font = 'bold 28px Georgia, serif';
signCtx.textAlign = 'center';
signCtx.fillText('GOVERNMENT HIGHER SECONDARY SCHOOL', 300, 55);
signCtx.font = '18px Georgia, serif';
signCtx.fillText('Est. 2008', 300, 90);
const signTex = new THREE.CanvasTexture(signCanvas);
const schoolSign = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.2), new THREE.MeshStandardMaterial({ map: signTex, transparent: false, opacity: 1.0, depthWrite: true }));
schoolSign.position.set(0, 6.5, 9.08); schoolGroup.add(schoolSign);

// Flagpole
const flagpole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 8, 8), new THREE.MeshStandardMaterial({ color: 0xC0C0C0, metalness: 0.8, roughness: 0.2, transparent: false, opacity: 1.0, depthWrite: true }));
flagpole.position.set(8, 4, 10); schoolGroup.add(flagpole);
// Indian tricolor flag
const flagCanvas = document.createElement('canvas');
flagCanvas.width = 120; flagCanvas.height = 80;
const flagCtx = flagCanvas.getContext('2d');
flagCtx.fillStyle = '#FF9933'; flagCtx.fillRect(0, 0, 120, 27);
flagCtx.fillStyle = '#FFFFFF'; flagCtx.fillRect(0, 27, 120, 26);
flagCtx.fillStyle = '#138808'; flagCtx.fillRect(0, 53, 120, 27);
// Ashoka Chakra (simplified)
flagCtx.strokeStyle = '#000080'; flagCtx.lineWidth = 1;
flagCtx.beginPath(); flagCtx.arc(60, 40, 10, 0, Math.PI * 2); flagCtx.stroke();
const flagTex = new THREE.CanvasTexture(flagCanvas);
const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), new THREE.MeshStandardMaterial({ map: flagTex, side: THREE.DoubleSide, transparent: false, opacity: 1.0, depthWrite: true }));
flag.position.set(8.7, 7.6, 10); schoolGroup.add(flag);

// Compound wall
const compoundWallMat = new THREE.MeshStandardMaterial({ color: 0xD4C4A8, roughness: 0.85, transparent: false, opacity: 1.0, depthWrite: true });
// Front wall (with gate opening)
const cwLeft = new THREE.Mesh(new THREE.BoxGeometry(12, 1.8, 0.25), compoundWallMat);
cwLeft.position.set(-8, 0.9, 13); cwLeft.castShadow = true; schoolGroup.add(cwLeft);
const cwRight = new THREE.Mesh(new THREE.BoxGeometry(12, 1.8, 0.25), compoundWallMat);
cwRight.position.set(8, 0.9, 13); cwRight.castShadow = true; schoolGroup.add(cwRight);
// Gate posts
for (let gx of [-2, 2]) {
    const gatePost = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.2, 0.4), compoundWallMat);
    gatePost.position.set(gx, 1.1, 13); gatePost.castShadow = true; schoolGroup.add(gatePost);
}

// School label
const schoolLabelDiv = document.createElement('div');
schoolLabelDiv.className = 'appliance-label';
schoolLabelDiv.innerHTML = '<span class="name" style="font-size:1.1rem;">🏫 School</span>';
const schoolLabel = new THREE.CSS2DObject(schoolLabelDiv);
schoolLabel.position.set(0, 10, 0);
schoolGroup.add(schoolLabel);

// Interior lighting
const schoolHallLight = new THREE.PointLight(0xFFF4E0, 1.5, 20, 1.2);
schoolHallLight.position.set(0, 6, 0); schoolHallLight.castShadow = true;
schoolGroup.add(schoolHallLight);

// ═══════════════════════════════════════════════
//  CLASSROOM 1 — Physics/Science (left section)
// ═══════════════════════════════════════════════
const classroom1Group = new THREE.Group();
classroom1Group.position.set(-8, 0.3, -3);
schoolGroup.add(classroom1Group);

// Floor
const classFloor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), schoolFloorMat);
classFloor.rotation.x = -Math.PI / 2; classFloor.position.set(0, 0, 0);
classFloor.receiveShadow = true; classroom1Group.add(classFloor);

// 10 student desks (2 rows × 5)
const deskMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
const chairMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 5; col++) {
        const dx = -3 + row * 4;
        const dz = -4 + col * 2;
        // Desk
        const desk = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.5), deskMat);
        desk.position.set(dx, 1.0, dz); classroom1Group.add(desk);
        // Desk legs
        for (let lx of [-0.35, 0.35]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.0, 4), deskMat);
            leg.position.set(dx + lx, 0.5, dz); classroom1Group.add(leg);
        }
        // Chair
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.4), chairMat);
        seat.position.set(dx + 0.6, 0.6, dz); classroom1Group.add(seat);
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.04), chairMat);
        back.position.set(dx + 0.6, 0.9, dz + 0.18); classroom1Group.add(back);
    }
}

// Teacher's desk
const teacherDesk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.75, 0.7), new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.6, transparent: false, opacity: 1.0, depthWrite: true }));
teacherDesk.position.set(0, 0.375, 4); classroom1Group.add(teacherDesk);

// Blackboard
const bbCanvas = document.createElement('canvas');
bbCanvas.width = 512; bbCanvas.height = 200;
const bbCtx = bbCanvas.getContext('2d');
bbCtx.fillStyle = '#1B5E20'; bbCtx.fillRect(0, 0, 512, 200);
bbCtx.fillStyle = '#FFFFFFCC'; bbCtx.font = '36px Georgia, serif';
bbCtx.fillText('P = V × I', 30, 60);
bbCtx.fillText('Energy = Power × Time', 30, 120);
bbCtx.font = '20px Georgia, serif';
bbCtx.fillText('E = P × t (in kWh)', 30, 170);
const bbTex = new THREE.CanvasTexture(bbCanvas);
const blackboard = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.4, 0.06), new THREE.MeshStandardMaterial({ map: bbTex, transparent: false, opacity: 1.0, depthWrite: true }));
blackboard.position.set(0, 3.5, 4.8); classroom1Group.add(blackboard);
// Board frame
const boardFrameMat = new THREE.MeshStandardMaterial({ color: 0x5D3A1A, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
const bbFrameTop = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.08, 0.1), boardFrameMat);
bbFrameTop.position.set(0, 4.22, 4.8); classroom1Group.add(bbFrameTop);
const bbFrameBot = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.08, 0.14), boardFrameMat);
bbFrameBot.position.set(0, 2.78, 4.8); classroom1Group.add(bbFrameBot);

// Tube lights
for (let tz of [-2, 2]) {
    const tube = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 0.12), new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xF0F8FF, emissiveIntensity: 0.8, transparent: false, opacity: 1.0, depthWrite: true }));
    tube.position.set(0, 6.5, tz); classroom1Group.add(tube);
}

// Energy education poster 1
const poster1Canvas = document.createElement('canvas');
poster1Canvas.width = 256; poster1Canvas.height = 320;
const p1Ctx = poster1Canvas.getContext('2d');
p1Ctx.fillStyle = '#FFF9C4'; p1Ctx.fillRect(0, 0, 256, 320);
p1Ctx.fillStyle = '#E65100'; p1Ctx.font = 'bold 22px Arial'; p1Ctx.textAlign = 'center';
p1Ctx.fillText('⚡ SAVE ELECTRICITY', 128, 40);
p1Ctx.fillText('SAVE MONEY ⚡', 128, 70);
p1Ctx.fillStyle = '#333'; p1Ctx.font = '16px Arial';
p1Ctx.fillText('1 unit = ₹8', 128, 120);
p1Ctx.fillText('Your AC uses', 128, 160);
p1Ctx.fillText('6 units/day!', 128, 185);
p1Ctx.fillStyle = '#D32F2F'; p1Ctx.font = 'bold 20px Arial';
p1Ctx.fillText('= ₹1,440/month!', 128, 230);
p1Ctx.fillStyle = '#2E7D32'; p1Ctx.font = '14px Arial';
p1Ctx.fillText('Switch to solar and', 128, 280);
p1Ctx.fillText('save 80%! ☀️', 128, 305);
const p1Tex = new THREE.CanvasTexture(poster1Canvas);
const poster1 = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.5), new THREE.MeshStandardMaterial({ map: p1Tex, transparent: false, opacity: 1.0, depthWrite: true }));
poster1.position.set(-4.8, 3.5, 0); poster1.rotation.y = Math.PI / 2;
classroom1Group.add(poster1);

// Classroom 1 light
const class1Light = new THREE.PointLight(0xFFFFFF, 1.5, 15, 1.2);
class1Light.position.set(0, 6, 0); class1Light.castShadow = true;
classroom1Group.add(class1Light);

// ═══════════════════════════════════════════════
//  CLASSROOM 2 — Computer Lab (right section)
// ═══════════════════════════════════════════════
const classroom2Group = new THREE.Group();
classroom2Group.position.set(8, 0.3, -3);
schoolGroup.add(classroom2Group);

const class2Floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), schoolFloorMat);
class2Floor.rotation.x = -Math.PI / 2; class2Floor.receiveShadow = true;
classroom2Group.add(class2Floor);

// 10 computer stations
const monitorMat = new THREE.MeshStandardMaterial({ color: 0x1A1A2E, roughness: 0.3, transparent: false, opacity: 1.0, depthWrite: true });
const monitorScreenMat = new THREE.MeshStandardMaterial({ color: 0x1565C0, emissive: 0x1565C0, emissiveIntensity: 0.6, transparent: false, opacity: 1.0, depthWrite: true });
const cpuMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.5, transparent: false, opacity: 1.0, depthWrite: true });

for (let i = 0; i < 10; i++) {
    const cx = (i < 5) ? -3 : 2;
    const cz = -4 + (i % 5) * 2;
    // Desk
    const cDesk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.7), deskMat);
    cDesk.position.set(cx, 1.0, cz); classroom2Group.add(cDesk);
    for (let lx of [-0.55, 0.55]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.0, 4), deskMat);
        leg.position.set(cx + lx, 0.5, cz); classroom2Group.add(leg);
    }
    // Monitor
    const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.04), monitorMat);
    monitor.position.set(cx, 1.4, cz - 0.15); classroom2Group.add(monitor);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.3), monitorScreenMat);
    screen.position.set(cx, 1.4, cz - 0.12); classroom2Group.add(screen);
    // CPU
    const cpu = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 0.4), cpuMat);
    cpu.position.set(cx + 0.4, 0.7, cz); classroom2Group.add(cpu);
}

// AC unit on wall
const classAC = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 0.25), schoolWhiteMat);
classAC.position.set(0, 5.5, 4.8); classroom2Group.add(classAC);

// Energy display board
const edCanvas = document.createElement('canvas');
edCanvas.width = 400; edCanvas.height = 300;
const edCtx = edCanvas.getContext('2d');
edCtx.fillStyle = '#0D2137'; edCtx.fillRect(0, 0, 400, 300);
edCtx.fillStyle = '#00FF88'; edCtx.font = 'bold 18px monospace';
edCtx.textAlign = 'center';
edCtx.fillText('Computer Lab Power Usage', 200, 40);
edCtx.fillStyle = '#FFD700'; edCtx.font = '16px monospace';
edCtx.fillText('10 PCs × 150W = 1500W', 200, 90);
edCtx.fillText('Running 6 hours/day = 9 kWh', 200, 130);
edCtx.fillStyle = '#FF6B6B'; edCtx.font = 'bold 20px monospace';
edCtx.fillText('Monthly cost = ₹2,160', 200, 190);
edCtx.fillStyle = '#4CAF50'; edCtx.font = '14px monospace';
edCtx.fillText('With solar: ₹432/month! 🌞', 200, 240);
const edTex = new THREE.CanvasTexture(edCanvas);
const energyDisplay = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.8), new THREE.MeshStandardMaterial({ map: edTex, emissive: 0x111111, emissiveIntensity: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
energyDisplay.position.set(-4.8, 3.5, 0); energyDisplay.rotation.y = Math.PI / 2;
classroom2Group.add(energyDisplay);

const class2Light = new THREE.PointLight(0xFFFFFF, 1.8, 15, 1.2);
class2Light.position.set(0, 6, 0);
classroom2Group.add(class2Light);

// ═══════════════════════════════════════════════
//  ASSEMBLY HALL (back section)
// ═══════════════════════════════════════════════
const assemblyGroup = new THREE.Group();
assemblyGroup.position.set(0, 0.3, -6);
schoolGroup.add(assemblyGroup);

// Stage
const stage = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 3), new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.6, transparent: false, opacity: 1.0, depthWrite: true }));
stage.position.set(0, 0.2, -3); stage.castShadow = true; assemblyGroup.add(stage);

// Podium
const podium = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.4), new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.6, transparent: false, opacity: 1.0, depthWrite: true }));
podium.position.set(0, 1.0, -3); assemblyGroup.add(podium);

// Rows of chairs (5 rows × 8)
for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
        const cx = -5.25 + col * 1.5;
        const cz = 0.5 + row * 1.2;
        const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.4), chairMat);
        chairSeat.position.set(cx, 0.55, cz); assemblyGroup.add(chairSeat);
        const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.03), chairMat);
        chairBack.position.set(cx, 0.85, cz + 0.18); assemblyGroup.add(chairBack);
    }
}

// 4 large ceiling fans
for (let fi = 0; fi < 4; fi++) {
    const fx = -4.5 + fi * 3;
    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
    fanHub.position.set(fx, 6.6, 1); assemblyGroup.add(fanHub);
    for (let b = 0; b < 4; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.04, 0.3),
            new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
        const angle = (b / 4) * Math.PI * 2;
        blade.position.set(fx + Math.cos(angle) * 1, 6.55, 1 + Math.sin(angle) * 1);
        blade.rotation.y = angle;
        assemblyGroup.add(blade);
    }
}

const assemblyLight = new THREE.PointLight(0xFFF4E0, 1.5, 20, 1.2);
assemblyLight.position.set(0, 6.2, 1); assemblyLight.castShadow = true;
assemblyGroup.add(assemblyLight);

// ═══════════════════════════════════════════════
//  SCHOOL DOOR TRIGGER
// ═══════════════════════════════════════════════
const SCHOOL_DOOR = {
    position: new THREE.Vector3(-20, 0, -40 + 13),
    radius: 2.5,
    label: '🏫 School',
    houseId: 'school'
};
window.SCHOOL_DOOR = SCHOOL_DOOR;

console.log('[SCHOOL] Built — 3 rooms: Physics classroom, Computer Lab, Assembly Hall');
