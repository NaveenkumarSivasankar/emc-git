// ═══════════════════════════════════════════════
//  ANIMATED BOY CHARACTER
// ═══════════════════════════════════════════════
const boyGroup = new THREE.Group();

// Materials
const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFCC99, roughness: 0.8 });
const hairMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.9 });
const tshirtMat = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.75 }); // Blue t-shirt
const pantsMat = new THREE.MeshStandardMaterial({ color: 0x37474F, roughness: 0.8 }); // Dark gray jeans
const shoeMat = new THREE.MeshStandardMaterial({ color: 0xE53935, roughness: 0.7 }); // Red sneakers
const shoeSoleMat = new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.6 }); // White sole
const eyeMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3 });
const tshirtStripeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.75 }); // White stripe

// ── HEAD ──
const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), skinMat);
head.position.y = 2.05;
head.castShadow = true;
boyGroup.add(head);

// Hair (cap style)
const hair = new THREE.Mesh(new THREE.SphereGeometry(0.30, 12, 12), hairMat);
hair.position.y = 2.15;
hair.scale.set(1.02, 0.7, 1.02);
boyGroup.add(hair);

// Hair fringe
const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.06, 0.12), hairMat);
fringe.position.set(0, 2.1, 0.24);
boyGroup.add(fringe);

// Eyes
const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
leftEye.position.set(-0.1, 2.06, 0.25);
boyGroup.add(leftEye);
const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
rightEye.position.set(0.1, 2.06, 0.25);
boyGroup.add(rightEye);

// Smile
const smileMat = new THREE.MeshStandardMaterial({ color: 0xCC6666, roughness: 0.5 });
const smile = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.03), smileMat);
smile.position.set(0, 1.95, 0.27);
boyGroup.add(smile);

// ── BODY (T-SHIRT) ──
const torso = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.25), tshirtMat);
torso.position.y = 1.45;
torso.castShadow = true;
boyGroup.add(torso);

// T-shirt collar
const collar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.27), tshirtMat);
collar.position.y = 1.78;
boyGroup.add(collar);

// White stripe across t-shirt
const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.26), tshirtStripeMat);
stripe.position.set(0, 1.45, 0);
boyGroup.add(stripe);

// ── ARMS (pivoted at shoulder) ──
const leftArmPivot = new THREE.Group();
leftArmPivot.position.set(-0.3, 1.7, 0);
boyGroup.add(leftArmPivot);

// Upper arm
const leftUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.12), tshirtMat);
leftUpperArm.position.set(0, -0.18, 0);
leftUpperArm.castShadow = true;
leftArmPivot.add(leftUpperArm);

// Lower arm (skin)
const leftLowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.3, 0.10), skinMat);
leftLowerArm.position.set(0, -0.48, 0);
leftArmPivot.add(leftLowerArm);

// Hand
const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
leftHand.position.set(0, -0.65, 0);
leftArmPivot.add(leftHand);

const rightArmPivot = new THREE.Group();
rightArmPivot.position.set(0.3, 1.7, 0);
boyGroup.add(rightArmPivot);

const rightUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.12), tshirtMat);
rightUpperArm.position.set(0, -0.18, 0);
rightUpperArm.castShadow = true;
rightArmPivot.add(rightUpperArm);

const rightLowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.3, 0.10), skinMat);
rightLowerArm.position.set(0, -0.48, 0);
rightArmPivot.add(rightLowerArm);

const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
rightHand.position.set(0, -0.65, 0);
rightArmPivot.add(rightHand);

// ── LEGS (pivoted at hip) ──
const leftLegPivot = new THREE.Group();
leftLegPivot.position.set(-0.12, 1.15, 0);
boyGroup.add(leftLegPivot);

// Upper leg (pants)
const leftUpperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.4, 0.14), pantsMat);
leftUpperLeg.position.set(0, -0.2, 0);
leftUpperLeg.castShadow = true;
leftLegPivot.add(leftUpperLeg);

// Lower leg (pants)
const leftLowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.35, 0.13), pantsMat);
leftLowerLeg.position.set(0, -0.57, 0);
leftLegPivot.add(leftLowerLeg);

// Shoe
const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.22), shoeMat);
leftShoe.position.set(0, -0.79, 0.03);
leftLegPivot.add(leftShoe);
// Shoe sole
const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.23), shoeSoleMat);
leftSole.position.set(0, -0.85, 0.03);
leftLegPivot.add(leftSole);

const rightLegPivot = new THREE.Group();
rightLegPivot.position.set(0.12, 1.15, 0);
boyGroup.add(rightLegPivot);

const rightUpperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.4, 0.14), pantsMat);
rightUpperLeg.position.set(0, -0.2, 0);
rightUpperLeg.castShadow = true;
rightLegPivot.add(rightUpperLeg);

const rightLowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.35, 0.13), pantsMat);
rightLowerLeg.position.set(0, -0.57, 0);
rightLegPivot.add(rightLowerLeg);

const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.22), shoeMat);
rightShoe.position.set(0, -0.79, 0.03);
rightLegPivot.add(rightShoe);

const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.23), shoeSoleMat);
rightSole.position.set(0, -0.85, 0.03);
rightLegPivot.add(rightSole);

// ── PLACE BOY ON ROAD ──
boyGroup.position.set(0, 0.15, 13);  // Road is at z=13
boyGroup.scale.setScalar(1.2);        // Slightly bigger for visibility
scene.add(boyGroup);

// ── CONTROLS & STATE ──
const boyState = {
    moving: false,
    direction: 0,    // -1 left, 0 stop, 1 right
    speed: 8,
    walkPhase: 0,
    keys: { up: false, down: false, left: false, right: false }
};

// Key listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { boyState.keys.up = true; e.preventDefault(); }
    if (e.key === 'ArrowDown') { boyState.keys.down = true; e.preventDefault(); }
    if (e.key === 'ArrowLeft') { boyState.keys.left = true; e.preventDefault(); }
    if (e.key === 'ArrowRight') { boyState.keys.right = true; e.preventDefault(); }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') boyState.keys.up = false;
    if (e.key === 'ArrowDown') boyState.keys.down = false;
    if (e.key === 'ArrowLeft') boyState.keys.left = false;
    if (e.key === 'ArrowRight') boyState.keys.right = false;
});

// ── UPDATE FUNCTION (called from main.js animate loop) ──
function updateBoy(delta) {
    let moveX = 0;
    let moveZ = 0;

    if (boyState.keys.left) moveX = -1;
    if (boyState.keys.right) moveX = 1;
    if (boyState.keys.up) moveZ = -1;
    if (boyState.keys.down) moveZ = 1;

    const isMoving = (moveX !== 0 || moveZ !== 0);

    if (isMoving) {
        // Move the boy
        boyGroup.position.x += moveX * boyState.speed * delta;
        boyGroup.position.z += moveZ * boyState.speed * delta;

        // Clamp position to road area
        boyGroup.position.x = Math.max(-40, Math.min(42, boyGroup.position.x));
        boyGroup.position.z = Math.max(9, Math.min(17, boyGroup.position.z));

        // Face movement direction
        const targetAngle = Math.atan2(moveX, -moveZ);
        boyGroup.rotation.y += (targetAngle - boyGroup.rotation.y) * 0.15;

        // Walking animation
        boyState.walkPhase += delta * 10;
        const swing = Math.sin(boyState.walkPhase) * 0.6;

        // Leg swing (opposite legs)
        leftLegPivot.rotation.x = swing;
        rightLegPivot.rotation.x = -swing;

        // Arm swing (opposite to legs)
        leftArmPivot.rotation.x = -swing * 0.7;
        rightArmPivot.rotation.x = swing * 0.7;

        // Slight body bob
        boyGroup.position.y = 0.15 + Math.abs(Math.sin(boyState.walkPhase * 2)) * 0.04;

        // Slight body tilt
        torso.rotation.z = Math.sin(boyState.walkPhase) * 0.03;
    } else {
        // Idle - return to standing pose smoothly
        boyState.walkPhase = 0;

        leftLegPivot.rotation.x *= 0.85;
        rightLegPivot.rotation.x *= 0.85;
        leftArmPivot.rotation.x *= 0.85;
        rightArmPivot.rotation.x *= 0.85;
        torso.rotation.z *= 0.85;

        // Subtle idle breathing
        const breath = Math.sin(Date.now() * 0.003) * 0.01;
        torso.scale.y = 1 + breath;
        boyGroup.position.y = 0.15;
    }
}
