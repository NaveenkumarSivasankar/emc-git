// ═══════════════════════════════════════════════
//  ELECTRICAL TRANSFORMER & POWER LINES
// ═══════════════════════════════════════════════
const poleGroup = new THREE.Group();

// Transformer body
const tfMat = new THREE.MeshStandardMaterial({ color: 0x556655, roughness: 0.6, metalness: 0.3 });
const tfBody = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 1.5), tfMat);
tfBody.position.set(1, 5.25, 10); tfBody.castShadow = true; poleGroup.add(tfBody);

// Transformer pole
const tfPoleMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
const tfPole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 12, 8), tfPoleMat);
tfPole.position.set(1, 3, 10); tfPole.castShadow = true; poleGroup.add(tfPole);

// Cross beam
const tfCross = new THREE.Mesh(new THREE.BoxGeometry(5, 0.2, 0.2), tfPoleMat);
tfCross.position.set(1, 8.5, 10); poleGroup.add(tfCross);

// Bushings
const bushingMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.6 });
for (let bi = -1; bi <= 1; bi++) {
    const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.8, 8), bushingMat);
    bushing.position.set(1 + bi * 0.6, 7, 10); poleGroup.add(bushing);
}

// Label
const tfLabelDiv = document.createElement('div');
tfLabelDiv.className = 'appliance-label';
tfLabelDiv.innerHTML = '<span class="name" style="font-size:0.8rem">⚡ Grid Transformer</span>';
const tfLabel = new THREE.CSS2DObject(tfLabelDiv);
tfLabel.position.set(1, 9.5, 10); poleGroup.add(tfLabel);

// Wires to 1BHK house (adjusted for enlarged house W=20)
const wireMat = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 });
for (let i = -1; i <= 1; i++) {
    const pts = [];
    for (let t = 0; t <= 20; t++) {
        const f = t / 20;
        const x = (1 + i * 1.5) + (-14 + W / 2 - (1 + i * 1.5)) * f;
        const y = 8.5 - Math.sin(f * Math.PI) * 3 + (H + 1 - 8.5) * f;
        const z = 10 + (0 - 10) * f;
        pts.push(new THREE.Vector3(x, y, z));
    }
    poleGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat));
}

// Wires to 2BHK house
for (let i = -1; i <= 1; i++) {
    const pts = [];
    for (let t = 0; t <= 20; t++) {
        const f = t / 20;
        const x = (1 + i * 1.5) + (16 - 10 - (1 + i * 1.5)) * f;
        const y = 8.5 - Math.sin(f * Math.PI) * 3 + (H + 1 - 8.5) * f;
        const z = 10 + (0 - 10) * f;
        pts.push(new THREE.Vector3(x, y, z));
    }
    poleGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat));
}
scene.add(poleGroup);
