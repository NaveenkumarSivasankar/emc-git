// ═══════════════════════════════════════════════
//  1BHK HOUSE STRUCTURE (ENLARGED & SPACIOUS)
//  FIXED: All walls SOLID — transparent:false, opacity:1.0
//  Canvas-generated floor textures, ceiling light fixtures
// ═══════════════════════════════════════════════
const houseGroup = new THREE.Group();
houseGroup.position.set(-22, 0, 0);
scene.add(houseGroup);

// Enlarged Dimensions
const W = 28, D = 22, H = 7, roofH = 4.5;

// House label
const simpleLabelDiv = document.createElement('div');
simpleLabelDiv.className = 'appliance-label';
simpleLabelDiv.innerHTML = '<span class="name" style="font-size:1.1rem;">🏠 1BHK House</span>';
const simpleLabel = new THREE.CSS2DObject(simpleLabelDiv);
simpleLabel.position.set(0, H + roofH + 3, 0);
houseGroup.add(simpleLabel);

// ═══════════════════════════════════════════════
//  STEP 4 — WALL COLORS
// ═══════════════════════════════════════════════
const WALL_COLORS = {
    hall:     0xE8DCC8,  // warm Indian cream
    bedroom:  0xD4E0EC,  // calm blue-white
    kitchen:  0xFFF3DC,  // warm yellowy white
    ceiling:  0xF8F6F2,  // off-white
    exterior: 0xe8d5b7,  // exterior wall
};

// ═══════════════════════════════════════════════
//  STEP 2 — WALL MATERIAL STANDARD
//  Every wall: MeshStandardMaterial, transparent:false, opacity:1.0
// ═══════════════════════════════════════════════
const wallColor = WALL_COLORS.exterior;
const wallMat = new THREE.MeshStandardMaterial({
    color: wallColor, roughness: 0.88, metalness: 0.0,
    transparent: false, opacity: 1.0, depthWrite: true, side: THREE.FrontSide
});
// Material for walls that become transparent when INSIDE (roof, outer walls)
const wallMatTransparent = new THREE.MeshStandardMaterial({
    color: wallColor, roughness: 0.88, metalness: 0.0,
    transparent: false, opacity: 1.0, depthWrite: true, side: THREE.FrontSide
});
const roofMat = new THREE.MeshStandardMaterial({
    color: 0x8B4513, roughness: 0.7, metalness: 0.1,
    transparent: false, opacity: 1.0, depthWrite: true
});
const floorMat = new THREE.MeshStandardMaterial({
    color: 0xc9a96e, roughness: 0.85, metalness: 0.0,
    transparent: false, opacity: 1.0, depthWrite: true
});
const doorMat = new THREE.MeshStandardMaterial({
    color: 0x5c3a1e, roughness: 0.7, metalness: 0.0,
    transparent: false, opacity: 1.0, depthWrite: true
});
const windowFrameMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.5, metalness: 0.0,
    transparent: false, opacity: 1.0, depthWrite: true
});
// ONLY glass may be transparent
const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88ccee, transparent: true, opacity: 0.20,
    roughness: 0.1, metalness: 0.8, depthWrite: false
});
const handleMat = new THREE.MeshStandardMaterial({
    color: 0xd4a843, metalness: 0.9, roughness: 0.2,
    transparent: false, opacity: 1.0, depthWrite: true
});

// ═══════════════════════════════════════════════
//  STEP 5 — CANVAS-GENERATED FLOOR TEXTURES
// ═══════════════════════════════════════════════
function createWoodFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#9B7B4E';
    ctx.fillRect(0, 0, 512, 512);
    // 8 vertical plank lines
    ctx.strokeStyle = '#7A5C30'; ctx.lineWidth = 2;
    for (let i = 1; i < 8; i++) {
        const x = (512 / 8) * i + (Math.random() - 0.5) * 4;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
    }
    // Horizontal grain lines
    ctx.strokeStyle = '#8A6B3E'; ctx.lineWidth = 0.8;
    for (let y = 0; y < 512; y += 24) {
        const offset = (Math.random() - 0.5) * 8;
        ctx.beginPath(); ctx.moveTo(0, y + offset); ctx.lineTo(512, y + offset); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 4);
    return tex;
}

function createKitchenTileTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#F5F5F0';
    ctx.fillRect(0, 0, 512, 512);
    // Alternating tiles
    for (let y = 0; y < 512; y += 64) {
        for (let x = 0; x < 512; x += 64) {
            if (((x / 64) + (y / 64)) % 2 === 0) {
                ctx.fillStyle = '#EFEDE8'; ctx.fillRect(x + 2, y + 2, 60, 60);
            }
        }
    }
    ctx.strokeStyle = '#D8D8D0'; ctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 64) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2.5);
    return tex;
}

const woodFloorTex = createWoodFloorTexture();
const kitchenTileTex = createKitchenTileTexture();

// Floor
const floorGeo = new THREE.BoxGeometry(W, 0.3, D);
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.position.y = 0.15; floor.receiveShadow = true; houseGroup.add(floor);

// Walls (stored for transparency control)
const transparentWalls = [];
function createWall(w, h, d, x, y, z, mat, isTransparent) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const m = isTransparent ? wallMatTransparent.clone() : mat;
    // STEP 1: Force solid wall properties
    m.transparent = false; m.opacity = 1.0;
    m.depthWrite = true; m.depthTest = true;
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true;
    houseGroup.add(mesh);
    if (isTransparent) transparentWalls.push(mesh);
    return mesh;
}

createWall(W, H, 0.3, 0, H / 2 + 0.3, -D / 2, wallMat, false);       // Back
createWall(0.3, H, D, -W / 2, H / 2 + 0.3, 0, wallMat, true);         // Left
createWall(0.3, H, D, W / 2, H / 2 + 0.3, 0, wallMat, true);          // Right
// Front walls with door gap
createWall((W - 3) / 2, H, 0.3, -(W + 3) / 4, H / 2 + 0.3, D / 2, wallMat, true);   // Front left
createWall((W - 3) / 2, H, 0.3, (W + 3) / 4, H / 2 + 0.3, D / 2, wallMat, true);    // Front right
createWall(3, 2.5, 0.3, 0, H - 0.95, D / 2, wallMat, true);           // Front above door

// Front door (animated pivot door)
const mainDoor1BHK_pivot = new THREE.Group();
mainDoor1BHK_pivot.position.set(-1.5, 0, D / 2);
houseGroup.add(mainDoor1BHK_pivot);
const mainDoor1BHK_mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 4.5, 0.35), doorMat);
mainDoor1BHK_mesh.position.set(1.5, 2.55, 0);
mainDoor1BHK_mesh.castShadow = true;
mainDoor1BHK_pivot.add(mainDoor1BHK_mesh);
const handle = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), handleMat);
handle.position.set(2.7, 2.8, 0.2);
mainDoor1BHK_pivot.add(handle);

// Windows — ONLY glass is transparent
function createWindow(x, y, z, rotY) {
    const group = new THREE.Group();
    group.add(new THREE.Mesh(new THREE.BoxGeometry(2.2, 2, 0.15), windowFrameMat));
    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.7, 0.06), glassMat);
    glass.position.z = 0.06; group.add(glass);
    const barH = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.06, 0.08), windowFrameMat);
    barH.position.z = 0.08; group.add(barH);
    const barV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.7, 0.08), windowFrameMat);
    barV.position.z = 0.08; group.add(barV);
    group.position.set(x, y, z); group.rotation.y = rotY || 0;
    houseGroup.add(group);
}
createWindow(-7, 4.5, D / 2 + 0.15, 0); createWindow(7, 4.5, D / 2 + 0.15, 0);
createWindow(-W / 2 - 0.15, 4.5, -3, Math.PI / 2); createWindow(W / 2 + 0.15, 4.5, -3, Math.PI / 2);
createWindow(-W / 2 - 0.15, 4.5, 4, Math.PI / 2); createWindow(W / 2 + 0.15, 4.5, 4, Math.PI / 2);

// Roof
const roofShape = new THREE.Shape();
roofShape.moveTo(-W / 2 - 0.8, 0); roofShape.lineTo(0, roofH); roofShape.lineTo(W / 2 + 0.8, 0);
roofShape.lineTo(-W / 2 - 0.8, 0);
const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: D + 1.6, bevelEnabled: false });
const roof = new THREE.Mesh(roofGeo, roofMat);
roof.position.set(0, H + 0.3, -D / 2 - 0.8); roof.castShadow = true; roof.receiveShadow = true;
houseGroup.add(roof);

// Chimney
const chimneyMat = new THREE.MeshStandardMaterial({
    color: 0x8B4513, roughness: 0.85, transparent: false, opacity: 1.0, depthWrite: true
});
const chimney = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.5, 1.3), chimneyMat);
chimney.position.set(7, H + roofH - 0.3, -3); chimney.castShadow = true; houseGroup.add(chimney);
const chimneyTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 1.6), chimneyMat);
chimneyTop.position.set(7, H + roofH + 1.4, -3); houseGroup.add(chimneyTop);

// ═══════════════════════════════════════════════
//  INTERIOR
// ═══════════════════════════════════════════════
const interiorGroup = new THREE.Group();
houseGroup.add(interiorGroup);

// Baseboard
const baseboardMat = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0, roughness: 0.6, transparent: false, opacity: 1.0, depthWrite: true
});
const bbBack = new THREE.Mesh(new THREE.BoxGeometry(W - 0.4, 0.3, 0.15), baseboardMat);
bbBack.position.set(0, 0.45, -D / 2 + 0.2); interiorGroup.add(bbBack);

// ═══════════════════════════════════════════════
//  STEP 6 — CEILING LIGHT FIXTURES
// ═══════════════════════════════════════════════
function createCeilingFixture(x, z, parent) {
    const fixtureGroup = new THREE.Group();
    // Outer ring
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.06, 8, 32),
        new THREE.MeshStandardMaterial({ color: 0xC8A84B, roughness: 0.3, metalness: 0.7, transparent: false, opacity: 1.0, depthWrite: true })
    );
    ring.rotation.x = Math.PI / 2;
    fixtureGroup.add(ring);
    // Bulb
    const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xFFF4C2, emissive: 0xFFF4C2, emissiveIntensity: 1.2, transparent: false, opacity: 1.0, depthWrite: true })
    );
    fixtureGroup.add(bulb);
    // Hanging wire
    const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.6, 6),
        new THREE.MeshStandardMaterial({ color: 0x888888, transparent: false, opacity: 1.0, depthWrite: true })
    );
    wire.position.y = 0.3;
    fixtureGroup.add(wire);
    fixtureGroup.position.set(x, H + 0.1, z);
    parent.add(fixtureGroup);
    return fixtureGroup;
}

// Ceiling fixtures for each room
createCeilingFixture(5, 3, houseGroup);    // Hall
createCeilingFixture(-9, 3, houseGroup);   // Kitchen
createCeilingFixture(0, -8, houseGroup);   // Bedroom

// ═══════════════════════════════════════════════
//  HALL FURNITURE (right-front: x=-4 to 14, z=-5 to 11)
// ═══════════════════════════════════════════════

// Rug in hall
const rugMat = new THREE.MeshStandardMaterial({ color: 0x8B2252, roughness: 0.95, transparent: false, opacity: 1.0, depthWrite: true });
const rug = new THREE.Mesh(new THREE.PlaneGeometry(8, 7), rugMat);
rug.rotation.x = -Math.PI / 2; rug.position.set(5, 0.35, 3); interiorGroup.add(rug);
const rugBorder = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 7.5), new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.9, transparent: false, opacity: 1.0, depthWrite: true }));
rugBorder.rotation.x = -Math.PI / 2; rugBorder.position.set(5, 0.33, 3); interiorGroup.add(rugBorder);

// Sofa in hall
const sofaMat = new THREE.MeshStandardMaterial({ color: 0x4a6fa5, roughness: 0.8, transparent: false, opacity: 1.0, depthWrite: true });
const sofaSeat = new THREE.Mesh(new THREE.BoxGeometry(5, 0.7, 2.2), sofaMat);
sofaSeat.position.set(9, 0.95, -3.5); sofaSeat.castShadow = true; interiorGroup.add(sofaSeat);
const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 0.45), sofaMat);
sofaBack.position.set(9, 1.7, -4.5); sofaBack.castShadow = true; interiorGroup.add(sofaBack);
const cushionMat = new THREE.MeshStandardMaterial({ color: 0x6b8fc4, roughness: 0.85, transparent: false, opacity: 1.0, depthWrite: true });
for (let ci = 0; ci < 2; ci++) {
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 1.7), cushionMat);
    cushion.position.set(9 + ci * 2.5 - 1.25, 1.45, -3.5); interiorGroup.add(cushion);
}
const armMat = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.75, transparent: false, opacity: 1.0, depthWrite: true });
const armL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 2.2), armMat);
armL.position.set(6.7, 1.2, -3.5); interiorGroup.add(armL);
const armR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 2.2), armMat);
armR.position.set(11.3, 1.2, -3.5); interiorGroup.add(armR);

// Bookshelf in hall (right wall)
const shelfMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.8, transparent: false, opacity: 1.0, depthWrite: true });
const shelfBody = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4.5, 0.9), shelfMat);
shelfBody.position.set(12, 2.55, 0); shelfBody.castShadow = true; interiorGroup.add(shelfBody);
for (let si = 0; si < 3; si++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.85), shelfMat);
    shelf.position.set(12, 1.2 + si * 1.4, 0); interiorGroup.add(shelf);
}
const bookColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0xe67e22, 0x1abc9c];
for (let bi = 0; bi < 7; bi++) {
    const bookH = 0.6 + Math.random() * 0.5;
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.22, bookH, 0.65), new THREE.MeshStandardMaterial({ color: bookColors[bi], roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true }));
    book.position.set(11 + bi * 0.28, 1.5 + bookH / 2, 0); interiorGroup.add(book);
}

// TV on partition wall
const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(4, 2.3, 0.15), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
tvFrame.position.set(9, 4.5, -D / 2 + 0.25); interiorGroup.add(tvFrame);
const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2), new THREE.MeshStandardMaterial({ color: 0x225588, emissive: 0x112244, emissiveIntensity: 0.6, roughness: 0.1, transparent: false, opacity: 1.0, depthWrite: true }));
tvScreen.position.set(9, 4.5, -D / 2 + 0.34); interiorGroup.add(tvScreen);

// Wall clock
const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
clockFace.rotation.x = Math.PI / 2; clockFace.position.set(-2, 5.5, -D / 2 + 0.2); interiorGroup.add(clockFace);
const clockRim = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.06, 8, 24), new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
clockRim.position.set(-2, 5.5, -D / 2 + 0.22); interiorGroup.add(clockRim);

// ═══════════════════════════════════════════════
//  1BHK ROOM PARTITIONS & DOORS
// ═══════════════════════════════════════════════
const partWallMat1BHK = new THREE.MeshStandardMaterial({
    color: 0xf0e6d3, roughness: 0.85,
    transparent: true, opacity: 0.35,
    depthWrite: true, depthTest: true
});

// Horizontal partition separating front rooms from bedroom at z=-5
const pw1 = new THREE.Mesh(new THREE.BoxGeometry(W - 0.4, H, 0.2), partWallMat1BHK);
pw1.position.set(0, H / 2 + 0.3, -5); pw1.castShadow = true; houseGroup.add(pw1);

// Vertical partition separating hall from kitchen at x=-4
const kitchenDepth = D / 2 - 5;
const pw2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, H, kitchenDepth), partWallMat1BHK);
pw2.position.set(-4, H / 2 + 0.3, -5 + kitchenDepth / 2); pw2.castShadow = true; houseGroup.add(pw2);

// Room doors (interactive — swing open on approach)
createInteractiveDoor(houseGroup, 5, 2.2, -5, 0, { x: -0.75, z: 0 }, Math.PI / 2, -22, 0);
createInteractiveDoor(houseGroup, -4, 2.2, 3, Math.PI / 2, { x: 0, z: -0.75 }, Math.PI / 2, -22, 0);

// Room floor tiles with proper textures
const hallW = W / 2 + 4;
const hallD = D / 2 + 5;
const hallFloorMat = new THREE.MeshStandardMaterial({
    color: 0xE8DCC8, roughness: 0.75, map: woodFloorTex,
    transparent: false, opacity: 1.0, depthWrite: true
});
const hallTile = new THREE.Mesh(new THREE.PlaneGeometry(hallW - 0.4, hallD - 0.4), hallFloorMat);
hallTile.rotation.x = -Math.PI / 2; hallTile.position.set(-4 + hallW / 2, 0.32, -5 + hallD / 2);
hallTile.receiveShadow = true; houseGroup.add(hallTile);

const kitW = W / 2 - 4;
const kitD = D / 2 + 5;
const kitFloorMat = new THREE.MeshStandardMaterial({
    color: 0xFFF3DC, roughness: 0.75, map: kitchenTileTex,
    transparent: false, opacity: 1.0, depthWrite: true
});
const kitchenTile = new THREE.Mesh(new THREE.PlaneGeometry(kitW - 0.4, kitD - 0.4), kitFloorMat);
kitchenTile.rotation.x = -Math.PI / 2; kitchenTile.position.set(-W / 2 + kitW / 2, 0.32, -5 + kitD / 2);
kitchenTile.receiveShadow = true; houseGroup.add(kitchenTile);

const bedD = D / 2 - 5;
const bedFloorMat = new THREE.MeshStandardMaterial({
    color: 0xD4E0EC, roughness: 0.75, map: woodFloorTex.clone(),
    transparent: false, opacity: 1.0, depthWrite: true
});
const bedTile = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.4, bedD - 0.4), bedFloorMat);
bedTile.rotation.x = -Math.PI / 2; bedTile.position.set(0, 0.32, -D / 2 + bedD / 2);
bedTile.receiveShadow = true; houseGroup.add(bedTile);

// Ceiling plane
const ceilingMat = new THREE.MeshStandardMaterial({
    color: WALL_COLORS.ceiling, roughness: 0.9, metalness: 0.0,
    transparent: false, opacity: 1.0, depthWrite: true, side: THREE.DoubleSide
});
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.4, D - 0.4), ceilingMat);
ceiling.rotation.x = Math.PI / 2; ceiling.position.set(0, H + 0.2, 0);
ceiling.receiveShadow = true; houseGroup.add(ceiling);

// 1BHK Room Labels
function add1BHKLabel(name, x, y, z) {
    const div = document.createElement('div');
    div.className = 'appliance-label';
    div.innerHTML = '<span class="name" style="font-size:0.9rem">' + name + '</span>';
    const l = new THREE.CSS2DObject(div);
    l.position.set(x, y, z); houseGroup.add(l); return l;
}
const bhk1RoomLabels = [
    add1BHKLabel('🏠 Hall', 5, 5, 3),
    add1BHKLabel('🍳 Kitchen', -9, 5, 3),
    add1BHKLabel('🛏️ Bedroom', 0, 5, -8)
];

// Room zoom positions for 1BHK
const bhk1RoomPositions = {
    'Hall': { target: new THREE.Vector3(-17, 3.5, 3), camera: new THREE.Vector3(-17, 10, 16) },
    'Kitchen': { target: new THREE.Vector3(-31, 3.5, 3), camera: new THREE.Vector3(-31, 10, 16) },
    'Bedroom': { target: new THREE.Vector3(-22, 3.5, -8), camera: new THREE.Vector3(-22, 10, 2) }
};

// ═══════════════════════════════════════════════
//  1BHK BEDROOM FURNITURE (z=-11 to -5, full width)
// ═══════════════════════════════════════════════
const bedFrameMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.55, 4.2), bedFrameMat);
bedFrame.position.set(3, 0.58, -8.5); bedFrame.castShadow = true; houseGroup.add(bedFrame);
const bedMattress = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.35, 4), new THREE.MeshStandardMaterial({ color: 0x6495ED, roughness: 0.9, transparent: false, opacity: 1.0, depthWrite: true }));
bedMattress.position.set(3, 1.03, -8.5); houseGroup.add(bedMattress);
const pillowMat1 = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, transparent: false, opacity: 1.0, depthWrite: true });
const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.17, 0.55), pillowMat1);
pillow1.position.set(2.4, 1.3, -10.2); houseGroup.add(pillow1);
const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.17, 0.55), pillowMat1);
pillow2.position.set(3.6, 1.3, -10.2); houseGroup.add(pillow2);
const bedHead = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.7, 0.22), bedFrameMat);
bedHead.position.set(3, 1.5, -10.5); houseGroup.add(bedHead);

// Wardrobe
const wardrobeMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.8, transparent: false, opacity: 1.0, depthWrite: true });
const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.8, 1), wardrobeMat);
wardrobe.position.set(-11, 2.7, -8); wardrobe.castShadow = true; houseGroup.add(wardrobe);

// ═══════════════════════════════════════════════
//  1BHK KITCHEN FURNITURE (x=-14 to -4, z=-5 to 11)
// ═══════════════════════════════════════════════
const counterMat1 = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.3, transparent: false, opacity: 1.0, depthWrite: true });
const counter1 = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 0.9), counterMat1);
counter1.position.set(-10, 1.3, -3.5); counter1.castShadow = true; houseGroup.add(counter1);
const stove1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.7), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
stove1.position.set(-10, 2.36, -3.5); houseGroup.add(stove1);
const cabinet1 = new THREE.Mesh(new THREE.BoxGeometry(4, 1.4, 0.6), new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true }));
cabinet1.position.set(-10, 5, -3.8); houseGroup.add(cabinet1);

// ═══════════════════════════════════════════════
//  ROOF DATA — used by solar.js for panel placement
// ═══════════════════════════════════════════════
const ROOF_DATA_1BHK = {
    centerX: 0,
    centerZ: 0,
    y: H + 0.3,
    peakY: H + 0.3 + roofH,
    width: W,
    depth: D,
    slopeAngle: Math.atan2(roofH, W / 2 + 0.8),
    slopeAxis: 'x',
};

window.ROOF_1BHK = {
    centerX: -22,
    centerZ: 0,
    roofY: -22 + H + 0.3 + roofH > 0 ? H + 0.3 + roofH : 5.5,
    width: W,
    depth: D,
    slopeAngle: Math.atan2(roofH, W / 2 + 0.8),
};

const wallCount1BHK = transparentWalls.length + 2;
console.log('[HOUSE-1BHK] Built — walls:', wallCount1BHK, '— roof data exported, window.ROOF_1BHK set');
console.log('[ROOM] Built hall — walls:', wallCount1BHK);
