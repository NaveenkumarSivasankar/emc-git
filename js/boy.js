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

// Nose
const nose = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 6), skinMat);
nose.position.set(0, 2.04, 0.33); nose.rotation.x = -Math.PI / 2; boyGroup.add(nose);

// Ears (small, natural)
const earGeo = new THREE.SphereGeometry(0.04, 8, 8);
const leftEar = new THREE.Mesh(earGeo, skinMat);
leftEar.position.set(-0.30, 2.10, 0.05); leftEar.scale.set(0.5, 0.7, 0.6); boyGroup.add(leftEar);
const rightEar = new THREE.Mesh(earGeo, skinMat);
rightEar.position.set(0.30, 2.10, 0.05); rightEar.scale.set(0.5, 0.7, 0.6); boyGroup.add(rightEar);

// Eyebrows
const browMat = new THREE.MeshStandardMaterial({ color: 0x2C1B0E, roughness: 0.9 });
const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.02, 0.03), browMat);
leftBrow.position.set(-0.11, 2.19, 0.29); boyGroup.add(leftBrow);
const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.02, 0.03), browMat);
rightBrow.position.set(0.11, 2.19, 0.29); boyGroup.add(rightBrow);

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

// ── BELT ──
const beltMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.5, metalness: 0.3 });
const belt = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.27), beltMat);
belt.position.y = 1.15; boyGroup.add(belt);
const buckleMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2 });
const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.28), buckleMat);
buckle.position.set(0, 1.15, 0.01); boyGroup.add(buckle);

// (backpack removed for a cleaner look)

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
entry1BHK.position.set(-22, 0, 7);
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
entry2BHK.position.set(24, 0, 8);
scene.add(entry2BHK);


// ═══════════════════════════════════════════════
//  COLLISION SYSTEM — OPTIMIZED
//  Uses pre-computed AABB boxes from interiors.js (furnitureBoxes)
//  Legacy collisionBoxes removed to avoid duplicate data
// ═══════════════════════════════════════════════
const BOY_RADIUS = 0.35;

// Door animation is handled by interiors.js updateDoors()

// Room regions for detecting which room the boy is in
const roomRegions = [
    // 1BHK (shifted z by -4)
    { xMin: -16.5, xMax: -4, zMin: -5.5, zMax: 3.5, room: '🏠 Hall', house: '1bhk' },
    { xMin: -24, xMax: -16.5, zMin: -5.5, zMax: 3.5, room: '🍳 Kitchen', house: '1bhk' },
    { xMin: -24, xMax: -4, zMin: -11.5, zMax: -5.5, room: '🛏️ Bedroom', house: '1bhk' },
    // 2BHK (shifted z by -4)
    { xMin: 11, xMax: 26, zMin: -6.5, zMax: 4, room: '🏠 Hall', house: '2bhk' },
    { xMin: 6, xMax: 16, zMin: -12, zMax: -6.5, room: '🛏️ Bedroom 1', house: '2bhk' },
    { xMin: 16, xMax: 26, zMin: -12, zMax: -6.5, room: '🛏️ Bedroom 2', house: '2bhk' },
    { xMin: 6, xMax: 11, zMin: -6.5, zMax: 0, room: '🍳 Kitchen', house: '2bhk' },
    { xMin: 6, xMax: 11, zMin: 0, zMax: 4, room: '🚿 Bathroom', house: '2bhk' },
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
    '1bhk': new THREE.Vector3(-22, 0, 7),
    '2bhk': new THREE.Vector3(24, 0, 8)
};

// Indoor spawn positions (world coords)
const indoorSpawn = {
    '1bhk': { pos: new THREE.Vector3(-22, 0.15, 6), rot: Math.PI },
    '2bhk': { pos: new THREE.Vector3(24, 0.15, 7), rot: Math.PI }
};

// Indoor movement bounds (world coords) — matches wall positions exactly
// 1BHK: houseGroup at (-22,0,-4), W=28, D=22 → walls at x[-36,-8] z[-15,7]
// 2BHK: bhk2Group at (24,0,-4), W2=28, D2=24 → walls at x[10,38] z[-16,8]
const indoorBounds = {
    '1bhk': { xMin: -35.5, xMax: -8.5, zMin: -18.5, zMax: 6.8 },
    '2bhk': { xMin: 10.5, xMax: 37.5, zMin: -19.5, zMax: 7.8 }
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
        } else if (boyState.mode === 'outdoor') {
            // Fallback: check distance directly at keypress moment
            const bp = boyGroup.position;
            const d1 = bp.distanceTo(entryPositions['1bhk']);
            const d2 = bp.distanceTo(entryPositions['2bhk']);
            if (d1 < 6) { enterHouse('1bhk'); e.preventDefault(); }
            else if (d2 < 6) { enterHouse('2bhk'); e.preventDefault(); }
        }
    }

    // ESCAPE — exit house back to road (works from anywhere inside)
    if (e.key === 'Escape' && boyState.mode === 'indoor') {
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

    // Lazy load interiors
    if (houseId === '1bhk' && typeof window.load1BHKFurniture === 'function') {
        window.load1BHKFurniture();
    } else if (houseId === '2bhk' && typeof window.load2BHKFurniture === 'function') {
        window.load2BHKFurniture();
    }

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
        camera.position.set(spawn.pos.x, spawn.pos.y + 9, spawn.pos.z - 6);
        controls.target.set(spawn.pos.x, spawn.pos.y + 1.5, spawn.pos.z - 2);
        controls.update();
    }

    // Immediately hide outdoor objects to reduce rendering load
    if (typeof environmentGroup !== 'undefined') environmentGroup.visible = false;
    if (typeof poleGroup !== 'undefined') poleGroup.visible = false;
    if (typeof entry1BHK !== 'undefined') entry1BHK.visible = false;
    if (typeof entry2BHK !== 'undefined') entry2BHK.visible = false;
    if (houseId === '1bhk') {
        if (typeof bhk2Group !== 'undefined') bhk2Group.visible = false;
    } else {
        if (typeof houseGroup !== 'undefined') houseGroup.visible = false;
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

    // Only allow exit if boy is near the front door spawn position
    const spawnPos = indoorSpawn[boyState.insideHouse].pos;
    const distToDoor = Math.sqrt(
        (boyGroup.position.x - spawnPos.x) ** 2 +
        (boyGroup.position.z - spawnPos.z) ** 2
    );
    if (distToDoor > 3.5) {
        const prompt = document.getElementById('interaction-popup');
        if (prompt) {
            prompt.textContent = '🚪 Walk to the front door to exit';
            prompt.classList.add('visible');
            setTimeout(() => prompt.classList.remove('visible'), 2000);
        }
        return;
    }

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

    // Immediately restore outdoor object visibility
    if (typeof environmentGroup !== 'undefined') environmentGroup.visible = true;
    if (typeof poleGroup !== 'undefined') poleGroup.visible = true;
    if (typeof entry1BHK !== 'undefined') entry1BHK.visible = true;
    if (typeof entry2BHK !== 'undefined') entry2BHK.visible = true;
    if (typeof houseGroup !== 'undefined') houseGroup.visible = true;
    if (typeof bhk2Group !== 'undefined') bhk2Group.visible = true;

    boyState.currentRoom = null;

    // Reset all interactive doors to closed
    if (typeof interactiveDoors !== 'undefined') {
        interactiveDoors.forEach(d => {
            d.currentAngle = 0;
            d.pivot.rotation.y = d.baseRY;
        });
    }

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
//  CACHED VECTORS FOR MOVEMENT (avoid per-frame allocation)
// ═══════════════════════════════════════════════
const _moveForward = new THREE.Vector3();
const _moveRight = new THREE.Vector3();
const _moveDir = new THREE.Vector3();
const _upVec = new THREE.Vector3(0, 1, 0);
const _desiredTarget = new THREE.Vector3();
const _lookAt = new THREE.Vector3();

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
        // Camera-relative movement (reuse cached vectors)
        _moveForward.subVectors(controls.target, camera.position);
        _moveForward.y = 0;
        if (_moveForward.lengthSq() > 0.0001) {
            _moveForward.normalize();
        } else {
            _moveForward.set(0, 0, -1);
        }
        _moveRight.crossVectors(_moveForward, _upVec).normalize();

        _moveDir.set(0, 0, 0);
        _moveDir.addScaledVector(_moveForward, -inputZ);
        _moveDir.addScaledVector(_moveRight, inputX);
        if (_moveDir.lengthSq() > 0) _moveDir.normalize();

        // Save position before move for collision rollback
        const prevX = boyGroup.position.x;
        const prevZ = boyGroup.position.z;

        const dx = _moveDir.x * boyState.speed * delta;
        const dz = _moveDir.z * boyState.speed * delta;

        // Clamp helper (inline, no function creation per frame)
        let newX = prevX + dx;
        let newZ = prevZ + dz;

        // Clamp to world bounds
        if (boyState.mode === 'outdoor') {
            newX = Math.max(-45, Math.min(48, newX));
            newZ = Math.max(5, Math.min(18, newZ));
        }

        // Collision check (only uses the dedicated furniture/wall list)
        const collides = typeof checkFurnitureCollision === 'function'
            ? checkFurnitureCollision : () => false;

        // Axis-split sliding collision with corner nudge
        if (collides(newX, newZ)) {
            if (!collides(newX, prevZ)) {
                newZ = prevZ;
            } else if (!collides(prevX, newZ)) {
                newX = prevX;
            } else {
                newX = prevX;
                newZ = prevZ;
            }
        }

        // REMOVED Lightweight edge pushback

        boyGroup.position.x = newX;
        boyGroup.position.z = newZ;

        // Hard clamp to indoor bounds — prevents escaping through outer walls
        if (boyState.mode === 'indoor') {
            const bounds = indoorBounds[boyState.insideHouse];
            boyGroup.position.x = Math.max(bounds.xMin, Math.min(bounds.xMax, boyGroup.position.x));
            boyGroup.position.z = Math.max(bounds.zMin, Math.min(bounds.zMax, boyGroup.position.z));
        }

        // Face movement direction
        const targetAngle = Math.atan2(_moveDir.x, _moveDir.z);
        const diff = Math.atan2(Math.sin(targetAngle - boyGroup.rotation.y), Math.cos(targetAngle - boyGroup.rotation.y));
        boyGroup.rotation.y += diff * 0.25;

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
        const threshold = 5;

        if (dist1 < threshold) {
            boyState.nearEntry = '1bhk';
            if (prompt) {
                prompt.textContent = '🏠 Press ENTER to enter 1BHK House';
                prompt.classList.add('visible');
            }
        } else if (dist2 < threshold) {
            boyState.nearEntry = '2bhk';
            if (prompt) {
                prompt.textContent = '🏠 Press ENTER to enter 2BHK House';
                prompt.classList.add('visible');
            }
        } else {
            boyState.nearEntry = null;
            if (prompt) prompt.classList.remove('visible');
        }

        // Debug: always update nearEntry even if prompt missing
        if (dist1 < threshold) boyState.nearEntry = '1bhk';
        else if (dist2 < threshold) boyState.nearEntry = '2bhk';
        else boyState.nearEntry = null;
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
        _desiredTarget.set(
            boyGroup.position.x,
            boyGroup.position.y + 1.5,
            boyGroup.position.z
        );
        const prevTarget = controls.target.clone();
        controls.target.lerp(_desiredTarget, 0.15);
        const camDelta = controls.target.clone().sub(prevTarget);
        camera.position.add(camDelta);
        controls.update();
    } else if (boyState.mode === 'outdoor' && isMoving) {
        // Track the boy when moving outside
        _lookAt.set(boyGroup.position.x, 2, boyGroup.position.z);
        controls.target.lerp(_lookAt, 0.05);
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

// ═══════════════════════════════════════════════
//  CONTROLS HINT OVERLAY
// ═══════════════════════════════════════════════
(function createControlsOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'controls-overlay';
    overlay.innerHTML = `
        <div class="controls-title">Controls</div>
        <div class="controls-arrows">
            <div class="key-row"><span class="key">↑</span></div>
            <div class="key-row">
                <span class="key">←</span>
                <span class="key">↓</span>
                <span class="key">→</span>
            </div>
        </div>
        <div class="controls-actions">
            <span class="key wide">Enter</span> <span class="key-label">Enter House</span>
        </div>
        <div class="controls-actions">
            <span class="key wide">ESC</span> <span class="key-label">Exit House</span>
        </div>
    `;
    document.body.appendChild(overlay);
})();
