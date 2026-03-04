// ═══════════════════════════════════════════════
//  DEFAULT BOY AVATAR — Register with AvatarManager
// ═══════════════════════════════════════════════
AvatarManager.register('defaultBoy', {
    name: 'Solar Boy',
    speed: 8,
    color: '#2196F3',
    emoji: '🧑',
    buildMesh(group) {
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFCC99, roughness: 0.8 });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.9 });
        const tshirtMat = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.75 });
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0x37474F, roughness: 0.8 });
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0xE53935, roughness: 0.7 });
        const shoeSoleMat = new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.6 });
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3 });
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.75 });

        // HEAD
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), skinMat);
        head.position.y = 2.05; head.castShadow = true; group.add(head);
        const hair = new THREE.Mesh(new THREE.SphereGeometry(0.30, 12, 12), hairMat);
        hair.position.y = 2.15; hair.scale.set(1.02, 0.7, 1.02); group.add(hair);
        const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.06, 0.12), hairMat);
        fringe.position.set(0, 2.1, 0.24); group.add(fringe);
        const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
        leftEye.position.set(-0.1, 2.06, 0.25); group.add(leftEye);
        const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
        rightEye.position.set(0.1, 2.06, 0.25); group.add(rightEye);
        const smileMat = new THREE.MeshStandardMaterial({ color: 0xCC6666, roughness: 0.5 });
        const smile = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.03), smileMat);
        smile.position.set(0, 1.95, 0.27); group.add(smile);

        // BODY
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.25), tshirtMat);
        torso.position.y = 1.45; torso.castShadow = true; group.add(torso);
        const collar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.27), tshirtMat);
        collar.position.y = 1.78; group.add(collar);
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.26), stripeMat);
        stripe.position.set(0, 1.45, 0); group.add(stripe);

        // ARMS
        const leftArmPivot = new THREE.Group();
        leftArmPivot.position.set(-0.3, 1.7, 0); group.add(leftArmPivot);
        const lUA = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.12), tshirtMat);
        lUA.position.set(0, -0.18, 0); lUA.castShadow = true; leftArmPivot.add(lUA);
        const lLA = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.3, 0.10), skinMat);
        lLA.position.set(0, -0.48, 0); leftArmPivot.add(lLA);
        const lH = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
        lH.position.set(0, -0.65, 0); leftArmPivot.add(lH);

        const rightArmPivot = new THREE.Group();
        rightArmPivot.position.set(0.3, 1.7, 0); group.add(rightArmPivot);
        const rUA = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.12), tshirtMat);
        rUA.position.set(0, -0.18, 0); rUA.castShadow = true; rightArmPivot.add(rUA);
        const rLA = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.3, 0.10), skinMat);
        rLA.position.set(0, -0.48, 0); rightArmPivot.add(rLA);
        const rH = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
        rH.position.set(0, -0.65, 0); rightArmPivot.add(rH);

        // LEGS
        const leftLegPivot = new THREE.Group();
        leftLegPivot.position.set(-0.12, 1.15, 0); group.add(leftLegPivot);
        const lUL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.4, 0.14), pantsMat);
        lUL.position.set(0, -0.2, 0); lUL.castShadow = true; leftLegPivot.add(lUL);
        const lLL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.35, 0.13), pantsMat);
        lLL.position.set(0, -0.57, 0); leftLegPivot.add(lLL);
        const lS = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.22), shoeMat);
        lS.position.set(0, -0.79, 0.03); leftLegPivot.add(lS);
        const lSl = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.23), shoeSoleMat);
        lSl.position.set(0, -0.85, 0.03); leftLegPivot.add(lSl);

        const rightLegPivot = new THREE.Group();
        rightLegPivot.position.set(0.12, 1.15, 0); group.add(rightLegPivot);
        const rUL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.4, 0.14), pantsMat);
        rUL.position.set(0, -0.2, 0); rUL.castShadow = true; rightLegPivot.add(rUL);
        const rLL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.35, 0.13), pantsMat);
        rLL.position.set(0, -0.57, 0); rightLegPivot.add(rLL);
        const rS = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.22), shoeMat);
        rS.position.set(0, -0.79, 0.03); rightLegPivot.add(rS);
        const rSl = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.23), shoeSoleMat);
        rSl.position.set(0, -0.85, 0.03); rightLegPivot.add(rSl);

        return { leftArm: leftArmPivot, rightArm: rightArmPivot, leftLeg: leftLegPivot, rightLeg: rightLegPivot, torso };
    }
});

// ═══════════════════════════════════════════════
//  BOY GROUP + STATE
// ═══════════════════════════════════════════════
const boyGroup = new THREE.Group();
boyGroup.position.set(0, 0.15, 13);
boyGroup.scale.setScalar(1.2);
scene.add(boyGroup);

// boyState MUST be defined before AvatarManager.load() since load() sets boyState.speed
const boyState = {
    moving: false, speed: 8, walkPhase: 0,
    keys: { up: false, down: false, left: false, right: false },
    mode: 'outdoor', insideHouse: null, nearEntry: null, cameraFollow: true
};

// Load default avatar
AvatarManager.load('defaultBoy');

// ═══════════════════════════════════════════════
//  GREEN ENTRY CIRCLES
// ═══════════════════════════════════════════════
const entryCircleMat = new THREE.MeshStandardMaterial({
    color: 0x00ff44, emissive: 0x00cc33, emissiveIntensity: 0.6,
    transparent: true, opacity: 0.7, roughness: 0.4, metalness: 0.2
});
const entryGlowMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88, emissive: 0x00ff66, emissiveIntensity: 0.4,
    transparent: true, opacity: 0.3, roughness: 0.5
});
const arrowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });

// 1BHK entry circle
const entry1BHK = new THREE.Group();
const entry1Circle = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), entryCircleMat.clone());
entry1Circle.rotation.x = -Math.PI / 2; entry1Circle.position.set(0, 0.06, 0); entry1BHK.add(entry1Circle);
const entry1Glow = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.8, 24), entryGlowMat.clone());
entry1Glow.rotation.x = -Math.PI / 2; entry1Glow.position.set(0, 0.05, 0); entry1BHK.add(entry1Glow);
const arrow1 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 4), arrowMat);
arrow1.position.set(0, 1.5, 0); arrow1.rotation.x = Math.PI; entry1BHK.add(arrow1);
entry1BHK.position.set(-14, 0, 9.5); scene.add(entry1BHK);

// 2BHK entry circle
const entry2BHK = new THREE.Group();
const entry2Circle = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), entryCircleMat.clone());
entry2Circle.rotation.x = -Math.PI / 2; entry2Circle.position.set(0, 0.06, 0); entry2BHK.add(entry2Circle);
const entry2Glow = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.8, 24), entryGlowMat.clone());
entry2Glow.rotation.x = -Math.PI / 2; entry2Glow.position.set(0, 0.05, 0); entry2BHK.add(entry2Glow);
const arrow2 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 4), arrowMat);
arrow2.position.set(0, 1.5, 0); arrow2.rotation.x = Math.PI; entry2BHK.add(arrow2);
entry2BHK.position.set(16, 0, 10); scene.add(entry2BHK);

// ═══════════════════════════════════════════════
//  CONTROLS & NAVIGATION STATE
// ═══════════════════════════════════════════════
const entryPositions = {
    '1bhk': new THREE.Vector3(-14, 0, 9.5),
    '2bhk': new THREE.Vector3(16, 0, 10)
};
const indoorSpawn = {
    '1bhk': { pos: new THREE.Vector3(-14, 0.15, 5), rot: Math.PI },
    '2bhk': { pos: new THREE.Vector3(16, 0.15, 5), rot: Math.PI }
};
const indoorBounds = {
    '1bhk': { xMin: -24, xMax: -4, zMin: -7.5, zMax: 7 },
    '2bhk': { xMin: 6, xMax: 26, zMin: -8, zMax: 7.5 }
};
const indoorCameraOffset = new THREE.Vector3(0, 8, 10);

// KEY LISTENERS
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { boyState.keys.up = true; e.preventDefault(); }
    if (e.key === 'ArrowDown') { boyState.keys.down = true; e.preventDefault(); }
    if (e.key === 'ArrowLeft') { boyState.keys.left = true; e.preventDefault(); }
    if (e.key === 'ArrowRight') { boyState.keys.right = true; e.preventDefault(); }
    if (e.key === 'Enter' && boyState.mode === 'outdoor' && boyState.nearEntry) {
        enterHouse(boyState.nearEntry); e.preventDefault();
    }
    if (e.key === 'Escape' && boyState.mode === 'indoor') {
        exitHouse(); e.preventDefault();
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') boyState.keys.up = false;
    if (e.key === 'ArrowDown') boyState.keys.down = false;
    if (e.key === 'ArrowLeft') boyState.keys.left = false;
    if (e.key === 'ArrowRight') boyState.keys.right = false;
});

// ═══════════════════════════════════════════════
//  ENTER / EXIT HOUSE
// ═══════════════════════════════════════════════
function enterHouse(houseId) {
    boyState.mode = 'indoor';
    boyState.insideHouse = houseId;
    boyState.nearEntry = null;
    const spawn = indoorSpawn[houseId];
    boyGroup.position.copy(spawn.pos);
    boyGroup.rotation.y = spawn.rot;
    controls.enabled = false;
    if (houseId === '1bhk') { is2BHK = false; } else { is2BHK = true; }
    buildAppliancePanel(); buildRoomNavPanel(); recalcWattage();
    entry1BHK.visible = false; entry2BHK.visible = false;
    const prompt = document.getElementById('enter-prompt');
    prompt.textContent = '🏠 Inside ' + (houseId === '1bhk' ? '1BHK' : '2BHK') + ' House — Press ESC to exit';
    prompt.classList.add('visible');
    document.getElementById('back-btn').classList.add('visible');
}

function exitHouse() {
    const houseId = boyState.insideHouse;
    boyState.mode = 'outdoor'; boyState.insideHouse = null;
    const entryPos = entryPositions[houseId];
    boyGroup.position.set(entryPos.x, 0.15, entryPos.z + 2);
    boyGroup.rotation.y = 0;
    controls.enabled = true;
    camera.position.set(0, 20, 40);
    controls.target.set(0, 4, 0); controls.update();
    entry1BHK.visible = true; entry2BHK.visible = true;
    document.getElementById('enter-prompt').classList.remove('visible');
    document.getElementById('back-btn').classList.remove('visible');
}

// ═══════════════════════════════════════════════
//  UPDATE FUNCTION — uses AvatarManager pivots
// ═══════════════════════════════════════════════
function updateBoy(delta) {
    const pivots = AvatarManager.getPivots();
    if (!pivots) return;

    let moveX = 0, moveZ = 0;
    if (boyState.keys.left) moveX = -1;
    if (boyState.keys.right) moveX = 1;
    if (boyState.keys.up) moveZ = -1;
    if (boyState.keys.down) moveZ = 1;

    const isMoving = (moveX !== 0 || moveZ !== 0);

    if (isMoving) {
        boyGroup.position.x += moveX * boyState.speed * delta;
        boyGroup.position.z += moveZ * boyState.speed * delta;
        if (boyState.mode === 'outdoor') {
            boyGroup.position.x = Math.max(-40, Math.min(42, boyGroup.position.x));
            boyGroup.position.z = Math.max(9, Math.min(17, boyGroup.position.z));
        } else if (boyState.mode === 'indoor') {
            const bounds = indoorBounds[boyState.insideHouse];
            boyGroup.position.x = Math.max(bounds.xMin, Math.min(bounds.xMax, boyGroup.position.x));
            boyGroup.position.z = Math.max(bounds.zMin, Math.min(bounds.zMax, boyGroup.position.z));
        }
        const targetAngle = Math.atan2(moveX, -moveZ);
        boyGroup.rotation.y += (targetAngle - boyGroup.rotation.y) * 0.15;

        boyState.walkPhase += delta * 10;
        const swing = Math.sin(boyState.walkPhase) * 0.6;
        pivots.leftLeg.rotation.x = swing;
        pivots.rightLeg.rotation.x = -swing;
        pivots.leftArm.rotation.x = -swing * 0.7;
        pivots.rightArm.rotation.x = swing * 0.7;
        boyGroup.position.y = 0.15 + Math.abs(Math.sin(boyState.walkPhase * 2)) * 0.04;
        pivots.torso.rotation.z = Math.sin(boyState.walkPhase) * 0.03;
    } else {
        boyState.walkPhase = 0;
        pivots.leftLeg.rotation.x *= 0.85;
        pivots.rightLeg.rotation.x *= 0.85;
        pivots.leftArm.rotation.x *= 0.85;
        pivots.rightArm.rotation.x *= 0.85;
        pivots.torso.rotation.z *= 0.85;
        const breath = Math.sin(Date.now() * 0.003) * 0.01;
        pivots.torso.scale.y = 1 + breath;
        boyGroup.position.y = 0.15;
    }

    // Proximity check for entry circles (outdoor only)
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

    // Camera follow (indoor mode)
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
//  CHARACTER SELECTOR UI — Build dynamically
// ═══════════════════════════════════════════════
function buildCharacterSelector() {
    const container = document.getElementById('character-selector');
    if (!container) return;
    const avatars = AvatarManager.getAll();
    const currentId = AvatarManager.getCurrent();
    let html = '<div class="char-selector-title">🎭 Characters</div><div class="char-selector-scroll">';
    avatars.forEach(av => {
        const sel = av.id === currentId ? ' selected' : '';
        html += '<div class="avatar-card' + sel + '" data-avatar-id="' + av.id + '" onclick="switchAvatar(\'' + av.id + '\')">';
        html += '<div class="avatar-icon" style="background:' + av.color + '">' + av.emoji + '</div>';
        html += '<div class="avatar-name">' + av.name + '</div>';
        html += '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
}

function switchAvatar(id) {
    AvatarManager.load(id);
    // Add switch animation feedback
    const cards = document.querySelectorAll('.avatar-card');
    cards.forEach(card => {
        card.classList.toggle('selected', card.dataset.avatarId === id);
        if (card.dataset.avatarId === id) {
            card.classList.add('switching');
            setTimeout(() => card.classList.remove('switching'), 400);
        }
    });
}

function toggleCharacterSelector() {
    const panel = document.getElementById('character-selector');
    panel.classList.toggle('visible');
}

// Build on load
setTimeout(buildCharacterSelector, 100);
