// ═══════════════════════════════════════════════
//  ENVIRONMENT GROUP (toggle visibility when inside)
// ═══════════════════════════════════════════════
const environmentGroup = new THREE.Group();
scene.add(environmentGroup);

// ═══════════════════════════════════════════════
//  GROUND
// ═══════════════════════════════════════════════
const groundGeo = new THREE.PlaneGeometry(120, 120);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x4a8c3f, roughness: 0.9, metalness: 0.0 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
environmentGroup.add(ground);

// Grass patches for natural look
for (let i = 0; i < 30; i++) {
    const patchSize = 2 + Math.random() * 5;
    const patch = new THREE.Mesh(
        new THREE.CircleGeometry(patchSize, 8),
        new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.28 + Math.random() * 0.06, 0.6 + Math.random() * 0.2, 0.25 + Math.random() * 0.1), roughness: 0.95 })
    );
    patch.rotation.x = -Math.PI / 2;
    patch.position.set((Math.random() - 0.5) * 100, 0.01, (Math.random() - 0.5) * 100);
    environmentGroup.add(patch);
}

// ═══════════════════════════════════════════════
//  ROAD IN FRONT OF HOUSES
// ═══════════════════════════════════════════════
const roadGeo = new THREE.PlaneGeometry(90, 7);
const roadMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.95 });
const road = new THREE.Mesh(roadGeo, roadMat);
road.rotation.x = -Math.PI / 2;
road.position.set(1, 0.03, 13);
road.receiveShadow = true;
environmentGroup.add(road);

// Yellow dashed center line
for (let i = -20; i <= 20; i++) {
    const mk = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.15), new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.8 }));
    mk.rotation.x = -Math.PI / 2;
    mk.position.set(i * 2.2, 0.04, 13);
    environmentGroup.add(mk);
}
// White edge lines
[-3.4, 3.4].forEach(zOff => {
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(90, 0.12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }));
    edge.rotation.x = -Math.PI / 2;
    edge.position.set(1, 0.04, 13 + zOff);
    environmentGroup.add(edge);
});
// Sidewalks
[-4.3, 4.3].forEach(zOff => {
    const sw = new THREE.Mesh(new THREE.PlaneGeometry(90, 1.2), new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.9 }));
    sw.rotation.x = -Math.PI / 2;
    sw.position.set(1, 0.025, 13 + zOff + (zOff > 0 ? 0.6 : -0.6));
    environmentGroup.add(sw);
});
// Driveways
const driveMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
const drive1 = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 5), driveMat);
drive1.rotation.x = -Math.PI / 2; drive1.position.set(-14, 0.02, 9.5); environmentGroup.add(drive1);
const drive2 = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 5), driveMat);
drive2.rotation.x = -Math.PI / 2; drive2.position.set(16, 0.02, 11); environmentGroup.add(drive2);

// ═══════════════════════════════════════════════
//  FRONT WALL BETWEEN HOUSES
// ═══════════════════════════════════════════════
// 1BHK front at world z = 0 + 7.5 = 7.5 (x from -4 to x=6 is the gap)
// 2BHK front at world z = 0 + 8 = 8
// Wall connects from 1BHK right edge (x=-4) to 2BHK left edge (x=6)
const frontWallMat = new THREE.MeshStandardMaterial({ color: 0xd4c4a8, roughness: 0.85, metalness: 0.05 });
const frontWallPillarMat = new THREE.MeshStandardMaterial({ color: 0xc0a882, roughness: 0.7, metalness: 0.1 });
const frontWallTopMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });

// Main wall section (fills the gap between houses)
const frontWall = new THREE.Mesh(new THREE.BoxGeometry(10, 4, 0.4), frontWallMat);
frontWall.position.set(1, 2.3, 7.75); frontWall.castShadow = true; frontWall.receiveShadow = true;
environmentGroup.add(frontWall);

// Wall top cap
const frontWallTop = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.25, 0.6), frontWallTopMat);
frontWallTop.position.set(1, 4.42, 7.75); frontWallTop.castShadow = true;
environmentGroup.add(frontWallTop);

// Pillars on the wall
for (let pi = 0; pi < 4; pi++) {
    const px = -3.5 + pi * 3;
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.8, 0.55), frontWallPillarMat);
    pillar.position.set(px, 2.7, 7.75); pillar.castShadow = true;
    environmentGroup.add(pillar);
    // Pillar cap
    const pillarCap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.75), frontWallTopMat);
    pillarCap.position.set(px, 5.2, 7.75);
    environmentGroup.add(pillarCap);
}

// Decorative arch gate in the center of the wall
const gatePostMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.6, metalness: 0.2 });
const gatePostL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.5, 0.5), gatePostMat);
gatePostL.position.set(-0.1, 3, 7.75); gatePostL.castShadow = true; environmentGroup.add(gatePostL);
const gatePostR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.5, 0.5), gatePostMat);
gatePostR.position.set(2.1, 3, 7.75); gatePostR.castShadow = true; environmentGroup.add(gatePostR);
// Gate arch top
const gateArch = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.35, 0.5), gatePostMat);
gateArch.position.set(1, 5.75, 7.75); environmentGroup.add(gateArch);
// Gate bars (iron gate look)
const gateBarMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });
for (let gi = 0; gi < 5; gi++) {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4, 6), gateBarMat);
    bar.position.set(0.2 + gi * 0.4, 2.3, 7.75); environmentGroup.add(bar);
}

// ═══════════════════════════════════════════════
//  SUN SPHERE
// ═══════════════════════════════════════════════
const sunGeo = new THREE.SphereGeometry(3, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
sunMesh.position.set(30, 35, -20);
environmentGroup.add(sunMesh);

const sunGlowGeo = new THREE.SphereGeometry(5, 32, 32);
const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xffee88, transparent: true, opacity: 0.15 });
const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
sunGlow.position.copy(sunMesh.position);
environmentGroup.add(sunGlow);

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
    environmentGroup.add(group);
    return group;
}

const clouds = [
    createCloud(-15, 20, -10, 1.5), createCloud(20, 22, -15, 1.8),
    createCloud(5, 18, -25, 1.2), createCloud(-25, 24, -20, 1.4),
    createCloud(30, 19, -8, 1.0)
];

// ═══════════════════════════════════════════════
//  NATURAL TREES & BUSHES
// ═══════════════════════════════════════════════
function createTree(x, y, z, scale) {
    const g = new THREE.Group();

    // Trunk with root flare
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.3 * scale, 2.8 * scale, 8), trunkMat);
    trunk.position.y = 1.4 * scale; trunk.castShadow = true; g.add(trunk);

    // Root flare
    const rootMat = new THREE.MeshStandardMaterial({ color: 0x4a2e14, roughness: 0.95 });
    for (let ri = 0; ri < 4; ri++) {
        const root = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * scale, 0.12 * scale, 0.6 * scale, 4), rootMat);
        const angle = (ri / 4) * Math.PI * 2 + Math.random() * 0.5;
        root.position.set(Math.cos(angle) * 0.15 * scale, 0.15 * scale, Math.sin(angle) * 0.15 * scale);
        root.rotation.z = (Math.random() - 0.5) * 0.4;
        g.add(root);
    }

    // Branches
    const branchMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.85 });
    for (let bi = 0; bi < 3; bi++) {
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.03 * scale, 0.06 * scale, 1.2 * scale, 4), branchMat);
        const angle = (bi / 3) * Math.PI * 2 + Math.random() * 0.5;
        branch.position.set(Math.cos(angle) * 0.5 * scale, (2.2 + bi * 0.4) * scale, Math.sin(angle) * 0.5 * scale);
        branch.rotation.z = Math.cos(angle) * 0.6;
        branch.rotation.x = Math.sin(angle) * 0.6;
        g.add(branch);
    }

    // Foliage clusters (varied spheres for natural look)
    const foliageColors = [0x2d7d2d, 0x3a9d3a, 0x228B22, 0x1a6b1a, 0x45a845];
    const foliagePositions = [
        { x: 0, y: 3.2, z: 0, r: 1.3 },
        { x: 0.6, y: 3.6, z: 0.3, r: 1.0 },
        { x: -0.5, y: 3.4, z: -0.4, r: 1.1 },
        { x: 0.3, y: 4.2, z: -0.2, r: 0.9 },
        { x: -0.3, y: 4.5, z: 0.3, r: 0.7 },
        { x: 0, y: 4.8, z: 0, r: 0.55 },
        { x: 0.7, y: 3.0, z: -0.5, r: 0.8 },
        { x: -0.6, y: 3.8, z: 0.5, r: 0.75 }
    ];
    foliagePositions.forEach((fp, i) => {
        const jitterX = (Math.random() - 0.5) * 0.3;
        const jitterZ = (Math.random() - 0.5) * 0.3;
        const color = foliageColors[i % foliageColors.length];
        const f = new THREE.Mesh(
            new THREE.SphereGeometry(fp.r * scale * (0.85 + Math.random() * 0.3), 10, 10),
            new THREE.MeshStandardMaterial({ color: color, roughness: 0.85 })
        );
        f.position.set((fp.x + jitterX) * scale, fp.y * scale, (fp.z + jitterZ) * scale);
        f.castShadow = true;
        g.add(f);
    });

    g.position.set(x, y, z); environmentGroup.add(g); return g;
}

function createBush(x, y, z, scale) {
    const g = new THREE.Group();
    const bushColors = [0x2e8b2e, 0x3a7a3a, 0x228822];
    for (let i = 0; i < 3; i++) {
        const radius = (0.35 + Math.random() * 0.25) * scale;
        const b = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 8, 8),
            new THREE.MeshStandardMaterial({ color: bushColors[i % bushColors.length], roughness: 0.9 })
        );
        b.position.set((Math.random() - 0.5) * 0.4 * scale, (0.2 + radius * 0.5) * scale, (Math.random() - 0.5) * 0.3 * scale);
        g.add(b);
    }
    g.position.set(x, y, z); environmentGroup.add(g); return g;
}

// Far side trees (across the road - kept)
createTree(-30, 0, 19, 1.3); createTree(-22, 0, 18, 1.1); createTree(-12, 0, 20, 1.4);
createTree(-2, 0, 19, 1.0); createTree(8, 0, 20, 1.5); createTree(18, 0, 18, 1.2);
createTree(28, 0, 19, 1.3); createTree(35, 0, 20, 1.1);

// NOTE: Near-side trees REMOVED to clear view of both houses

// NOTE: Trees behind houses REMOVED for clearer view

// Side trees (far from houses)
createTree(-35, 0, 5, 1.1); createTree(38, 0, 6, 1.2);
createTree(-38, 0, -5, 1.0); createTree(40, 0, -6, 1.3);

// Bushes along far side of road only
createBush(-25, 0, 18, 1.2); createBush(-16, 0, 19, 1.0); createBush(-5, 0, 18, 0.9);
createBush(5, 0, 19, 1.1); createBush(15, 0, 18, 1.0); createBush(25, 0, 19, 1.3);
createBush(32, 0, 18, 0.8);

// Small flower patches near houses (decorative)
function createFlowerPatch(x, z) {
    const g = new THREE.Group();
    const flowerColors = [0xff6b9d, 0xffd93d, 0xff6b6b, 0xc56cf0, 0xff9ff3];
    for (let i = 0; i < 6; i++) {
        const flower = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 6, 6),
            new THREE.MeshStandardMaterial({ color: flowerColors[i % flowerColors.length] })
        );
        flower.position.set((Math.random() - 0.5) * 1.2, 0.15, (Math.random() - 0.5) * 0.8);
        g.add(flower);
        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.01, 0.01, 0.15, 4),
            new THREE.MeshStandardMaterial({ color: 0x228B22 })
        );
        stem.position.copy(flower.position);
        stem.position.y -= 0.08;
        g.add(stem);
    }
    g.position.set(x, 0, z);
    environmentGroup.add(g);
}
createFlowerPatch(-20, 6); createFlowerPatch(-10, 5.5);
createFlowerPatch(10, 6); createFlowerPatch(22, 5.5);

// ═══════════════════════════════════════════════
//  BIRDS IN THE SKY
// ═══════════════════════════════════════════════
const birds = [];

function createBird(x, y, z, scale) {
    const g = new THREE.Group();
    const birdMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });

    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.12 * scale, 6, 6), birdMat);
    body.scale.set(1, 0.6, 2);
    g.add(body);

    // Left wing
    const leftWing = new THREE.Group();
    const lw = new THREE.Mesh(new THREE.PlaneGeometry(0.6 * scale, 0.12 * scale), birdMat);
    lw.position.x = -0.3 * scale;
    lw.rotation.z = 0.3;
    leftWing.add(lw);
    leftWing.position.set(-0.05 * scale, 0.02 * scale, 0);
    g.add(leftWing);

    // Right wing
    const rightWing = new THREE.Group();
    const rw = new THREE.Mesh(new THREE.PlaneGeometry(0.6 * scale, 0.12 * scale), birdMat);
    rw.position.x = 0.3 * scale;
    rw.rotation.z = -0.3;
    rightWing.add(rw);
    rightWing.position.set(0.05 * scale, 0.02 * scale, 0);
    g.add(rightWing);

    g.position.set(x, y, z);
    environmentGroup.add(g);

    birds.push({
        group: g,
        leftWing: leftWing,
        rightWing: rightWing,
        speed: 1.5 + Math.random() * 2,
        flapSpeed: 3 + Math.random() * 3,
        flapPhase: Math.random() * Math.PI * 2,
        circleRadius: 8 + Math.random() * 15,
        circleSpeed: 0.2 + Math.random() * 0.3,
        baseY: y,
        bobAmount: 0.3 + Math.random() * 0.5,
        startAngle: Math.random() * Math.PI * 2
    });

    return g;
}

// Place birds at different heights and positions
createBird(-10, 25, -12, 1.0);
createBird(5, 28, -18, 0.8);
createBird(15, 22, -10, 1.2);
createBird(-20, 30, -15, 0.7);
createBird(25, 26, -20, 0.9);
createBird(-5, 32, -8, 1.1);
createBird(10, 24, -25, 0.8);
createBird(-15, 27, -22, 1.0);
createBird(30, 29, -14, 0.6);
createBird(0, 31, -5, 0.9);
