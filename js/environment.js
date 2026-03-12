// ═══════════════════════════════════════════════
//  ENVIRONMENT GROUP (toggle visibility when inside)
// ═══════════════════════════════════════════════
const environmentGroup = new THREE.Group();
scene.add(environmentGroup);

// ═══════════════════════════════════════════════
//  GROUND
// ═══════════════════════════════════════════════
const groundGeo = new THREE.PlaneGeometry(250, 250);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x4a8c3f, roughness: 0.9, metalness: 0.0 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
environmentGroup.add(ground);

// ── BUILDING POSITIONS (world coords) ──
const BUILDING_POSITIONS = {
    '1bhk':        { x: -22, z: 0 },
    '2bhk':        { x: 24,  z: 0 },
    'school':      { x: -20, z: -40 },
    'office':      { x: 20,  z: -40 },
    'grid-office': { x: 0,   z: -70 },
    'solar-office': { x: 0,  z: -100 },
};
window.BUILDING_POSITIONS = BUILDING_POSITIONS;

// Grass patches for natural look
for (let i = 0; i < 30; i++) {
    const patchSize = 2 + Math.random() * 5;
    const patch = new THREE.Mesh(
        new THREE.CircleGeometry(patchSize, 8),
        new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.28 + Math.random() * 0.06, 0.6 + Math.random() * 0.2, 0.25 + Math.random() * 0.1), roughness: 0.95 })
    );
    patch.rotation.x = -Math.PI / 2;
    patch.position.set((Math.random() - 0.5) * 200, 0.01, (Math.random() - 0.5) * 200);
    environmentGroup.add(patch);
}

// ── ROADS TO NEW BUILDINGS ──
// Vertical road from houses to school+office area
const roadSouth1 = new THREE.Mesh(new THREE.PlaneGeometry(7, 60), roadMat);
roadSouth1.rotation.x = -Math.PI / 2; roadSouth1.position.set(0, 0.03, -25);
roadSouth1.receiveShadow = true; environmentGroup.add(roadSouth1);
// Dashed center line for south road
for (let d = 0; d < 30; d++) {
    const dm = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 1.5), new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.8 }));
    dm.rotation.x = -Math.PI / 2; dm.position.set(0, 0.04, 5 - d * 2);
    environmentGroup.add(dm);
}
// Road from grid office to solar office
const roadSouth2 = new THREE.Mesh(new THREE.PlaneGeometry(7, 40), roadMat);
roadSouth2.rotation.x = -Math.PI / 2; roadSouth2.position.set(0, 0.03, -85);
roadSouth2.receiveShadow = true; environmentGroup.add(roadSouth2);
// Cross road at z=-40 connecting school and office
const crossRoad1 = new THREE.Mesh(new THREE.PlaneGeometry(60, 7), roadMat);
crossRoad1.rotation.x = -Math.PI / 2; crossRoad1.position.set(0, 0.03, -28);
crossRoad1.receiveShadow = true; environmentGroup.add(crossRoad1);

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
drive1.rotation.x = -Math.PI / 2; drive1.position.set(-22, 0.02, 12); environmentGroup.add(drive1);
const drive2 = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 5), driveMat);
drive2.rotation.x = -Math.PI / 2; drive2.position.set(24, 0.02, 13); environmentGroup.add(drive2);

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
const frontWall = new THREE.Mesh(new THREE.BoxGeometry(18, 4, 0.4), frontWallMat);
frontWall.position.set(1, 2.3, 10); frontWall.castShadow = true; frontWall.receiveShadow = true;
environmentGroup.add(frontWall);

// Wall top cap
const frontWallTop = new THREE.Mesh(new THREE.BoxGeometry(18.4, 0.25, 0.6), frontWallTopMat);
frontWallTop.position.set(1, 4.42, 10); frontWallTop.castShadow = true;
environmentGroup.add(frontWallTop);

// Pillars on the wall
for (let pi = 0; pi < 6; pi++) {
    const px = -7 + pi * 3.2;
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4.8, 0.55), frontWallPillarMat);
    pillar.position.set(px, 2.7, 10); pillar.castShadow = true;
    environmentGroup.add(pillar);
    const pillarCap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.75), frontWallTopMat);
    pillarCap.position.set(px, 5.2, 10);
    environmentGroup.add(pillarCap);
}

// Decorative arch gate in the center of the wall
const gatePostMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.6, metalness: 0.2 });
const gatePostL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.5, 0.5), gatePostMat);
gatePostL.position.set(-0.1, 3, 10); gatePostL.castShadow = true; environmentGroup.add(gatePostL);
const gatePostR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.5, 0.5), gatePostMat);
gatePostR.position.set(2.1, 3, 10); gatePostR.castShadow = true; environmentGroup.add(gatePostR);
// Gate arch top
const gateArch = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.35, 0.5), gatePostMat);
gateArch.position.set(1, 5.75, 10); environmentGroup.add(gateArch);
// Gate bars
const gateBarMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });
for (let gi = 0; gi < 5; gi++) {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4, 6), gateBarMat);
    bar.position.set(0.2 + gi * 0.4, 2.3, 10); environmentGroup.add(bar);
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
//  NATURAL TREES & BUSHES — 5 DISTINCT TYPES
// ═══════════════════════════════════════════════

// ── TYPE 1: ROUND TREE (classic) ──
function createRoundTree(x, y, z, scale) {
    const g = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.28 * scale, 2.8 * scale, 8), trunkMat);
    trunk.position.y = 1.4 * scale; trunk.castShadow = true; g.add(trunk);
    const foliageColors = [0x2d7d2d, 0x3a9d3a, 0x228B22, 0x1a6b1a, 0x45a845];
    const positions = [
        { x: 0, y: 3.2, z: 0, r: 1.3 }, { x: 0.6, y: 3.6, z: 0.3, r: 1.0 },
        { x: -0.5, y: 3.4, z: -0.4, r: 1.1 }, { x: 0.3, y: 4.2, z: -0.2, r: 0.9 },
        { x: -0.3, y: 4.5, z: 0.3, r: 0.7 }, { x: 0, y: 4.8, z: 0, r: 0.55 }
    ];
    positions.forEach((fp, i) => {
        const f = new THREE.Mesh(
            new THREE.SphereGeometry(fp.r * scale * (0.85 + Math.random() * 0.3), 10, 10),
            new THREE.MeshStandardMaterial({ color: foliageColors[i % foliageColors.length], roughness: 0.85 })
        );
        f.position.set((fp.x + (Math.random() - 0.5) * 0.3) * scale, fp.y * scale, (fp.z + (Math.random() - 0.5) * 0.3) * scale);
        f.castShadow = true; g.add(f);
    });
    g.position.set(x, y, z); environmentGroup.add(g); return g;
}

// ── TYPE 2: PINE TREE (conical) ──
function createPineTree(x, y, z, scale) {
    const g = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2e14, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * scale, 0.2 * scale, 3.5 * scale, 6), trunkMat);
    trunk.position.y = 1.75 * scale; trunk.castShadow = true; g.add(trunk);
    const pineColors = [0x1a5c1a, 0x1e6b1e, 0x155215];
    for (let i = 0; i < 4; i++) {
        const coneR = (1.6 - i * 0.3) * scale;
        const coneH = (1.4 - i * 0.1) * scale;
        const cone = new THREE.Mesh(
            new THREE.ConeGeometry(coneR, coneH, 8),
            new THREE.MeshStandardMaterial({ color: pineColors[i % pineColors.length], roughness: 0.85 })
        );
        cone.position.y = (2.8 + i * 1.1) * scale;
        cone.castShadow = true; g.add(cone);
    }
    g.position.set(x, y, z); environmentGroup.add(g); return g;
}

// ── TYPE 3: TALL TREE (high canopy) ──
function createTallTree(x, y, z, scale) {
    const g = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.85 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * scale, 0.22 * scale, 4.5 * scale, 7), trunkMat);
    trunk.position.y = 2.25 * scale; trunk.castShadow = true; g.add(trunk);
    // Branches
    for (let bi = 0; bi < 2; bi++) {
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.03 * scale, 0.06 * scale, 1.5 * scale, 4), trunkMat);
        const angle = bi * Math.PI + Math.random() * 0.8;
        branch.position.set(Math.cos(angle) * 0.5 * scale, (3.5 + bi * 0.8) * scale, Math.sin(angle) * 0.5 * scale);
        branch.rotation.z = Math.cos(angle) * 0.7; g.add(branch);
    }
    // High foliage clusters
    const foliageColors = [0x2a8a2a, 0x3e9e3e, 0x1f751f];
    for (let fi = 0; fi < 5; fi++) {
        const r = (0.7 + Math.random() * 0.5) * scale;
        const f = new THREE.Mesh(
            new THREE.SphereGeometry(r, 8, 8),
            new THREE.MeshStandardMaterial({ color: foliageColors[fi % foliageColors.length], roughness: 0.85 })
        );
        f.position.set((Math.random() - 0.5) * 1.2 * scale, (4.8 + Math.random() * 1.5) * scale, (Math.random() - 0.5) * 1.2 * scale);
        f.castShadow = true; g.add(f);
    }
    g.position.set(x, y, z); environmentGroup.add(g); return g;
}

// ── TYPE 4: BUSHY TREE (short & wide) ──
function createBushyTree(x, y, z, scale) {
    const g = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x7a5230, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * scale, 0.3 * scale, 1.6 * scale, 8), trunkMat);
    trunk.position.y = 0.8 * scale; trunk.castShadow = true; g.add(trunk);
    // Wide dense foliage
    const bushyColors = [0x3d8b3d, 0x4ca64c, 0x2e7d2e, 0x55b855];
    for (let fi = 0; fi < 8; fi++) {
        const r = (0.6 + Math.random() * 0.6) * scale;
        const angle = (fi / 8) * Math.PI * 2;
        const dist = (0.4 + Math.random() * 0.8) * scale;
        const f = new THREE.Mesh(
            new THREE.SphereGeometry(r, 8, 8),
            new THREE.MeshStandardMaterial({ color: bushyColors[fi % bushyColors.length], roughness: 0.9 })
        );
        f.position.set(Math.cos(angle) * dist, (1.6 + Math.random() * 0.8) * scale, Math.sin(angle) * dist);
        f.castShadow = true; g.add(f);
    }
    // Top cluster
    const topF = new THREE.Mesh(
        new THREE.SphereGeometry(0.9 * scale, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x35993e, roughness: 0.85 })
    );
    topF.position.y = 2.8 * scale; topF.castShadow = true; g.add(topF);
    g.position.set(x, y, z); environmentGroup.add(g); return g;
}

// ── RANDOM TREE PICKER (ensures variety) ──
const treeCreators = [createRoundTree, createPineTree, createTallTree, createBushyTree];
let lastTreeType = -1;
function createRandomTree(x, y, z, scale) {
    let idx;
    do { idx = Math.floor(Math.random() * treeCreators.length); } while (idx === lastTreeType);
    lastTreeType = idx;
    return treeCreators[idx](x, y, z, scale);
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

// Far side trees (across the road — varied types)
// NOTE: Tree at (-22, 0, 18) REMOVED — was blocking front view of 1BHK house
createPineTree(-30, 0, 19, 1.3); createBushyTree(-15, 0, 21, 1.4);
createTallTree(-2, 0, 19, 1.0); createTallTree(8, 0, 20, 1.5); createPineTree(18, 0, 18, 1.2);
createBushyTree(28, 0, 19, 1.3); createRoundTree(35, 0, 20, 1.1);

// NOTE: Near-side trees REMOVED to clear view of both houses

// NOTE: Trees behind houses REMOVED for clearer view

// Side trees (far from houses — varied)
createTallTree(-35, 0, 5, 1.1); createRoundTree(38, 0, 6, 1.2);
createPineTree(-38, 0, -5, 1.0); createBushyTree(40, 0, -6, 1.3);

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
