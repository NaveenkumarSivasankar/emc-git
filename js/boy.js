// ═══════════════════════════════════════════════
//  ANIMATED BOY CHARACTER — WITH HOUSE NAVIGATION
// ═══════════════════════════════════════════════
const boyGroup = new THREE.Group();

// Materials
const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFCC99, roughness: 0.8 });
const hairMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.9 });
const tshirtMat = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.75 });
const pantsMat = new THREE.MeshStandardMaterial({ color: 0x37474F, roughness: 0.8 });
const shoeMat = new THREE.MeshStandardMaterial({ color: 0xE53935, roughness: 0.7 });
const shoeSoleMat = new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.6 });
const eyeMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3 });
const tshirtStripeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.75 });

// ── HEAD ──
const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), skinMat);
head.position.y = 2.05; head.castShadow = true; boyGroup.add(head);
const hair = new THREE.Mesh(new THREE.SphereGeometry(0.30, 12, 12), hairMat);
hair.position.y = 2.15; hair.scale.set(1.02, 0.7, 1.02); boyGroup.add(hair);
const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.06, 0.12), hairMat);
fringe.position.set(0, 2.1, 0.24); boyGroup.add(fringe);
const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
leftEye.position.set(-0.1, 2.06, 0.25); boyGroup.add(leftEye);
const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
rightEye.position.set(0.1, 2.06, 0.25); boyGroup.add(rightEye);
const smileMat = new THREE.MeshStandardMaterial({ color: 0xCC6666, roughness: 0.5 });
const smile = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.03), smileMat);
smile.position.set(0, 1.95, 0.27); boyGroup.add(smile);

// ── BODY (T-SHIRT) ──
const torso = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.25), tshirtMat);
torso.position.y = 1.45; torso.castShadow = true; boyGroup.add(torso);
const collar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.27), tshirtMat);
collar.position.y = 1.78; boyGroup.add(collar);
const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.26), tshirtStripeMat);
stripe.position.set(0, 1.45, 0); boyGroup.add(stripe);

// ── ARMS ──
const leftArmPivot = new THREE.Group();
leftArmPivot.position.set(-0.3, 1.7, 0); boyGroup.add(leftArmPivot);
const leftUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.12), tshirtMat);
leftUpperArm.position.set(0, -0.18, 0); leftUpperArm.castShadow = true; leftArmPivot.add(leftUpperArm);
const leftLowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.3, 0.10), skinMat);
leftLowerArm.position.set(0, -0.48, 0); leftArmPivot.add(leftLowerArm);
const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
leftHand.position.set(0, -0.65, 0); leftArmPivot.add(leftHand);

const rightArmPivot = new THREE.Group();
rightArmPivot.position.set(0.3, 1.7, 0); boyGroup.add(rightArmPivot);
const rightUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.12), tshirtMat);
rightUpperArm.position.set(0, -0.18, 0); rightUpperArm.castShadow = true; rightArmPivot.add(rightUpperArm);
const rightLowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.3, 0.10), skinMat);
rightLowerArm.position.set(0, -0.48, 0); rightArmPivot.add(rightLowerArm);
const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
rightHand.position.set(0, -0.65, 0); rightArmPivot.add(rightHand);

// ── LEGS ──
const leftLegPivot = new THREE.Group();
leftLegPivot.position.set(-0.12, 1.15, 0); boyGroup.add(leftLegPivot);
const leftUpperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.4, 0.14), pantsMat);
leftUpperLeg.position.set(0, -0.2, 0); leftUpperLeg.castShadow = true; leftLegPivot.add(leftUpperLeg);
const leftLowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.35, 0.13), pantsMat);
leftLowerLeg.position.set(0, -0.57, 0); leftLegPivot.add(leftLowerLeg);
const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.22), shoeMat);
leftShoe.position.set(0, -0.79, 0.03); leftLegPivot.add(leftShoe);
const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.23), shoeSoleMat);
leftSole.position.set(0, -0.85, 0.03); leftLegPivot.add(leftSole);

const rightLegPivot = new THREE.Group();
rightLegPivot.position.set(0.12, 1.15, 0); boyGroup.add(rightLegPivot);
const rightUpperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.4, 0.14), pantsMat);
rightUpperLeg.position.set(0, -0.2, 0); rightUpperLeg.castShadow = true; rightLegPivot.add(rightUpperLeg);
const rightLowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.35, 0.13), pantsMat);
rightLowerLeg.position.set(0, -0.57, 0); rightLegPivot.add(rightLowerLeg);
const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.22), shoeMat);
rightShoe.position.set(0, -0.79, 0.03); rightLegPivot.add(rightShoe);
const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.23), shoeSoleMat);
rightSole.position.set(0, -0.85, 0.03); rightLegPivot.add(rightSole);

// ── PLACE BOY ON ROAD ──
boyGroup.position.set(0, 0.15, 13);
boyGroup.scale.setScalar(1.2);
scene.add(boyGroup);

// ═══════════════════════════════════════════════
//  GREEN ENTRY CIRCLES (in front of each house)
// ═══════════════════════════════════════════════
const entryCircleMat = new THREE.MeshStandardMaterial({
    color: 0x00ff44, emissive: 0x00cc33, emissiveIntensity: 0.6,
    transparent: true, opacity: 0.7, roughness: 0.4, metalness: 0.2
});

// Outer glow ring
const entryGlowMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88, emissive: 0x00ff66, emissiveIntensity: 0.4,
    transparent: true, opacity: 0.3, roughness: 0.5
});

// 1BHK entry circle — in front of 1BHK house door (house at x=-14, door at z=7.5)
const entry1BHK = new THREE.Group();
const entry1Circle = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), entryCircleMat.clone());
entry1Circle.rotation.x = -Math.PI / 2;
entry1Circle.position.set(0, 0.06, 0);
entry1BHK.add(entry1Circle);
const entry1Glow = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.8, 24), entryGlowMat.clone());
entry1Glow.rotation.x = -Math.PI / 2;
entry1Glow.position.set(0, 0.05, 0);
entry1BHK.add(entry1Glow);
// Arrow indicator
const arrowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });
const arrow1 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 4), arrowMat);
arrow1.position.set(0, 1.5, 0);
arrow1.rotation.x = Math.PI; // point down
entry1BHK.add(arrow1);
entry1BHK.position.set(-14, 0, 9.5);
scene.add(entry1BHK);

// 2BHK entry circle — in front of 2BHK house door (house at x=16, door at z=8)
const entry2BHK = new THREE.Group();
const entry2Circle = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), entryCircleMat.clone());
entry2Circle.rotation.x = -Math.PI / 2;
entry2Circle.position.set(0, 0.06, 0);
entry2BHK.add(entry2Circle);
const entry2Glow = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.8, 24), entryGlowMat.clone());
entry2Glow.rotation.x = -Math.PI / 2;
entry2Glow.position.set(0, 0.05, 0);
entry2BHK.add(entry2Glow);
const arrow2 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 4), arrowMat);
arrow2.position.set(0, 1.5, 0);
arrow2.rotation.x = Math.PI;
entry2BHK.add(arrow2);
entry2BHK.position.set(16, 0, 10);
scene.add(entry2BHK);

// ═══════════════════════════════════════════════
//  EXIT BUTTONS ABOVE DOORS
// ═══════════════════════════════════════════════
function createExitButton(houseId) {
    const btn = document.createElement('button');
    btn.className = 'exit-scene-btn';
    btn.textContent = 'Exit House';
    btn.onclick = (e) => {
        e.stopPropagation();
        exitHouse();
    };

    const obj = new THREE.CSS2DObject(btn);
    // Position above the door (Door height is ~4-5, so 6 is good)
    obj.position.set(0, 6, -1); // Slightly retracted to avoid clipping with front door frame
    return obj;
}

// Add Exit button to 1BHK
if (typeof houseGroup !== 'undefined') {
    const exitBtn1 = createExitButton('1bhk');
    // Align with 1BHK door at x=0 in its local space
    exitBtn1.position.set(0, 6.5, 7.8);
    houseGroup.add(exitBtn1);
    window.exitBtn1 = exitBtn1; // expose for visibility control if needed
}

// Add Exit button to 2BHK
if (typeof bhk2Group !== 'undefined') {
    const exitBtn2 = createExitButton('2bhk');
    // Align with 2BHK door at x=0 in its local space
    exitBtn2.position.set(0, 6.5, 8.3);
    bhk2Group.add(exitBtn2);
    window.exitBtn2 = exitBtn2;
}

// ═══════════════════════════════════════════════
//  COLLISION SYSTEM — SOLID OBJECTS
// ═══════════════════════════════════════════════
const BOY_RADIUS = 0.35;
const collisionBoxes = [
    // ── 1BHK OUTER WALLS (house at x=-14) ──
    { xMin: -24, xMax: -4, zMin: -7.65, zMax: -7.35, house: '1bhk' },
    { xMin: -24.15, xMax: -23.85, zMin: -7.5, zMax: 7.5, house: '1bhk' },
    { xMin: -4.15, xMax: -3.85, zMin: -7.5, zMax: 7.5, house: '1bhk' },
    { xMin: -24.15, xMax: -15.25, zMin: 7.35, zMax: 7.65, house: '1bhk' },
    { xMin: -12.75, xMax: -3.85, zMin: 7.35, zMax: 7.65, house: '1bhk' },
    // ── 1BHK PARTITIONS (with door gaps) ──
    { xMin: -23.8, xMax: -11.85, zMin: -1.6, zMax: -1.4, house: '1bhk' },
    { xMin: -10.15, xMax: -4.2, zMin: -1.6, zMax: -1.4, house: '1bhk' },
    { xMin: -16.6, xMax: -16.4, zMin: 0.85, zMax: 2.65, house: '1bhk' },
    { xMin: -16.6, xMax: -16.4, zMin: 4.35, zMax: 6.65, house: '1bhk' },
    // ── 1BHK FURNITURE ──
    { xMin: -19.5, xMax: -14.5, zMin: -5.75, zMax: -3.4, house: '1bhk' },
    { xMin: -8.75, xMax: -6.25, zMin: -5.45, zMax: -4.55, house: '1bhk' },
    { xMin: -15.75, xMax: -12.25, zMin: -6.65, zMax: -2.0, house: '1bhk' },
    { xMin: -22.7, xMax: -20.3, zMin: -6, zMax: -5, house: '1bhk' },
    { xMin: -21.75, xMax: -18.25, zMin: -0.95, zMax: -0.05, house: '1bhk' },
    // ── 2BHK OUTER WALLS (house at x=16) ──
    { xMin: 6, xMax: 26, zMin: -8.15, zMax: -7.85, house: '2bhk' },
    { xMin: 5.85, xMax: 6.15, zMin: -8, zMax: 8, house: '2bhk' },
    { xMin: 25.85, xMax: 26.15, zMin: -8, zMax: 8, house: '2bhk' },
    { xMin: 5.85, xMax: 14.75, zMin: 7.85, zMax: 8.15, house: '2bhk' },
    { xMin: 17.25, xMax: 26.15, zMin: 7.85, zMax: 8.15, house: '2bhk' },
    // ── 2BHK PARTITIONS (with door gaps) ──
    { xMin: 6.2, xMax: 12.25, zMin: -2.6, zMax: -2.4, house: '2bhk' },
    { xMin: 13.75, xMax: 18.25, zMin: -2.6, zMax: -2.4, house: '2bhk' },
    { xMin: 19.75, xMax: 25.8, zMin: -2.6, zMax: -2.4, house: '2bhk' },
    { xMin: 15.9, xMax: 16.1, zMin: -7.9, zMax: -2.6, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: -2.3, zMax: -0.25, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: 1.25, zMax: 4.75, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: 6.25, zMax: 8.0, house: '2bhk' },
    { xMin: 6.1, xMax: 10.9, zMin: 3.9, zMax: 4.1, house: '2bhk' },
    // ── 2BHK FURNITURE ──
    { xMin: 9.6, xMax: 12.4, zMin: -7, zMax: -3.5, house: '2bhk' },
    { xMin: 19.6, xMax: 22.4, zMin: -7, zMax: -3.5, house: '2bhk' },
    { xMin: 20.95, xMax: 25.45, zMin: 0, zMax: 2.2, house: '2bhk' },
    { xMin: 17.25, xMax: 19.75, zMin: 0.4, zMax: 1.6, house: '2bhk' },
    { xMin: 6.3, xMax: 9.3, zMin: -1.9, zMax: -1.1, house: '2bhk' },
];

function checkCollision(testX, testZ) {
    const house = boyState.insideHouse;
    for (const box of collisionBoxes) {
        if (box.house !== house) continue;
        const closestX = Math.max(box.xMin, Math.min(testX, box.xMax));
        const closestZ = Math.max(box.zMin, Math.min(testZ, box.zMax));
        const dx = testX - closestX;
        const dz = testZ - closestZ;
        if (dx * dx + dz * dz < BOY_RADIUS * BOY_RADIUS) return true;
    }
    return false;
}

// ═══════════════════════════════════════════════
//  DOOR PUSH/PULL ANIMATION
// ═══════════════════════════════════════════════
const DOOR_OPEN_ANGLE = Math.PI / 2.2;  // ~80 degrees swing
const DOOR_PROXIMITY = 1.5;             // distance to trigger open (touch)
const DOOR_ANIM_SPEED = 5;              // animation speed

function updateDoors(delta) {
    if (boyState.mode !== 'indoor') return;
    const bx = boyGroup.position.x;
    const bz = boyGroup.position.z;
    const doors = boyState.insideHouse === '1bhk' ? bhk1Doors : bhk2Doors;
    doors.forEach(door => {
        const dx = bx - door.wx;
        const dz = bz - door.wz;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const targetAngle = dist < DOOR_PROXIMITY ? DOOR_OPEN_ANGLE : 0;
        // Smoothly animate toward target
        door.openAngle += (targetAngle - door.openAngle) * DOOR_ANIM_SPEED * delta;
        if (Math.abs(door.openAngle) < 0.01) door.openAngle = 0;
        door.pivot.rotation.y = door.baseRy + door.openAngle;
    });
}

// Room regions for detecting which room the boy is in
const roomRegions = [
    // 1BHK
    { xMin: -16.5, xMax: -4, zMin: -1.5, zMax: 7.5, room: '🏠 Hall', house: '1bhk' },
    { xMin: -24, xMax: -16.5, zMin: -1.5, zMax: 7.5, room: '🍳 Kitchen', house: '1bhk' },
    { xMin: -24, xMax: -4, zMin: -7.5, zMax: -1.5, room: '🛏️ Bedroom', house: '1bhk' },
    // 2BHK
    { xMin: 11, xMax: 26, zMin: -2.5, zMax: 8, room: '🏠 Hall', house: '2bhk' },
    { xMin: 6, xMax: 16, zMin: -8, zMax: -2.5, room: '🛏️ Bedroom 1', house: '2bhk' },
    { xMin: 16, xMax: 26, zMin: -8, zMax: -2.5, room: '🛏️ Bedroom 2', house: '2bhk' },
    { xMin: 6, xMax: 11, zMin: -2.5, zMax: 4, room: '🍳 Kitchen', house: '2bhk' },
    { xMin: 6, xMax: 11, zMin: 4, zMax: 8, room: '🚿 Bathroom', house: '2bhk' },
];

// ═══════════════════════════════════════════════
//  BOY STATE & CONTROLS
// ═══════════════════════════════════════════════
let mainDoorTransition = null;

const boyState = {
    moving: false,
    speed: 8,
    walkPhase: 0,
    keys: { up: false, down: false, left: false, right: false },
    // Navigation state
    mode: 'outdoor',       // 'outdoor' | 'indoor'
    insideHouse: null,     // '1bhk' | '2bhk'
    nearEntry: null,       // '1bhk' | '2bhk' | null
    cameraFollow: true,    // camera follows boy when indoor
    currentRoom: null      // current room name (for enter zone notifications)
};

// Entry circle world positions
const entryPositions = {
    '1bhk': new THREE.Vector3(-14, 0, 9.5),
    '2bhk': new THREE.Vector3(16, 0, 10)
};

// Indoor spawn positions (world coords — where boy appears inside the house)
const indoorSpawn = {
    '1bhk': { pos: new THREE.Vector3(-14, 0.15, 5), rot: Math.PI },  // Hall area facing interior
    '2bhk': { pos: new THREE.Vector3(16, 0.15, 5), rot: Math.PI }
};

// Indoor movement bounds (world coords)
const indoorBounds = {
    '1bhk': { xMin: -24, xMax: -4, zMin: -7.5, zMax: 7 },
    '2bhk': { xMin: 6, xMax: 26, zMin: -8, zMax: 7.5 }
};

// Camera offsets for indoor follow
const indoorCameraOffset = new THREE.Vector3(0, 8, 10);

// ── KEY LISTENERS ──
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { boyState.keys.up = true; e.preventDefault(); }
    if (e.key === 'ArrowDown') { boyState.keys.down = true; e.preventDefault(); }
    if (e.key === 'ArrowLeft') { boyState.keys.left = true; e.preventDefault(); }
    if (e.key === 'ArrowRight') { boyState.keys.right = true; e.preventDefault(); }

    // ENTER — enter house if near entry circle
    if (e.key === 'Enter') {
        if (boyState.mode === 'outdoor' && boyState.nearEntry) {
            enterHouse(boyState.nearEntry);
            e.preventDefault();
        }
    }

    // ESCAPE — exit current house view (character-based or focus-based)
    if (e.key === 'Escape') {
        if (boyState.mode === 'indoor' || boyState.mode === 'transition') {
            exitHouse(); // boy walks out (or force reset if stuck)
            e.preventDefault();
        } else {
            resetToStreetOverview(); // UI zoom reset
            e.preventDefault();
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') boyState.keys.up = false;
    if (e.key === 'ArrowDown') boyState.keys.down = false;
    if (e.key === 'ArrowLeft') boyState.keys.left = false;
    if (e.key === 'ArrowRight') boyState.keys.right = false;
});

// ═══════════════════════════════════════════════
//  ENTER / EXIT HOUSE
// ═══════════════════════════════════════════════
function enterHouse(houseId) {
    if (boyState.mode === 'transition' || mainDoorTransition) return;
    boyState.mode = 'transition';
    mainDoorTransition = { type: 'enter', houseId: houseId, progress: 0 };

    document.getElementById('enter-prompt').classList.remove('visible');
    entry1BHK.visible = false;
    entry2BHK.visible = false;
}

function finishEnterHouse(houseId) {
    boyState.mode = 'indoor';
    boyState.insideHouse = houseId;
    boyState.nearEntry = null;

    // Move boy inside
    const spawn = indoorSpawn[houseId];
    boyGroup.position.copy(spawn.pos);
    boyGroup.rotation.y = spawn.rot;

    // Focus on the right house
    if (houseId === '1bhk') {
        is2BHK = false;
    } else {
        is2BHK = true;
    }
    buildAppliancePanel();
    buildRoomNavPanel();
    recalcWattage();
    boyState.currentRoom = null;

    // Show exit hint
    const prompt = document.getElementById('enter-prompt');
    prompt.textContent = '🏠 Inside ' + (houseId === '1bhk' ? '1BHK' : '2BHK') + ' House — Press ESC to exit';
    prompt.classList.add('visible');

    // Show back button
    document.getElementById('back-btn').classList.add('visible');
}

function exitHouse() {
    if (boyState.mode === 'transition' || mainDoorTransition) return;
    const houseId = boyState.insideHouse;

    if (!houseId) {
        // Fallback: just reset mode and camera if we don't know which house we're in
        boyState.mode = 'outdoor';
        if (typeof resetToStreetOverview === 'function') resetToStreetOverview();
        return;
    }

    boyState.mode = 'transition';
    boyState.insideHouse = null;

    // Move boy back outside, closer to door for exit animation
    const entryPos = entryPositions[houseId];
    boyGroup.position.set(entryPos.x, 0.15, entryPos.z + 0.5);
    boyGroup.rotation.y = 0;

    // Reset camera to overview via shared helper
    if (typeof resetToStreetOverview === 'function') {
        resetToStreetOverview();
    } else {
        camera.position.set(0, 20, 40);
        controls.target.set(0, 4, 0);
        controls.update();
    }

    boyState.currentRoom = null;

    // Reset all doors to closed
    bhk1Doors.forEach(d => { d.openAngle = 0; d.pivot.rotation.y = d.baseRy; });
    bhk2Doors.forEach(d => { d.openAngle = 0; d.pivot.rotation.y = d.baseRy; });

    // Hide prompt and room indicator
    document.getElementById('enter-prompt').classList.remove('visible');
    document.getElementById('back-btn').classList.remove('visible');
    document.getElementById('room-indicator').classList.remove('visible');

    mainDoorTransition = { type: 'exit', houseId: houseId, progress: 0 };
}

// ═══════════════════════════════════════════════
//  UPDATE FUNCTION (called from animate loop)
// ═══════════════════════════════════════════════
function updateBoy(delta) {
    if (boyState.mode === 'transition') {
        boyState.walkPhase += delta * boyState.speed * 1.5;
        boyGroup.position.y = 0.15 + Math.abs(Math.sin(boyState.walkPhase * 2)) * 0.04;

        if (mainDoorTransition) {
            const pivot = mainDoorTransition.houseId === '1bhk' ? mainDoorPivot1 : mainDoorPivot2;
            mainDoorTransition.progress += delta * 1.8;

            if (mainDoorTransition.type === 'enter') {
                const t = Math.min(mainDoorTransition.progress, 1);
                pivot.rotation.y = t * (Math.PI / 2.2);
                boyGroup.position.z -= delta * 2; // autowalk into house

                if (t === 1) {
                    pivot.rotation.y = 0;
                    finishEnterHouse(mainDoorTransition.houseId);
                    mainDoorTransition = null;
                }
            } else if (mainDoorTransition.type === 'exit') {
                const t = Math.min(mainDoorTransition.progress, 1);
                pivot.rotation.y = (1 - t) * (Math.PI / 2.2); // starts open, closes
                boyGroup.position.z += delta * 2; // autowalk outwards

                if (t === 1) {
                    pivot.rotation.y = 0;
                    boyState.mode = 'outdoor';
                    mainDoorTransition = null;
                    entry1BHK.visible = true;
                    entry2BHK.visible = true;
                }
            }
        }
        return;
    }

    let inputX = 0;  // left/right input
    let inputZ = 0;  // forward/back input

    if (boyState.keys.left) inputX = -1;
    if (boyState.keys.right) inputX = 1;
    if (boyState.keys.up) inputZ = 1;    // forward (into screen from camera's view)
    if (boyState.keys.down) inputZ = -1; // backward

    const isMoving = (inputX !== 0 || inputZ !== 0);

    if (isMoving) {
        // Compute camera-relative forward/right vectors, snapped to nearest 45°
        // so small camera angle deviations don't cause diagonal drift
        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);
        let yaw = Math.atan2(camDir.x, camDir.z);
        yaw = Math.round(yaw / (Math.PI / 4)) * (Math.PI / 4); // snap to 45°

        const camForward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
        const camRight = new THREE.Vector3(-Math.cos(yaw), 0, Math.sin(yaw));

        // Combine input with camera-relative directions
        const moveDir = new THREE.Vector3();
        moveDir.addScaledVector(camForward, inputZ);
        moveDir.addScaledVector(camRight, inputX);
        moveDir.normalize();

        if (boyState.mode === 'indoor') {
            // Per-axis collision detection for sliding along walls
            const newX = boyGroup.position.x + moveDir.x * boyState.speed * delta;
            if (!checkCollision(newX, boyGroup.position.z)) {
                boyGroup.position.x = newX;
            }
            const newZ = boyGroup.position.z + moveDir.z * boyState.speed * delta;
            if (!checkCollision(boyGroup.position.x, newZ)) {
                boyGroup.position.z = newZ;
            }
            // Clamp to house bounds
            const bounds = indoorBounds[boyState.insideHouse];
            boyGroup.position.x = Math.max(bounds.xMin, Math.min(bounds.xMax, boyGroup.position.x));
            boyGroup.position.z = Math.max(bounds.zMin, Math.min(bounds.zMax, boyGroup.position.z));
        } else {
            boyGroup.position.x += moveDir.x * boyState.speed * delta;
            boyGroup.position.z += moveDir.z * boyState.speed * delta;
            boyGroup.position.x = Math.max(-40, Math.min(42, boyGroup.position.x));
            boyGroup.position.z = Math.max(9, Math.min(17, boyGroup.position.z));
        }

        // Face movement direction (using camera-relative moveDir)
        const targetAngle = Math.atan2(moveDir.x, moveDir.z);
        boyGroup.rotation.y += (targetAngle - boyGroup.rotation.y) * 0.15;

        // Walking animation
        boyState.walkPhase += delta * 10;
        const swing = Math.sin(boyState.walkPhase) * 0.6;
        leftLegPivot.rotation.x = swing;
        rightLegPivot.rotation.x = -swing;
        leftArmPivot.rotation.x = -swing * 0.7;
        rightArmPivot.rotation.x = swing * 0.7;
        boyGroup.position.y = (boyState.mode === 'indoor' ? 0.15 : 0.15) + Math.abs(Math.sin(boyState.walkPhase * 2)) * 0.04;
        torso.rotation.z = Math.sin(boyState.walkPhase) * 0.03;
    } else {
        // Idle
        boyState.walkPhase = 0;
        leftLegPivot.rotation.x *= 0.85;
        rightLegPivot.rotation.x *= 0.85;
        leftArmPivot.rotation.x *= 0.85;
        rightArmPivot.rotation.x *= 0.85;
        torso.rotation.z *= 0.85;
        const breath = Math.sin(Date.now() * 0.003) * 0.01;
        torso.scale.y = 1 + breath;
        boyGroup.position.y = 0.15;
    }

    // ── Proximity check for entry circles (outdoor only) ──
    if (boyState.mode === 'outdoor') {
        const boyPos = boyGroup.position;
        const dist1 = boyPos.distanceTo(entryPositions['1bhk']);
        const dist2 = boyPos.distanceTo(entryPositions['2bhk']);
        const threshold = 3;

        const prompt = document.getElementById('enter-prompt');
        if (dist1 < threshold) {
            boyState.nearEntry = '1bhk';
            prompt.textContent = '⏎ Press ENTER to explore 1BHK House';
            prompt.classList.add('visible');
        } else if (dist2 < threshold) {
            boyState.nearEntry = '2bhk';
            prompt.textContent = '⏎ Press ENTER to explore 2BHK House';
            prompt.classList.add('visible');
        } else {
            boyState.nearEntry = null;
            prompt.classList.remove('visible');
        }
    }

    // ── Room zone detection (indoor only) ──
    if (boyState.mode === 'indoor') {
        const bx = boyGroup.position.x;
        const bz = boyGroup.position.z;
        const house = boyState.insideHouse;
        let detectedRoom = null;
        // Check which room region the boy is in
        for (const reg of roomRegions) {
            if (reg.house !== house) continue;
            if (bx >= reg.xMin && bx <= reg.xMax && bz >= reg.zMin && bz <= reg.zMax) {
                detectedRoom = reg.room;
                break;
            }
        }
        // Show room indicator when room changes
        const indicator = document.getElementById('room-indicator');
        if (detectedRoom && detectedRoom !== boyState.currentRoom) {
            boyState.currentRoom = detectedRoom;
            indicator.textContent = detectedRoom;
            indicator.classList.add('visible');
            // Auto-hide after 2 seconds
            clearTimeout(window._roomIndicatorTimeout);
            window._roomIndicatorTimeout = setTimeout(() => {
                indicator.classList.remove('visible');
            }, 2000);
        }
    }

    // ── Door push/pull animation ──
    updateDoors(delta);

    // ── Camera follow (indoor & outdoor) ──
    if (boyState.mode === 'indoor') {
        const targetCamPos = new THREE.Vector3(
            boyGroup.position.x,
            boyGroup.position.y + indoorCameraOffset.y,
            boyGroup.position.z + indoorCameraOffset.z
        );
        camera.position.lerp(targetCamPos, 0.05);
        const lookAt = new THREE.Vector3(boyGroup.position.x, boyGroup.position.y + 2, boyGroup.position.z);
        controls.target.lerp(lookAt, 0.05);
        controls.update();
    } else if (boyState.mode === 'outdoor' && isMoving) {
        // Track the boy when moving outside
        const lookAt = new THREE.Vector3(boyGroup.position.x, 2, boyGroup.position.z);
        controls.target.lerp(lookAt, 0.05);
        controls.update();
    }
}

// ═══════════════════════════════════════════════
//  ENTRY CIRCLE PULSE ANIMATION
// ═══════════════════════════════════════════════
function updateEntryCircles(elapsed) {
    const pulse = 0.5 + Math.sin(elapsed * 3) * 0.3;
    const glowPulse = 0.2 + Math.sin(elapsed * 2) * 0.15;
    const arrowBob = Math.sin(elapsed * 4) * 0.3;

    if (boyState.mode === 'outdoor') {
        // 1BHK circle
        entry1Circle.material.opacity = pulse;
        entry1Circle.material.emissiveIntensity = 0.4 + Math.sin(elapsed * 3) * 0.3;
        entry1Glow.material.opacity = glowPulse;
        const scale1 = 1 + Math.sin(elapsed * 2) * 0.08;
        entry1Circle.scale.set(scale1, scale1, 1);
        arrow1.position.y = 1.5 + arrowBob;

        // 2BHK circle
        entry2Circle.material.opacity = pulse;
        entry2Circle.material.emissiveIntensity = 0.4 + Math.sin(elapsed * 3) * 0.3;
        entry2Glow.material.opacity = glowPulse;
        const scale2 = 1 + Math.sin(elapsed * 2 + 0.5) * 0.08;
        entry2Circle.scale.set(scale2, scale2, 1);
        arrow2.position.y = 1.5 + arrowBob;
    }


}
