// ═══════════════════════════════════════════════
//  ANIMATED BOY CHARACTER — REALISTIC 3D + HOUSE NAVIGATION
// ═══════════════════════════════════════════════
const boyGroup = new THREE.Group();

// ── MATERIALS ──
const skinMat = new THREE.MeshStandardMaterial({ color: 0xFDBCB4, roughness: 0.7 });
const hairMat = new THREE.MeshStandardMaterial({ color: 0x2C1B0E, roughness: 0.9 });
const tshirtMat = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.65 });
const pantsMat = new THREE.MeshStandardMaterial({ color: 0x37474F, roughness: 0.8 });
const shoeMat = new THREE.MeshStandardMaterial({ color: 0xE53935, roughness: 0.6 });
const shoeSoleMat = new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.5 });
const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 });
const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.2 });
const tshirtStripeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.65 });

// ── HEAD ──
const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), skinMat);
head.position.y = 2.1; head.castShadow = true; boyGroup.add(head);

// Hair (main cap + side tufts)
const hairMain = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 16), hairMat);
hairMain.position.y = 2.22; hairMain.scale.set(1.04, 0.72, 1.04); boyGroup.add(hairMain);
const hairFringe = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.14), hairMat);
hairFringe.position.set(0, 2.14, 0.27); boyGroup.add(hairFringe);
const hairSideL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.2), hairMat);
hairSideL.position.set(-0.3, 2.1, 0); boyGroup.add(hairSideL);
const hairSideR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.2), hairMat);
hairSideR.position.set(0.3, 2.1, 0); boyGroup.add(hairSideR);

// Eyes (white + dark pupil)
const leftEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), eyeWhiteMat);
leftEyeWhite.position.set(-0.11, 2.12, 0.27); boyGroup.add(leftEyeWhite);
const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
leftEye.position.set(-0.11, 2.12, 0.30); boyGroup.add(leftEye);
const rightEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), eyeWhiteMat);
rightEyeWhite.position.set(0.11, 2.12, 0.27); boyGroup.add(rightEyeWhite);
const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
rightEye.position.set(0.11, 2.12, 0.30); boyGroup.add(rightEye);

// Mouth
const mouthMat = new THREE.MeshStandardMaterial({ color: 0xCC6666, roughness: 0.4 });
const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.03), mouthMat);
mouth.position.set(0, 1.97, 0.30); boyGroup.add(mouth);

// ── NECK ──
const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.18, 8), skinMat);
neck.position.y = 1.85; boyGroup.add(neck);

// ── TORSO ──
const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.65, 0.28), tshirtMat);
torso.position.y = 1.45; torso.castShadow = true; boyGroup.add(torso);

// Collar
const collar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.30), tshirtMat);
collar.position.y = 1.80; boyGroup.add(collar);

// Stripe detail
const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.53, 0.06, 0.29), tshirtStripeMat);
stripe.position.set(0, 1.45, 0); boyGroup.add(stripe);

// ── HIPS ──
const hips = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.18, 0.25), pantsMat);
hips.position.y = 1.08; boyGroup.add(hips);

// ── ARMS (Cylinder-based with elbow pivots) ──
const leftShoulderPivot = new THREE.Group();
leftShoulderPivot.position.set(-0.34, 1.72, 0); boyGroup.add(leftShoulderPivot);
const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.35, 8), tshirtMat);
leftUpperArm.position.set(0, -0.18, 0); leftUpperArm.castShadow = true; leftShoulderPivot.add(leftUpperArm);
const leftElbowPivot = new THREE.Group();
leftElbowPivot.position.set(0, -0.36, 0); leftShoulderPivot.add(leftElbowPivot);
const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.32, 8), skinMat);
leftForearm.position.set(0, -0.16, 0); leftElbowPivot.add(leftForearm);
const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), skinMat);
leftHand.position.set(0, -0.34, 0); leftElbowPivot.add(leftHand);

const rightShoulderPivot = new THREE.Group();
rightShoulderPivot.position.set(0.34, 1.72, 0); boyGroup.add(rightShoulderPivot);
const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.35, 8), tshirtMat);
rightUpperArm.position.set(0, -0.18, 0); rightUpperArm.castShadow = true; rightShoulderPivot.add(rightUpperArm);
const rightElbowPivot = new THREE.Group();
rightElbowPivot.position.set(0, -0.36, 0); rightShoulderPivot.add(rightElbowPivot);
const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.32, 8), skinMat);
rightForearm.position.set(0, -0.16, 0); rightElbowPivot.add(rightForearm);
const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), skinMat);
rightHand.position.set(0, -0.34, 0); rightElbowPivot.add(rightHand);

// Arm pivot aliases for animation compatibility
const leftArmPivot = leftShoulderPivot;
const rightArmPivot = rightShoulderPivot;

// ── LEGS (Cylinder-based with knee pivots) ──
const leftHipPivot = new THREE.Group();
leftHipPivot.position.set(-0.13, 1.0, 0); boyGroup.add(leftHipPivot);
const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.42, 8), pantsMat);
leftThigh.position.set(0, -0.21, 0); leftThigh.castShadow = true; leftHipPivot.add(leftThigh);
const leftKneePivot = new THREE.Group();
leftKneePivot.position.set(0, -0.42, 0); leftHipPivot.add(leftKneePivot);
const leftShin = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.38, 8), pantsMat);
leftShin.position.set(0, -0.19, 0); leftKneePivot.add(leftShin);
const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.24), shoeMat);
leftShoe.position.set(0, -0.42, 0.04); leftKneePivot.add(leftShoe);
const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.25), shoeSoleMat);
leftSole.position.set(0, -0.48, 0.04); leftKneePivot.add(leftSole);

const rightHipPivot = new THREE.Group();
rightHipPivot.position.set(0.13, 1.0, 0); boyGroup.add(rightHipPivot);
const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.42, 8), pantsMat);
rightThigh.position.set(0, -0.21, 0); rightThigh.castShadow = true; rightHipPivot.add(rightThigh);
const rightKneePivot = new THREE.Group();
rightKneePivot.position.set(0, -0.42, 0); rightHipPivot.add(rightKneePivot);
const rightShin = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.38, 8), pantsMat);
rightShin.position.set(0, -0.19, 0); rightKneePivot.add(rightShin);
const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.24), shoeMat);
rightShoe.position.set(0, -0.42, 0.04); rightKneePivot.add(rightShoe);
const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.25), shoeSoleMat);
rightSole.position.set(0, -0.48, 0.04); rightKneePivot.add(rightSole);

// Leg pivot aliases for animation compatibility
const leftLegPivot = leftHipPivot;
const rightLegPivot = rightHipPivot;

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

const entryGlowMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88, emissive: 0x00ff66, emissiveIntensity: 0.4,
    transparent: true, opacity: 0.3, roughness: 0.5
});

// 1BHK entry circle
const entry1BHK = new THREE.Group();
const entry1Circle = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), entryCircleMat.clone());
entry1Circle.rotation.x = -Math.PI / 2;
entry1Circle.position.set(0, 0.06, 0);
entry1BHK.add(entry1Circle);
const entry1Glow = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.8, 24), entryGlowMat.clone());
entry1Glow.rotation.x = -Math.PI / 2;
entry1Glow.position.set(0, 0.05, 0);
entry1BHK.add(entry1Glow);
const arrowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });
const arrow1 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 4), arrowMat);
arrow1.position.set(0, 1.5, 0);
arrow1.rotation.x = Math.PI;
entry1BHK.add(arrow1);
entry1BHK.position.set(-22, 0, 12);
scene.add(entry1BHK);

// 2BHK entry circle
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
entry2BHK.position.set(24, 0, 13);
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
    mode: 'outdoor',       // 'outdoor' | 'transitioning' | 'indoor'
    insideHouse: null,     // '1bhk' | '2bhk'
    nearEntry: null,       // '1bhk' | '2bhk' | null
    nearExit: false,       // determines if Exit prompt is visible near doors inside
    cameraFollow: true,    // camera follows boy when indoor
    followTarget: new THREE.Vector3(),
    followInit: false,
    // Room tracking for popup HUD
    currentRoom: null,
    lastRoom: null
};

// Entry circle world positions
const entryPositions = {
    '1bhk': new THREE.Vector3(-22, 0, 12),
    '2bhk': new THREE.Vector3(24, 0, 13)
};

// Indoor spawn positions (world coords)
const indoorSpawn = {
    '1bhk': { pos: new THREE.Vector3(-22, 0.15, 8), rot: Math.PI },
    '2bhk': { pos: new THREE.Vector3(24, 0.15, 9), rot: Math.PI }
};

// Indoor movement bounds (world coords)
const indoorBounds = {
    '1bhk': { xMin: -36, xMax: -8, zMin: -11, zMax: 10 },
    '2bhk': { xMin: 10, xMax: 38, zMin: -12, zMax: 11 }
};

const indoorCameraOffset = new THREE.Vector3(0, 8, 10);

// ── KEY LISTENERS ──
document.addEventListener('keydown', (e) => {
    // Always accept key presses (even during transition — they queue up)
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { boyState.keys.up = true; e.preventDefault(); }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { boyState.keys.down = true; e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { boyState.keys.left = true; e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { boyState.keys.right = true; e.preventDefault(); }

    // ENTER — enter house if near entry circle
    if (e.key === 'Enter') {
        if (boyState.mode === 'outdoor' && boyState.nearEntry) {
            enterHouse(boyState.nearEntry);
            e.preventDefault();
        }
    }

    // ESCAPE — exit house back to road
    if (e.key === 'Escape' && boyState.mode === 'indoor' && boyState.nearExit) {
        exitHouse();
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { boyState.keys.up = false; e.preventDefault(); }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { boyState.keys.down = false; e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { boyState.keys.left = false; e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { boyState.keys.right = false; e.preventDefault(); }
}, { passive: false });

// Disable camera panning with arrow keys
if (typeof controls !== 'undefined') {
    controls.enableKeys = false;
}

// ═══════════════════════════════════════════════
//  ENTER / EXIT HOUSE — Clean state machine
//  OUTSIDE → TRANSITIONING → INSIDE
//  Input only blocked during TRANSITIONING (200ms)
// ═══════════════════════════════════════════════
function enterHouse(houseId) {
    if (boyState.mode === 'transitioning') return; // prevent double-entry

    // Animate main door open
    if (typeof openMainDoor === 'function') openMainDoor(houseId);

    // TRANSITIONING state — block movement briefly
    boyState.mode = 'transitioning';
    boyState.insideHouse = houseId;
    boyState.nearEntry = null;

    // CRITICAL FIX: Reset all key states to prevent stale input
    boyState.keys = { up: false, down: false, left: false, right: false };

    // Move boy inside
    const spawn = indoorSpawn[houseId];
    boyGroup.position.copy(spawn.pos);
    boyGroup.rotation.y = spawn.rot;

    boyState.followTarget.copy(spawn.pos);

    // Position camera for indoor view
    if (typeof controls !== 'undefined') {
        controls.enabled = true;
        camera.position.set(spawn.pos.x, spawn.pos.y + 6, spawn.pos.z + 8);
        controls.target.set(spawn.pos.x, spawn.pos.y + 1.5, spawn.pos.z);
        controls.update();
    }

    // Focus on the right house
    is2BHK = (houseId === '2bhk');
    buildAppliancePanel();
    buildRoomNavPanel();
    recalcWattage();
    boyState.currentRoom = null;

    // Show back button
    document.getElementById('back-btn').classList.add('visible');

    // Transition to INDOOR after short delay — movement immediately works
    setTimeout(() => {
        boyState.mode = 'indoor';
    }, 200);

    // Close door after boy is inside
    setTimeout(() => {
        if (typeof closeMainDoor === 'function') closeMainDoor(houseId);
    }, 1500);
}

function exitHouse() {
    if (boyState.mode === 'transitioning') return;

    const houseId = boyState.insideHouse;

    // Animate main door open
    if (typeof openMainDoor === 'function') openMainDoor(houseId);

    // TRANSITIONING state
    boyState.mode = 'transitioning';

    // CRITICAL FIX: Reset all key states
    boyState.keys = { up: false, down: false, left: false, right: false };

    // Move boy back outside, closer to door for exit animation
    const entryPos = entryPositions[houseId];
    boyGroup.position.set(entryPos.x, 0.15, entryPos.z + 0.5);
    boyGroup.rotation.y = 0;

    boyState.followTarget.copy(boyGroup.position);

    // Position camera
    if (typeof controls !== 'undefined') {
        controls.enabled = true;
        camera.position.set(boyGroup.position.x, 6, boyGroup.position.z + 10);
        controls.target.set(boyGroup.position.x, 1.5, boyGroup.position.z);
        controls.update();
    }

    boyState.currentRoom = null;

    // Reset all doors to closed
    bhk1Doors.forEach(d => { d.openAngle = 0; d.pivot.rotation.y = d.baseRy; });
    bhk2Doors.forEach(d => { d.openAngle = 0; d.pivot.rotation.y = d.baseRy; });

    // Hide prompts
    const prompt = document.getElementById('interaction-popup');
    if (prompt) prompt.classList.remove('visible');
    document.getElementById('back-btn').classList.remove('visible');

    // Hide room popup
    if (typeof hideRoomPopup === 'function') hideRoomPopup();
    boyState.currentRoom = null;
    boyState.lastRoom = null;

    // Transition to OUTDOOR
    setTimeout(() => {
        boyState.mode = 'outdoor';
        boyState.insideHouse = null;
    }, 200);

    // Close door
    setTimeout(() => {
        if (typeof closeMainDoor === 'function') closeMainDoor(houseId);
    }, 1500);
}

// ═══════════════════════════════════════════════
//  UPDATE FUNCTION (called from animate loop)
// ═══════════════════════════════════════════════
function updateBoy(delta) {
    // Don't process movement during transition
    if (boyState.mode === 'transitioning') return;

    let inputX = 0;
    let inputZ = 0;

    if (boyState.keys.left) inputX = -1;
    if (boyState.keys.right) inputX = 1;
    if (boyState.keys.up) inputZ = -1;
    if (boyState.keys.down) inputZ = 1;

    const isMoving = (inputX !== 0 || inputZ !== 0);

    if (isMoving) {
        // Camera-relative movement
        const forward = new THREE.Vector3();
        forward.subVectors(controls.target, camera.position);
        forward.y = 0;
        if (forward.lengthSq() > 0.0001) {
            forward.normalize();
        } else {
            forward.set(0, 0, -1);
        }
        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        const moveDir = new THREE.Vector3();
        moveDir.addScaledVector(forward, -inputZ);
        moveDir.addScaledVector(right, inputX);
        if (moveDir.lengthSq() > 0) moveDir.normalize();

        // Save position before move for collision rollback
        const prevX = boyGroup.position.x;
        const prevZ = boyGroup.position.z;

        boyGroup.position.x += moveDir.x * boyState.speed * delta;
        boyGroup.position.z += moveDir.z * boyState.speed * delta;

        // Clamp based on mode
        if (boyState.mode === 'outdoor') {
            boyGroup.position.x = Math.max(-45, Math.min(48, boyGroup.position.x));
            boyGroup.position.z = Math.max(9, Math.min(17, boyGroup.position.z));
        } else if (boyState.mode === 'indoor') {
            const bounds = indoorBounds[boyState.insideHouse];
            if (bounds) {
                boyGroup.position.x = Math.max(bounds.xMin, Math.min(bounds.xMax, boyGroup.position.x));
                boyGroup.position.z = Math.max(bounds.zMin, Math.min(bounds.zMax, boyGroup.position.z));
            }
        }

        // Furniture collision check — revert if colliding
        if (typeof checkFurnitureCollision === 'function' &&
            checkFurnitureCollision(boyGroup.position.x, boyGroup.position.z)) {
            boyGroup.position.x = prevX;
            boyGroup.position.z = prevZ;
        }

        // Face movement direction
        const targetAngle = Math.atan2(moveDir.x, moveDir.z);
        const diff = Math.atan2(Math.sin(targetAngle - boyGroup.rotation.y), Math.cos(targetAngle - boyGroup.rotation.y));
        boyGroup.rotation.y += diff * 0.2;

        // Walking animation — arm and leg swing with elbow/knee bend
        boyState.walkPhase += delta * 10;
        const swing = Math.sin(boyState.walkPhase) * 0.6;

        // Legs swing at hip
        leftHipPivot.rotation.x = swing;
        rightHipPivot.rotation.x = -swing;
        // Knees bend on backswing
        leftKneePivot.rotation.x = Math.max(0, -swing) * 0.5;
        rightKneePivot.rotation.x = Math.max(0, swing) * 0.5;

        // Arms swing oppositely
        leftShoulderPivot.rotation.x = -swing * 0.7;
        rightShoulderPivot.rotation.x = swing * 0.7;
        // Elbows bend slightly during swing
        leftElbowPivot.rotation.x = Math.abs(swing) * 0.3;
        rightElbowPivot.rotation.x = Math.abs(swing) * 0.3;

        // Body bounce
        boyGroup.position.y = 0.15 + Math.abs(Math.sin(boyState.walkPhase * 2)) * 0.04;
        torso.rotation.z = Math.sin(boyState.walkPhase) * 0.03;
    } else {
        // Idle animation — breathing + smooth decay
        boyState.walkPhase = 0;
        leftHipPivot.rotation.x *= 0.85;
        rightHipPivot.rotation.x *= 0.85;
        leftKneePivot.rotation.x *= 0.85;
        rightKneePivot.rotation.x *= 0.85;
        leftShoulderPivot.rotation.x *= 0.85;
        rightShoulderPivot.rotation.x *= 0.85;
        leftElbowPivot.rotation.x *= 0.85;
        rightElbowPivot.rotation.x *= 0.85;
        torso.rotation.z *= 0.85;

        // Breathing — subtle torso scale oscillation
        const breath = Math.sin(Date.now() * 0.003) * 0.012;
        torso.scale.y = 1 + breath;
        torso.scale.x = 1 - breath * 0.3;
        boyGroup.position.y = 0.15;
    }

    // ── Proximity check for entry circles and exit doors ──
    const prompt = document.getElementById('interaction-popup');
    if (boyState.mode === 'outdoor') {
        const boyPos = boyGroup.position;
        const dist1 = boyPos.distanceTo(entryPositions['1bhk']);
        const dist2 = boyPos.distanceTo(entryPositions['2bhk']);
        const threshold = 3;

        if (dist1 < threshold) {
            boyState.nearEntry = '1bhk';
            if (prompt) {
                prompt.textContent = 'Press ENTER to enter 1BHK House';
                prompt.classList.add('visible');
            }
        } else if (dist2 < threshold) {
            boyState.nearEntry = '2bhk';
            if (prompt) {
                prompt.textContent = 'Press ENTER to enter 2BHK House';
                prompt.classList.add('visible');
            }
        } else {
            boyState.nearEntry = null;
            if (prompt) prompt.classList.remove('visible');
        }
    } else if (boyState.mode === 'indoor') {
        const boyPos = boyGroup.position;
        const distExit = boyPos.distanceTo(indoorSpawn[boyState.insideHouse].pos);
        const threshold = 3;

        if (distExit < threshold) {
            boyState.nearExit = true;
            if (prompt) {
                prompt.textContent = 'Press ESC to exit the house';
                prompt.classList.add('visible');
            }
        } else {
            boyState.nearExit = false;
            if (prompt && prompt.textContent === 'Press ESC to exit the house') {
                prompt.classList.remove('visible');
            }
        }

        // ── Room tracking for popup HUD ──
        if (typeof getBoyRoom === 'function') {
            const room = getBoyRoom();
            if (room !== boyState.currentRoom) {
                boyState.lastRoom = boyState.currentRoom;
                boyState.currentRoom = room;
                if (room && typeof showRoomPopup === 'function') {
                    showRoomPopup(room, boyState.insideHouse);
                }
            }
        }
    }

    // ── Smooth Camera Follow (only when boy is moving) ──
    if (isMoving && typeof camera !== 'undefined' && typeof controls !== 'undefined') {
        const desiredTarget = new THREE.Vector3(
            boyGroup.position.x,
            boyGroup.position.y + 1.5,
            boyGroup.position.z
        );
        const prevTarget = controls.target.clone();
        controls.target.lerp(desiredTarget, 0.12);
        const camDelta = controls.target.clone().sub(prevTarget);
        camera.position.add(camDelta);
        controls.update();
    } else if (boyState.mode === 'outdoor' && isMoving) {
        // Track the boy when moving outside
        const lookAt = new THREE.Vector3(boyGroup.position.x, 2, boyGroup.position.z);
        controls.target.lerp(lookAt, 0.05);
        controls.update();
    }

    // ── Door animation + room transparency + main doors ──
    if (typeof updateDoors === 'function') updateDoors();
    if (typeof updateMainDoors === 'function') updateMainDoors();
    if (typeof updateRoomTransparency === 'function') updateRoomTransparency();
}

// ═══════════════════════════════════════════════
//  ENTRY CIRCLE PULSE ANIMATION
// ═══════════════════════════════════════════════
function updateEntryCircles(elapsed) {
    if (boyState.mode === 'indoor' || boyState.mode === 'transitioning') return;

    const pulse = 0.5 + Math.sin(elapsed * 3) * 0.3;
    const glowPulse = 0.2 + Math.sin(elapsed * 2) * 0.15;
    const arrowBob = Math.sin(elapsed * 4) * 0.3;

    entry1Circle.material.opacity = pulse;
    entry1Circle.material.emissiveIntensity = 0.4 + Math.sin(elapsed * 3) * 0.3;
    entry1Glow.material.opacity = glowPulse;
    const scale1 = 1 + Math.sin(elapsed * 2) * 0.08;
    entry1Circle.scale.set(scale1, scale1, 1);
    arrow1.position.y = 1.5 + arrowBob;

    entry2Circle.material.opacity = pulse;
    entry2Circle.material.emissiveIntensity = 0.4 + Math.sin(elapsed * 3) * 0.3;
    entry2Glow.material.opacity = glowPulse;
    const scale2 = 1 + Math.sin(elapsed * 2 + 0.5) * 0.08;
    entry2Circle.scale.set(scale2, scale2, 1);
    arrow2.position.y = 1.5 + arrowBob;
}
