// ═══════════════════════════════════════════════
//  INJECT CSS — All UI styles
// ═══════════════════════════════════════════════
(function injectCSS() {
    const s = document.createElement('style');
    s.textContent = `
    #camera-mode-modal{position:fixed;inset:0;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;z-index:2000}
    .cam-modal-box{background:linear-gradient(160deg,#1a2a1a,#2a4a2a);border:3px solid #4CAF50;border-radius:20px;padding:30px;text-align:center;max-width:380px;box-shadow:0 0 40px rgba(76,175,80,0.3)}
    .cam-modal-title{font-size:1.5rem;font-weight:bold;color:#FFE066;font-family:Georgia,serif;margin-bottom:6px}
    .cam-modal-subtitle{color:#A8D5A2;font-size:0.9rem;margin-bottom:20px}
    .cam-modal-buttons{display:flex;gap:16px}
    .cam-btn{flex:1;background:linear-gradient(180deg,#2E7D32,#1B5E20);border:2px solid #66BB6A;border-radius:12px;padding:16px 10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;transition:all 0.15s;box-shadow:0 4px 0 #0a3d0a;color:#fff;font-family:Georgia,serif}
    .cam-btn:hover{background:linear-gradient(180deg,#388E3C,#2E7D32);transform:translateY(-2px)}
    .cam-btn:active{transform:translateY(2px);box-shadow:0 1px 0 #0a3d0a}
    .cam-btn-icon{font-size:2rem}.cam-btn-label{color:#FFE066;font-weight:bold;font-size:0.9rem}
    .cam-btn-desc{color:#A8D5A2;font-size:0.72rem}
    #door-hint{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:10px 22px;border-radius:22px;display:flex;align-items:center;gap:10px;font-family:Georgia,serif;animation:hintPulse 1.4s infinite;z-index:900}
    #door-hint.hidden{display:none}
    .hint-key{background:#FFE066;color:#222;padding:2px 10px;border-radius:5px;font-weight:bold;font-size:0.8rem;border-bottom:3px solid #888}
    @keyframes hintPulse{0%,100%{opacity:1;transform:translateX(-50%) scale(1)}50%{opacity:0.7;transform:translateX(-50%) scale(0.97)}}
    `;
    document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════
//  STATE MACHINE
// ═══════════════════════════════════════════════
const STATE = { OUTSIDE: 0, TRANSITIONING: 1, INSIDE: 2 };
window.STATE = STATE;
let gameState = STATE.OUTSIDE;
window.gameState = gameState;
let currentHouseId = null;
window.cameraMode = 'firstperson';

// ═══════════════════════════════════════════════
//  BOY INSTANTIATION
// ═══════════════════════════════════════════════
const boy = new Boy(scene);
boy.group.position.set(0, 0.15, 13);
boy.groundY = 0.15;
const boyGroup = boy.group;

// Backward-compat state object (used by interiors.js)
const boyState = {
    moving: false, speed: 8, mode: 'outdoor',
    insideHouse: null, nearEntry: null, nearExit: false,
    cameraFollow: true, followTarget: new THREE.Vector3(),
    currentRoom: null, lastRoom: null,
    keys: { up: false, down: false, left: false, right: false }
};

// ═══════════════════════════════════════════════
//  ENTRY CIRCLES
// ═══════════════════════════════════════════════
const entryCircleMat = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00cc33, emissiveIntensity: 0.6, transparent: true, opacity: 0.7, roughness: 0.4 });
const entryGlowMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff66, emissiveIntensity: 0.4, transparent: true, opacity: 0.3 });
const arrowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });

function makeEntryCircle(x, z) {
    const g = new THREE.Group();
    const c = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), entryCircleMat.clone());
    c.rotation.x = -Math.PI / 2; c.position.y = 0.06; g.add(c);
    const gl = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.8, 24), entryGlowMat.clone());
    gl.rotation.x = -Math.PI / 2; gl.position.y = 0.05; g.add(gl);
    const ar = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 4), arrowMat);
    ar.position.y = 1.5; ar.rotation.x = Math.PI; g.add(ar);
    g.position.set(x, 0, z); scene.add(g);
    return { group: g, circle: c, glow: gl, arrow: ar };
}
const entry1 = makeEntryCircle(-22, 12);
const entry2 = makeEntryCircle(24, 13);

// ═══════════════════════════════════════════════
//  DOOR ZONES & ROOM ZONES
// ═══════════════════════════════════════════════
const DOOR_ZONES = {
    '1bhk': new THREE.Sphere(new THREE.Vector3(-22, 0, 12), 2.5),
    '2bhk': new THREE.Sphere(new THREE.Vector3(24, 0, 13), 2.5)
};
let nearDoor = null;

const entryPositions = { '1bhk': new THREE.Vector3(-22, 0, 12), '2bhk': new THREE.Vector3(24, 0, 13) };
const indoorSpawn = { '1bhk': { pos: new THREE.Vector3(-22, 0.15, 8), rot: Math.PI }, '2bhk': { pos: new THREE.Vector3(24, 0.15, 9), rot: Math.PI } };
const INTERIOR_BOUNDS = { '1bhk': { minX: -30, maxX: -14, minZ: -10, maxZ: 7 }, '2bhk': { minX: 14, maxX: 34, minZ: -12, maxZ: 7 } };

const ROOM_ZONES = {
    '1bhk': [
        { id: 'hall', center: new THREE.Vector3(-22, 0, 4), radius: 3.5 },
        { id: 'bedroom', center: new THREE.Vector3(-19, 0, -1), radius: 3.0 },
        { id: 'kitchen', center: new THREE.Vector3(-25, 0, -5), radius: 3.0 },
        { id: 'bathroom', center: new THREE.Vector3(-19, 0, -8), radius: 2.5 },
    ],
    '2bhk': [
        { id: 'hall', center: new THREE.Vector3(24, 0, 5), radius: 4.0 },
        { id: 'bedroom1', center: new THREE.Vector3(20, 0, 0), radius: 3.5 },
        { id: 'bedroom2', center: new THREE.Vector3(28, 0, 0), radius: 3.5 },
        { id: 'kitchen', center: new THREE.Vector3(20, 0, -6), radius: 3.0 },
        { id: 'bathroom', center: new THREE.Vector3(28, 0, -6), radius: 2.5 },
    ]
};
let lastRoomId = null;

// Room regions (legacy compat for interiors.js)
const roomRegions = [
    { xMin: -16.5, xMax: -4, zMin: -1.5, zMax: 7.5, room: '🏠 Hall', house: '1bhk' },
    { xMin: -24, xMax: -16.5, zMin: -1.5, zMax: 7.5, room: '🍳 Kitchen', house: '1bhk' },
    { xMin: -24, xMax: -4, zMin: -7.5, zMax: -1.5, room: '🛏️ Bedroom', house: '1bhk' },
    { xMin: 11, xMax: 26, zMin: -2.5, zMax: 8, room: '🏠 Hall', house: '2bhk' },
    { xMin: 6, xMax: 16, zMin: -8, zMax: -2.5, room: '🛏️ Bedroom 1', house: '2bhk' },
    { xMin: 16, xMax: 26, zMin: -8, zMax: -2.5, room: '🛏️ Bedroom 2', house: '2bhk' },
    { xMin: 6, xMax: 11, zMin: -2.5, zMax: 4, room: '🍳 Kitchen', house: '2bhk' },
    { xMin: 6, xMax: 11, zMin: 4, zMax: 8, room: '🚿 Bathroom', house: '2bhk' },
];

// ═══════════════════════════════════════════════
//  CAMERA STATE — First Person
// ═══════════════════════════════════════════════
const EYE_HEIGHT = 1.45;
let yaw = 0, pitch = 0, pointerLocked = false;

document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === renderer.domElement;
});
document.addEventListener('mousemove', (e) => {
    if (!pointerLocked || gameState !== STATE.INSIDE) return;
    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
    pitch = Math.max(-0.4, Math.min(0.6, pitch));
});

// ═══════════════════════════════════════════════
//  KEY LISTENERS
// ═══════════════════════════════════════════════
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if ((e.code === 'Enter' || e.code === 'KeyE') && nearDoor && gameState === STATE.OUTSIDE) {
        enterHouse(nearDoor); e.preventDefault();
    }
    if (e.code === 'Escape' && gameState === STATE.INSIDE) {
        exitHouse(); e.preventDefault();
    }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
}, { passive: false });
window.addEventListener('keyup', (e) => { keys[e.code] = false; }, { passive: false });
if (typeof controls !== 'undefined') controls.enableKeys = false;

// ═══════════════════════════════════════════════
//  UTILITY FUNCTIONS
// ═══════════════════════════════════════════════
function fadeOverlay(targetOpacity, duration) {
    return new Promise(resolve => {
        const o = document.getElementById('fade-overlay') || document.getElementById('transition-overlay');
        if (!o) { resolve(); return; }
        o.style.transition = `opacity ${duration}ms ease`;
        o.style.opacity = targetOpacity;
        setTimeout(resolve, duration);
    });
}

function clampToBounds(pos, houseId) {
    const b = INTERIOR_BOUNDS[houseId]; if (!b) return pos;
    pos.x = Math.max(b.minX, Math.min(b.maxX, pos.x));
    pos.z = Math.max(b.minZ, Math.min(b.maxZ, pos.z));
    return pos;
}

// ═══════════════════════════════════════════════
//  CAMERA MODE MODAL
// ═══════════════════════════════════════════════
function showCameraModeModal() {
    return new Promise(resolve => {
        const modal = document.createElement('div');
        modal.id = 'camera-mode-modal';
        modal.innerHTML = `<div class="cam-modal-box">
            <div class="cam-modal-title">👁️ Choose Your View</div>
            <div class="cam-modal-subtitle">How do you want to explore?</div>
            <div class="cam-modal-buttons">
                <button class="cam-btn" data-mode="firstperson">
                    <span class="cam-btn-icon">👦</span>
                    <span class="cam-btn-label">Boy's Eyes</span>
                    <span class="cam-btn-desc">See what the boy sees</span>
                </button>
                <button class="cam-btn" data-mode="thirdperson">
                    <span class="cam-btn-icon">🎮</span>
                    <span class="cam-btn-label">Watch the Boy</span>
                    <span class="cam-btn-desc">See the boy from behind</span>
                </button>
            </div>
        </div>`;
        document.body.appendChild(modal);
        modal.querySelectorAll('.cam-btn').forEach(btn => {
            btn.addEventListener('click', () => { modal.remove(); resolve(btn.dataset.mode); });
        });
    });
}

// ═══════════════════════════════════════════════
//  ENTER / EXIT HOUSE (Bug #1 fix: setTimeout chain + safety fallback)
// ═══════════════════════════════════════════════
function enterHouse(houseId) {
    if (gameState === STATE.TRANSITIONING) return;
    console.log('[ENTER] Starting house entry:', houseId);
    gameState = STATE.TRANSITIONING; window.gameState = gameState;
    boyState.mode = 'transitioning'; boyState.insideHouse = houseId;
    nearDoor = null;
    if (typeof showDoorHint === 'function') showDoorHint(false, null);
    if (typeof openMainDoor === 'function') openMainDoor(houseId);

    // Step 1: Fade out
    console.log('[FADE] Overlay opacity set to 1');
    const overlay = document.getElementById('fade-overlay');
    if (overlay) {
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    }

    setTimeout(() => {
        // Step 2: Camera mode selection during black screen
        showCameraModeModal().then(camMode => {
            window.cameraMode = camMode;

            // Clear exterior collisions
            if (typeof collisionSystem !== 'undefined') { collisionSystem.walls = []; collisionSystem.doors = []; }

            // Teleport boy
            const spawn = indoorSpawn[houseId];
            boyGroup.position.copy(spawn.pos); boyGroup.rotation.y = spawn.rot;
            yaw = spawn.rot; pitch = 0;
            boy.groundY = spawn.pos.y;

            // Visibility — show correct interior, hide rest
            environmentGroup.visible = false;
            if (houseId === '1bhk') {
                bhk2Group.visible = false;
                houseGroup.visible = true;
            } else {
                houseGroup.visible = false;
                bhk2Group.visible = true;
            }
            console.log('[INTERIOR] Showing interior for:', houseId);

            // Panels
            is2BHK = (houseId === '2bhk');
            if (typeof buildAppliancePanel === 'function') buildAppliancePanel();
            if (typeof buildRoomNavPanel === 'function') buildRoomNavPanel();
            if (typeof recalcWattage === 'function') recalcWattage();

            // Interior collision
            if (typeof collisionSystem !== 'undefined' && typeof collisionSystem.setupInterior === 'function')
                collisionSystem.setupInterior(houseId);

            currentHouseId = houseId; lastRoomId = null;
            boyState.currentRoom = null;

            // Fix camera clipping
            camera.near = 0.01; camera.far = 1000;
            camera.updateProjectionMatrix();

            // Emergency ambient light for interior
            let eLight = scene.getObjectByName('emergencyLight');
            if (!eLight) {
                eLight = new THREE.AmbientLight(0xffffff, 1.5);
                eLight.name = 'emergencyLight';
                scene.add(eLight);
            } else {
                eLight.intensity = 1.5;
            }

            // Camera mode setup
            if (camMode === 'firstperson') {
                boy.setFirstPerson(true);
                if (typeof controls !== 'undefined') controls.enabled = false;
                renderer.domElement.requestPointerLock();
            } else {
                boy.setFirstPerson(false);
                if (typeof controls !== 'undefined') controls.enabled = false;
            }

            camera.position.set(boyGroup.position.x, boyGroup.position.y + EYE_HEIGHT, boyGroup.position.z);
            camera.lookAt(boyGroup.position.x, boyGroup.position.y + 1, boyGroup.position.z - 2);
            console.log('[RENDER] camera pos:', camera.position);

            const backBtn = document.getElementById('back-btn');
            if (backBtn) backBtn.classList.add('visible');

            if (typeof showViewModeBadge === 'function') showViewModeBadge(true);
            if (typeof updateViewModeBadge === 'function') updateViewModeBadge(camMode);

            // Step 3: Fade in
            console.log('[FADE] Overlay opacity set to 0');
            if (overlay) {
                overlay.style.transition = 'opacity 0.5s ease';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }

            setTimeout(() => {
                // Step 4: Enable movement
                gameState = STATE.INSIDE; window.gameState = gameState;
                boyState.mode = 'indoor';
                console.log('[INSIDE] gameState = INSIDE, movement enabled');
                if (typeof showToast === 'function') showToast('🏠 You are inside! Walk to explore rooms.');
                console.log('[SUCCESS] Inside house:', houseId);
            }, 600);

            setTimeout(() => { if (typeof closeMainDoor === 'function') closeMainDoor(houseId); }, 1500);
        });
    }, 600);

    // Safety fallback — force overlay off after 5 seconds no matter what
    setTimeout(() => {
        const o = document.getElementById('fade-overlay');
        if (o && parseFloat(o.style.opacity) > 0.5) {
            console.warn('[SAFETY] Forcing fade overlay to 0');
            o.style.opacity = '0';
            o.style.pointerEvents = 'none';
        }
    }, 5000);
}

async function exitHouse() {
    if (gameState === STATE.TRANSITIONING) return;
    console.log('[STATE] → EXITING house');
    const houseId = currentHouseId;
    if (typeof openMainDoor === 'function') openMainDoor(houseId);

    gameState = STATE.TRANSITIONING; window.gameState = gameState;
    boyState.mode = 'transitioning';
    if (document.pointerLockElement) document.exitPointerLock();
    boy.setFirstPerson(false);
    if (typeof showViewModeBadge === 'function') showViewModeBadge(false);

    await fadeOverlay(1, 400);
    const ep = entryPositions[houseId];
    boyGroup.position.set(ep.x, 0.15, ep.z + 0.5); boyGroup.rotation.y = 0;
    boy.groundY = 0.15; yaw = 0; pitch = 0;

    houseGroup.visible = true; bhk2Group.visible = true; environmentGroup.visible = true;
    if (typeof collisionSystem !== 'undefined' && typeof collisionSystem.setupExterior === 'function')
        collisionSystem.setupExterior();
    if (typeof controls !== 'undefined') {
        controls.enabled = true;
        camera.position.set(boyGroup.position.x, 6, boyGroup.position.z + 10);
        controls.target.set(boyGroup.position.x, 1.5, boyGroup.position.z);
        controls.update();
    }
    currentHouseId = null; lastRoomId = null;
    boyState.currentRoom = null; boyState.insideHouse = null;
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.classList.remove('visible');
    if (typeof closeRoomPopup === 'function') closeRoomPopup();

    await fadeOverlay(0, 400);
    gameState = STATE.OUTSIDE; window.gameState = gameState;
    boyState.mode = 'outdoor';
    console.log('[STATE] → OUTSIDE — movement enabled');
    setTimeout(() => { if (typeof closeMainDoor === 'function') closeMainDoor(houseId); }, 1500);
}

// ═══════════════════════════════════════════════
//  setCameraMode GLOBAL
// ═══════════════════════════════════════════════
window.setCameraMode = function (mode) {
    window.cameraMode = mode;
    if (mode === 'firstperson') {
        boy.setFirstPerson(true);
        renderer.domElement.requestPointerLock();
    } else {
        boy.setFirstPerson(false);
        if (document.pointerLockElement) document.exitPointerLock();
    }
    if (typeof updateViewModeBadge === 'function') updateViewModeBadge(mode);
    if (typeof showToast === 'function')
        showToast(mode === 'firstperson' ? '👁️ First Person — move mouse to look' : '🎮 Third Person — camera follows boy');
};

// ═══════════════════════════════════════════════
//  MOVEMENT (Bug #2 fix: correct camera-relative direction)
// ═══════════════════════════════════════════════
function processMovement(delta) {
    if (gameState === STATE.TRANSITIONING) return;

    const speed = (gameState === STATE.INSIDE) ? 4.0 : 8;
    let mx = 0, mz = 0;

    // Read keys — simple and explicit
    if (keys['KeyW'] || keys['ArrowUp']) mz = -1;
    if (keys['KeyS'] || keys['ArrowDown']) mz = 1;
    if (keys['KeyA'] || keys['ArrowLeft']) mx = -1;
    if (keys['KeyD'] || keys['ArrowRight']) mx = 1;

    if (mx === 0 && mz === 0) {
        boy.isWalking = false;
        return;
    }

    boy.isWalking = true;

    let moveX, moveZ;

    if (gameState === STATE.OUTSIDE && typeof controls !== 'undefined' && controls.enabled) {
        // Third-person outside: camera-relative movement
        const camFwd = new THREE.Vector3();
        camFwd.subVectors(controls.target, camera.position); camFwd.y = 0;
        if (camFwd.lengthSq() > 0.0001) camFwd.normalize(); else camFwd.set(0, 0, -1);
        const camRight = new THREE.Vector3().crossVectors(camFwd, new THREE.Vector3(0, 1, 0)).normalize();
        const cm = new THREE.Vector3();
        if (keys['KeyW'] || keys['ArrowUp']) cm.add(camFwd);
        if (keys['KeyS'] || keys['ArrowDown']) cm.sub(camFwd);
        if (keys['KeyA'] || keys['ArrowLeft']) cm.sub(camRight);
        if (keys['KeyD'] || keys['ArrowRight']) cm.add(camRight);
        if (cm.lengthSq() > 0) cm.normalize();
        moveX = cm.x * speed * delta;
        moveZ = cm.z * speed * delta;
    } else {
        // First-person / inside: yaw-relative movement
        const sinY = Math.sin(yaw);
        const cosY = Math.cos(yaw);

        // Forward direction (W key = move in direction camera faces)
        const fwdX = -sinY;
        const fwdZ = -cosY;

        // Right direction (D key = move right relative to camera)
        const rgtX = cosY;
        const rgtZ = -sinY;

        // Combine
        moveX = (fwdX * mz + rgtX * mx) * speed * delta;
        moveZ = (fwdZ * mz + rgtZ * mx) * speed * delta;
    }

    const newX = boyGroup.position.x + moveX;
    const newZ = boyGroup.position.z + moveZ;
    const newPos = new THREE.Vector3(newX, boyGroup.position.y, newZ);

    // Apply bounds
    if (gameState === STATE.INSIDE && currentHouseId) {
        const b = INTERIOR_BOUNDS[currentHouseId];
        if (b) {
            newPos.x = Math.max(b.minX, Math.min(b.maxX, newPos.x));
            newPos.z = Math.max(b.minZ, Math.min(b.maxZ, newPos.z));
        }
    } else if (gameState === STATE.OUTSIDE) {
        newPos.x = Math.max(-45, Math.min(48, newPos.x));
        newPos.z = Math.max(8, Math.min(18, newPos.z));
    }

    // Collision
    if (gameState === STATE.INSIDE && typeof resolveSliding === 'function') {
        const r = resolveSliding(boyGroup.position.x, boyGroup.position.z, newPos.x, newPos.z);
        boyGroup.position.x = r.x; boyGroup.position.z = r.z;
    } else if (typeof collisionSystem !== 'undefined' && collisionSystem.walls && collisionSystem.walls.length > 0) {
        const res = collisionSystem.resolveCollision(boyGroup, newPos);
        boyGroup.position.copy(res.position);
    } else {
        boyGroup.position.x = newPos.x; boyGroup.position.z = newPos.z;
    }

    // Rotate boy to face movement direction
    const angle = Math.atan2(moveX, moveZ);
    boyGroup.rotation.y = THREE.MathUtils.lerp(boyGroup.rotation.y, angle, 0.12);

    // Third-person camera follow outside
    if (gameState === STATE.OUTSIDE && typeof controls !== 'undefined' && controls.enabled) {
        const dt = new THREE.Vector3(boyGroup.position.x, boyGroup.position.y + 1.5, boyGroup.position.z);
        const pt = controls.target.clone();
        controls.target.lerp(dt, 0.08);
        camera.position.add(controls.target.clone().sub(pt));
        controls.update();
    }
}

// ═══════════════════════════════════════════════
//  CAMERA UPDATE (two modes)
// ═══════════════════════════════════════════════
function updateCamera() {
    if (gameState !== STATE.INSIDE) return;
    if (window.cameraMode === 'firstperson') {
        const eye = boyGroup.position.clone(); eye.y += EYE_HEIGHT;
        const fwd = new THREE.Vector3(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
        camera.position.copy(eye);
        camera.lookAt(eye.clone().add(fwd));
    } else {
        const offset = new THREE.Vector3(Math.sin(yaw) * 4, 2.5, Math.cos(yaw) * 4);
        const targetPos = boyGroup.position.clone().add(offset);
        camera.position.lerp(targetPos, 0.10);
        const lookAt = boyGroup.position.clone(); lookAt.y += 1.0;
        camera.lookAt(lookAt);
    }
}

// ═══════════════════════════════════════════════
//  PROXIMITY CHECKS
// ═══════════════════════════════════════════════
function checkDoorProximity() {
    if (gameState !== STATE.OUTSIDE) return;
    nearDoor = null;
    for (const [id, zone] of Object.entries(DOOR_ZONES)) {
        if (zone.containsPoint(boyGroup.position)) {
            nearDoor = id;
            if (typeof showDoorHint === 'function') showDoorHint(true, id);
            return;
        }
    }
    if (typeof showDoorHint === 'function') showDoorHint(false, null);
}

function checkRoomProximity() {
    if (gameState !== STATE.INSIDE || !currentHouseId) return;
    const zones = ROOM_ZONES[currentHouseId] || [];
    for (const z of zones) {
        if (boyGroup.position.distanceTo(z.center) < z.radius && lastRoomId !== z.id) {
            lastRoomId = z.id; boyState.currentRoom = z.id;
            if (typeof showRoomPopup === 'function') showRoomPopup(z.id, currentHouseId);
            console.log('[ROOM] Entered:', z.id);
            return;
        }
    }
}

function checkExitProximity() {
    if (gameState !== STATE.INSIDE || !currentHouseId) return;
    const sp = indoorSpawn[currentHouseId];
    if (sp && boyGroup.position.distanceTo(sp.pos) < 3) {
        if (typeof showDoorHint === 'function') {
            let h = document.getElementById('door-hint');
            if (h) { h.classList.remove('hidden'); const t = h.querySelector('#hint-text') || h.querySelector('.hint-text'); if (t) t.textContent = 'Press ESC to exit'; const k = h.querySelector('.hint-key'); if (k) k.textContent = 'ESC'; }
        }
        boyState.nearExit = true;
    } else {
        boyState.nearExit = false;
        if (gameState === STATE.INSIDE) { const h = document.getElementById('door-hint'); if (h) h.classList.add('hidden'); }
    }
}

// ═══════════════════════════════════════════════
//  UPDATE BOY — called from animate()
// ═══════════════════════════════════════════════
function updateBoy(delta) {
    if (gameState === STATE.TRANSITIONING) return;
    if (gameState === STATE.OUTSIDE || gameState === STATE.INSIDE) processMovement(delta);
    if (gameState === STATE.OUTSIDE) checkDoorProximity();
    else if (gameState === STATE.INSIDE) { checkRoomProximity(); checkExitProximity(); updateCamera(); }
    boy.update(delta);
    if (typeof updateDoors === 'function') updateDoors(delta);
    if (typeof updateMainDoors === 'function') updateMainDoors();
    if (typeof updateRoomTransparency === 'function') updateRoomTransparency();
}

// ═══════════════════════════════════════════════
//  ENTRY CIRCLE ANIMATION
// ═══════════════════════════════════════════════
function updateEntryCircles(elapsed) {
    if (gameState !== STATE.OUTSIDE) return;
    const p = 0.5 + Math.sin(elapsed * 3) * 0.3;
    const gp = 0.2 + Math.sin(elapsed * 2) * 0.15;
    const ab = Math.sin(elapsed * 4) * 0.3;
    [entry1, entry2].forEach((e, i) => {
        e.circle.material.opacity = p;
        e.circle.material.emissiveIntensity = 0.4 + Math.sin(elapsed * 3) * 0.3;
        e.glow.material.opacity = gp;
        const sc = 1 + Math.sin(elapsed * 2 + i * 0.5) * 0.08;
        e.circle.scale.set(sc, sc, 1);
        e.arrow.position.y = 1.5 + ab;
    });
}

// ═══════════════════════════════════════════════
//  WALL TRANSPARENCY
// ═══════════════════════════════════════════════
function updateWallTransparency() {
    const camPos = camera.position.clone();
    if (boyState.mode === 'indoor') {
        if (boyState.insideHouse === '1bhk') {
            transparentWalls.forEach(w => { w.material.opacity = 0; w.material.transparent = true; w.material.needsUpdate = true; });
            roofMat.opacity = 0; roofMat.needsUpdate = true;
            doorMat.opacity = 0; doorMat.needsUpdate = true;
            labels.forEach(l => { l.element.style.opacity = 1; l.element.style.display = 'block'; });
            environmentGroup.visible = false; bhk2Group.visible = false;
        } else if (boyState.insideHouse === '2bhk') {
            bhk2TransWalls.forEach(w => { w.material.opacity = 0; w.material.transparent = true; w.material.needsUpdate = true; });
            bhk2RoofMat.opacity = 0; bhk2RoofMat.needsUpdate = true;
            bhk2DoorMat.opacity = 0; bhk2DoorMat.needsUpdate = true;
            bhk2WallMat.opacity = 0; bhk2WallMat.needsUpdate = true;
            roomLabels.forEach(l => { l.element.style.opacity = 1; l.element.style.display = 'block'; });
            environmentGroup.visible = false; houseGroup.visible = false;
        }
        return;
    }
    houseGroup.visible = true; bhk2Group.visible = true; environmentGroup.visible = true;
    const d1 = camPos.distanceTo(new THREE.Vector3(-22, 4, 0));
    const t1 = THREE.MathUtils.clamp((d1 - 6) / 14, 0, 1);
    transparentWalls.forEach(w => { w.material.opacity = t1; w.material.transparent = true; w.material.needsUpdate = true; });
    roofMat.opacity = t1; roofMat.needsUpdate = true; doorMat.opacity = t1; doorMat.needsUpdate = true;
    labels.forEach(l => { l.element.style.opacity = 1 - t1; l.element.style.display = (1 - t1) > 0.2 ? 'block' : 'none'; });
    const d2 = camPos.distanceTo(new THREE.Vector3(24, 4, 0));
    const t2 = THREE.MathUtils.clamp((d2 - 8) / 14, 0, 1);
    bhk2TransWalls.forEach(w => { w.material.opacity = t2; w.material.transparent = true; w.material.needsUpdate = true; });
    bhk2RoofMat.opacity = t2; bhk2RoofMat.needsUpdate = true; bhk2DoorMat.opacity = t2; bhk2DoorMat.needsUpdate = true;
    bhk2WallMat.opacity = t2; bhk2WallMat.needsUpdate = true;
    roomLabels.forEach(l => { l.element.style.opacity = 1 - t2; l.element.style.display = (1 - t2) > 0.2 ? 'block' : 'none'; });
}

// ═══════════════════════════════════════════════
//  ANIMATION LOOP
// ═══════════════════════════════════════════════
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    if (gameState !== STATE.INSIDE && typeof controls !== 'undefined') controls.update();

    clouds.forEach((c, i) => { c.position.x += delta * (0.3 + i * 0.1); if (c.position.x > 45) c.position.x = -45; });
    sunMesh.position.y = 35 + Math.sin(elapsed * 0.1) * 2;
    sunGlow.position.copy(sunMesh.position);
    sunGlow.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.1);

    birds.forEach(b => {
        const a = b.startAngle + elapsed * b.circleSpeed;
        b.group.position.x = b.circleRadius * Math.cos(a);
        b.group.position.z = -10 + b.circleRadius * Math.sin(a) * 0.5;
        b.group.position.y = b.baseY + Math.sin(elapsed * 0.5 + b.flapPhase) * b.bobAmount;
        const fa = Math.sin(elapsed * b.flapSpeed + b.flapPhase) * 0.5;
        b.leftWing.rotation.z = fa; b.rightWing.rotation.z = -fa;
        const na = a + 0.01;
        b.group.rotation.y = Math.atan2(Math.cos(na) - Math.cos(a), Math.sin(na) - Math.sin(a));
    });

    // 1BHK appliances
    if (!is2BHK) {
        const sa = simpleAppliances;
        if (sa[1] && sa[1].on) fan1.blades.rotation.y += delta * 5;
        if (sa[5] && sa[5].on && typeof tableFan !== 'undefined') tableFan.blades.rotation.z += delta * 8;
        if (sa[3] && sa[3].on && typeof ac !== 'undefined') {
            const p = ac.particlePositions;
            for (let i = 0; i < p.length / 3; i++) {
                p[i * 3 + 1] -= delta * 0.5;
                if (p[i * 3 + 1] < ac.baseY - 3) { p[i * 3 + 1] = ac.baseY - 0.3; p[i * 3] = ac.group.position.x + (Math.random() - 0.5) * 2; p[i * 3 + 2] = ac.group.position.z + 0.5 + Math.random() * 1.5; }
            }
            ac.particles.geometry.attributes.position.needsUpdate = true;
        }
        if (typeof ac !== 'undefined') ac.particles.visible = sa[3] ? sa[3].on : false;
        if (sa[0] && sa[0].on) { light1.bulbMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 3) * 0.3; light1.pointLight.intensity = 0.6 + Math.sin(elapsed * 3) * 0.3; }
        else if (sa[0]) { light1.bulbMat.emissiveIntensity = 0; light1.pointLight.intensity = 0; }
        if (sa[4] && sa[4].on) { light2.bulbMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 3) * 0.3; light2.pointLight.intensity = 0.6 + Math.sin(elapsed * 3) * 0.3; }
        else if (sa[4]) { light2.bulbMat.emissiveIntensity = 0; light2.pointLight.intensity = 0; }
    }

    // 2BHK appliances
    if (is2BHK && typeof bhk2AnimData !== 'undefined') {
        bhk2AnimData.fans.forEach(f => { if (f.on) f.mesh.blades.rotation.y += delta * 5; });
        bhk2AnimData.tableFans.forEach(tf => { if (tf.on) tf.mesh.blades.rotation.z += delta * 8; });
        bhk2AnimData.acs.forEach(a2 => {
            if (a2.on && a2.mesh.particlePositions) {
                const p = a2.mesh.particlePositions;
                for (let i = 0; i < p.length / 3; i++) { p[i * 3 + 1] -= delta * 0.5; if (p[i * 3 + 1] < a2.mesh.baseY - 3) { p[i * 3 + 1] = a2.mesh.baseY - 0.3; p[i * 3] = a2.mesh.group.position.x + (Math.random() - 0.5) * 2; p[i * 3 + 2] = a2.mesh.group.position.z + 0.5 + Math.random() * 1.5; } }
                a2.mesh.particles.geometry.attributes.position.needsUpdate = true;
            }
        });
        bhk2AnimData.lights.forEach(l => { if (l.on) { l.mesh.bulbMat.emissiveIntensity = 1.2 + Math.sin(elapsed * 3) * 0.3; l.mesh.pointLight.intensity = 1.2 + Math.sin(elapsed * 3) * 0.3; } });
    }

    solarPanels.forEach(p => {
        if (p.animating) { p.frame++; if (p.frame > p.delay) { const dy = (p.targetY - p.group.position.y) * 0.08; p.group.position.y += dy; if (Math.abs(p.group.position.y - p.targetY) < 0.05) { p.group.position.y = p.targetY; p.animating = false; if (typeof spawnSparkles === 'function') spawnSparkles(p.group.position); } } }
    });

    updateBoy(delta);
    if (typeof updateEnergyFlow === 'function') updateEnergyFlow(delta);
    updateEntryCircles(elapsed);
    updateWallTransparency();

    [...simpleAppliances, ...bhk2Appliances].forEach(a => {
        if (a.kind === 'tv' && a.on && a.mesh && a.mesh.screen) {
            a.mesh.screen.material.emissiveIntensity = 0.8 + Math.random() * 0.4;
            if (Math.random() > 0.9) a.mesh.screen.material.emissive.setHSL(0.6, 0.4, 0.3 + Math.random() * 0.2);
        }
    });

    if (typeof waterStream !== 'undefined' && waterStream.visible) { waterStream.scale.y = 1 + Math.sin(elapsed * 20) * 0.05; waterStream.material.opacity = 0.5 + Math.sin(elapsed * 15) * 0.1; }

    labelRenderer.render(scene, camera);
    renderer.render(scene, camera);
}

// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════
buildAppliancePanel();
buildRoomNavPanel();
if (typeof updateStats === 'function') updateStats();
if (typeof createViewModeBadge === 'function') createViewModeBadge();
animate();
console.log('[BOOT] Scene ready');
console.log('[Main] EnergyWorld initialized — all systems active');

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { if (typeof collisionSystem !== 'undefined' && typeof collisionSystem.setupExterior === 'function') collisionSystem.setupExterior(); }, 200);
});
