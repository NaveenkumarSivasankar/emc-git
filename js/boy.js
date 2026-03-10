// ═══════════════════════════════════════════════
//  BOY CHARACTER — Cheerful Indian School Student
//  1024×512 Canvas Face (UV-correct for sphere)
//  Pure Three.js Geometry with School Uniform
// ═══════════════════════════════════════════════

function createFaceTexture() {
    const W = 1024, H = 512;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 1. FULL BACKGROUND — skin color
    ctx.fillStyle = '#F5C5A3';
    ctx.fillRect(0, 0, W, H);

    // 2. FACE OVAL — slightly darker center to give depth
    const grad = ctx.createRadialGradient(512, 256, 30, 512, 256, 220);
    grad.addColorStop(0, '#F8D0B0');
    grad.addColorStop(0.7, '#F5C5A3');
    grad.addColorStop(1, '#E8B090');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(512, 256, 210, 230, 0, 0, Math.PI * 2);
    ctx.fill();

    // Helper: draw one complete eye at (cx, cy)
    function drawEye(cx, cy) {
        // Sclera (white)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 48, 32, 0, 0, Math.PI * 2);
        ctx.fill();

        // Iris (warm brown)
        ctx.fillStyle = '#6B3E26';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 26, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pupil (black center)
        ctx.fillStyle = '#0D0D0D';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 14, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Primary shine (top right of pupil)
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.beginPath();
        ctx.ellipse(cx + 8, cy - 8, 7, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Secondary small shine
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.ellipse(cx - 6, cy + 6, 3, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyelid upper arc
        ctx.strokeStyle = '#3B1F0E';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy, 30, Math.PI + 0.5, -0.5, false);
        ctx.stroke();

        // Lower eyelid (thinner)
        ctx.strokeStyle = '#C48060';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0.3, Math.PI - 0.3, false);
        ctx.stroke();

        // Eyelashes (3 short lines from upper lid)
        ctx.strokeStyle = '#2A1008';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        [[-20, -28], [0, -32], [20, -28]].forEach(([ox, oy]) => {
            ctx.beginPath();
            ctx.moveTo(cx + ox * 0.8, cy + oy * 0.7);
            ctx.lineTo(cx + ox, cy + oy);
            ctx.stroke();
        });
    }

    // 3. DRAW LEFT EYE (LEFT side of face)
    drawEye(382, 210);

    // 4. DRAW RIGHT EYE (RIGHT side of face — symmetric)
    drawEye(642, 210);

    // 5. EYEBROWS (curved, expressive)
    ctx.strokeStyle = '#3B1F0E';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    // Left brow
    ctx.beginPath();
    ctx.moveTo(330, 165);
    ctx.quadraticCurveTo(382, 150, 434, 165);
    ctx.stroke();
    // Right brow
    ctx.beginPath();
    ctx.moveTo(590, 165);
    ctx.quadraticCurveTo(642, 150, 694, 165);
    ctx.stroke();

    // 6. NOSE (simple friendly lines)
    ctx.strokeStyle = '#C88060';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    // Left nostril curve
    ctx.beginPath();
    ctx.moveTo(512, 265);
    ctx.bezierCurveTo(495, 295, 478, 310, 482, 325);
    ctx.stroke();
    // Right nostril curve
    ctx.beginPath();
    ctx.moveTo(512, 265);
    ctx.bezierCurveTo(529, 295, 546, 310, 542, 325);
    ctx.stroke();
    // Nostril dots
    ctx.fillStyle = 'rgba(160,80,40,0.35)';
    ctx.beginPath();
    ctx.ellipse(484, 323, 10, 7, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(540, 323, 10, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 7. HAPPY SMILE
    ctx.strokeStyle = '#C06060';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(440, 370);
    ctx.bezierCurveTo(470, 408, 554, 408, 584, 370);
    ctx.stroke();
    // Lip fill
    ctx.fillStyle = '#E08080';
    ctx.beginPath();
    ctx.moveTo(440, 370);
    ctx.bezierCurveTo(470, 358, 554, 358, 584, 370);
    ctx.bezierCurveTo(554, 382, 470, 382, 440, 370);
    ctx.fill();

    // 8. ROSY CHEEKS
    ctx.fillStyle = 'rgba(255,130,90,0.22)';
    ctx.beginPath();
    ctx.ellipse(300, 300, 65, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(724, 300, 65, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // 9. EARS
    ctx.fillStyle = '#F0BB95';
    ctx.strokeStyle = '#D4956A';
    ctx.lineWidth = 3;
    // Left ear
    ctx.beginPath();
    ctx.ellipse(295, 250, 18, 32, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Right ear
    ctx.beginPath();
    ctx.ellipse(729, 250, 18, 32, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // 10. HAIR covering top portion (school boy haircut)
    ctx.fillStyle = '#1A0A05';
    // Main hair cap
    ctx.beginPath();
    ctx.ellipse(512, 80, 230, 170, 0, Math.PI, 0);
    ctx.fill();
    // Side hair left
    ctx.fillRect(280, 75, 40, 110);
    // Side hair right
    ctx.fillRect(704, 75, 40, 110);
    // Fringe (slight hair over forehead)
    ctx.beginPath();
    ctx.moveTo(310, 130);
    ctx.bezierCurveTo(400, 165, 624, 165, 714, 130);
    ctx.bezierCurveTo(680, 115, 344, 115, 310, 130);
    ctx.fill();

    console.log('[Boy] Face texture created (1024×512, UV-correct)');
    return new THREE.CanvasTexture(canvas);
}

class Boy {
    constructor(scene) {
        this.group = new THREE.Group();
        this.group.scale.setScalar(0.82); // Kid-sized
        this.walkCycle = 0;
        this.idleTimer = 0;
        this.isWalking = false;
        this.groundY = 0;
        this.firstPerson = false;

        const skin = new THREE.MeshStandardMaterial({ color: 0xF5C5A3, roughness: 0.85 });
        const shirtBlue = new THREE.MeshStandardMaterial({ color: 0x1976D2, roughness: 0.9 });
        const navyPants = new THREE.MeshStandardMaterial({ color: 0x283593, roughness: 0.9 });
        const whiteShoeMat = new THREE.MeshStandardMaterial({ color: 0xFAFAFA, roughness: 0.6 });
        const soleMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8 });

        // HEAD — larger for kid proportions (0.26 vs 0.22)
        const faceTex = createFaceTexture();
        this.head = new THREE.Mesh(
            new THREE.SphereGeometry(0.26, 64, 64),
            new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.85 })
        );
        this.head.position.set(0, 1.55, 0);
        this.head.castShadow = true;

        // HAIR
        this.hair = new THREE.Mesh(
            new THREE.SphereGeometry(0.275, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0x1A0A05, roughness: 0.9 })
        );
        this.hair.scale.y = 0.62;
        this.hair.position.set(0, 1.68, -0.01);
        this.hair.castShadow = true;

        // NECK
        this.neck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.10, 0.13, 16), skin
        );
        this.neck.position.set(0, 1.32, 0);
        this.neck.castShadow = true;

        // TORSO (school uniform blue shirt)
        this.torso = new THREE.Mesh(
            new THREE.BoxGeometry(0.50, 0.60, 0.28), shirtBlue
        );
        this.torso.position.set(0, 0.92, 0);
        this.torso.castShadow = true;

        // WHITE COLLAR
        this.collar = new THREE.Mesh(
            new THREE.BoxGeometry(0.48, 0.06, 0.30),
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.6 })
        );
        this.collar.position.set(0, 1.23, 0);
        this.collar.castShadow = true;

        // SCHOOL TIE (red)
        this.tie = new THREE.Mesh(
            new THREE.BoxGeometry(0.06, 0.35, 0.02),
            new THREE.MeshStandardMaterial({ color: 0xB71C1C, roughness: 0.7 })
        );
        this.tie.position.set(0, 1.0, 0.15);
        this.tie.castShadow = true;

        // SHIRT POCKET (left chest)
        this.pocket = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.10, 0.01),
            new THREE.MeshStandardMaterial({ color: 0x1565C0, roughness: 0.85 })
        );
        this.pocket.position.set(-0.12, 1.02, 0.145);

        // TUMMY
        this.tummy = new THREE.Mesh(
            new THREE.SphereGeometry(0.21, 16, 16), shirtBlue
        );
        this.tummy.scale.set(1, 0.85, 0.75);
        this.tummy.position.set(0, 0.82, 0.07);

        // PANTS (dark school navy, shorter for kid)
        this.pants = new THREE.Mesh(
            new THREE.BoxGeometry(0.48, 0.40, 0.26), navyPants
        );
        this.pants.position.set(0, 0.50, 0);
        this.pants.castShadow = true;

        // ARMS
        this.leftArmPivot = new THREE.Group();
        this.leftArmPivot.position.set(-0.30, 1.20, 0);
        this._buildArm(this.leftArmPivot, skin, shirtBlue);

        this.rightArmPivot = new THREE.Group();
        this.rightArmPivot.position.set(0.30, 1.20, 0);
        this._buildArm(this.rightArmPivot, skin, shirtBlue);

        // LEGS with white school shoes
        this.leftLegPivot = new THREE.Group();
        this.leftLegPivot.position.set(-0.12, 0.62, 0);
        this._buildLeg(this.leftLegPivot, navyPants, whiteShoeMat, soleMat);

        this.rightLegPivot = new THREE.Group();
        this.rightLegPivot.position.set(0.12, 0.62, 0);
        this._buildLeg(this.rightLegPivot, navyPants, whiteShoeMat, soleMat);

        // SCHOOL BACKPACK (bright red with yellow straps)
        this.backpack = this._buildBackpack();
        this.backpack.position.set(0, 0.92, -0.21);

        [this.head, this.hair, this.neck, this.torso, this.collar,
        this.tie, this.pocket, this.tummy, this.pants,
        this.leftArmPivot, this.rightArmPivot,
        this.leftLegPivot, this.rightLegPivot, this.backpack
        ].forEach(m => this.group.add(m));

        this.group.castShadow = true;
        scene.add(this.group);
        console.log('[Boy] Cheerful school student constructed (1024×512 face, school uniform, kid scale 0.82)');
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

    _buildLeg(pivot, pants, shoeMat, soleMat) {
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.085, 0.32, 12), pants);
        thigh.position.set(0, -0.16, 0); thigh.castShadow = true;
        const knee = new THREE.Mesh(new THREE.SphereGeometry(0.088, 12, 12), pants);
        knee.position.set(0, -0.32, 0);
        const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.072, 0.28, 12), pants);
        shin.position.set(0, -0.47, 0); shin.castShadow = true;
        // White school shoe
        const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.085, 0.25), shoeMat);
        shoe.position.set(0, -0.63, 0.04); shoe.castShadow = true;
        // Grey sole line
        const sole = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.26), soleMat);
        sole.position.set(0, -0.675, 0.04);
        pivot.add(thigh, knee, shin, shoe, sole);
    }

    _buildBackpack() {
        const bp = new THREE.Group();
        const redDark = new THREE.MeshStandardMaterial({ color: 0xC62828, roughness: 0.85 });
        // Slightly larger backpack for school kid
        const main = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 0.15), redDark);
        main.castShadow = true;
        // Front pocket
        const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.03),
            new THREE.MeshStandardMaterial({ color: 0xA31515 }));
        pocket.position.set(0, -0.06, 0.085);
        bp.add(main, pocket);
        // Yellow straps (bright school bag)
        const strapMat = new THREE.MeshStandardMaterial({ color: 0xFDD835, roughness: 0.7 });
        [-0.10, 0.10].forEach(x => {
            const strap = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.40, 0.025), strapMat);
            strap.position.set(x, 0, 0.085);
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
        this.collar.visible = !enabled;
        this.tie.visible = !enabled;
        this.pocket.visible = !enabled;
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
