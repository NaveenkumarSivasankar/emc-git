// ═══════════════════════════════════════════════
//  GROUND
// ═══════════════════════════════════════════════
const groundGeo = new THREE.PlaneGeometry(120, 120);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x4a8c3f, roughness: 0.9, metalness: 0.0 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ═══════════════════════════════════════════════
//  ROAD IN FRONT OF HOUSES
// ═══════════════════════════════════════════════
const roadGeo = new THREE.PlaneGeometry(90, 7);
const roadMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.95 });
const road = new THREE.Mesh(roadGeo, roadMat);
road.rotation.x = -Math.PI / 2;
road.position.set(1, 0.03, 13);
road.receiveShadow = true;
scene.add(road);

// Yellow dashed center line
for (let i = -20; i <= 20; i++) {
    const mk = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.15), new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.8 }));
    mk.rotation.x = -Math.PI / 2;
    mk.position.set(i * 2.2, 0.04, 13);
    scene.add(mk);
}
// White edge lines
[-3.4, 3.4].forEach(zOff => {
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(90, 0.12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }));
    edge.rotation.x = -Math.PI / 2;
    edge.position.set(1, 0.04, 13 + zOff);
    scene.add(edge);
});
// Sidewalks
[-4.3, 4.3].forEach(zOff => {
    const sw = new THREE.Mesh(new THREE.PlaneGeometry(90, 1.2), new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.9 }));
    sw.rotation.x = -Math.PI / 2;
    sw.position.set(1, 0.025, 13 + zOff + (zOff > 0 ? 0.6 : -0.6));
    scene.add(sw);
});
// Driveways
const driveMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
const drive1 = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 5), driveMat);
drive1.rotation.x = -Math.PI / 2; drive1.position.set(-14, 0.02, 9.5); scene.add(drive1);
const drive2 = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 5), driveMat);
drive2.rotation.x = -Math.PI / 2; drive2.position.set(16, 0.02, 11); scene.add(drive2);

// ═══════════════════════════════════════════════
//  SUN SPHERE
// ═══════════════════════════════════════════════
const sunGeo = new THREE.SphereGeometry(3, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
sunMesh.position.set(30, 35, -20);
scene.add(sunMesh);

const sunGlowGeo = new THREE.SphereGeometry(5, 32, 32);
const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xffee88, transparent: true, opacity: 0.15 });
const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
sunGlow.position.copy(sunMesh.position);
scene.add(sunGlow);

// ═══════════════════════════════════════════════
//  CLOUDS
// ═══════════════════════════════════════════════
function createCloud(x, y, z, scale) {
    const group = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0 });
    const positions = [
        [0, 0, 0, 1.5], [1.5, 0.2, 0.3, 1.2], [-1.3, 0.1, -0.2, 1.1],
        [0.5, 0.6, 0, 1.0], [-0.5, 0.5, 0.2, 0.9]
    ];
    positions.forEach(([px, py, pz, r]) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 12), cloudMat);
        mesh.position.set(px, py, pz);
        group.add(mesh);
    });
    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    scene.add(group);
    return group;
}

const clouds = [
    createCloud(-15, 20, -10, 1.5), createCloud(20, 22, -15, 1.8),
    createCloud(5, 18, -25, 1.2), createCloud(-25, 24, -20, 1.4),
    createCloud(30, 19, -8, 1.0)
];

// ═══════════════════════════════════════════════
//  TREES & BUSHES ALONG ROAD
// ═══════════════════════════════════════════════
function createTree(x, y, z, scale) {
    const g = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * scale, 0.25 * scale, 2.5 * scale, 8), trunkMat);
    trunk.position.y = 1.25 * scale; trunk.castShadow = true; g.add(trunk);
    const foliageColors = [0x2d7d2d, 0x3a9d3a, 0x228B22];
    [{ y: 3.0, r: 1.4 }, { y: 3.8, r: 1.1 }, { y: 4.4, r: 0.75 }].forEach((fp, i) => {
        const f = new THREE.Mesh(new THREE.SphereGeometry(fp.r * scale, 10, 10), new THREE.MeshStandardMaterial({ color: foliageColors[i], roughness: 0.85 }));
        f.position.y = fp.y * scale; f.castShadow = true; g.add(f);
    });
    g.position.set(x, y, z); scene.add(g); return g;
}
function createBush(x, y, z, scale) {
    const g = new THREE.Group();
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x2e8b2e, roughness: 0.9 });
    const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.5 * scale, 8, 8), bushMat);
    b1.position.y = 0.3 * scale; g.add(b1);
    const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.35 * scale, 8, 8), bushMat);
    b2.position.set(0.3 * scale, 0.25 * scale, 0.2 * scale); g.add(b2);
    g.position.set(x, y, z); scene.add(g); return g;
}

// Far side trees
createTree(-30, 0, 19, 1.3); createTree(-22, 0, 18, 1.1); createTree(-12, 0, 20, 1.4);
createTree(-2, 0, 19, 1.0); createTree(8, 0, 20, 1.5); createTree(18, 0, 18, 1.2);
createTree(28, 0, 19, 1.3); createTree(35, 0, 20, 1.1);
// Near side trees
createTree(-28, 0, 7, 1.0); createTree(-20, 0, 8, 1.3);
createTree(8, 0, 7, 1.1); createTree(28, 0, 8, 1.4);
// Trees behind houses
createTree(-22, 0, -8, 1.2); createTree(-8, 0, -9, 1.0);
createTree(10, 0, -10, 1.3); createTree(24, 0, -11, 1.1);
// Bushes along road
createBush(-25, 0, 18, 1.2); createBush(-16, 0, 19, 1.0); createBush(-5, 0, 18, 0.9);
createBush(5, 0, 19, 1.1); createBush(15, 0, 18, 1.0); createBush(25, 0, 19, 1.3);
createBush(32, 0, 18, 0.8);
createBush(-25, 0, 7.5, 1.0); createBush(10, 0, 7, 0.9); createBush(25, 0, 7.5, 1.1);
