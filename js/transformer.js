// ═══════════════════════════════════════════════
//  GRID TRANSFORMER & POWER LINES
//  Positioned between 1BHK (x=-22) and 2BHK (x=24)
//  Gap runs from x=-8 to x=10, centered at x=1
// ═══════════════════════════════════════════════
const poleGroup = new THREE.Group();
const TX = 1, TZ = 3; // Transformer position (between houses, in front)

// ── Main Utility Pole ──
const poleMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
const mainPole = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 16, 8), poleMat);
mainPole.position.set(TX, 8, TZ); mainPole.castShadow = true;
poleGroup.add(mainPole);

// Pole base plate
const basePlate = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.3, 2),
    new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8, metalness: 0.3 })
);
basePlate.position.set(TX, 0.15, TZ); basePlate.castShadow = true;
poleGroup.add(basePlate);

// ── Cross Beams (two levels) ──
const crossBeamMat = new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.85 });
const crossTop = new THREE.Mesh(new THREE.BoxGeometry(7, 0.25, 0.25), crossBeamMat);
crossTop.position.set(TX, 15, TZ); poleGroup.add(crossTop);
const crossMid = new THREE.Mesh(new THREE.BoxGeometry(5, 0.22, 0.22), crossBeamMat);
crossMid.position.set(TX, 13.5, TZ); poleGroup.add(crossMid);

// ── Transformer Box (green, mounted on pole) ──
const tfBoxMat = new THREE.MeshStandardMaterial({ color: 0x3a6b3a, roughness: 0.5, metalness: 0.4 });
const tfBox = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3, 1.8), tfBoxMat);
tfBox.position.set(TX, 10, TZ); tfBox.castShadow = true;
poleGroup.add(tfBox);

// Transformer cooling fins
const finMat = new THREE.MeshStandardMaterial({ color: 0x2d5a2d, roughness: 0.6, metalness: 0.3 });
for (let fi = -3; fi <= 3; fi++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.15), finMat);
    fin.position.set(TX, 9.2 + fi * 0.35, TZ + 0.95);
    poleGroup.add(fin);
}

// ── Bushings (3 ceramic insulators on top of transformer) ──
const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.2, metalness: 0.5 });
for (let bi = -1; bi <= 1; bi++) {
    const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.2, 8), ceramicMat);
    bushing.position.set(TX + bi * 0.7, 12, TZ);
    poleGroup.add(bushing);
    // Insulator rings
    for (let ri = 0; ri < 3; ri++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 6, 12), ceramicMat);
        ring.position.set(TX + bi * 0.7, 11.5 + ri * 0.3, TZ);
        poleGroup.add(ring);
    }
}

// ── Glass Insulators on cross beams ──
const glassMat2 = new THREE.MeshStandardMaterial({ color: 0x66aacc, roughness: 0.2, metalness: 0.4, transparent: true, opacity: 0.8 });
for (let ci = -2; ci <= 2; ci++) {
    if (ci === 0) continue; // skip center (pole is there)
    const insulator = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.35, 8), glassMat2);
    insulator.position.set(TX + ci * 1.5, 15.3, TZ);
    poleGroup.add(insulator);
    const insulator2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.3, 8), glassMat2);
    insulator2.position.set(TX + ci * 1.2, 13.8, TZ);
    poleGroup.add(insulator2);
}

// ── Warning Sign ──
const signMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.5 });
const sign = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.05), signMat);
sign.position.set(TX, 5, TZ + 0.5); poleGroup.add(sign);
const signBorder = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.9, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 }));
signBorder.position.set(TX, 5, TZ + 0.48); poleGroup.add(signBorder);
// Lightning bolt on sign
const boltMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.06), boltMat);
bolt.position.set(TX, 5, TZ + 0.52); bolt.rotation.z = 0.3; poleGroup.add(bolt);

// ── CSS2D Label ──
const tfLabelDiv = document.createElement('div');
tfLabelDiv.className = 'appliance-label';
tfLabelDiv.innerHTML = '<span class="name" style="font-size:0.95rem; color:#ffcc00;">⚡ Grid Transformer</span>';
const tfLabel = new THREE.CSS2DObject(tfLabelDiv);
tfLabel.position.set(TX, 17, TZ);
poleGroup.add(tfLabel);

// ═══════════════════════════════════════════════
//  POWER LINES — Catenary curves to both houses
// ═══════════════════════════════════════════════

// 1BHK house: center at x=-22, right edge at x=-22+14=-8, roof peak at H+0.3
// Wire endpoint: top of 1BHK right wall
const wire1BHK_X = -8;   // right edge of 1BHK
const wire1BHK_Y = H + 1; // just above roof edge
const wire1BHK_Z = 0;     // center of house depth

// 2BHK house: center at x=24, left edge at x=24-14=10
const wire2BHK_X = 10;    // left edge of 2BHK
const wire2BHK_Y = H + 1;
const wire2BHK_Z = 0;

const wireMat = new THREE.LineBasicMaterial({ color: 0x1a1a1a, linewidth: 2 });

// Draw 3 wires to each house (3-phase power)
function createCatenaryWire(startX, startY, startZ, endX, endY, endZ, sag, wireColor) {
    const pts = [];
    const segments = 30;
    for (let t = 0; t <= segments; t++) {
        const f = t / segments;
        const x = startX + (endX - startX) * f;
        const y = startY + (endY - startY) * f - Math.sin(f * Math.PI) * sag;
        const z = startZ + (endZ - startZ) * f;
        pts.push(new THREE.Vector3(x, y, z));
    }
    const mat = new THREE.LineBasicMaterial({ color: wireColor || 0x1a1a1a, linewidth: 2 });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
    poleGroup.add(line);
}

// Wires to 1BHK (left side)
createCatenaryWire(TX - 1.5, 15, TZ, wire1BHK_X, wire1BHK_Y, wire1BHK_Z - 2, 2, 0x111111);
createCatenaryWire(TX, 15, TZ, wire1BHK_X, wire1BHK_Y, wire1BHK_Z, 2.5, 0x222222);
createCatenaryWire(TX + 1.5, 15, TZ, wire1BHK_X, wire1BHK_Y, wire1BHK_Z + 2, 2, 0x111111);

// Wires to 2BHK (right side)
createCatenaryWire(TX - 1.5, 15, TZ, wire2BHK_X, wire2BHK_Y, wire2BHK_Z - 2, 2, 0x111111);
createCatenaryWire(TX, 15, TZ, wire2BHK_X, wire2BHK_Y, wire2BHK_Z, 2.5, 0x222222);
createCatenaryWire(TX + 1.5, 15, TZ, wire2BHK_X, wire2BHK_Y, wire2BHK_Z + 2, 2, 0x111111);

// ── Ground-level fencing around transformer ──
const fenceMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.6, roughness: 0.4 });
const fencePostMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 });

// Fence posts
const fencePositions = [
    [TX - 2.2, TZ - 1.8], [TX + 2.2, TZ - 1.8],
    [TX - 2.2, TZ + 1.8], [TX + 2.2, TZ + 1.8]
];
fencePositions.forEach(([fx, fz]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3, 6), fencePostMat);
    post.position.set(fx, 1.5, fz); poleGroup.add(post);
});

// Fence rails (horizontal bars)
const railPositions = [
    // Front
    { w: 4.4, x: TX, z: TZ + 1.8 },
    // Back
    { w: 4.4, x: TX, z: TZ - 1.8 },
    // Left
    { w: 3.6, x: TX - 2.2, z: TZ, ry: Math.PI / 2 },
    // Right
    { w: 3.6, x: TX + 2.2, z: TZ, ry: Math.PI / 2 }
];
railPositions.forEach(r => {
    for (let rh = 0; rh < 2; rh++) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(r.w, 0.06, 0.06), fenceMat);
        rail.position.set(r.x, 1 + rh * 1.2, r.z);
        if (r.ry) rail.rotation.y = r.ry;
        poleGroup.add(rail);
    }
});

scene.add(poleGroup);
