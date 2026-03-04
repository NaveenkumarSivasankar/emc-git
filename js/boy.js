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
//  BOY STATE & CONTROLS
// ═══════════════════════════════════════════════
const boyState = {
    moving: false,
    speed: 8,
    walkPhase: 0,
    keys: { up: false, down: false, left: false, right: false },
    // Navigation state
    mode: 'outdoor',       // 'outdoor' | 'indoor'
    insideHouse: null,     // '1bhk' | '2bhk'
    nearEntry: null,       // '1bhk' | '2bhk' | null
    cameraFollow: true     // camera follows boy when indoor
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
document.addEventListener('keydown', (e) => {
    let moved = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { boyState.keys.up = true; moved = true; }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { boyState.keys.down = true; moved = true; }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { boyState.keys.left = true; moved = true; }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { boyState.keys.right = true; moved = true; }

    if (moved) {
        if (boyState.mode === 'indoor') boyState.cameraFollow = true;
        if (e.key.startsWith('Arrow')) e.preventDefault();
    }

    // ENTER — enter house if near entry circle
    if (e.key === 'Enter' && boyState.mode === 'outdoor' && boyState.nearEntry) {
        enterHouse(boyState.nearEntry);
        e.preventDefault();
    }

    // ESCAPE — exit house back to road
    if (e.key === 'Escape' && boyState.mode === 'indoor') {
        exitHouse();
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') boyState.keys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') boyState.keys.down = false;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') boyState.keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') boyState.keys.right = false;
});

// ═══════════════════════════════════════════════
//  ENTER / EXIT HOUSE
// ═══════════════════════════════════════════════
function enterHouse(houseId) {
    boyState.mode = 'indoor';
    boyState.insideHouse = houseId;
    boyState.nearEntry = null;
    boyState.cameraFollow = true; // reset camera follow

    // Move boy inside
    const spawn = indoorSpawn[houseId];
    boyGroup.position.copy(spawn.pos);
    boyGroup.rotation.y = spawn.rot;

    // We now let OrbitControls remain enabled so the user can freely look around!
    // controls.enabled = false; 

    // Focus on the right house
    if (houseId === '1bhk') {
        is2BHK = false;
    } else {
        is2BHK = true;
    }
    buildAppliancePanel();
    buildRoomNavPanel();
    recalcWattage();

    // Hide entry circles
    entry1BHK.visible = false;
    entry2BHK.visible = false;

    // Show exit hint
    const prompt = document.getElementById('enter-prompt');
    prompt.textContent = '🏠 Inside ' + (houseId === '1bhk' ? '1BHK' : '2BHK') + ' House — Press ESC to exit';
    prompt.classList.add('visible');

    // Show back button
    document.getElementById('back-btn').classList.add('visible');
}

function exitHouse() {
    const houseId = boyState.insideHouse;
    boyState.mode = 'outdoor';
    boyState.insideHouse = null;

    // Move boy back to entry circle position
    const entryPos = entryPositions[houseId];
    boyGroup.position.set(entryPos.x, 0.15, entryPos.z + 2);
    boyGroup.rotation.y = 0;

    // Re-enable orbit controls
    controls.enabled = true;

    // Reset camera to overview
    camera.position.set(0, 20, 40);
    controls.target.set(0, 4, 0);
    controls.update();

    // Show entry circles again
    entry1BHK.visible = true;
    entry2BHK.visible = true;

    // Hide prompt
    document.getElementById('enter-prompt').classList.remove('visible');
    document.getElementById('back-btn').classList.remove('visible');
}

// ═══════════════════════════════════════════════
//  UPDATE FUNCTION (called from animate loop)
// ═══════════════════════════════════════════════
function updateBoy(delta) {
    let moveX = 0;
    let moveZ = 0;

    if (boyState.keys.left) moveX = -1;
    if (boyState.keys.right) moveX = 1;
    if (boyState.keys.up) moveZ = -1;
    if (boyState.keys.down) moveZ = 1;

    const isMoving = (moveX !== 0 || moveZ !== 0);

    if (isMoving) {
        boyGroup.position.x += moveX * boyState.speed * delta;
        boyGroup.position.z += moveZ * boyState.speed * delta;

        // Clamp based on mode
        if (boyState.mode === 'outdoor') {
            boyGroup.position.x = Math.max(-40, Math.min(42, boyGroup.position.x));
            boyGroup.position.z = Math.max(9, Math.min(17, boyGroup.position.z));
        } else if (boyState.mode === 'indoor') {
            const bounds = indoorBounds[boyState.insideHouse];
            boyGroup.position.x = Math.max(bounds.xMin, Math.min(bounds.xMax, boyGroup.position.x));
            boyGroup.position.z = Math.max(bounds.zMin, Math.min(bounds.zMax, boyGroup.position.z));
        }

        // Face movement direction
        const targetAngle = Math.atan2(moveX, -moveZ);
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

    // ── Camera follow (indoor mode) ──
    if (boyState.mode === 'indoor' && boyState.cameraFollow) {
        const targetCamPos = new THREE.Vector3(
            boyGroup.position.x,
            boyGroup.position.y + indoorCameraOffset.y,
            boyGroup.position.z + indoorCameraOffset.z
        );
        camera.position.lerp(targetCamPos, 0.05);
        const lookAt = new THREE.Vector3(boyGroup.position.x, boyGroup.position.y + 2, boyGroup.position.z);
        controls.target.lerp(lookAt, 0.05);
        controls.update();
    }
}

// ═══════════════════════════════════════════════
//  ENTRY CIRCLE PULSE ANIMATION
// ═══════════════════════════════════════════════
function updateEntryCircles(elapsed) {
    if (boyState.mode === 'indoor') return;

    const pulse = 0.5 + Math.sin(elapsed * 3) * 0.3;
    const glowPulse = 0.2 + Math.sin(elapsed * 2) * 0.15;
    const arrowBob = Math.sin(elapsed * 4) * 0.3;

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
