// ═══════════════════════════════════════════════
//  BOY CHARACTER — Cheerful Indian School Student
//  512×512 Canvas Face, Pure Three.js Geometry
// ═══════════════════════════════════════════════

function createFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. SKIN BASE
    ctx.fillStyle = '#F5C5A3';
    ctx.fillRect(0, 0, 512, 512);

    // 2. LEFT EYE (155, 210)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.ellipse(155, 210, 44, 30, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6B3E26';
    ctx.beginPath(); ctx.ellipse(155, 210, 24, 24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111111';
    ctx.beginPath(); ctx.ellipse(155, 210, 13, 13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.ellipse(165, 200, 7, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3B1F0E'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(155, 210, 30, Math.PI + 0.4, -0.4); ctx.stroke();

    // 3. RIGHT EYE (357, 210) — mirror
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.ellipse(357, 210, 44, 30, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6B3E26';
    ctx.beginPath(); ctx.ellipse(357, 210, 24, 24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111111';
    ctx.beginPath(); ctx.ellipse(357, 210, 13, 13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.ellipse(367, 200, 7, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3B1F0E'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(357, 210, 30, Math.PI + 0.4, -0.4); ctx.stroke();

    // 4. EYEBROWS
    ctx.strokeStyle = '#3B1F0E'; ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(110, 168); ctx.quadraticCurveTo(155, 155, 200, 168); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(312, 168); ctx.quadraticCurveTo(357, 155, 402, 168); ctx.stroke();

    // 5. NOSE
    ctx.strokeStyle = '#D4856A'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(256, 260);
    ctx.bezierCurveTo(240, 300, 220, 320, 225, 335); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(256, 260);
    ctx.bezierCurveTo(272, 300, 292, 320, 287, 335); ctx.stroke();
    ctx.fillStyle = 'rgba(160,80,40,0.4)';
    ctx.beginPath(); ctx.ellipse(228, 333, 13, 9, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(284, 333, 13, 9, 0.3, 0, Math.PI * 2); ctx.fill();

    // 6. SMILE
    ctx.strokeStyle = '#C06060'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(190, 390);
    ctx.bezierCurveTo(220, 425, 292, 425, 322, 390); ctx.stroke();
    ctx.fillStyle = '#E08080';
    ctx.beginPath(); ctx.moveTo(190, 390);
    ctx.bezierCurveTo(220, 378, 292, 378, 322, 390);
    ctx.bezierCurveTo(292, 402, 220, 402, 190, 390); ctx.fill();

    // 7. ROSY CHEEKS
    ctx.fillStyle = 'rgba(255,140,100,0.28)';
    ctx.beginPath(); ctx.ellipse(100, 310, 55, 35, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(412, 310, 55, 35, 0, 0, Math.PI * 2); ctx.fill();

    // 8. EARS
    ctx.fillStyle = '#F5C5A3'; ctx.strokeStyle = '#D4856A'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(25, 256, 22, 40, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(487, 256, 22, 40, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // 9. HAIR
    ctx.fillStyle = '#1A0A05';
    ctx.beginPath(); ctx.ellipse(256, 100, 240, 145, 0, Math.PI, 0); ctx.fill();
    ctx.fillRect(0, 80, 35, 130);
    ctx.fillRect(477, 80, 35, 130);
    ctx.beginPath(); ctx.moveTo(60, 130);
    ctx.bezierCurveTo(150, 155, 362, 155, 452, 130);
    ctx.bezierCurveTo(400, 110, 112, 110, 60, 130); ctx.fill();

    return new THREE.CanvasTexture(canvas);
}

class Boy {
    constructor(scene) {
        this.group = new THREE.Group();
        this.walkCycle = 0;
        this.idleTimer = 0;
        this.isWalking = false;
        this.groundY = 0;
        this.firstPerson = false;

        const skin = new THREE.MeshStandardMaterial({ color: 0xF5C5A3, roughness: 0.85 });
        const shirtBlue = new THREE.MeshStandardMaterial({ color: 0x1565C0, roughness: 0.9 });
        const navyPants = new THREE.MeshStandardMaterial({ color: 0x1A237E, roughness: 0.9 });
        const blackShoe = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

        // HEAD
        const faceTex = createFaceTexture();
        this.head = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 64, 64),
            new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.85 })
        );
        this.head.position.set(0, 1.52, 0);
        this.head.castShadow = true;

        // HAIR
        this.hair = new THREE.Mesh(
            new THREE.SphereGeometry(0.235, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0x1A0A05, roughness: 0.9 })
        );
        this.hair.scale.y = 0.62;
        this.hair.position.set(0, 1.625, -0.01);
        this.hair.castShadow = true;

        // NECK
        this.neck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.10, 0.13, 16), skin
        );
        this.neck.position.set(0, 1.32, 0);
        this.neck.castShadow = true;

        // TORSO
        this.torso = new THREE.Mesh(
            new THREE.BoxGeometry(0.50, 0.60, 0.28), shirtBlue
        );
        this.torso.position.set(0, 0.92, 0);
        this.torso.castShadow = true;

        // TUMMY
        this.tummy = new THREE.Mesh(
            new THREE.SphereGeometry(0.21, 16, 16), shirtBlue
        );
        this.tummy.scale.set(1, 0.85, 0.75);
        this.tummy.position.set(0, 0.82, 0.07);

        // PANTS
        this.pants = new THREE.Mesh(
            new THREE.BoxGeometry(0.48, 0.46, 0.26), navyPants
        );
        this.pants.position.set(0, 0.48, 0);
        this.pants.castShadow = true;

        // ARMS
        this.leftArmPivot = new THREE.Group();
        this.leftArmPivot.position.set(-0.30, 1.20, 0);
        this._buildArm(this.leftArmPivot, skin, shirtBlue);

        this.rightArmPivot = new THREE.Group();
        this.rightArmPivot.position.set(0.30, 1.20, 0);
        this._buildArm(this.rightArmPivot, skin, shirtBlue);

        // LEGS
        this.leftLegPivot = new THREE.Group();
        this.leftLegPivot.position.set(-0.12, 0.62, 0);
        this._buildLeg(this.leftLegPivot, navyPants, blackShoe);

        this.rightLegPivot = new THREE.Group();
        this.rightLegPivot.position.set(0.12, 0.62, 0);
        this._buildLeg(this.rightLegPivot, navyPants, blackShoe);

        // BACKPACK
        this.backpack = this._buildBackpack();
        this.backpack.position.set(0, 0.92, -0.21);

        [this.head, this.hair, this.neck, this.torso, this.tummy,
        this.pants, this.leftArmPivot, this.rightArmPivot,
        this.leftLegPivot, this.rightLegPivot, this.backpack
        ].forEach(m => this.group.add(m));

        this.group.castShadow = true;
        scene.add(this.group);
        console.log('[Boy] Cheerful school student constructed');
    }

    _buildArm(pivot, skin, shirt) {
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.28, 12), shirt);
        upper.position.set(0, -0.14, 0); upper.castShadow = true;
        const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.072, 12, 12), skin);
        elbow.position.set(0, -0.28, 0);
        const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.24, 12), skin);
        forearm.position.set(0, -0.42, 0); forearm.castShadow = true;
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 12), skin);
        hand.position.set(0, -0.56, 0);
        pivot.add(upper, elbow, forearm, hand);
    }

    _buildLeg(pivot, pants, shoe) {
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.32, 12), pants);
        thigh.position.set(0, -0.16, 0); thigh.castShadow = true;
        const knee = new THREE.Mesh(new THREE.SphereGeometry(0.088, 12, 12), pants);
        knee.position.set(0, -0.32, 0);
        const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.072, 0.28, 12), pants);
        shin.position.set(0, -0.47, 0); shin.castShadow = true;
        const shoeM = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.085, 0.25), shoe);
        shoeM.position.set(0, -0.63, 0.04); shoeM.castShadow = true;
        pivot.add(thigh, knee, shin, shoeM);
    }

    _buildBackpack() {
        const bp = new THREE.Group();
        const redDark = new THREE.MeshStandardMaterial({ color: 0xC62828, roughness: 0.85 });
        const main = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.38, 0.13), redDark);
        main.castShadow = true;
        const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.15, 0.03),
            new THREE.MeshStandardMaterial({ color: 0xA31515 }));
        pocket.position.set(0, -0.05, 0.073);
        bp.add(main, pocket);
        [-0.09, 0.09].forEach(x => {
            const strap = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.025),
                new THREE.MeshStandardMaterial({ color: 0xB71C1C }));
            strap.position.set(x, 0, 0.073);
            bp.add(strap);
        });
        return bp;
    }

    update(delta) {
        if (this.isWalking) {
            this.walkCycle += delta * 4.8;
            const wc = this.walkCycle;
            this.leftArmPivot.rotation.x = Math.sin(wc) * 0.52;
            this.rightArmPivot.rotation.x = -Math.sin(wc) * 0.52;
            this.leftLegPivot.rotation.x = -Math.sin(wc) * 0.58;
            this.rightLegPivot.rotation.x = Math.sin(wc) * 0.58;
            this.group.position.y = this.groundY + Math.abs(Math.sin(wc)) * 0.028;
            this.head.rotation.z = Math.sin(wc * 0.5) * 0.035;
        } else {
            this.idleTimer += delta;
            const t = this.idleTimer;
            ['leftArmPivot', 'rightArmPivot', 'leftLegPivot', 'rightLegPivot'].forEach(p => {
                this[p].rotation.x = THREE.MathUtils.lerp(this[p].rotation.x, 0, 0.08);
            });
            this.head.rotation.y = Math.sin(t * 0.55) * 0.20;
            this.torso.scale.z = 1 + Math.sin(t * 1.7) * 0.016;
            this.group.position.y = this.groundY;
        }
    }

    setFirstPerson(enabled) {
        this.firstPerson = enabled;
        this.head.visible = !enabled;
        this.hair.visible = !enabled;
        this.neck.visible = !enabled;
        this.torso.visible = !enabled;
        this.tummy.visible = !enabled;
        this.pants.visible = !enabled;
        this.backpack.visible = !enabled;
        this.leftArmPivot.visible = true;
        this.rightArmPivot.visible = true;
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
        this.groundY = y;
    }
}
