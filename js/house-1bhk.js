// ═══════════════════════════════════════════════
//  1BHK HOUSE STRUCTURE (ENLARGED)
// ═══════════════════════════════════════════════
const houseGroup = new THREE.Group();
houseGroup.position.set(-14, 0, 0);
scene.add(houseGroup);

// Enlarged Dimensions
const W = 20, D = 15, H = 7, roofH = 4.5;

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
// Front walls: extend past side walls (overlap by 0.15) to eliminate corner gaps
createWall(8.9, H, 0.3, -5.7, H / 2 + 0.3, D / 2, wallMat, true);   // Front left
createWall(8.9, H, 0.3, 5.7, H / 2 + 0.3, D / 2, wallMat, true);    // Front right
createWall(2.5, 2.5, 0.3, 0, H - 0.95, D / 2, wallMat, true);        // Front above door

// Door
const mainDoorPivot1 = new THREE.Group();
mainDoorPivot1.position.set(-1.25, 2.55, D / 2);
houseGroup.add(mainDoorPivot1);
const doorGeo = new THREE.BoxGeometry(2.5, 4.5, 0.35);
const door = new THREE.Mesh(doorGeo, doorMat);
door.position.set(1.25, 0, 0); door.castShadow = true;
mainDoorPivot1.add(door);
const handle = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), handleMat);
handle.position.set(2.1, 0.25, 0.2);
mainDoorPivot1.add(handle);
window.mainDoorPivot1 = mainDoorPivot1;

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
createWindow(-5, 4.5, D / 2 + 0.15, 0); createWindow(5, 4.5, D / 2 + 0.15, 0);
createWindow(-W / 2 - 0.15, 4.5, -2, Math.PI / 2); createWindow(W / 2 + 0.15, 4.5, -2, Math.PI / 2);
createWindow(-W / 2 - 0.15, 4.5, 3, Math.PI / 2); createWindow(W / 2 + 0.15, 4.5, 3, Math.PI / 2);

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
chimney.position.set(5, H + roofH - 0.3, -2.5); chimney.castShadow = true; houseGroup.add(chimney);
const chimneyTop = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 1.6), chimneyMat);
chimneyTop.position.set(5, H + roofH + 1.4, -2.5); houseGroup.add(chimneyTop);

// ═══════════════════════════════════════════════
//  INTERIOR
// ═══════════════════════════════════════════════
const interiorGroup = new THREE.Group();
houseGroup.add(interiorGroup);

// Carpet / Rug
const rugMat = new THREE.MeshStandardMaterial({ color: 0x8B2252, roughness: 0.95 });
const rug = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 6), rugMat);
rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.35, 1); interiorGroup.add(rug);
const rugBorder = new THREE.Mesh(new THREE.PlaneGeometry(8, 6.5), new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.9 }));
rugBorder.rotation.x = -Math.PI / 2; rugBorder.position.set(0, 0.33, 1); interiorGroup.add(rugBorder);

// Baseboard
const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6 });
const bbBack = new THREE.Mesh(new THREE.BoxGeometry(W - 0.4, 0.3, 0.15), baseboardMat);
bbBack.position.set(0, 0.45, -D / 2 + 0.2); interiorGroup.add(bbBack);

// Sofa
const sofaMat = new THREE.MeshStandardMaterial({ color: 0x4a6fa5, roughness: 0.8 });
const sofaSeat = new THREE.Mesh(new THREE.BoxGeometry(5, 0.7, 2.2), sofaMat);
sofaSeat.position.set(-3, 0.95, -4.5); sofaSeat.castShadow = true; interiorGroup.add(sofaSeat);
const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(5, 1.4, 0.45), sofaMat);
sofaBack.position.set(-3, 1.7, -5.5); sofaBack.castShadow = true; interiorGroup.add(sofaBack);
const cushionMat = new THREE.MeshStandardMaterial({ color: 0x6b8fc4, roughness: 0.85 });
for (let ci = 0; ci < 2; ci++) {
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 1.7), cushionMat);
    cushion.position.set(-3 + ci * 2.5 - 1.25, 1.45, -4.5); interiorGroup.add(cushion);
}
const armMat = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.75 });
const armL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 2.2), armMat);
armL.position.set(-5.3, 1.2, -4.5); interiorGroup.add(armL);
const armR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 2.2), armMat);
armR.position.set(-0.7, 1.2, -4.5); interiorGroup.add(armR);

// Bookshelf
const shelfMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.8 });
const shelfBody = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4.5, 0.9), shelfMat);
shelfBody.position.set(6.5, 2.55, -5); shelfBody.castShadow = true; interiorGroup.add(shelfBody);
for (let si = 0; si < 3; si++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.85), shelfMat);
    shelf.position.set(6.5, 1.2 + si * 1.4, -5); interiorGroup.add(shelf);
}
const bookColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0xe67e22, 0x1abc9c];
for (let bi = 0; bi < 7; bi++) {
    const bookH = 0.6 + Math.random() * 0.5;
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.22, bookH, 0.65), new THREE.MeshStandardMaterial({ color: bookColors[bi], roughness: 0.7 }));
    book.position.set(5.5 + bi * 0.28, 1.5 + bookH / 2, -5); interiorGroup.add(book);
}

// TV on back wall
const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(4, 2.3, 0.15), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.5 }));
tvFrame.position.set(-3, 4.8, -D / 2 + 0.25); interiorGroup.add(tvFrame);
const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2), new THREE.MeshStandardMaterial({ color: 0x225588, emissive: 0x112244, emissiveIntensity: 0.6, roughness: 0.1 }));
tvScreen.position.set(-3, 4.8, -D / 2 + 0.34); interiorGroup.add(tvScreen);

// Wall clock
const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
clockFace.rotation.x = Math.PI / 2; clockFace.position.set(3, 5.5, -D / 2 + 0.2); interiorGroup.add(clockFace);
const clockRim = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.06, 8, 24), new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3 }));
clockRim.position.set(3, 5.5, -D / 2 + 0.22); interiorGroup.add(clockRim);

// ═══════════════════════════════════════════════
//  1BHK ROOM PARTITIONS & DOORS
// ═══════════════════════════════════════════════
const partWallMat1BHK = new THREE.MeshStandardMaterial({ color: 0xf0e6d3, roughness: 0.85, transparent: true, opacity: 0.35 });
// Horizontal partition separating front rooms from bedroom
const pw1 = new THREE.Mesh(new THREE.BoxGeometry(W - 0.4, H, 0.2), partWallMat1BHK);
pw1.position.set(0, H / 2 + 0.3, -1.5); pw1.castShadow = true; houseGroup.add(pw1);
// Vertical partition separating hall from kitchen
const pw2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, H, D / 2 - 1.5 - 0.2), partWallMat1BHK);
pw2.position.set(-2.5, H / 2 + 0.3, (D / 2 - 1.5) / 2 + 0.75); pw2.castShadow = true; houseGroup.add(pw2);

// Room doors
const roomDoorMat1 = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 });
const bhk1Doors = [];
function add1BHKDoor(x, y, z, ry) {
    const doorW = 1.7, halfW = 0.85;
    // Pivot at hinge edge
    const pivot = new THREE.Group();
    if (ry) {
        pivot.position.set(x, y, z + halfW);
    } else {
        pivot.position.set(x - halfW, y, z);
    }
    pivot.rotation.y = ry || 0;
    houseGroup.add(pivot);
    // Door mesh (offset so hinge edge is at pivot origin)
    const d = new THREE.Mesh(new THREE.BoxGeometry(doorW, 3.8, 0.25), roomDoorMat1);
    d.position.set(halfW, 0, 0);
    pivot.add(d);
    // Handle on far side from hinge
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), handleMat);
    h.position.set(doorW - 0.3, 0, 0.15);
    pivot.add(h);
    bhk1Doors.push({ pivot, mesh: d, handle: h, wx: -14 + x, wz: z, baseRy: ry || 0, openAngle: 0 });
}
add1BHKDoor(3, 2.2, -1.5, 0);       // Bedroom door
add1BHKDoor(-2.5, 2.2, 3.5, Math.PI / 2);  // Kitchen door

// Room floor tiles
const hallTile = new THREE.Mesh(new THREE.PlaneGeometry(W / 2 - 2.5, D / 2 - 1.5), new THREE.MeshStandardMaterial({ color: 0xd4b896, roughness: 0.75 }));
hallTile.rotation.x = -Math.PI / 2; hallTile.position.set(4, 0.32, (D / 2 - 1.5) / 2 + 0.75); houseGroup.add(hallTile);
const kitchenTile = new THREE.Mesh(new THREE.PlaneGeometry(W / 2 - 2.5, D / 2 - 1.5), new THREE.MeshStandardMaterial({ color: 0xf5f0e0, roughness: 0.75 }));
kitchenTile.rotation.x = -Math.PI / 2; kitchenTile.position.set(-6, 0.32, (D / 2 - 1.5) / 2 + 0.75); houseGroup.add(kitchenTile);
const bedTile = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.4, D / 2 - 1.5), new THREE.MeshStandardMaterial({ color: 0xa8c8e8, roughness: 0.75 }));
bedTile.rotation.x = -Math.PI / 2; bedTile.position.set(0, 0.32, -(D / 2 + 1.5) / 2); houseGroup.add(bedTile);

// 1BHK Room Labels
function add1BHKLabel(name, x, y, z) {
    const div = document.createElement('div');
    div.className = 'appliance-label';
    div.innerHTML = '<span class="name" style="font-size:0.9rem">' + name + '</span>';
    const l = new THREE.CSS2DObject(div);
    l.position.set(x, y, z); houseGroup.add(l); return l;
}
const bhk1RoomLabels = [
    add1BHKLabel('🏠 Hall', 4, 4.5, 3),
    add1BHKLabel('🍳 Kitchen', -6, 4.5, 3),
    add1BHKLabel('🛏️ Bedroom', 0, 4.5, -5)
];

// Room zoom positions for 1BHK
const bhk1RoomPositions = {
    'Hall': { target: new THREE.Vector3(-10, 3.5, 3), camera: new THREE.Vector3(-10, 8, 12) },
    'Kitchen': { target: new THREE.Vector3(-20, 3.5, 3), camera: new THREE.Vector3(-20, 8, 12) },
    'Bedroom': { target: new THREE.Vector3(-14, 3.5, -5), camera: new THREE.Vector3(-14, 8, 5) }
};

// ═══════════════════════════════════════════════
//  1BHK BEDROOM FURNITURE
// ═══════════════════════════════════════════════
const bedFrameMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7 });
const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.55, 4.2), bedFrameMat);
bedFrame.position.set(0, 0.58, -4.5); bedFrame.castShadow = true; houseGroup.add(bedFrame);
const bedMattress = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.35, 4), new THREE.MeshStandardMaterial({ color: 0x6495ED, roughness: 0.9 }));
bedMattress.position.set(0, 1.03, -4.5); houseGroup.add(bedMattress);
const pillowMat1 = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.17, 0.55), pillowMat1);
pillow1.position.set(-0.6, 1.3, -6.3); houseGroup.add(pillow1);
const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.17, 0.55), pillowMat1);
pillow2.position.set(0.6, 1.3, -6.3); houseGroup.add(pillow2);
const bedHead = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.7, 0.22), bedFrameMat);
bedHead.position.set(0, 1.5, -6.5); houseGroup.add(bedHead);

// Wardrobe
const wardrobeMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.8 });
const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.8, 1), wardrobeMat);
wardrobe.position.set(-7.5, 2.7, -5.5); wardrobe.castShadow = true; houseGroup.add(wardrobe);

// ═══════════════════════════════════════════════
//  1BHK KITCHEN FURNITURE
// ═══════════════════════════════════════════════
const counterMat1 = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.3 });
const counter1 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2, 0.9), counterMat1);
counter1.position.set(-6, 1.3, -0.5); counter1.castShadow = true; houseGroup.add(counter1);
const stove1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.7), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.3 }));
stove1.position.set(-6, 2.36, -0.5); houseGroup.add(stove1);
const cabinet1 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.4, 0.6), new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 }));
cabinet1.position.set(-6, 5, -0.8); houseGroup.add(cabinet1);
