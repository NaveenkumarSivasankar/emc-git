// ═══════════════════════════════════════════════
//  ANIMATED BOY CHARACTER — REALISTIC SCHOOL STUDENT
//  Full character with walk animation, pivots, and state management
// ═══════════════════════════════════════════════

class Boy {
    constructor(scene) {
        this.scene = scene;
        this.mesh = new THREE.Group();
        this.walkCycle = 0;
        this.baseY = 0.15;

        // Pivot groups for animation
        this.leftArmPivot = new THREE.Group();
        this.rightArmPivot = new THREE.Group();
        this.leftLegPivot = new THREE.Group();
        this.rightLegPivot = new THREE.Group();

        // Reference to torso for breathing
        this.torso = null;

        this._buildCharacter();
        this.mesh.position.set(0, this.baseY, 13);
        this.mesh.scale.setScalar(1.2);
        scene.add(this.mesh);

        console.log('[Boy] Character constructed and added to scene');
    }

    _buildCharacter() {
        const group = this.mesh;

        // === MATERIALS ===
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFCBA4, roughness: 0.85, metalness: 0.0 });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x2C1810, roughness: 0.9 });
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.2 });
        const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const eyebrowMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.8 });
        const noseMat = new THREE.MeshStandardMaterial({ color: 0xE8B898, roughness: 0.85 });
        const mouthMat = new THREE.MeshStandardMaterial({ color: 0xc0605a, roughness: 0.6 });
        const shirtMat = new THREE.MeshStandardMaterial({ color: 0x1565C0, roughness: 0.9 });
        const collarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
        const pocketMat = new THREE.MeshStandardMaterial({ color: 0x1976D2, roughness: 0.9 });
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.8 });
        const beltMat = new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.7 });
        const buckleMat = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, metalness: 0.8, roughness: 0.2 });
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x1B1B1B, roughness: 0.6 });
        const backpackMat = new THREE.MeshStandardMaterial({ color: 0xE53935, roughness: 0.8 });
        const backpackDarkMat = new THREE.MeshStandardMaterial({ color: 0xC62828, roughness: 0.8 });
        const strapMat = new THREE.MeshStandardMaterial({ color: 0xB71C1C, roughness: 0.7 });

        // Helper to set shadow on meshes
        function makeMesh(geo, mat, pos, parent) {
            const m = new THREE.Mesh(geo, mat);
            if (pos) m.position.set(pos.x || 0, pos.y || 0, pos.z || 0);
            m.castShadow = true;
            m.receiveShadow = true;
            (parent || group).add(m);
            return m;
        }

        // === HEAD ===
        const head = makeMesh(
            new THREE.SphereGeometry(0.35, 32, 32), skinMat,
            { y: 1.85 }
        );

        // Hair cap (top half only — scaled and positioned to cover top of head)
        const hair = makeMesh(
            new THREE.SphereGeometry(0.37, 32, 32), hairMat,
            { y: 2.0, z: -0.02 }
        );
        hair.scale.y = 0.6;

        // Eyes
        // Left eye white
        makeMesh(new THREE.SphereGeometry(0.07, 12, 12), eyeWhiteMat, { x: -0.13, y: 1.92, z: 0.32 });
        // Left eye pupil
        makeMesh(new THREE.SphereGeometry(0.05, 12, 12), eyeMat, { x: -0.13, y: 1.92, z: 0.33 });
        // Right eye white
        makeMesh(new THREE.SphereGeometry(0.07, 12, 12), eyeWhiteMat, { x: 0.13, y: 1.92, z: 0.32 });
        // Right eye pupil
        makeMesh(new THREE.SphereGeometry(0.05, 12, 12), eyeMat, { x: 0.13, y: 1.92, z: 0.33 });

        // Eyebrows
        makeMesh(new THREE.BoxGeometry(0.12, 0.025, 0.02), eyebrowMat, { x: -0.13, y: 1.99, z: 0.32 });
        makeMesh(new THREE.BoxGeometry(0.12, 0.025, 0.02), eyebrowMat, { x: 0.13, y: 1.99, z: 0.32 });

        // Nose
        makeMesh(new THREE.SphereGeometry(0.04, 12, 12), noseMat, { x: 0, y: 1.83, z: 0.36 });

        // Mouth
        makeMesh(new THREE.BoxGeometry(0.14, 0.025, 0.02), mouthMat, { x: 0, y: 1.74, z: 0.34 });

        // === NECK ===
        makeMesh(
            new THREE.CylinderGeometry(0.13, 0.15, 0.2, 16), skinMat,
            { y: 1.58 }
        );

        // === TORSO (school shirt) ===
        this.torso = makeMesh(
            new THREE.BoxGeometry(0.72, 0.85, 0.38), shirtMat,
            { y: 1.1 }
        );

        // Shirt collar
        makeMesh(new THREE.BoxGeometry(0.3, 0.06, 0.1), collarMat, { y: 1.54, z: 0.16 });

        // Shirt pocket (left chest)
        makeMesh(new THREE.BoxGeometry(0.12, 0.1, 0.01), pocketMat, { x: -0.18, y: 1.2, z: 0.2 });

        // === PANTS ===
        makeMesh(
            new THREE.BoxGeometry(0.7, 0.75, 0.36), pantsMat,
            { y: 0.5 }
        );

        // Belt
        makeMesh(new THREE.BoxGeometry(0.72, 0.06, 0.39), beltMat, { y: 0.89 });

        // Belt buckle
        makeMesh(new THREE.BoxGeometry(0.08, 0.05, 0.02), buckleMat, { y: 0.89, z: 0.2 });

        // === LEFT ARM (pivot at shoulder) ===
        this.leftArmPivot.position.set(-0.42, 1.45, 0);
        group.add(this.leftArmPivot);

        // Upper arm (shirt color)
        makeMesh(new THREE.CylinderGeometry(0.11, 0.10, 0.42, 12), shirtMat, { y: -0.21 }, this.leftArmPivot);
        // Elbow joint
        makeMesh(new THREE.SphereGeometry(0.10, 12, 12), skinMat, { y: -0.42 }, this.leftArmPivot);
        // Forearm (skin)
        makeMesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 12), skinMat, { y: -0.61 }, this.leftArmPivot);
        // Hand
        makeMesh(new THREE.SphereGeometry(0.09, 12, 12), skinMat, { y: -0.82 }, this.leftArmPivot);

        // === RIGHT ARM (pivot at shoulder) ===
        this.rightArmPivot.position.set(0.42, 1.45, 0);
        group.add(this.rightArmPivot);

        makeMesh(new THREE.CylinderGeometry(0.11, 0.10, 0.42, 12), shirtMat, { y: -0.21 }, this.rightArmPivot);
        makeMesh(new THREE.SphereGeometry(0.10, 12, 12), skinMat, { y: -0.42 }, this.rightArmPivot);
        makeMesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 12), skinMat, { y: -0.61 }, this.rightArmPivot);
        makeMesh(new THREE.SphereGeometry(0.09, 12, 12), skinMat, { y: -0.82 }, this.rightArmPivot);

        // === LEFT LEG (pivot at hip) ===
        this.leftLegPivot.position.set(-0.18, 0.82, 0);
        group.add(this.leftLegPivot);

        // Thigh (pants color)
        makeMesh(new THREE.CylinderGeometry(0.14, 0.12, 0.48, 12), pantsMat, { y: -0.24 }, this.leftLegPivot);
        // Knee
        makeMesh(new THREE.SphereGeometry(0.12, 12, 12), pantsMat, { y: -0.48 }, this.leftLegPivot);
        // Shin
        makeMesh(new THREE.CylinderGeometry(0.11, 0.10, 0.44, 12), pantsMat, { y: -0.70 }, this.leftLegPivot);
        // Shoe
        const leftShoe = makeMesh(new THREE.BoxGeometry(0.18, 0.1, 0.32), shoeMat, { y: -0.96, z: 0.04 }, this.leftLegPivot);

        // === RIGHT LEG (pivot at hip) ===
        this.rightLegPivot.position.set(0.18, 0.82, 0);
        group.add(this.rightLegPivot);

        makeMesh(new THREE.CylinderGeometry(0.14, 0.12, 0.48, 12), pantsMat, { y: -0.24 }, this.rightLegPivot);
        makeMesh(new THREE.SphereGeometry(0.12, 12, 12), pantsMat, { y: -0.48 }, this.rightLegPivot);
        makeMesh(new THREE.CylinderGeometry(0.11, 0.10, 0.44, 12), pantsMat, { y: -0.70 }, this.rightLegPivot);
        const rightShoe = makeMesh(new THREE.BoxGeometry(0.18, 0.1, 0.32), shoeMat, { y: -0.96, z: 0.04 }, this.rightLegPivot);

        // === BACKPACK ===
        // Main body
        makeMesh(new THREE.BoxGeometry(0.42, 0.52, 0.18), backpackMat, { y: 1.1, z: -0.28 });
        // Front pocket
        makeMesh(new THREE.BoxGeometry(0.32, 0.25, 0.04), backpackDarkMat, { y: 1.0, z: -0.38 });
        // Top handle  
        makeMesh(new THREE.BoxGeometry(0.12, 0.04, 0.08), strapMat, { y: 1.38, z: -0.28 });
        // Straps
        makeMesh(new THREE.BoxGeometry(0.06, 0.4, 0.04), strapMat, { x: -0.14, y: 1.1, z: -0.18 });
        makeMesh(new THREE.BoxGeometry(0.06, 0.4, 0.04), strapMat, { x: 0.14, y: 1.1, z: -0.18 });
    }

    update(delta, isMoving, direction) {
        if (isMoving) {
            // Increment walk cycle
            this.walkCycle += 3 * delta;
            if (this.walkCycle > Math.PI * 2) this.walkCycle -= Math.PI * 2;

            // Arms swing opposite to legs (natural walk)
            this.leftArmPivot.rotation.x = Math.sin(this.walkCycle) * 0.45;
            this.rightArmPivot.rotation.x = Math.sin(this.walkCycle + Math.PI) * 0.45;

            // Legs swing
            this.leftLegPivot.rotation.x = Math.sin(this.walkCycle + Math.PI) * 0.5;
            this.rightLegPivot.rotation.x = Math.sin(this.walkCycle) * 0.5;

            // Slight body bob
            this.mesh.position.y = this.baseY + Math.abs(Math.sin(this.walkCycle)) * 0.04;

            // Slight torso lean forward
            if (this.torso) this.torso.rotation.x = 0.05;

        } else {
            // Idle — smooth return to neutral
            this.leftArmPivot.rotation.x = THREE.MathUtils.lerp(this.leftArmPivot.rotation.x, 0, 0.1);
            this.rightArmPivot.rotation.x = THREE.MathUtils.lerp(this.rightArmPivot.rotation.x, 0, 0.1);
            this.leftLegPivot.rotation.x = THREE.MathUtils.lerp(this.leftLegPivot.rotation.x, 0, 0.1);
            this.rightLegPivot.rotation.x = THREE.MathUtils.lerp(this.rightLegPivot.rotation.x, 0, 0.1);

            // Idle breathing
            if (this.torso) {
                this.torso.scale.z = 1 + Math.sin(Date.now() * 0.002) * 0.015;
                this.torso.rotation.x = THREE.MathUtils.lerp(this.torso.rotation.x, 0, 0.1);
            }

            this.mesh.position.y = this.baseY;
            this.walkCycle = 0;
        }
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
        this.baseY = y;
    }

    getMesh() {
        return this.mesh;
    }
}

// ═══════════════════════════════════════════════
//  INSTANTIATE BOY — backward compatible globals
// ═══════════════════════════════════════════════
const boy = new Boy(scene);
const boyGroup = boy.mesh;

// Keep backward-compatible pivot references for the animation in main.js
const leftArmPivot = boy.leftArmPivot;
const rightArmPivot = boy.rightArmPivot;
const leftLegPivot = boy.leftLegPivot;
const rightLegPivot = boy.rightLegPivot;
const torso = boy.torso;

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
const DOOR_OPEN_ANGLE = Math.PI / 2.2;
const DOOR_PROXIMITY = 1.5;
const DOOR_ANIM_SPEED = 5;

function updateDoors(delta) {
    if (boyState.mode !== 'indoor') return;
    const bx = boyGroup.position.x;
    const bz = boyGroup.position.z;
    const doors = boyState.insideHouse === '1bhk' ? bhk1Doors : bhk2Doors;
    if (!doors) return;
    doors.forEach(door => {
        const dx = bx - door.wx;
        const dz = bz - door.wz;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const targetAngle = dist < DOOR_PROXIMITY ? DOOR_OPEN_ANGLE : 0;
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
//  GAME STATE MACHINE
// ═══════════════════════════════════════════════
const GameState = {
    EXTERIOR: 'exterior',
    ENTERING_HOUSE: 'entering',
    INTERIOR: 'interior',
    ENTERING_ROOM: 'entering_room',
    IN_ROOM: 'in_room'
};

window.currentGameState = GameState.EXTERIOR;
window.currentHouse = null;
window.currentRoom = null;

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
    nearExit: false,
    cameraFollow: true,
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
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { boyState.keys.up = true; e.preventDefault(); }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { boyState.keys.down = true; e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { boyState.keys.left = true; e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { boyState.keys.right = true; e.preventDefault(); }

    // ENTER — enter house if near entry circle
    if (e.key === 'Enter' && boyState.mode === 'outdoor' && boyState.nearEntry) {
        enterHouse(boyState.nearEntry);
        e.preventDefault();
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
// ═══════════════════════════════════════════════
function enterHouse(houseId) {
    if (boyState.mode === 'transitioning') return;
    console.log('[Boy] Entering ' + houseId.toUpperCase());

    // Animate main door open
    if (typeof openMainDoor === 'function') openMainDoor(houseId);

    // Update game state
    window.currentGameState = GameState.ENTERING_HOUSE;
    window.currentHouse = houseId;

    // TRANSITIONING state — block movement briefly
    boyState.mode = 'transitioning';
    boyState.insideHouse = houseId;
    boyState.nearEntry = null;

    // CRITICAL FIX: Reset all key states to prevent stale input
    boyState.keys = { up: false, down: false, left: false, right: false };

    // Fade to black
    const overlay = document.getElementById('transition-overlay');
    if (overlay) overlay.style.opacity = 1;

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

    // Transition to INDOOR after delay — match CSS transition
    setTimeout(() => {
        // Hide exterior world
        environmentGroup.visible = false;
        if (houseId === '1bhk') {
            bhk2Group.visible = false;
        } else {
            houseGroup.visible = false;
        }

        // Fade back in
        if (overlay) overlay.style.opacity = 0;

        // CRITICAL: Resume movement — set state to INTERIOR
        boyState.mode = 'indoor';
        window.currentGameState = GameState.INTERIOR;

        // Show toast hint
        showToast('🏠 You are inside! Walk to explore rooms.');
        console.log('[Boy] Now in INTERIOR state — movement enabled');
    }, 600);

    // Close door after boy is inside
    setTimeout(() => {
        if (typeof closeMainDoor === 'function') closeMainDoor(houseId);
    }, 1500);
}

function exitHouse() {
    if (boyState.mode === 'transitioning') return;
    console.log('[Boy] Exiting house');

    const houseId = boyState.insideHouse;

    // Animate main door open
    if (typeof openMainDoor === 'function') openMainDoor(houseId);

    // Update game state
    window.currentGameState = GameState.ENTERING_HOUSE;

    // TRANSITIONING state
    boyState.mode = 'transitioning';

    // CRITICAL FIX: Reset all key states
    boyState.keys = { up: false, down: false, left: false, right: false };

    // Fade to black
    const overlay = document.getElementById('transition-overlay');
    if (overlay) overlay.style.opacity = 1;

    setTimeout(() => {
        // Move boy back outside
        const entryPos = entryPositions[houseId];
        boyGroup.position.set(entryPos.x, 0.15, entryPos.z + 0.5);
        boyGroup.rotation.y = 0;
        boyState.followTarget.copy(boyGroup.position);

        // Restore exterior world
        houseGroup.visible = true;
        bhk2Group.visible = true;
        environmentGroup.visible = true;

        // Position camera
        if (typeof controls !== 'undefined') {
            controls.enabled = true;
            camera.position.set(boyGroup.position.x, 6, boyGroup.position.z + 10);
            controls.target.set(boyGroup.position.x, 1.5, boyGroup.position.z);
            controls.update();
        }

        boyState.currentRoom = null;
        window.currentRoom = null;

        // Reset all doors to closed
        if (typeof bhk1Doors !== 'undefined') bhk1Doors.forEach(d => { d.openAngle = 0; d.pivot.rotation.y = d.baseRy; });
        if (typeof bhk2Doors !== 'undefined') bhk2Doors.forEach(d => { d.openAngle = 0; d.pivot.rotation.y = d.baseRy; });

        // Hide prompts
        const prompt = document.getElementById('interaction-popup');
        if (prompt) prompt.classList.remove('visible');
        document.getElementById('back-btn').classList.remove('visible');

        // Hide room popup
        if (typeof closeRoomPopup === 'function') closeRoomPopup();
        boyState.currentRoom = null;
        boyState.lastRoom = null;

        // Fade back in
        if (overlay) overlay.style.opacity = 0;

        // Transition to OUTDOOR
        boyState.mode = 'outdoor';
        boyState.insideHouse = null;
        window.currentGameState = GameState.EXTERIOR;
        window.currentHouse = null;

        console.log('[Boy] Back to EXTERIOR state');
    }, 600);

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

    // Movement works in BOTH outdoor AND indoor states
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
            boyGroup.position.z = Math.max(8, Math.min(18, boyGroup.position.z));
        } else if (boyState.mode === 'indoor') {
            const bounds = indoorBounds[boyState.insideHouse];
            if (bounds) {
                boyGroup.position.x = Math.max(bounds.xMin, Math.min(bounds.xMax, boyGroup.position.x));
                boyGroup.position.z = Math.max(bounds.zMin, Math.min(bounds.zMax, boyGroup.position.z));
            }
        }

        // Furniture collision check — use sliding resolution
        if (boyState.mode === 'indoor' && typeof resolveSliding === 'function') {
            const resolved = resolveSliding(prevX, prevZ, boyGroup.position.x, boyGroup.position.z);
            boyGroup.position.x = resolved.x;
            boyGroup.position.z = resolved.z;
        }

        // Face movement direction
        const targetAngle = Math.atan2(moveDir.x, moveDir.z);
        const diff = Math.atan2(Math.sin(targetAngle - boyGroup.rotation.y), Math.cos(targetAngle - boyGroup.rotation.y));
        boyGroup.rotation.y += diff * 0.2;

        // Walking animation using Boy class
        boy.update(delta, true, moveDir);

    } else {
        // Idle animation using Boy class
        boy.update(delta, false, null);
    }

    // ── State-specific checks ──
    if (boyState.mode === 'outdoor') {
        checkHouseEntry();
    } else if (boyState.mode === 'indoor') {
        checkRoomTriggers();
    }

    // ── Smooth Camera Follow ──
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
    }

    // ── Door animation + room transparency + main doors ──
    if (typeof updateDoors === 'function') updateDoors(delta);
    if (typeof updateMainDoors === 'function') updateMainDoors();
    if (typeof updateRoomTransparency === 'function') updateRoomTransparency();
}

// ═══════════════════════════════════════════════
//  HOUSE ENTRY CHECK (exterior mode)
// ═══════════════════════════════════════════════
function checkHouseEntry() {
    if (boyState.mode !== 'outdoor') return;

    const boyPos = boyGroup.position;
    const dist1 = boyPos.distanceTo(entryPositions['1bhk']);
    const dist2 = boyPos.distanceTo(entryPositions['2bhk']);
    const threshold = 3;
    const prompt = document.getElementById('interaction-popup');

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
}

// ═══════════════════════════════════════════════
//  ROOM TRIGGERS CHECK (interior mode)
// ═══════════════════════════════════════════════
function checkRoomTriggers() {
    if (boyState.mode !== 'indoor') return;

    const boyPos = boyGroup.position;
    const distExit = boyPos.distanceTo(indoorSpawn[boyState.insideHouse].pos);
    const threshold = 3;
    const prompt = document.getElementById('interaction-popup');

    // Exit door trigger
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
            window.currentRoom = room;
            if (room) {
                console.log('[Boy] Room trigger: ' + room);
                if (typeof showRoomPopup === 'function') {
                    showRoomPopup(room, boyState.insideHouse);
                }
            }
        }
    }
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
//  TOAST MESSAGE SYSTEM
// ═══════════════════════════════════════════════
function showToast(message) {
    const toast = document.getElementById('toast-message');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
