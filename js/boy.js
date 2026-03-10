// ═══════════════════════════════════════════════
//  ANIMATED BOY CHARACTER — PHOTOREALISTIC SCHOOL STUDENT
//  Canvas face/shirt textures, high-poly geometry, GLTF-ready
// ═══════════════════════════════════════════════

class Boy {
    constructor(scene) {
        this.scene = scene;
        this.mesh = new THREE.Group();
        this.walkCycle = 0;
        this.baseY = 0.15;
        this.isWalking = false;

        // Pivot groups for animation
        this.leftArmPivot = new THREE.Group();
        this.rightArmPivot = new THREE.Group();
        this.leftLegPivot = new THREE.Group();
        this.rightLegPivot = new THREE.Group();

        // For GLTF readiness
        this.mixer = null;
        this.actions = {};

        // Reference to torso for breathing
        this.torso = null;

        this._buildCharacter();
        this.mesh.position.set(0, this.baseY, 13);
        this.mesh.scale.setScalar(1.2);
        scene.add(this.mesh);

        console.log('[Boy] Photorealistic character constructed');
    }

    // ═══════════════════════════════════════════════
    //  CANVAS FACE TEXTURE
    // ═══════════════════════════════════════════════
    _createFaceTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Skin base
        ctx.fillStyle = '#FFCBA4';
        ctx.fillRect(0, 0, 256, 256);

        // Subtle skin gradient
        const skinGrad = ctx.createRadialGradient(128, 128, 40, 128, 128, 128);
        skinGrad.addColorStop(0, 'rgba(255, 210, 175, 0.3)');
        skinGrad.addColorStop(1, 'rgba(230, 180, 140, 0.2)');
        ctx.fillStyle = skinGrad;
        ctx.fillRect(0, 0, 256, 256);

        // Eyes — dark iris
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.ellipse(80, 110, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(176, 110, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye whites
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(80, 108, 8, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(176, 108, 8, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(82, 109, 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(178, 109, 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlights
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.ellipse(85, 106, 2, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(181, 106, 2, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyebrows — slightly arched
        ctx.fillStyle = '#3d2b1f';
        ctx.beginPath();
        ctx.moveTo(60, 92);
        ctx.quadraticCurveTo(80, 82, 100, 90);
        ctx.lineTo(100, 96);
        ctx.quadraticCurveTo(80, 88, 60, 98);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(156, 90);
        ctx.quadraticCurveTo(176, 82, 196, 92);
        ctx.lineTo(196, 98);
        ctx.quadraticCurveTo(176, 88, 156, 96);
        ctx.fill();

        // Nose — subtle shadow
        ctx.strokeStyle = '#D4956A';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(128, 120);
        ctx.quadraticCurveTo(118, 145, 115, 148);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(128, 120);
        ctx.quadraticCurveTo(138, 145, 141, 148);
        ctx.stroke();
        // Nose tip
        ctx.fillStyle = '#E8B898';
        ctx.beginPath();
        ctx.ellipse(128, 147, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mouth — friendly smile
        ctx.strokeStyle = '#C0605A';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(128, 158, 24, 0.15, Math.PI - 0.15);
        ctx.stroke();
        // Lower lip fill
        ctx.fillStyle = 'rgba(192, 96, 90, 0.3)';
        ctx.beginPath();
        ctx.arc(128, 158, 24, 0.15, Math.PI - 0.15);
        ctx.fill();

        // Ears
        ctx.fillStyle = '#FFCBA4';
        ctx.beginPath();
        ctx.ellipse(22, 120, 14, 22, -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#D4956A';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(234, 120, 14, 22, 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Cheek blush
        ctx.fillStyle = 'rgba(255, 180, 180, 0.25)';
        ctx.beginPath();
        ctx.ellipse(65, 140, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(191, 140, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        return new THREE.CanvasTexture(canvas);
    }

    // ═══════════════════════════════════════════════
    //  CANVAS SHIRT TEXTURE
    // ═══════════════════════════════════════════════
    _createShirtTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Base shirt color — school blue
        ctx.fillStyle = '#1565C0';
        ctx.fillRect(0, 0, 256, 256);

        // Subtle fabric texture
        for (let y = 0; y < 256; y += 3) {
            ctx.fillStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.02})`;
            ctx.fillRect(0, y, 256, 1);
        }

        // Collar — white V-neck
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(90, 0);
        ctx.lineTo(128, 55);
        ctx.lineTo(166, 0);
        ctx.lineTo(172, 0);
        ctx.lineTo(128, 60);
        ctx.lineTo(84, 0);
        ctx.fill();

        // Collar fold lines
        ctx.strokeStyle = 'rgba(200,200,200,0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(95, 5);
        ctx.lineTo(128, 50);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(161, 5);
        ctx.lineTo(128, 50);
        ctx.stroke();

        // Buttons
        ctx.fillStyle = '#ffffff';
        [65, 95, 125, 155, 185].forEach(y => {
            ctx.beginPath();
            ctx.arc(128, y, 4, 0, Math.PI * 2);
            ctx.fill();
            // Button holes
            ctx.fillStyle = '#aaaaaa';
            ctx.beginPath();
            ctx.arc(126, y - 1, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(130, y + 1, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
        });

        // Pocket (left chest)
        ctx.fillStyle = '#0D47A1';
        ctx.fillRect(55, 70, 45, 42);
        ctx.strokeStyle = '#0B3D91';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(55, 70, 45, 42);
        // Pocket flap
        ctx.fillStyle = '#1258B0';
        ctx.fillRect(53, 67, 49, 8);

        // School badge hint
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(75, 90, 6, 0, Math.PI * 2);
        ctx.fill();

        return new THREE.CanvasTexture(canvas);
    }

    // ═══════════════════════════════════════════════
    //  BUILD CHARACTER MESH
    // ═══════════════════════════════════════════════
    _buildCharacter() {
        const group = this.mesh;
        const faceTexture = this._createFaceTexture();
        const shirtTexture = this._createShirtTexture();

        // === MATERIALS ===
        const skinMat = new THREE.MeshStandardMaterial({
            color: 0xFFCBA4, roughness: 0.85, metalness: 0.0
        });
        const faceMat = new THREE.MeshStandardMaterial({
            map: faceTexture, roughness: 0.85, metalness: 0.0
        });
        const hairMat = new THREE.MeshStandardMaterial({
            color: 0x2C1810, roughness: 0.9, metalness: 0.05
        });
        const shirtMat = new THREE.MeshStandardMaterial({
            map: shirtTexture, roughness: 0.92, metalness: 0.0
        });
        const pantsMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a2a, roughness: 0.8, metalness: 0.05
        });
        const beltMat = new THREE.MeshStandardMaterial({
            color: 0x4E342E, roughness: 0.7, metalness: 0.1
        });
        const buckleMat = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0, metalness: 0.8, roughness: 0.2
        });
        const shoeMat = new THREE.MeshStandardMaterial({
            color: 0x1B1B1B, roughness: 0.5, metalness: 0.1
        });
        const soleMat = new THREE.MeshStandardMaterial({
            color: 0x333333, roughness: 0.9
        });
        const backpackMat = new THREE.MeshStandardMaterial({
            color: 0xE53935, roughness: 0.8
        });
        const backpackDarkMat = new THREE.MeshStandardMaterial({
            color: 0xC62828, roughness: 0.8
        });
        const strapMat = new THREE.MeshStandardMaterial({
            color: 0xB71C1C, roughness: 0.7
        });

        // Helper
        function makeMesh(geo, mat, pos, parent) {
            const m = new THREE.Mesh(geo, mat);
            if (pos) m.position.set(pos.x || 0, pos.y || 0, pos.z || 0);
            m.castShadow = true;
            m.receiveShadow = true;
            (parent || group).add(m);
            return m;
        }

        // === HEAD (high-poly with face texture) ===
        const head = makeMesh(
            new THREE.SphereGeometry(0.35, 64, 64), faceMat,
            { y: 1.85 }
        );

        // Hair — layered for realistic look
        const hairMain = makeMesh(
            new THREE.SphereGeometry(0.37, 32, 32), hairMat,
            { y: 2.0, z: -0.04 }
        );
        hairMain.scale.set(1.02, 0.6, 1.05);

        // Hair side layers
        const hairLeft = makeMesh(
            new THREE.SphereGeometry(0.15, 16, 16), hairMat,
            { x: -0.3, y: 1.92, z: -0.08 }
        );
        hairLeft.scale.set(0.6, 0.9, 0.8);
        const hairRight = makeMesh(
            new THREE.SphereGeometry(0.15, 16, 16), hairMat,
            { x: 0.3, y: 1.92, z: -0.08 }
        );
        hairRight.scale.set(0.6, 0.9, 0.8);

        // Hair fringe (front)
        const hairFringe = makeMesh(
            new THREE.SphereGeometry(0.2, 16, 16), hairMat,
            { y: 2.08, z: 0.22 }
        );
        hairFringe.scale.set(1.4, 0.4, 0.6);

        // === NECK ===
        makeMesh(
            new THREE.CylinderGeometry(0.13, 0.15, 0.2, 16), skinMat,
            { y: 1.58 }
        );

        // === TORSO (textured shirt) ===
        this.torso = makeMesh(
            new THREE.BoxGeometry(0.72, 0.85, 0.38), shirtMat,
            { y: 1.1 }
        );

        // Shoulder seams
        makeMesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.04, 12),
            shirtMat, { x: -0.38, y: 1.48, z: 0 }
        );
        makeMesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.04, 12),
            shirtMat, { x: 0.38, y: 1.48, z: 0 }
        );

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

        // Upper arm (shirt sleeve)
        makeMesh(new THREE.CylinderGeometry(0.11, 0.10, 0.42, 16), shirtMat, { y: -0.21 }, this.leftArmPivot);
        // Elbow
        makeMesh(new THREE.SphereGeometry(0.10, 16, 16), skinMat, { y: -0.42 }, this.leftArmPivot);
        // Forearm
        makeMesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 16), skinMat, { y: -0.61 }, this.leftArmPivot);
        // Hand
        makeMesh(new THREE.SphereGeometry(0.09, 16, 16), skinMat, { y: -0.82 }, this.leftArmPivot);

        // === RIGHT ARM ===
        this.rightArmPivot.position.set(0.42, 1.45, 0);
        group.add(this.rightArmPivot);

        makeMesh(new THREE.CylinderGeometry(0.11, 0.10, 0.42, 16), shirtMat, { y: -0.21 }, this.rightArmPivot);
        makeMesh(new THREE.SphereGeometry(0.10, 16, 16), skinMat, { y: -0.42 }, this.rightArmPivot);
        makeMesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 16), skinMat, { y: -0.61 }, this.rightArmPivot);
        makeMesh(new THREE.SphereGeometry(0.09, 16, 16), skinMat, { y: -0.82 }, this.rightArmPivot);

        // === LEFT LEG ===
        this.leftLegPivot.position.set(-0.18, 0.82, 0);
        group.add(this.leftLegPivot);

        makeMesh(new THREE.CylinderGeometry(0.14, 0.12, 0.48, 16), pantsMat, { y: -0.24 }, this.leftLegPivot);
        makeMesh(new THREE.SphereGeometry(0.12, 16, 16), pantsMat, { y: -0.48 }, this.leftLegPivot);
        makeMesh(new THREE.CylinderGeometry(0.11, 0.10, 0.44, 16), pantsMat, { y: -0.70 }, this.leftLegPivot);
        // Shoe
        const leftShoe = makeMesh(new THREE.BoxGeometry(0.18, 0.1, 0.32), shoeMat, { y: -0.96, z: 0.04 }, this.leftLegPivot);
        // Sole
        makeMesh(new THREE.BoxGeometry(0.2, 0.04, 0.34), soleMat, { y: -1.02, z: 0.04 }, this.leftLegPivot);

        // === RIGHT LEG ===
        this.rightLegPivot.position.set(0.18, 0.82, 0);
        group.add(this.rightLegPivot);

        makeMesh(new THREE.CylinderGeometry(0.14, 0.12, 0.48, 16), pantsMat, { y: -0.24 }, this.rightLegPivot);
        makeMesh(new THREE.SphereGeometry(0.12, 16, 16), pantsMat, { y: -0.48 }, this.rightLegPivot);
        makeMesh(new THREE.CylinderGeometry(0.11, 0.10, 0.44, 16), pantsMat, { y: -0.70 }, this.rightLegPivot);
        makeMesh(new THREE.BoxGeometry(0.18, 0.1, 0.32), shoeMat, { y: -0.96, z: 0.04 }, this.rightLegPivot);
        makeMesh(new THREE.BoxGeometry(0.2, 0.04, 0.34), soleMat, { y: -1.02, z: 0.04 }, this.rightLegPivot);

        // === BACKPACK ===
        makeMesh(new THREE.BoxGeometry(0.42, 0.52, 0.18), backpackMat, { y: 1.1, z: -0.28 });
        makeMesh(new THREE.BoxGeometry(0.32, 0.25, 0.04), backpackDarkMat, { y: 1.0, z: -0.38 });
        // Zipper line
        makeMesh(new THREE.BoxGeometry(0.28, 0.02, 0.02), buckleMat, { y: 1.12, z: -0.39 });
        // Top handle
        makeMesh(new THREE.BoxGeometry(0.12, 0.04, 0.08), strapMat, { y: 1.38, z: -0.28 });
        // Straps
        makeMesh(new THREE.BoxGeometry(0.06, 0.4, 0.04), strapMat, { x: -0.14, y: 1.1, z: -0.18 });
        makeMesh(new THREE.BoxGeometry(0.06, 0.4, 0.04), strapMat, { x: 0.14, y: 1.1, z: -0.18 });
    }

    update(delta, isMoving, direction) {
        if (isMoving) {
            // Natural walk cycle
            this.walkCycle += 5 * delta;
            if (this.walkCycle > Math.PI * 2) this.walkCycle -= Math.PI * 2;

            // Arms swing opposite to legs
            this.leftArmPivot.rotation.x = Math.sin(this.walkCycle) * 0.5;
            this.rightArmPivot.rotation.x = Math.sin(this.walkCycle + Math.PI) * 0.5;

            // Legs swing
            this.leftLegPivot.rotation.x = Math.sin(this.walkCycle + Math.PI) * 0.55;
            this.rightLegPivot.rotation.x = Math.sin(this.walkCycle) * 0.55;

            // Body bob
            this.mesh.position.y = this.baseY + Math.abs(Math.sin(this.walkCycle)) * 0.04;

            // Torso lean forward
            if (this.torso) this.torso.rotation.x = 0.06;
        } else {
            // Idle — smooth return with breathing
            this.leftArmPivot.rotation.x = THREE.MathUtils.lerp(this.leftArmPivot.rotation.x, 0, 0.1);
            this.rightArmPivot.rotation.x = THREE.MathUtils.lerp(this.rightArmPivot.rotation.x, 0, 0.1);
            this.leftLegPivot.rotation.x = THREE.MathUtils.lerp(this.leftLegPivot.rotation.x, 0, 0.1);
            this.rightLegPivot.rotation.x = THREE.MathUtils.lerp(this.rightLegPivot.rotation.x, 0, 0.1);

            // Breathing animation
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

// Backward-compatible pivot references
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
entry1BHK.position.set(-22, 0, 8);
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
entry2BHK.position.set(24, 0, 9);
scene.add(entry2BHK);


// ═══════════════════════════════════════════════
//  COLLISION — kept for backward compat from old code
// ═══════════════════════════════════════════════
const BOY_RADIUS = 0.35;
const collisionBoxes = [
    // 1BHK OUTER WALLS
    { xMin: -24, xMax: -4, zMin: -7.65, zMax: -7.35, house: '1bhk' },
    { xMin: -24.15, xMax: -23.85, zMin: -7.5, zMax: 7.5, house: '1bhk' },
    { xMin: -4.15, xMax: -3.85, zMin: -7.5, zMax: 7.5, house: '1bhk' },
    { xMin: -24.15, xMax: -15.25, zMin: 7.35, zMax: 7.65, house: '1bhk' },
    { xMin: -12.75, xMax: -3.85, zMin: 7.35, zMax: 7.65, house: '1bhk' },
    // 1BHK PARTITIONS
    { xMin: -23.8, xMax: -11.85, zMin: -1.6, zMax: -1.4, house: '1bhk' },
    { xMin: -10.15, xMax: -4.2, zMin: -1.6, zMax: -1.4, house: '1bhk' },
    { xMin: -16.6, xMax: -16.4, zMin: 0.85, zMax: 2.65, house: '1bhk' },
    { xMin: -16.6, xMax: -16.4, zMin: 4.35, zMax: 6.65, house: '1bhk' },
    // 1BHK FURNITURE
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
    // 2BHK PARTITIONS
    { xMin: 6.2, xMax: 12.25, zMin: -2.6, zMax: -2.4, house: '2bhk' },
    { xMin: 13.75, xMax: 18.25, zMin: -2.6, zMax: -2.4, house: '2bhk' },
    { xMin: 19.75, xMax: 25.8, zMin: -2.6, zMax: -2.4, house: '2bhk' },
    { xMin: 15.9, xMax: 16.1, zMin: -7.9, zMax: -2.6, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: -2.3, zMax: -0.25, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: 1.25, zMax: 4.75, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: 6.25, zMax: 8.0, house: '2bhk' },
    { xMin: 6.1, xMax: 10.9, zMin: 3.9, zMax: 4.1, house: '2bhk' },
    // 2BHK FURNITURE
    { xMin: 9.6, xMax: 12.4, zMin: -7, zMax: -3.5, house: '2bhk' },
    { xMin: 19.6, xMax: 22.4, zMin: -7, zMax: -3.5, house: '2bhk' },
    { xMin: 20.95, xMax: 25.45, zMin: 0, zMax: 2.2, house: '2bhk' },
    { xMin: 17.25, xMax: 19.75, zMin: 0.4, zMax: 1.6, house: '2bhk' },
    { xMin: 6.3, xMax: 9.3, zMin: -1.9, zMax: -1.1, house: '2bhk' },
    // ── 1BHK OUTER WALLS (house at x=-22, z=-4) ──
    { xMin: -24, xMax: -4, zMin: -11.65, zMax: -11.35, house: '1bhk' },
    { xMin: -24.15, xMax: -23.85, zMin: -11.5, zMax: 3.5, house: '1bhk' },
    { xMin: -4.15, xMax: -3.85, zMin: -11.5, zMax: 3.5, house: '1bhk' },
    { xMin: -24.15, xMax: -15.25, zMin: 3.35, zMax: 3.65, house: '1bhk' },
    { xMin: -12.75, xMax: -3.85, zMin: 3.35, zMax: 3.65, house: '1bhk' },
    // ── 1BHK PARTITIONS (with door gaps) ──
    { xMin: -23.8, xMax: -11.85, zMin: -5.6, zMax: -5.4, house: '1bhk' },
    { xMin: -10.15, xMax: -4.2, zMin: -5.6, zMax: -5.4, house: '1bhk' },
    { xMin: -16.6, xMax: -16.4, zMin: -3.15, zMax: -1.35, house: '1bhk' },
    { xMin: -16.6, xMax: -16.4, zMin: 0.35, zMax: 2.65, house: '1bhk' },
    // ── 1BHK FURNITURE ──
    { xMin: -19.5, xMax: -14.5, zMin: -9.75, zMax: -7.4, house: '1bhk' },
    { xMin: -8.75, xMax: -6.25, zMin: -9.45, zMax: -8.55, house: '1bhk' },
    { xMin: -15.75, xMax: -12.25, zMin: -10.65, zMax: -6.0, house: '1bhk' },
    { xMin: -22.7, xMax: -20.3, zMin: -10, zMax: -9, house: '1bhk' },
    { xMin: -21.75, xMax: -18.25, zMin: -4.95, zMax: -4.05, house: '1bhk' },
    // ── 2BHK OUTER WALLS (house at x=24, z=-4) ──
    { xMin: 6, xMax: 26, zMin: -12.15, zMax: -11.85, house: '2bhk' },
    { xMin: 5.85, xMax: 6.15, zMin: -12, zMax: 4, house: '2bhk' },
    { xMin: 25.85, xMax: 26.15, zMin: -12, zMax: 4, house: '2bhk' },
    { xMin: 5.85, xMax: 14.75, zMin: 3.85, zMax: 4.15, house: '2bhk' },
    { xMin: 17.25, xMax: 26.15, zMin: 3.85, zMax: 4.15, house: '2bhk' },
    // ── 2BHK PARTITIONS (with door gaps) ──
    { xMin: 6.2, xMax: 12.25, zMin: -6.6, zMax: -6.4, house: '2bhk' },
    { xMin: 13.75, xMax: 18.25, zMin: -6.6, zMax: -6.4, house: '2bhk' },
    { xMin: 19.75, xMax: 25.8, zMin: -6.6, zMax: -6.4, house: '2bhk' },
    { xMin: 15.9, xMax: 16.1, zMin: -11.9, zMax: -6.6, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: -6.3, zMax: -4.25, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: -2.75, zMax: 0.75, house: '2bhk' },
    { xMin: 10.9, xMax: 11.1, zMin: 2.25, zMax: 4.0, house: '2bhk' },
    { xMin: 6.1, xMax: 10.9, zMin: -0.1, zMax: 0.1, house: '2bhk' },
    // ── 2BHK FURNITURE ──
    { xMin: 9.6, xMax: 12.4, zMin: -11, zMax: -7.5, house: '2bhk' },
    { xMin: 19.6, xMax: 22.4, zMin: -11, zMax: -7.5, house: '2bhk' },
    { xMin: 20.95, xMax: 25.45, zMin: -4, zMax: -1.8, house: '2bhk' },
    { xMin: 17.25, xMax: 19.75, zMin: -3.6, zMax: -2.4, house: '2bhk' },
    { xMin: 6.3, xMax: 9.3, zMin: -5.9, zMax: -5.1, house: '2bhk' },
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

// Room regions
const roomRegions = [
    { xMin: -16.5, xMax: -4, zMin: -1.5, zMax: 7.5, room: '🏠 Hall', house: '1bhk' },
    { xMin: -24, xMax: -16.5, zMin: -1.5, zMax: 7.5, room: '🍳 Kitchen', house: '1bhk' },
    { xMin: -24, xMax: -4, zMin: -7.5, zMax: -1.5, room: '🛏️ Bedroom', house: '1bhk' },
    { xMin: 11, xMax: 26, zMin: -2.5, zMax: 8, room: '🏠 Hall', house: '2bhk' },
    { xMin: 6, xMax: 16, zMin: -8, zMax: -2.5, room: '🛏️ Bedroom 1', house: '2bhk' },
    { xMin: 16, xMax: 26, zMin: -8, zMax: -2.5, room: '🛏️ Bedroom 2', house: '2bhk' },
    { xMin: 6, xMax: 11, zMin: -2.5, zMax: 4, room: '🍳 Kitchen', house: '2bhk' },
    { xMin: 6, xMax: 11, zMin: 4, zMax: 8, room: '🚿 Bathroom', house: '2bhk' },
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
//  STATE MACHINE
// ═══════════════════════════════════════════════
const STATE = {
    OUTSIDE: 0,
    TRANSITIONING: 1,
    INSIDE: 2
};

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

let gameState = STATE.OUTSIDE;

// ═══════════════════════════════════════════════
//  BOY STATE & INPUT
// ═══════════════════════════════════════════════
let mainDoorTransition = null;

const boyState = {
    moving: false,
    speed: 8,
    walkPhase: 0,
    keys: { up: false, down: false, left: false, right: false },
    mode: 'outdoor',
    insideHouse: null,
    nearEntry: null,
    nearExit: false,
    cameraFollow: true,
    followTarget: new THREE.Vector3(),
    followInit: false,
    currentRoom: null,
    lastRoom: null
};

// Entry positions
const entryPositions = {
    '1bhk': new THREE.Vector3(-22, 0, 8),
    '2bhk': new THREE.Vector3(24, 0, 9)
};

const indoorSpawn = {
    '1bhk': { pos: new THREE.Vector3(-22, 0.15, 4), rot: Math.PI },
    '2bhk': { pos: new THREE.Vector3(24, 0.15, 5), rot: Math.PI }
};

const indoorBounds = {
    '1bhk': { xMin: -35.5, xMax: -8.5, zMin: -14.5, zMax: 6.5 },
    '2bhk': { xMin: 10.5, xMax: 37.5, zMin: -15.5, zMax: 7.5 }
};

const indoorCameraOffset = new THREE.Vector3(0, 8, 10);

// ── KEY LISTENERS ──
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;

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

    // ESCAPE — exit house
    if (e.key === 'Escape' && boyState.mode === 'indoor' && boyState.nearExit) {
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

if (typeof controls !== 'undefined') {
    controls.enableKeys = false;
}

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
//  ENTER / EXIT HOUSE — Clean state machine
// ═══════════════════════════════════════════════
function enterHouse(houseId) {
    if (boyState.mode === 'transitioning' || gameState === STATE.TRANSITIONING) return;
    console.log(`[STATE] → ENTERING ${houseId.toUpperCase()}`);

    // Animate main door
    if (typeof openMainDoor === 'function') openMainDoor(houseId);

    // TRANSITIONING — block ALL input
    gameState = STATE.TRANSITIONING;
    boyState.mode = 'transitioning';
    boyState.insideHouse = houseId;
    boyState.nearEntry = null;
    boyState.keys = { up: false, down: false, left: false, right: false };

    window.currentGameState = GameState.ENTERING_HOUSE;
    window.currentHouse = houseId;

    // Fade out
    fadeOverlay(1, 500).then(() => {
        // Move boy inside
        const spawn = indoorSpawn[houseId];
        boyGroup.position.copy(spawn.pos);
        boyGroup.rotation.y = spawn.rot;
        boyState.followTarget.copy(spawn.pos);

        // Camera for indoor
        if (typeof controls !== 'undefined') {
            controls.enabled = true;
            camera.position.set(spawn.pos.x, spawn.pos.y + 6, spawn.pos.z + 8);
            controls.target.set(spawn.pos.x, spawn.pos.y + 1.5, spawn.pos.z);
            controls.update();
        }

        // Switch view
        is2BHK = (houseId === '2bhk');
        buildAppliancePanel();
        buildRoomNavPanel();
        recalcWattage();
        boyState.currentRoom = null;

        // Hide exterior
        environmentGroup.visible = false;
        if (houseId === '1bhk') {
            bhk2Group.visible = false;
        } else {
            houseGroup.visible = false;
        }

        // Setup interior collision
        if (typeof collisionSystem !== 'undefined') {
            collisionSystem.setupInterior(houseId);
        }

        // Show back button
        document.getElementById('back-btn').classList.add('visible');

        // Fade in — then RESTORE INPUT
        fadeOverlay(0, 500).then(() => {
            gameState = STATE.INSIDE;
            boyState.mode = 'indoor';
            window.currentGameState = GameState.INTERIOR;

            showToast('🏠 You are inside! Walk to explore rooms.');
            console.log(`[STATE] → INSIDE ${houseId.toUpperCase()} — movement enabled`);
        });
    });

    // Close door after a delay
    setTimeout(() => {
        if (typeof closeMainDoor === 'function') closeMainDoor(houseId);
    }, 1500);
}

function exitHouse() {
    if (boyState.mode === 'transitioning' || gameState === STATE.TRANSITIONING) return;
    console.log('[STATE] → EXITING house');

    const houseId = boyState.insideHouse;
    if (typeof openMainDoor === 'function') openMainDoor(houseId);

    // TRANSITIONING
    gameState = STATE.TRANSITIONING;
    boyState.mode = 'transitioning';
    boyState.keys = { up: false, down: false, left: false, right: false };

    window.currentGameState = GameState.ENTERING_HOUSE;

    fadeOverlay(1, 500).then(() => {
        // Move boy outside
        const entryPos = entryPositions[houseId];
        boyGroup.position.set(entryPos.x, 0.15, entryPos.z + 0.5);
        boyGroup.rotation.y = 0;
        boyState.followTarget.copy(boyGroup.position);

        // Restore exterior
        houseGroup.visible = true;
        bhk2Group.visible = true;
        environmentGroup.visible = true;

        // Setup exterior collision
        if (typeof collisionSystem !== 'undefined') {
            collisionSystem.setupExterior();
        }

        // Camera
        if (typeof controls !== 'undefined') {
            controls.enabled = true;
            camera.position.set(boyGroup.position.x, 6, boyGroup.position.z + 10);
            controls.target.set(boyGroup.position.x, 1.5, boyGroup.position.z);
            controls.update();
        }

        boyState.currentRoom = null;
        window.currentRoom = null;

        // Reset doors
        if (typeof bhk1Doors !== 'undefined') bhk1Doors.forEach(d => { d.openAngle = 0; d.pivot.rotation.y = d.baseRy; });
        if (typeof bhk2Doors !== 'undefined') bhk2Doors.forEach(d => { d.openAngle = 0; d.pivot.rotation.y = d.baseRy; });

        // Hide prompts
        const prompt = document.getElementById('interaction-popup');
        if (prompt) prompt.classList.remove('visible');
        document.getElementById('back-btn').classList.remove('visible');

        if (typeof closeRoomPopup === 'function') closeRoomPopup();
        boyState.currentRoom = null;
        boyState.lastRoom = null;

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
//  UPDATE FUNCTION (called from animate loop)
// ═══════════════════════════════════════════════
function updateBoy(delta) {
    // Block movement during transition
    if (boyState.mode === 'transitioning' || gameState === STATE.TRANSITIONING) return;

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

        const speed = boyState.speed;
        const moveVec = moveDir.clone().multiplyScalar(speed * delta);

        const dx = moveDir.x * boyState.speed * delta;
        const dz = moveDir.z * boyState.speed * delta;

        // Clamp helper
        function clampPos(x, z) {
            if (boyState.mode === 'outdoor') {
                x = Math.max(-45, Math.min(48, x));
                z = Math.max(9, Math.min(17, z));
            } else if (boyState.mode === 'indoor') {
                const bounds = indoorBounds[boyState.insideHouse];
                if (bounds) {
                    x = Math.max(bounds.xMin, Math.min(bounds.xMax, x));
                    z = Math.max(bounds.zMin, Math.min(bounds.zMax, z));
                }
            }
            return { x, z };
        }

        const collides = typeof checkFurnitureCollision === 'function'
            ? checkFurnitureCollision : () => false;

        // Axis-separated sliding collision:
        // Try moving both axes first
        let newX = prevX + dx;
        let newZ = prevZ + dz;
        let clamped = clampPos(newX, newZ);
        newX = clamped.x; newZ = clamped.z;

        if (collides(newX, newZ)) {
            // Both blocked — try X-only movement (slide along Z wall)
            newX = prevX + dx;
            newZ = prevZ;
            clamped = clampPos(newX, newZ);
            newX = clamped.x; newZ = clamped.z;

            if (collides(newX, newZ)) {
                // X also blocked — try Z-only movement (slide along X wall)
                newX = prevX;
                newZ = prevZ + dz;
                clamped = clampPos(newX, newZ);
                newX = clamped.x; newZ = clamped.z;

                if (collides(newX, newZ)) {
                    // Fully stuck — no movement possible
                    newX = prevX;
                    newZ = prevZ;
                }
            }
        }

        boyGroup.position.x = newX;
        boyGroup.position.z = newZ;

        // Face movement direction
        const targetAngle = Math.atan2(moveDir.x, moveDir.z);
        const diff = Math.atan2(Math.sin(targetAngle - boyGroup.rotation.y), Math.cos(targetAngle - boyGroup.rotation.y));
        boyGroup.rotation.y += diff * 0.15;

        // Update animation
        boy.isWalking = true;
        boy.update(delta, true, moveDir);

    } else {
        boy.isWalking = false;
        boy.update(delta, false, null);
    }

    // State-specific checks
    if (boyState.mode === 'outdoor') {
        checkHouseEntry();

        // Check door entry via collision system
        if (typeof collisionSystem !== 'undefined') {
            const destination = collisionSystem.checkDoorEntry(boyGroup);
            if (destination && destination !== 'exit') {
                enterHouse(destination);
            }
        }
    } else if (boyState.mode === 'indoor') {
        checkRoomTriggers();
    }

    // Smooth camera follow
    if (isMoving && typeof camera !== 'undefined' && typeof controls !== 'undefined') {
        const desiredTarget = new THREE.Vector3(
            boyGroup.position.x,
            boyGroup.position.y + 1.5,
            boyGroup.position.z
        );
        const prevTarget = controls.target.clone();
        controls.target.lerp(desiredTarget, 0.08);
        const camDelta = controls.target.clone().sub(prevTarget);
        camera.position.add(camDelta);
        camera.lookAt(boyGroup.position.clone().add(new THREE.Vector3(0, 1, 0)));
        controls.update();
    }

    // Door animation
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

    // Room tracking
    if (typeof getBoyRoom === 'function') {
        const room = getBoyRoom();
        if (room !== boyState.currentRoom) {
            boyState.lastRoom = boyState.currentRoom;
            boyState.currentRoom = room;
            window.currentRoom = room;
            if (room) {
                console.log('[ROOM] Entered: ' + room);
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

// Initialize exterior collision on load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof collisionSystem !== 'undefined') {
            collisionSystem.setupExterior();
        }
    }, 200);
});
