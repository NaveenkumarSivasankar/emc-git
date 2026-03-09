// ═══════════════════════════════════════════════
//  1BHK HOUSE STRUCTURE (ENLARGED & SPACIOUS)
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

// Materials
const wallColor = 0xe8d5b7;
const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.8, metalness: 0.05 });
const wallMatTransparent = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.8, metalness: 0.05, transparent: true, opacity: 1 });
const roofMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7, metalness: 0.1, transparent: true, opacity: 1 });
const floorMat = new THREE.MeshStandardMaterial({ color: 0xc9a96e, roughness: 0.85 });
const doorMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7, transparent: true, opacity: 1 });
const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
const glassMat = new THREE.MeshStandardMaterial({ color: 0x88ccee, transparent: true, opacity: 0.35, roughness: 0.1, metalness: 0.8 });
const handleMat = new THREE.MeshStandardMaterial({ color: 0xd4a843, metalness: 0.9, roughness: 0.2 });

// Floor
const floorGeo = new THREE.BoxGeometry(W, 0.3, D);
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.position.y = 0.15; floor.receiveShadow = true; houseGroup.add(floor);

// Walls (stored for transparency control)
const transparentWalls = [];
function createWall(w, h, d, x, y, z, mat, isTransparent) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const m = isTransparent ? wallMatTransparent.clone() : mat;
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
mainDoor1BHK_pivot.position.set(-1.5, 0, D / 2); // hinge at left edge
houseGroup.add(mainDoor1BHK_pivot);
const mainDoor1BHK_mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 4.5, 0.35), doorMat);
mainDoor1BHK_mesh.position.set(1.5, 2.55, 0); // offset from hinge
mainDoor1BHK_mesh.castShadow = true;
mainDoor1BHK_pivot.add(mainDoor1BHK_mesh);
const handle = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), handleMat);
handle.position.set(2.7, 2.8, 0.2);
mainDoor1BHK_pivot.add(handle);

// Windows
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
const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.85 });
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
const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6 });
const bbBack = new THREE.Mesh(new THREE.BoxGeometry(W - 0.4, 0.3, 0.15), baseboardMat);
bbBack.position.set(0, 0.45, -D / 2 + 0.2); interiorGroup.add(bbBack);

// ═══════════════════════════════════════════════
//  HALL FURNITURE (right-front: x=-4 to 14, z=-5 to 11)
// ═══════════════════════════════════════════════

// Rug in hall
const rugMat = new THREE.MeshStandardMaterial({ color: 0x8B2252, roughness: 0.95 });
const rug = new THREE.Mesh(new THREE.PlaneGeometry(8, 7), rugMat);
rug.rotation.x = -Math.PI / 2; rug.position.set(5, 0.35, 3); interiorGroup.add(rug);
const rugBorder = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 7.5), new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.9 }));
rugBorder.rotation.x = -Math.PI / 2; rugBorder.position.set(5, 0.33, 3); interiorGroup.add(rugBorder);

// Sofa in hall (against partition wall, moved to x=9 to unblock door at x=5)
const sofaMat = new THREE.MeshStandardMaterial({ color: 0x4a6fa5, roughness: 0.8 });
const sofaSeat = new THREE.Mesh(new THREE.BoxGeometry(5, 0.7, 2.2), sofaMat);
sofaSeat.position.set(9, 0.95, -3.5); sofaSeat.castShadow = true; interiorGroup.add(sofaSeat);
const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 0.45), sofaMat);
sofaBack.position.set(9, 1.7, -4.5); sofaBack.castShadow = true; interiorGroup.add(sofaBack);
const cushionMat = new THREE.MeshStandardMaterial({ color: 0x6b8fc4, roughness: 0.85 });
for (let ci = 0; ci < 2; ci++) {
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 1.7), cushionMat);
    cushion.position.set(9 + ci * 2.5 - 1.25, 1.45, -3.5); interiorGroup.add(cushion);
}
const armMat = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.75 });
const armL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 2.2), armMat);
armL.position.set(6.7, 1.2, -3.5); interiorGroup.add(armL);
const armR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 2.2), armMat);
armR.position.set(11.3, 1.2, -3.5); interiorGroup.add(armR);

// Bookshelf in hall (right wall)
const shelfMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.8 });
const shelfBody = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4.5, 0.9), shelfMat);
shelfBody.position.set(12, 2.55, 0); shelfBody.castShadow = true; interiorGroup.add(shelfBody);
for (let si = 0; si < 3; si++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.85), shelfMat);
    shelf.position.set(12, 1.2 + si * 1.4, 0); interiorGroup.add(shelf);
}
const bookColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0xe67e22, 0x1abc9c];
for (let bi = 0; bi < 7; bi++) {
    const bookH = 0.6 + Math.random() * 0.5;
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.22, bookH, 0.65), new THREE.MeshStandardMaterial({ color: bookColors[bi], roughness: 0.7 }));
    book.position.set(11 + bi * 0.28, 1.5 + bookH / 2, 0); interiorGroup.add(book);
}

// TV on partition wall (facing sofa, moved to x=9 to match sofa)
const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(4, 2.3, 0.15), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.5 }));
tvFrame.position.set(9, 4.5, -D / 2 + 0.25); interiorGroup.add(tvFrame);
const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2), new THREE.MeshStandardMaterial({ color: 0x225588, emissive: 0x112244, emissiveIntensity: 0.6, roughness: 0.1 }));
tvScreen.position.set(9, 4.5, -D / 2 + 0.34); interiorGroup.add(tvScreen);

// Wall clock
const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
clockFace.rotation.x = Math.PI / 2; clockFace.position.set(-2, 5.5, -D / 2 + 0.2); interiorGroup.add(clockFace);
const clockRim = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.06, 8, 24), new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3 }));
clockRim.position.set(-2, 5.5, -D / 2 + 0.22); interiorGroup.add(clockRim);

// ═══════════════════════════════════════════════
//  1BHK ROOM PARTITIONS & DOORS
// ═══════════════════════════════════════════════
const partWallMat1BHK = new THREE.MeshStandardMaterial({ color: 0xf0e6d3, roughness: 0.85, transparent: true, opacity: 0.35 });

// Horizontal partition separating front rooms from bedroom at z=-5
const pw1 = new THREE.Mesh(new THREE.BoxGeometry(W - 0.4, H, 0.2), partWallMat1BHK);
pw1.position.set(0, H / 2 + 0.3, -5); pw1.castShadow = true; houseGroup.add(pw1);

// Vertical partition separating hall from kitchen at x=-4
const kitchenDepth = D / 2 - 5;  // from z=-5 to z=D/2
const pw2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, H, kitchenDepth), partWallMat1BHK);
pw2.position.set(-4, H / 2 + 0.3, -5 + kitchenDepth / 2); pw2.castShadow = true; houseGroup.add(pw2);

// Room doors (interactive — swing open on approach)
// Bedroom door at z=-5, x=5
createInteractiveDoor(houseGroup, 5, 2.2, -5, 0, { x: -0.75, z: 0 }, Math.PI / 2, -22, 0);
// Kitchen door at x=-4, z=3
createInteractiveDoor(houseGroup, -4, 2.2, 3, Math.PI / 2, { x: 0, z: -0.75 }, Math.PI / 2, -22, 0);

// Room floor tiles
// Hall: x=-4 to W/2, z=-5 to D/2
const hallW = W / 2 + 4;
const hallD = D / 2 + 5;
const hallTile = new THREE.Mesh(new THREE.PlaneGeometry(hallW - 0.4, hallD - 0.4), new THREE.MeshStandardMaterial({ color: 0xd4b896, roughness: 0.75 }));
hallTile.rotation.x = -Math.PI / 2; hallTile.position.set(-4 + hallW / 2, 0.32, -5 + hallD / 2); houseGroup.add(hallTile);

// Kitchen: x=-W/2 to -4, z=-5 to D/2
const kitW = W / 2 - 4;
const kitD = D / 2 + 5;
const kitchenTile = new THREE.Mesh(new THREE.PlaneGeometry(kitW - 0.4, kitD - 0.4), new THREE.MeshStandardMaterial({ color: 0xf5f0e0, roughness: 0.75 }));
kitchenTile.rotation.x = -Math.PI / 2; kitchenTile.position.set(-W / 2 + kitW / 2, 0.32, -5 + kitD / 2); houseGroup.add(kitchenTile);

// Bedroom: full width, z=-D/2 to -5
const bedD = D / 2 - 5;
const bedTile = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.4, bedD - 0.4), new THREE.MeshStandardMaterial({ color: 0xa8c8e8, roughness: 0.75 }));
bedTile.rotation.x = -Math.PI / 2; bedTile.position.set(0, 0.32, -D / 2 + bedD / 2); houseGroup.add(bedTile);

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

// Room zoom positions for 1BHK (world coords — houseGroup at -14,0,0)
const bhk1RoomPositions = {
    'Hall': { target: new THREE.Vector3(-17, 3.5, 3), camera: new THREE.Vector3(-17, 10, 16) },
    'Kitchen': { target: new THREE.Vector3(-31, 3.5, 3), camera: new THREE.Vector3(-31, 10, 16) },
    'Bedroom': { target: new THREE.Vector3(-22, 3.5, -8), camera: new THREE.Vector3(-22, 10, 2) }
};

// ═══════════════════════════════════════════════
//  1BHK BEDROOM FURNITURE (z=-11 to -5, full width)
// ═══════════════════════════════════════════════
const bedFrameMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7 });
const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.55, 4.2), bedFrameMat);
bedFrame.position.set(3, 0.58, -8.5); bedFrame.castShadow = true; houseGroup.add(bedFrame);
const bedMattress = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.35, 4), new THREE.MeshStandardMaterial({ color: 0x6495ED, roughness: 0.9 }));
bedMattress.position.set(3, 1.03, -8.5); houseGroup.add(bedMattress);
const pillowMat1 = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.17, 0.55), pillowMat1);
pillow1.position.set(2.4, 1.3, -10.2); houseGroup.add(pillow1);
const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.17, 0.55), pillowMat1);
pillow2.position.set(3.6, 1.3, -10.2); houseGroup.add(pillow2);
const bedHead = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.7, 0.22), bedFrameMat);
bedHead.position.set(3, 1.5, -10.5); houseGroup.add(bedHead);

// Wardrobe (left side of bedroom)
const wardrobeMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.8 });
const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.8, 1), wardrobeMat);
wardrobe.position.set(-11, 2.7, -8); wardrobe.castShadow = true; houseGroup.add(wardrobe);

// ═══════════════════════════════════════════════
//  1BHK KITCHEN FURNITURE (x=-14 to -4, z=-5 to 11)
// ═══════════════════════════════════════════════
const counterMat1 = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.3 });
const counter1 = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 0.9), counterMat1);
counter1.position.set(-10, 1.3, -3.5); counter1.castShadow = true; houseGroup.add(counter1);
const stove1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.7), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.3 }));
stove1.position.set(-10, 2.36, -3.5); houseGroup.add(stove1);
const cabinet1 = new THREE.Mesh(new THREE.BoxGeometry(4, 1.4, 0.6), new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 }));
cabinet1.position.set(-10, 5, -3.8); houseGroup.add(cabinet1);

// ═══════════════════════════════════════════════
//  ROOF DATA — used by solar.js for panel placement
// ═══════════════════════════════════════════════
const ROOF_DATA_1BHK = {
    centerX: 0,           // local to houseGroup
    centerZ: 0,
    y: H + 0.3,           // exact roof base height
    peakY: H + 0.3 + roofH,
    width: W,
    depth: D,
    slopeAngle: Math.atan2(roofH, W / 2 + 0.8),
    slopeAxis: 'x',
};
console.log('[HOUSE-1BHK] Built — roof data exported');
