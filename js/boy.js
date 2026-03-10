// ═══════════════════════════════════════════════
//  ANIMATED BOY CHARACTER — CHEERFUL INDIAN SCHOOL STUDENT
//  Canvas face texture, exact geometry, first-person support
// ═══════════════════════════════════════════════

class Boy {
    constructor(scene) {
        this.scene = scene;
        this._group = new THREE.Group();
        this.walkCycle = 0;
        this.idleTimer = 0;
        this.baseY = 0.15;
        this.isWalking = false;
        this.firstPerson = false;

        // Part references for visibility toggling
        this.head = null;
        this.hair = null;
        this.neck = null;
        this.torso = null;
        this.tummy = null;

        // Pivot groups for animation
        this.leftArmPivot = new THREE.Group();
        this.rightArmPivot = new THREE.Group();
        this.leftLegPivot = new THREE.Group();
        this.rightLegPivot = new THREE.Group();

        this._buildCharacter();
        this._group.position.set(0, this.baseY, 13);
        scene.add(this._group);

        console.log('[Boy] Cheerful school student constructed');
    }

    get group() { return this._group; }

    // ═══════════════════════════════════════════════
    //  FACE TEXTURE — 256x256 Canvas
    // ═══════════════════════════════════════════════
    _createFaceTexture() {
        const c = document.createElement('canvas');
        c.width = 256; c.height = 256;
        const ctx = c.getContext('2d');

        // === SKIN ===
        ctx.fillStyle = '#FFD5A8';
        ctx.fillRect(0, 0, 256, 256);

        // === HAIR (black cap on top half) ===
        ctx.fillStyle = '#1A0F0A';
        ctx.beginPath();
        ctx.ellipse(128, 50, 115, 70, 0, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(0, 50, 20, 60);
        ctx.fillRect(236, 50, 20, 60);

        // === ROSY CHEEKS ===
        ctx.fillStyle = 'rgba(255, 160, 130, 0.35)';
        ctx.beginPath(); ctx.ellipse(55, 160, 28, 18, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(201, 160, 28, 18, 0, 0, Math.PI * 2); ctx.fill();

        // === LEFT EYE (75, 108) ===
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.ellipse(75, 108, 22, 16, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#5C3A1E';
        ctx.beginPath(); ctx.ellipse(75, 108, 13, 13, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0D0D0D';
        ctx.beginPath(); ctx.ellipse(75, 108, 7, 7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath(); ctx.ellipse(80, 103, 4, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#3d2010'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(75, 108, 16, Math.PI + 0.5, -0.5); ctx.stroke();

        // === RIGHT EYE (181, 108) — mirror ===
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.ellipse(181, 108, 22, 16, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#5C3A1E';
        ctx.beginPath(); ctx.ellipse(181, 108, 13, 13, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0D0D0D';
        ctx.beginPath(); ctx.ellipse(181, 108, 7, 7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath(); ctx.ellipse(186, 103, 4, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#3d2010'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(181, 108, 16, Math.PI + 0.5, -0.5); ctx.stroke();

        // === EYEBROWS ===
        ctx.strokeStyle = '#3D2010'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(53, 84); ctx.quadraticCurveTo(75, 78, 97, 84); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(159, 84); ctx.quadraticCurveTo(181, 78, 203, 84); ctx.stroke();

        // === NOSE ===
        ctx.strokeStyle = '#D4956A'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(128, 125);
        ctx.bezierCurveTo(120, 148, 108, 158, 110, 165); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(128, 125);
        ctx.bezierCurveTo(136, 148, 148, 158, 146, 165); ctx.stroke();
        ctx.fillStyle = 'rgba(180,100,60,0.5)';
        ctx.beginPath(); ctx.ellipse(113, 164, 7, 5, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(143, 164, 7, 5, 0.3, 0, Math.PI * 2); ctx.fill();

        // === SMILE ===
        ctx.strokeStyle = '#B05050'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(95, 192);
        ctx.bezierCurveTo(110, 210, 146, 210, 161, 192); ctx.stroke();
        ctx.fillStyle = '#E07070';
        ctx.beginPath(); ctx.moveTo(95, 192);
        ctx.bezierCurveTo(112, 183, 144, 183, 161, 192);
        ctx.bezierCurveTo(144, 198, 112, 198, 95, 192); ctx.fill();

        // === EARS ===
        ctx.fillStyle = '#FFD5A8'; ctx.strokeStyle = '#D4956A'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(14, 128, 12, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(242, 128, 12, 22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        return new THREE.CanvasTexture(c);
    }

    // ═══════════════════════════════════════════════
    //  BUILD CHARACTER MESH
    // ═══════════════════════════════════════════════
    _buildCharacter() {
        const g = this._group;
        const faceTexture = this._createFaceTexture();

        const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFD5A8, roughness: 0.85 });
        const faceMat = new THREE.MeshStandardMaterial({ map: faceTexture, roughness: 0.85 });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x1A0F0A, roughness: 0.9 });
        const shirtMat = new THREE.MeshStandardMaterial({ color: 0x1565C0, roughness: 0.9 });
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1A237E, roughness: 0.8 });
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
        const bpMat = new THREE.MeshStandardMaterial({ color: 0xC62828, roughness: 0.8 });
        const bpDarkMat = new THREE.MeshStandardMaterial({ color: 0xB71C1C, roughness: 0.8 });

        function mk(geo, mat, pos, parent) {
            const m = new THREE.Mesh(geo, mat);
            if (pos) m.position.set(pos.x || 0, pos.y || 0, pos.z || 0);
            m.castShadow = true; m.receiveShadow = true;
            (parent || g).add(m);
            return m;
        }

        // HEAD
        this.head = mk(new THREE.SphereGeometry(0.22, 64, 64), faceMat, { y: 1.55 });

        // HAIR
        this.hair = mk(new THREE.SphereGeometry(0.235, 32, 32), hairMat, { y: 1.65, z: -0.02 });
        this.hair.scale.set(1, 0.65, 1);

        // NECK
        this.neck = mk(new THREE.CylinderGeometry(0.08, 0.10, 0.12, 12), skinMat, { y: 1.34 });

        // TORSO
        this.torso = mk(new THREE.BoxGeometry(0.52, 0.62, 0.30), shirtMat, { y: 0.95 });

        // TUMMY
        this.tummy = mk(new THREE.SphereGeometry(0.22, 16, 16), shirtMat, { y: 0.85, z: 0.06 });
        this.tummy.scale.set(1, 0.9, 0.8);

        // PANTS
        mk(new THREE.BoxGeometry(0.50, 0.48, 0.28), pantsMat, { y: 0.50 });

        // LEFT ARM — pivot at (-0.32, 1.22, 0)
        this.leftArmPivot.position.set(-0.32, 1.22, 0);
        g.add(this.leftArmPivot);
        mk(new THREE.CylinderGeometry(0.085, 0.075, 0.30, 12), shirtMat, { y: -0.15 }, this.leftArmPivot);
        mk(new THREE.SphereGeometry(0.08, 12, 12), skinMat, { y: -0.30 }, this.leftArmPivot);
        mk(new THREE.CylinderGeometry(0.075, 0.065, 0.26, 12), skinMat, { y: -0.45 }, this.leftArmPivot);
        mk(new THREE.SphereGeometry(0.075, 12, 12), skinMat, { y: -0.60 }, this.leftArmPivot);

        // RIGHT ARM — mirror at (0.32, 1.22, 0)
        this.rightArmPivot.position.set(0.32, 1.22, 0);
        g.add(this.rightArmPivot);
        mk(new THREE.CylinderGeometry(0.085, 0.075, 0.30, 12), shirtMat, { y: -0.15 }, this.rightArmPivot);
        mk(new THREE.SphereGeometry(0.08, 12, 12), skinMat, { y: -0.30 }, this.rightArmPivot);
        mk(new THREE.CylinderGeometry(0.075, 0.065, 0.26, 12), skinMat, { y: -0.45 }, this.rightArmPivot);
        mk(new THREE.SphereGeometry(0.075, 12, 12), skinMat, { y: -0.60 }, this.rightArmPivot);

        // LEFT LEG — pivot at (-0.13, 0.64, 0)
        this.leftLegPivot.position.set(-0.13, 0.64, 0);
        g.add(this.leftLegPivot);
        mk(new THREE.CylinderGeometry(0.105, 0.095, 0.34, 12), pantsMat, { y: -0.17 }, this.leftLegPivot);
        mk(new THREE.SphereGeometry(0.095, 12, 12), pantsMat, { y: -0.34 }, this.leftLegPivot);
        mk(new THREE.CylinderGeometry(0.09, 0.08, 0.30, 12), pantsMat, { y: -0.51 }, this.leftLegPivot);
        mk(new THREE.BoxGeometry(0.14, 0.09, 0.26), shoeMat, { y: -0.68, z: 0.04 }, this.leftLegPivot);

        // RIGHT LEG — mirror at (0.13, 0.64, 0)
        this.rightLegPivot.position.set(0.13, 0.64, 0);
        g.add(this.rightLegPivot);
        mk(new THREE.CylinderGeometry(0.105, 0.095, 0.34, 12), pantsMat, { y: -0.17 }, this.rightLegPivot);
        mk(new THREE.SphereGeometry(0.095, 12, 12), pantsMat, { y: -0.34 }, this.rightLegPivot);
        mk(new THREE.CylinderGeometry(0.09, 0.08, 0.30, 12), pantsMat, { y: -0.51 }, this.rightLegPivot);
        mk(new THREE.BoxGeometry(0.14, 0.09, 0.26), shoeMat, { y: -0.68, z: 0.04 }, this.rightLegPivot);

        // BACKPACK — group at (0, 0.95, -0.22)
        const bpGroup = new THREE.Group();
        bpGroup.position.set(0, 0.95, -0.22);
        g.add(bpGroup);
        mk(new THREE.BoxGeometry(0.32, 0.40, 0.14), bpMat, {}, bpGroup);
        mk(new THREE.BoxGeometry(0.22, 0.16, 0.03), bpDarkMat, { y: -0.05, z: 0.075 }, bpGroup);
        mk(new THREE.BoxGeometry(0.06, 0.38, 0.03), bpDarkMat, { x: -0.10, z: 0.075 }, bpGroup);
        mk(new THREE.BoxGeometry(0.06, 0.38, 0.03), bpDarkMat, { x: 0.10, z: 0.075 }, bpGroup);
    }

    // ═══════════════════════════════════════════════
    //  ANIMATION
    // ═══════════════════════════════════════════════
    update(delta, isWalking) {
        if (isWalking) {
            this.walkCycle += delta * 4.5;
            this.leftArmPivot.rotation.x = Math.sin(this.walkCycle) * 0.5;
            this.rightArmPivot.rotation.x = -Math.sin(this.walkCycle) * 0.5;
            this.leftLegPivot.rotation.x = -Math.sin(this.walkCycle) * 0.55;
            this.rightLegPivot.rotation.x = Math.sin(this.walkCycle) * 0.55;
            this._group.position.y = this.baseY + Math.abs(Math.sin(this.walkCycle)) * 0.03;
            if (this.head) this.head.rotation.z = Math.sin(this.walkCycle * 0.5) * 0.04;
        } else {
            this.idleTimer += delta;
            this.leftArmPivot.rotation.x *= 0.9;
            this.rightArmPivot.rotation.x *= 0.9;
            this.leftLegPivot.rotation.x *= 0.9;
            this.rightLegPivot.rotation.x *= 0.9;
            if (this.head) this.head.rotation.y = Math.sin(this.idleTimer * 0.6) * 0.18;
            if (this.torso) this.torso.scale.z = 1 + Math.sin(this.idleTimer * 1.8) * 0.018;
            this._group.position.y = this.baseY;
        }
    }

    setFirstPerson(enabled) {
        this.firstPerson = enabled;
        if (this.head) this.head.visible = !enabled;
        if (this.hair) this.hair.visible = !enabled;
        if (this.torso) this.torso.visible = !enabled;
        if (this.tummy) this.tummy.visible = !enabled;
        if (this.neck) this.neck.visible = !enabled;
        // Arms stay visible for first-person view
    }

    setPosition(x, y, z) {
        this._group.position.set(x, y, z);
        this.baseY = y;
    }

    getMesh() { return this._group; }
}

// ═══════════════════════════════════════════════
//  INSTANTIATE BOY — backward compatible globals
// ═══════════════════════════════════════════════
const boy = new Boy(scene);
const boyGroup = boy.group;
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

const entry1BHK = new THREE.Group();
const entry1Circle = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), entryCircleMat.clone());
entry1Circle.rotation.x = -Math.PI / 2; entry1Circle.position.set(0, 0.06, 0);
entry1BHK.add(entry1Circle);
const entry1Glow = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.8, 24), entryGlowMat.clone());
entry1Glow.rotation.x = -Math.PI / 2; entry1Glow.position.set(0, 0.05, 0);
entry1BHK.add(entry1Glow);
const arrowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });
const arrow1 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 4), arrowMat);
arrow1.position.set(0, 1.5, 0); arrow1.rotation.x = Math.PI;
entry1BHK.add(arrow1);
entry1BHK.position.set(-22, 0, 12);
scene.add(entry1BHK);

const entry2BHK = new THREE.Group();
const entry2Circle = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), entryCircleMat.clone());
entry2Circle.rotation.x = -Math.PI / 2; entry2Circle.position.set(0, 0.06, 0);
entry2BHK.add(entry2Circle);
const entry2Glow = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.8, 24), entryGlowMat.clone());
entry2Glow.rotation.x = -Math.PI / 2; entry2Glow.position.set(0, 0.05, 0);
entry2BHK.add(entry2Glow);
const arrow2 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 4), arrowMat);
arrow2.position.set(0, 1.5, 0); arrow2.rotation.x = Math.PI;
entry2BHK.add(arrow2);
entry2BHK.position.set(24, 0, 13);
scene.add(entry2BHK);

// ═══════════════════════════════════════════════
//  COLLISION — furniture AABB boxes (kept for interior)
// ═══════════════════════════════════════════════
const BOY_RADIUS = 0.35;
const collisionBoxes = [
    // 1BHK OUTER WALLS
    { xMin: -24, xMax: -4, zMin: -7.65, zMax: -7.35, house: '1bhk' },
    { xMin: -24.15, xMax: -23.85, zMin: -7.5, zMax: 7.5, house: '1bhk' },
    { xMin: -4.15, xMax: -3.85, zMin: -7.5, zMax: 7.5, house: '1bhk' },
    { xMin: -24.15, xMax: -15.25, zMin: 7.35, zMax: 7.65, house: '1bhk' },
    { xMin: -12.75, xMax: -3.85, zMin: 7.35, zMax: 7.65, house: '1bhk' },
    { xMin: -23.8, xMax: -11.85, zMin: -1.6, zMax: -1.4, house: '1bhk' },
    { xMin: -10.15, xMax: -4.2, zMin: -1.6, zMax: -1.4, house: '1bhk' },
    { xMin: -16.6, xMax: -16.4, zMin: 0.85, zMax: 2.65, house: '1bhk' },
    { xMin: -16.6, xMax: -16.4, zMin: 4.35, zMax: 6.65, house: '1bhk' },
    { xMin: -19.5, xMax: -14.5, zMin: -5.75, zMax: -3.4, house: '1bhk' },
    { xMin: -8.75, xMax: -6.25, zMin: -5.45, zMax: -4.55, house: '1bhk' },
    { xMin: -15.75, xMax: -12.25, zMin: -6.65, zMax: -2.0, house: '1bhk' },
    { xMin: -22.7, xMax: -20.3, zMin: -6, zMax: -5, house: '1bhk' },
    { xMin: -21.75, xMax: -18.25, zMin: -0.95, zMax: -0.05, house: '1bhk' },
    // 2BHK OUTER WALLS
    { xMin: 6, xMax: 26, zMin: -8.15, zMax: -7.85, house: '2bhk' },
    { xMin: 5.85, xMax: 6.15, zMin: -8, zMax: 8, house: '2bhk' },
    { xMin: 25.85, xMax: 26.15, zMin: -8, zMax: 8, house: '2bhk' },
    { xMin: 5.85, xMax: 14.75, zMin: 7.85, zMax: 8.15, house: '2bhk' },
    { xMin: 17.25, xMax: 26.15, zMin: 7.85, zMax: 8.15, house: '2bhk' },
    { xMin: 6.2, xMax: 12.25, zMin: -2.6, zMax: -2.4, house: '2bhk' },
    { xMin: 13.75, xMax: 18.25, zMin: -2.6, zMax: -2.4, house: '2bhk' },
    { xMin: 19.75, xMax: 25.8, zMin: -2.6, zMax: -2.4, house: '2bhk' },
    { xMin: 15.9, xMax: 16.1, zMin: -7.9, zMax: -2.6, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: -2.3, zMax: -0.25, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: 1.25, zMax: 4.75, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: 6.25, zMax: 8.0, house: '2bhk' },
    { xMin: 6.1, xMax: 10.9, zMin: 3.9, zMax: 4.1, house: '2bhk' },
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
//  DOOR PROXIMITY ZONES (THREE.Sphere — NOT auto-entry)
// ═══════════════════════════════════════════════
const DOOR_ZONES = {
    '1bhk': new THREE.Sphere(new THREE.Vector3(-22, 0, 12), 2.5),
    '2bhk': new THREE.Sphere(new THREE.Vector3(24, 0, 13), 2.5)
};
let nearDoor = null;

// ═══════════════════════════════════════════════
//  STATE MACHINE
// ═══════════════════════════════════════════════
const STATE = { OUTSIDE: 0, TRANSITIONING: 1, INSIDE: 2 };

const GameState = {
    EXTERIOR: 'exterior', ENTERING_HOUSE: 'entering',
    INTERIOR: 'interior', ENTERING_ROOM: 'entering_room', IN_ROOM: 'in_room'
};

window.currentGameState = GameState.EXTERIOR;
window.currentHouse = null;
window.currentRoom = null;

let gameState = STATE.OUTSIDE;
let currentHouseId = null;

// ═══════════════════════════════════════════════
//  INTERIOR BOUNDS (world coords = house origin + local)
// ═══════════════════════════════════════════════
// 1BHK origin: (-22, 0), 2BHK origin: (24, 0)
const INTERIOR_BOUNDS = {
    '1bhk': { minX: -30, maxX: -14, minZ: -10, maxZ: 7 },
    '2bhk': { minX: 14, maxX: 34, minZ: -12, maxZ: 7 }
};

function clampToBounds(position, houseId) {
    const b = INTERIOR_BOUNDS[houseId];
    if (!b) return position;
    position.x = Math.max(b.minX, Math.min(b.maxX, position.x));
    position.z = Math.max(b.minZ, Math.min(b.maxZ, position.z));
    return position;
}

// ═══════════════════════════════════════════════
//  ROOM ZONES — distance-based center checks
// ═══════════════════════════════════════════════
const ROOM_ZONES = {
    '1bhk': [
        { id: 'Hall', center: new THREE.Vector3(-22, 0, 4), radius: 3.5 },
        { id: 'Bedroom', center: new THREE.Vector3(-19, 0, -1), radius: 3.0 },
        { id: 'Kitchen', center: new THREE.Vector3(-25, 0, -5), radius: 3.0 },
        { id: 'Bathroom', center: new THREE.Vector3(-19, 0, -8), radius: 2.5 },
    ],
    '2bhk': [
        { id: 'Hall', center: new THREE.Vector3(24, 0, 5), radius: 4.0 },
        { id: 'Bedroom 1', center: new THREE.Vector3(20, 0, 0), radius: 3.5 },
        { id: 'Bedroom 2', center: new THREE.Vector3(28, 0, 0), radius: 3.5 },
        { id: 'Kitchen', center: new THREE.Vector3(20, 0, -6), radius: 3.0 },
        { id: 'Bathroom', center: new THREE.Vector3(28, 0, -6), radius: 2.5 },
    ]
};
let lastRoomId = null;

// ═══════════════════════════════════════════════
//  FIRST PERSON CAMERA
// ═══════════════════════════════════════════════
const EYE_HEIGHT = 1.45;
let yaw = 0, pitch = 0;
let pointerLocked = false;

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
//  BOY STATE & INPUT
// ═══════════════════════════════════════════════
const boyState = {
    moving: false, speed: 8, walkPhase: 0,
    keys: { up: false, down: false, left: false, right: false },
    mode: 'outdoor', insideHouse: null,
    nearEntry: null, nearExit: false,
    cameraFollow: true,
    followTarget: new THREE.Vector3(),
    followInit: false,
    currentRoom: null, lastRoom: null
};

const entryPositions = {
    '1bhk': new THREE.Vector3(-22, 0, 12),
    '2bhk': new THREE.Vector3(24, 0, 13)
};
const indoorSpawn = {
    '1bhk': { pos: new THREE.Vector3(-22, 0.15, 8), rot: Math.PI },
    '2bhk': { pos: new THREE.Vector3(24, 0.15, 9), rot: Math.PI }
};
const indoorBounds = {
    '1bhk': { xMin: -30, xMax: -14, zMin: -10, zMax: 7 },
    '2bhk': { xMin: 14, xMax: 34, zMin: -12, zMax: 7 }
};

// ── KEY LISTENERS ──
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { boyState.keys.up = true; e.preventDefault(); }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { boyState.keys.down = true; e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { boyState.keys.left = true; e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { boyState.keys.right = true; e.preventDefault(); }

    // ENTER / E — enter house ONLY if near a door
    if ((e.code === 'Enter' || e.code === 'KeyE') && nearDoor && gameState === STATE.OUTSIDE) {
        enterHouse(nearDoor);
        e.preventDefault();
    }

    // ESCAPE — exit house
    if (e.code === 'Escape' && gameState === STATE.INSIDE) {
        exitHouse();
        e.preventDefault();
    }
}, { passive: false });

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { boyState.keys.up = false; e.preventDefault(); }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { boyState.keys.down = false; e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { boyState.keys.left = false; e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { boyState.keys.right = false; e.preventDefault(); }
}, { passive: false });

if (typeof controls !== 'undefined') controls.enableKeys = false;

// ═══════════════════════════════════════════════
//  FADE OVERLAY UTILITY
// ═══════════════════════════════════════════════
function fadeOverlay(targetOpacity, duration) {
    return new Promise(resolve => {
        const overlay = document.getElementById('fade-overlay') || document.getElementById('transition-overlay');
        if (!overlay) { resolve(); return; }
        overlay.style.transition = `opacity ${duration}ms ease`;
        overlay.style.opacity = targetOpacity;
        setTimeout(resolve, duration);
    });
}

// ═══════════════════════════════════════════════
//  DOOR HINT SYSTEM
// ═══════════════════════════════════════════════
function showDoorHint(show, houseId) {
    const hint = document.getElementById('door-hint');
    if (!hint) return;
    if (show) {
        hint.classList.remove('hidden');
        const textEl = hint.querySelector('.hint-text');
        if (textEl) textEl.textContent = `Enter ${houseId === '1bhk' ? '1BHK' : '2BHK'} House`;
    } else {
        hint.classList.add('hidden');
    }
}

function showExitHint(show) {
    const hint = document.getElementById('door-hint');
    if (!hint) return;
    if (show) {
        hint.classList.remove('hidden');
        const keyEl = hint.querySelector('.hint-key');
        const textEl = hint.querySelector('.hint-text');
        if (keyEl) keyEl.textContent = 'ESC';
        if (textEl) textEl.textContent = 'Exit House';
    } else if (gameState === STATE.INSIDE) {
        hint.classList.add('hidden');
    }
}

// ═══════════════════════════════════════════════
//  DOOR PROXIMITY CHECK (every frame when outside)
// ═══════════════════════════════════════════════
function checkDoorProximity() {
    if (gameState !== STATE.OUTSIDE) return;
    nearDoor = null;
    const boyPos = boyGroup.position;

    for (const [id, zone] of Object.entries(DOOR_ZONES)) {
        if (zone.containsPoint(boyPos)) {
            nearDoor = id;
            showDoorHint(true, id);
            console.log('[DOOR] Near:', id, '— showing hint');
            return;
        }
    }
    showDoorHint(false, null);
}

// ═══════════════════════════════════════════════
//  ROOM PROXIMITY CHECK (every frame when inside)
// ═══════════════════════════════════════════════
function checkRoomProximity() {
    if (gameState !== STATE.INSIDE || !currentHouseId) return;
    const zones = ROOM_ZONES[currentHouseId] || [];
    const boyPos = boyGroup.position;

    for (const zone of zones) {
        const dist = boyPos.distanceTo(zone.center);
        if (dist < zone.radius && lastRoomId !== zone.id) {
            lastRoomId = zone.id;
            boyState.currentRoom = zone.id;
            window.currentRoom = zone.id;
            if (typeof showRoomPopup === 'function') {
                showRoomPopup(zone.id, currentHouseId);
            }
            console.log('[ROOM] Entered:', zone.id);
            return;
        }
    }
}

// ═══════════════════════════════════════════════
//  EXIT PROXIMITY CHECK (near indoor spawn door)
// ═══════════════════════════════════════════════
function checkExitProximity() {
    if (gameState !== STATE.INSIDE || !currentHouseId) return;
    const spawn = indoorSpawn[currentHouseId];
    if (!spawn) return;
    const dist = boyGroup.position.distanceTo(spawn.pos);
    if (dist < 3) {
        showExitHint(true);
        boyState.nearExit = true;
    } else {
        showExitHint(false);
        boyState.nearExit = false;
    }
}

// ═══════════════════════════════════════════════
//  ENTER HOUSE — clean state machine
// ═══════════════════════════════════════════════
function enterHouse(houseId) {
    if (gameState === STATE.TRANSITIONING) return;
    console.log('[ENTER] Entering', houseId);

    gameState = STATE.TRANSITIONING;
    boyState.mode = 'transitioning';
    boyState.insideHouse = houseId;
    boyState.nearEntry = null;
    boyState.keys = { up: false, down: false, left: false, right: false };
    nearDoor = null;
    showDoorHint(false, null);

    window.currentGameState = GameState.ENTERING_HOUSE;
    window.currentHouse = houseId;

    if (typeof openMainDoor === 'function') openMainDoor(houseId);

    fadeOverlay(1, 500).then(() => {
        // ✅ CLEAR ALL exterior collisions
        if (typeof collisionSystem !== 'undefined') {
            collisionSystem.walls = [];
            collisionSystem.doors = [];
        }

        // Teleport boy to interior start
        const spawn = indoorSpawn[houseId];
        boyGroup.position.copy(spawn.pos);
        boyGroup.rotation.y = spawn.rot;
        yaw = spawn.rot;
        pitch = 0;
        boyState.followTarget.copy(spawn.pos);

        // Hide exterior, show correct interior
        environmentGroup.visible = false;
        if (houseId === '1bhk') { bhk2Group.visible = false; }
        else { houseGroup.visible = false; }

        // Switch view
        is2BHK = (houseId === '2bhk');
        buildAppliancePanel();
        buildRoomNavPanel();
        recalcWattage();
        boyState.currentRoom = null;
        lastRoomId = null;
        currentHouseId = houseId;

        // Setup interior collisions
        if (typeof collisionSystem !== 'undefined' && typeof collisionSystem.setupInterior === 'function') {
            collisionSystem.setupInterior(houseId);
        }

        // Switch to first person
        boy.setFirstPerson(true);
        if (typeof controls !== 'undefined') controls.enabled = false;
        renderer.domElement.requestPointerLock();

        // Position camera at eye level immediately
        camera.position.set(boyGroup.position.x, boyGroup.position.y + EYE_HEIGHT, boyGroup.position.z);

        document.getElementById('back-btn').classList.add('visible');

        // ✅ Fade in — then set state LAST
        fadeOverlay(0, 500).then(() => {
            gameState = STATE.INSIDE;
            boyState.mode = 'indoor';
            window.currentGameState = GameState.INTERIOR;
            showToast('🏠 You are inside! Walk to explore rooms.');
            console.log('[STATE] INSIDE', houseId, '— movement enabled');
        });
    });

    setTimeout(() => {
        if (typeof closeMainDoor === 'function') closeMainDoor(houseId);
    }, 1500);
}

// ═══════════════════════════════════════════════
//  EXIT HOUSE
// ═══════════════════════════════════════════════
function exitHouse() {
    if (gameState === STATE.TRANSITIONING) return;
    console.log('[STATE] → EXITING house');

    const houseId = currentHouseId || boyState.insideHouse;
    if (typeof openMainDoor === 'function') openMainDoor(houseId);

    gameState = STATE.TRANSITIONING;
    boyState.mode = 'transitioning';
    boyState.keys = { up: false, down: false, left: false, right: false };

    // Exit pointer lock and first person
    if (document.pointerLockElement) document.exitPointerLock();
    boy.setFirstPerson(false);
    showExitHint(false);

    fadeOverlay(1, 500).then(() => {
        const entryPos = entryPositions[houseId];
        boyGroup.position.set(entryPos.x, 0.15, entryPos.z + 0.5);
        boyGroup.rotation.y = 0;
        yaw = 0; pitch = 0;
        boyState.followTarget.copy(boyGroup.position);

        houseGroup.visible = true;
        bhk2Group.visible = true;
        environmentGroup.visible = true;

        if (typeof collisionSystem !== 'undefined' && typeof collisionSystem.setupExterior === 'function') {
            collisionSystem.setupExterior();
        }

        // Re-enable orbit controls
        if (typeof controls !== 'undefined') {
            controls.enabled = true;
            camera.position.set(boyGroup.position.x, 6, boyGroup.position.z + 10);
            controls.target.set(boyGroup.position.x, 1.5, boyGroup.position.z);
            controls.update();
        }

        currentHouseId = null;
        boyState.currentRoom = null;
        boyState.lastRoom = null;
        lastRoomId = null;
        window.currentRoom = null;

        if (typeof bhk1Doors !== 'undefined') bhk1Doors.forEach(d => { d.openAngle = 0; d.pivot.rotation.y = d.baseRy; });
        if (typeof bhk2Doors !== 'undefined') bhk2Doors.forEach(d => { d.openAngle = 0; d.pivot.rotation.y = d.baseRy; });

        document.getElementById('back-btn').classList.remove('visible');
        if (typeof closeRoomPopup === 'function') closeRoomPopup();

        fadeOverlay(0, 500).then(() => {
            gameState = STATE.OUTSIDE;
            boyState.mode = 'outdoor';
            boyState.insideHouse = null;
            window.currentGameState = GameState.EXTERIOR;
            window.currentHouse = null;
            console.log('[STATE] → OUTSIDE — movement enabled');
        });
    });

    setTimeout(() => {
        if (typeof closeMainDoor === 'function') closeMainDoor(houseId);
    }, 1500);
}

// ═══════════════════════════════════════════════
//  FIRST PERSON CAMERA UPDATE
// ═══════════════════════════════════════════════
function updateFirstPersonCamera() {
    if (gameState !== STATE.INSIDE) return;
    const eyePos = boyGroup.position.clone();
    eyePos.y += EYE_HEIGHT;
    camera.position.copy(eyePos);

    const lookDir = new THREE.Vector3(
        Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        Math.cos(yaw) * Math.cos(pitch)
    );
    camera.lookAt(eyePos.clone().add(lookDir));
}

// ═══════════════════════════════════════════════
//  MOVEMENT PROCESSING
// ═══════════════════════════════════════════════
function processMovement(delta) {
    if (gameState === STATE.TRANSITIONING) return;

    const speed = (gameState === STATE.INSIDE) ? 3.5 : 8;
    const moveVec = new THREE.Vector3();

    if (keys['KeyW'] || keys['ArrowUp']) moveVec.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) moveVec.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) moveVec.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) moveVec.x += 1;

    const isMoving = moveVec.lengthSq() > 0;

    if (isMoving) {
        moveVec.normalize();

        if (gameState === STATE.INSIDE) {
            // First person: movement relative to yaw
            moveVec.applyEuler(new THREE.Euler(0, yaw, 0));
        } else {
            // Third person: camera-relative movement
            const forward = new THREE.Vector3();
            forward.subVectors(controls.target, camera.position);
            forward.y = 0;
            if (forward.lengthSq() > 0.0001) forward.normalize();
            else forward.set(0, 0, -1);
            const right = new THREE.Vector3();
            right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

            const camMove = new THREE.Vector3();
            camMove.addScaledVector(forward, -moveVec.z);
            camMove.addScaledVector(right, moveVec.x);
            if (camMove.lengthSq() > 0) camMove.normalize();
            moveVec.copy(camMove);
        }

        moveVec.multiplyScalar(speed * delta);
        const newPos = boyGroup.position.clone().add(moveVec);

        // Bounds clamping
        if (gameState === STATE.INSIDE && currentHouseId) {
            clampToBounds(newPos, currentHouseId);
        } else if (gameState === STATE.OUTSIDE) {
            newPos.x = Math.max(-45, Math.min(48, newPos.x));
            newPos.z = Math.max(8, Math.min(18, newPos.z));
        }

        // Collision resolution
        if (gameState === STATE.INSIDE && typeof resolveSliding === 'function') {
            const resolved = resolveSliding(boyGroup.position.x, boyGroup.position.z, newPos.x, newPos.z);
            boyGroup.position.x = resolved.x;
            boyGroup.position.z = resolved.z;
        } else if (typeof collisionSystem !== 'undefined' && collisionSystem.walls && collisionSystem.walls.length > 0) {
            const result = collisionSystem.resolveCollision(boyGroup, newPos);
            boyGroup.position.copy(result.position);
        } else {
            boyGroup.position.copy(newPos);
        }

        // Boy rotation
        if (gameState === STATE.INSIDE) {
            boyGroup.rotation.y = yaw;
        } else {
            const targetAngle = Math.atan2(moveVec.x, moveVec.z);
            const diff = Math.atan2(Math.sin(targetAngle - boyGroup.rotation.y), Math.cos(targetAngle - boyGroup.rotation.y));
            boyGroup.rotation.y += diff * 0.15;
        }

        boy.isWalking = true;
    } else {
        boy.isWalking = false;
    }

    // Third-person camera follow (outside only)
    if (gameState === STATE.OUTSIDE && isMoving && typeof controls !== 'undefined') {
        const desiredTarget = new THREE.Vector3(boyGroup.position.x, boyGroup.position.y + 1.5, boyGroup.position.z);
        const prevTarget = controls.target.clone();
        controls.target.lerp(desiredTarget, 0.08);
        const camDelta2 = controls.target.clone().sub(prevTarget);
        camera.position.add(camDelta2);
        camera.lookAt(boyGroup.position.clone().add(new THREE.Vector3(0, 1, 0)));
        controls.update();
    }
}

// ═══════════════════════════════════════════════
//  UPDATE BOY — called from animate() loop
// ═══════════════════════════════════════════════
function updateBoy(delta) {
    if (gameState === STATE.TRANSITIONING) return;

    // ✅ Movement works in BOTH outside and inside
    if (gameState === STATE.OUTSIDE || gameState === STATE.INSIDE) {
        processMovement(delta);
    }

    // State-specific checks
    if (gameState === STATE.OUTSIDE) {
        checkDoorProximity();
    } else if (gameState === STATE.INSIDE) {
        checkRoomProximity();
        checkExitProximity();
        updateFirstPersonCamera();
    }

    // Character animation
    boy.update(delta, boy.isWalking);

    // Door animation
    if (typeof updateDoors === 'function') updateDoors(delta);
    if (typeof updateMainDoors === 'function') updateMainDoors();
    if (typeof updateRoomTransparency === 'function') updateRoomTransparency();
}

// ═══════════════════════════════════════════════
//  ENTRY CIRCLE PULSE ANIMATION
// ═══════════════════════════════════════════════
function updateEntryCircles(elapsed) {
    if (gameState !== STATE.OUTSIDE) return;
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
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// ═══════════════════════════════════════════════
//  DOOR PUSH/PULL ANIMATION
// ═══════════════════════════════════════════════
const DOOR_OPEN_ANGLE = Math.PI / 2.2;
const DOOR_PROXIMITY = 1.5;
const DOOR_ANIM_SPEED = 5;

// Room regions (legacy compat — used by interiors.js getBoyRoom)
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

// Initialize exterior collision on load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof collisionSystem !== 'undefined' && typeof collisionSystem.setupExterior === 'function') {
            collisionSystem.setupExterior();
        }
    }, 200);
});
