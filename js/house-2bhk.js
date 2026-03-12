// ═══════════════════════════════════════════════
//  2BHK HOUSE — ALL TRANSPARENCY BUGS KILLED
//  Every wall: MeshStandardMaterial, transparent:false, opacity:1.0
//  Canvas floor textures, ceiling fixtures, proper room colors
// ═══════════════════════════════════════════════
const bhk2Group = new THREE.Group();
bhk2Group.position.set(24, 0, 0);
scene.add(bhk2Group);
let is2BHK = true;

// Room Groups
const roomGroups = {
    'Hall': new THREE.Group(),
    'Bedroom 1': new THREE.Group(),
    'Bedroom 2': new THREE.Group(),
    'Kitchen': new THREE.Group(),
    'Bathroom': new THREE.Group(),
    'Structure': new THREE.Group()
};
Object.values(roomGroups).forEach(g => bhk2Group.add(g));

// Enlarged Dimensions
const W2 = 28, D2 = 24;

// ═══════════════════════════════════════════════
//  STEP 2 — ALL WALL MATERIALS SOLID
// ═══════════════════════════════════════════════
const bhk2WallMat = new THREE.MeshStandardMaterial({
    color: 0xe0d0b8, roughness: 0.88, metalness: 0.0,
    transparent: false, opacity: 1.0, depthWrite: true, side: THREE.FrontSide
});
const bhk2RoofMat = new THREE.MeshStandardMaterial({
    color: 0x6B3410, roughness: 0.7, metalness: 0.1,
    transparent: false, opacity: 1.0, depthWrite: true
});
const bhk2DoorMat = new THREE.MeshStandardMaterial({
    color: 0x5c3a1e, roughness: 0.7, metalness: 0.0,
    transparent: false, opacity: 1.0, depthWrite: true
});
const bhk2TransWalls = [];

function addBhk2Wall(w, h, d, x, y, z, transp) {
    const mat = transp ? bhk2WallMat.clone() : bhk2WallMat;
    mat.transparent = false; mat.opacity = 1.0;
    mat.depthWrite = true; mat.depthTest = true;
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    roomGroups['Structure'].add(m); if (transp) bhk2TransWalls.push(m); return m;
}

const bhk2Floor = new THREE.Mesh(new THREE.BoxGeometry(W2, 0.3, D2), floorMat);
bhk2Floor.position.y = 0.15; bhk2Floor.receiveShadow = true; roomGroups['Structure'].add(bhk2Floor);

addBhk2Wall(W2, H, 0.3, 0, H / 2 + 0.3, -D2 / 2, false);  // Back
addBhk2Wall(0.3, H, D2, -W2 / 2, H / 2 + 0.3, 0, true);     // Left
addBhk2Wall(0.3, H, D2, W2 / 2, H / 2 + 0.3, 0, true);      // Right
addBhk2Wall((W2 - 3) / 2, H, 0.3, -(W2 + 3) / 4, H / 2 + 0.3, D2 / 2, true);
addBhk2Wall((W2 - 3) / 2, H, 0.3, (W2 + 3) / 4, H / 2 + 0.3, D2 / 2, true);
addBhk2Wall(3, 3.0, 0.3, 0, H - 1.2, D2 / 2, true);

// Front door
const mainDoor2BHK_pivot = new THREE.Group();
mainDoor2BHK_pivot.position.set(-1.5, 0, D2 / 2);
roomGroups['Structure'].add(mainDoor2BHK_pivot);
const mainDoor2BHK_mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.35), bhk2DoorMat);
mainDoor2BHK_mesh.position.set(1.5, 2.3, 0);
mainDoor2BHK_pivot.add(mainDoor2BHK_mesh);

// Roof
const bhk2RoofShape = new THREE.Shape();
bhk2RoofShape.moveTo(-W2 / 2 - 0.8, 0); bhk2RoofShape.lineTo(0, roofH + 1); bhk2RoofShape.lineTo(W2 / 2 + 0.8, 0); bhk2RoofShape.lineTo(-W2 / 2 - 0.8, 0);
const bhk2Roof = new THREE.Mesh(new THREE.ExtrudeGeometry(bhk2RoofShape, { depth: D2 + 1.6, bevelEnabled: false }), bhk2RoofMat);
bhk2Roof.position.set(0, H + 0.3, -D2 / 2 - 0.8); bhk2Roof.castShadow = true; roomGroups['Structure'].add(bhk2Roof);

// Windows — ONLY glass transparent
function addBhk2Window(x, y, z, ry) {
    const wg = new THREE.Group();
    wg.add(new THREE.Mesh(new THREE.BoxGeometry(2, 1.8, 0.15), windowFrameMat));
    const gl = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.5, 0.06), glassMat); gl.position.z = 0.06; wg.add(gl);
    wg.position.set(x, y, z); wg.rotation.y = ry || 0; roomGroups['Structure'].add(wg);
}
addBhk2Window(-7, 4, D2 / 2 + 0.15, 0); addBhk2Window(7, 4, D2 / 2 + 0.15, 0);
addBhk2Window(-W2 / 2 - 0.15, 4, -4, Math.PI / 2); addBhk2Window(W2 / 2 + 0.15, 4, -4, Math.PI / 2);
addBhk2Window(-W2 / 2 - 0.15, 4, 5, Math.PI / 2); addBhk2Window(W2 / 2 + 0.15, 4, 5, Math.PI / 2);

// Ceiling
const bhk2CeilingMat = new THREE.MeshStandardMaterial({
    color: 0xF8F6F2, roughness: 0.9, metalness: 0.0,
    transparent: false, opacity: 1.0, depthWrite: true, side: THREE.DoubleSide
});
const bhk2Ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W2 - 0.4, D2 - 0.4), bhk2CeilingMat);
bhk2Ceiling.rotation.x = Math.PI / 2; bhk2Ceiling.position.set(0, H + 0.2, 0);
bhk2Ceiling.receiveShadow = true; roomGroups['Structure'].add(bhk2Ceiling);

// 2BHK label
const bhk2LabelDiv = document.createElement('div');
bhk2LabelDiv.className = 'appliance-label';
bhk2LabelDiv.innerHTML = '<span class="name" style="font-size:1.1rem;">🏢 2BHK House</span>';
const bhk2Label = new THREE.CSS2DObject(bhk2LabelDiv);
bhk2Label.position.set(0, H + roofH + 4, 0);
bhk2Group.add(bhk2Label);

// ═══════════════════════════════════════════════
//  PARTITION WALLS — these CAN be semi-transparent when boy is near
// ═══════════════════════════════════════════════
const partWallMat = new THREE.MeshStandardMaterial({
    color: 0xf0e6d3, roughness: 0.85,
    transparent: true, opacity: 0.35,
    depthWrite: true, depthTest: true
});
const bhk2PartWalls = [];
function addPartWall(w, h, d, x, y, z, room) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), partWallMat.clone());
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    (room ? roomGroups[room] : roomGroups['Structure']).add(m);
    bhk2PartWalls.push(m); return m;
}

addPartWall(W2 - 0.4, H, 0.2, 0, H / 2 + 0.3, -5);
addPartWall(0.2, H, 7, 0, H / 2 + 0.3, -8.5);
addPartWall(0.2, H, 17, -5, H / 2 + 0.3, 3.5);
addPartWall(9, H, 0.2, -9.5, H / 2 + 0.3, 3);

// Room doors
createInteractiveDoor(bhk2Group, -5, 2.05, -5, 0, { x: -0.75, z: 0 }, Math.PI / 2, 24, 0);
createInteractiveDoor(bhk2Group, 5, 2.05, -5, 0, { x: -0.75, z: 0 }, -Math.PI / 2, 24, 0);
createInteractiveDoor(bhk2Group, -5, 2.05, -1, Math.PI / 2, { x: 0, z: -0.75 }, Math.PI / 2, 24, 0);
createInteractiveDoor(bhk2Group, -5, 2.05, 7, Math.PI / 2, { x: 0, z: -0.75 }, Math.PI / 2, 24, 0);

// ═══════════════════════════════════════════════
//  CANVAS-GENERATED FLOOR TEXTURES — STEP 5
// ═══════════════════════════════════════════════
function createBathroomMosaicTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#E8E8E8'; ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#C8C8C8'; ctx.lineWidth = 1;
    for (let x = 0; x <= 512; x += 24) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
    }
    for (let y = 0; y <= 512; y += 24) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
    }
    ctx.fillStyle = '#BBBBBB';
    for (let x = 0; x <= 512; x += 24) {
        for (let y = 0; y <= 512; y += 24) {
            ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 5);
    return tex;
}

const bhk2WoodTex = createWoodFloorTexture();
const bhk2KitchenTex = createKitchenTileTexture();
const bhk2BathTex = createBathroomMosaicTexture();

// ═══════════════════════════════════════════════
//  FLOOR TILES — with proper textures and room colors
// ═══════════════════════════════════════════════
function addFloorTile(color, w, d, x, z, room, tex) {
    const mat = new THREE.MeshStandardMaterial({
        color: color, roughness: 0.75,
        transparent: false, opacity: 1.0, depthWrite: true
    });
    if (tex) mat.map = tex;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.32, z); m.receiveShadow = true;
    (room ? roomGroups[room] : roomGroups['Structure']).add(m);
}

addFloorTile(0xE8DCC8, 18.5, 16.5, 4.5, 3.5, 'Hall', bhk2WoodTex);             // Hall
addFloorTile(0xD4E0EC, 13.5, 6.5, -7, -8.5, 'Bedroom 1', bhk2WoodTex.clone()); // Bedroom 1
addFloorTile(0xE8E0F0, 13.5, 6.5, 7, -8.5, 'Bedroom 2', bhk2WoodTex.clone());  // Bedroom 2
// Kitchen checkered
for (let ki = 0; ki < 8; ki++) for (let kj = 0; kj < 7; kj++) {
    addFloorTile((ki + kj) % 2 === 0 ? 0xf5f5f5 : 0x333333, 1, 1, -13.5 + ki * 1.1, -4.5 + kj * 1.1, 'Kitchen');
}
addFloorTile(0xE0F0F8, 8.5, 8.5, -9.5, 7.5, 'Bathroom', bhk2BathTex);          // Bathroom

// Ceiling light fixtures for each room
function createBhk2CeilingFixture(x, z, room) {
    const fg = new THREE.Group();
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xC8A84B, roughness: 0.3, metalness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 8, 32), ringMat);
    ring.rotation.x = Math.PI / 2; fg.add(ring);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xFFF4C2, emissive: 0xFFF4C2, emissiveIntensity: 1.2, transparent: false, opacity: 1.0, depthWrite: true }));
    fg.add(bulb);
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.6, 6),
        new THREE.MeshStandardMaterial({ color: 0x888888, transparent: false, opacity: 1.0, depthWrite: true }));
    wire.position.y = 0.3; fg.add(wire);
    fg.position.set(x, H + 0.1, z);
    (room ? roomGroups[room] : roomGroups['Structure']).add(fg);
}
createBhk2CeilingFixture(5, 4, 'Hall');
createBhk2CeilingFixture(-7, -8.5, 'Bedroom 1');
createBhk2CeilingFixture(7, -8.5, 'Bedroom 2');
createBhk2CeilingFixture(-9.5, -1, 'Kitchen');
createBhk2CeilingFixture(-9.5, 7.5, 'Bathroom');

// Room labels
function addRoomLabel(name, x, y, z, room) {
    const div = document.createElement('div');
    div.className = 'appliance-label';
    div.innerHTML = `<span class="name" style="font-size:0.9rem">${name}</span>`;
    const l = new THREE.CSS2DObject(div);
    l.position.set(x, y, z);
    (room ? roomGroups[room] : bhk2Group).add(l);
    return l;
}
const roomLabels = [
    addRoomLabel('🏠 Hall', 5, 5, 4, 'Hall'),
    addRoomLabel('🛏️ Bedroom 1', -7, 5, -8.5, 'Bedroom 1'),
    addRoomLabel('🛏️ Bedroom 2', 7, 5, -8.5, 'Bedroom 2'),
    addRoomLabel('🍳 Kitchen', -9.5, 5, -1, 'Kitchen'),
    addRoomLabel('🚿 Bathroom', -9.5, 5, 7.5, 'Bathroom')
];

// ═══════════════════════════════════════════════
//  2BHK APPLIANCES
// ═══════════════════════════════════════════════
const bhk2Appliances = [];
const bhk2AnimData = { fans: [], tableFans: [], acs: [], lights: [] };

// Beds
function createBed(x, y, z, color, room) {
    const g = new THREE.Group();
    const frameMat2 = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
    function addPart(geo, mat, px, py, pz, shadow) {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(px, py, pz); if (shadow) m.castShadow = true; g.add(m);
    }
    addPart(new THREE.BoxGeometry(2.8, 0.5, 3.5), frameMat2, 0, 0.25, 0, true);
    addPart(new THREE.BoxGeometry(2.6, 0.3, 3.3), new THREE.MeshStandardMaterial({ color: color, roughness: 0.9, transparent: false, opacity: 1.0, depthWrite: true }), 0, 0.65, 0, false);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, transparent: false, opacity: 1.0, depthWrite: true });
    addPart(new THREE.BoxGeometry(0.8, 0.15, 0.5), pillowMat, -0.5, 0.88, -1.3, false);
    addPart(new THREE.BoxGeometry(0.8, 0.15, 0.5), pillowMat, 0.5, 0.88, -1.3, false);
    addPart(new THREE.BoxGeometry(2.8, 1.5, 0.2), frameMat2, 0, 1, -1.7, false);
    g.position.set(x, y, z); roomGroups[room].add(g);
}
createBed(-7, 0.3, -9, 0x6495ED, 'Bedroom 1');
createBed(7, 0.3, -9, 0xDDA0DD, 'Bedroom 2');

// Hall Furniture
const hallSofaMat = new THREE.MeshStandardMaterial({ color: 0x4a6fa5, roughness: 0.8, transparent: false, opacity: 1.0, depthWrite: true });
const hallSofaSeat = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.6, 2), hallSofaMat);
hallSofaSeat.position.set(11, 0.9, 3); hallSofaSeat.castShadow = true; roomGroups['Hall'].add(hallSofaSeat);
const hallSofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.2, 0.4), hallSofaMat);
hallSofaBack.position.set(11, 1.5, 4); hallSofaBack.castShadow = true; roomGroups['Hall'].add(hallSofaBack);
const hallArmMat = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.75, transparent: false, opacity: 1.0, depthWrite: true });
const hallArmL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 2), hallArmMat);
hallArmL.position.set(8.9, 1.1, 3); roomGroups['Hall'].add(hallArmL);
const hallArmR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 2), hallArmMat);
hallArmR.position.set(13.1, 1.1, 3); roomGroups['Hall'].add(hallArmR);
for (let ci = 0; ci < 2; ci++) {
    const cush = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.6), new THREE.MeshStandardMaterial({ color: 0x6b8fc4, roughness: 0.85, transparent: false, opacity: 1.0, depthWrite: true }));
    cush.position.set(11 + ci * 2.2 - 1.1, 1.3, 3); roomGroups['Hall'].add(cush);
}

// Coffee Table
const coffeeTableMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
const coffeeTop = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 1.2), coffeeTableMat);
coffeeTop.position.set(5, 0.95, 3); coffeeTop.castShadow = true; roomGroups['Hall'].add(coffeeTop);
for (let li = 0; li < 4; li++) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6), coffeeTableMat);
    leg.position.set(5 + (li < 2 ? -1 : 1), 0.62, 3 + (li % 2 === 0 ? -0.45 : 0.45));
    roomGroups['Hall'].add(leg);
}

// Hall TV
const hallTvFrame = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 0.15), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.5, transparent: false, opacity: 1.0, depthWrite: true }));
hallTvFrame.position.set(5, 4.2, -4.8); roomGroups['Hall'].add(hallTvFrame);
const tvMat2bhk = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000, roughness: 0.1, transparent: false, opacity: 1.0, depthWrite: true });
const hallTvScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.9), tvMat2bhk);
hallTvScreen.position.set(5, 4.2, -4.72); roomGroups['Hall'].add(hallTvScreen);

// Decorative plant
const potMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8, transparent: false, opacity: 1.0, depthWrite: true });
const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.6, 8), potMat);
pot.position.set(-4, 0.6, 10); roomGroups['Hall'].add(pot);
const plant = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.9, transparent: false, opacity: 1.0, depthWrite: true }));
plant.position.set(-4, 1.3, 10); roomGroups['Hall'].add(plant);

// Kitchen
const counterMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.3, transparent: false, opacity: 1.0, depthWrite: true });
const counter = new THREE.Mesh(new THREE.BoxGeometry(4, 1.8, 0.8), counterMat);
counter.position.set(-11, 1.2, -3.5); counter.castShadow = true; roomGroups['Kitchen'].add(counter);
const stove = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.6), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.3, transparent: false, opacity: 1.0, depthWrite: true }));
stove.position.set(-11, 2.15, -3.5); roomGroups['Kitchen'].add(stove);
const kitchenSink = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.8), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.2, transparent: false, opacity: 1.0, depthWrite: true }));
kitchenSink.position.set(-11, 2.12, -1); roomGroups['Kitchen'].add(kitchenSink);
const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7, transparent: false, opacity: 1.0, depthWrite: true });
const cabinet = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 0.5), cabinetMat);
cabinet.position.set(-11, 4.5, -4.2); roomGroups['Kitchen'].add(cabinet);

// ═══════════════════════════════════════════════
//  BATHROOM FIXTURES
// ═══════════════════════════════════════════════
const bathX = -9.5;
const bathZ = 7.5;
const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.3, transparent: false, opacity: 1.0, depthWrite: true });
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1, transparent: false, opacity: 1.0, depthWrite: true });

// Toilet
const toiletBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 0.7, 12), whiteMat);
toiletBowl.position.set(bathX + 2, 0.65, bathZ + 2.5); roomGroups['Bathroom'].add(toiletBowl);
const toiletSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 12), whiteMat);
toiletSeat.position.set(bathX + 2, 1.03, bathZ + 2.5); roomGroups['Bathroom'].add(toiletSeat);
const toiletTank = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.3), whiteMat);
toiletTank.position.set(bathX + 2, 0.9, bathZ + 3.2); roomGroups['Bathroom'].add(toiletTank);
const flush = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.15), chromeMat);
flush.position.set(bathX + 2, 1.35, bathZ + 3.1); roomGroups['Bathroom'].add(flush);

// Basin
const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 0.15, 12), whiteMat);
basin.position.set(bathX - 1.5, 1.3, bathZ - 1.5); roomGroups['Bathroom'].add(basin);
const basinStand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.2, 8), whiteMat);
basinStand.position.set(bathX - 1.5, 0.6, bathZ - 1.5); roomGroups['Bathroom'].add(basinStand);
const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), chromeMat);
tap.position.set(bathX - 1.5, 1.55, bathZ - 1.8); roomGroups['Bathroom'].add(tap);
const tapSpout = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.2), chromeMat);
tapSpout.position.set(bathX - 1.5, 1.73, bathZ - 1.6); roomGroups['Bathroom'].add(tapSpout);

// Water stream — this is allowed to be transparent (water effect)
const waterStream = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1), new THREE.MeshStandardMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.6 }));
waterStream.position.set(bathX - 1.5, 1.2, bathZ - 1.5); waterStream.visible = false; roomGroups['Bathroom'].add(waterStream);

// Shower partition — allowed transparent (glass)
const showerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.5, 6), chromeMat);
showerPipe.position.set(bathX + 2, 2.05, bathZ - 1.5); roomGroups['Bathroom'].add(showerPipe);
const showerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.08, 12), chromeMat);
showerHead.position.set(bathX + 2, 3.8, bathZ - 1.5); roomGroups['Bathroom'].add(showerHead);
const showerTap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 6), chromeMat);
showerTap.position.set(bathX + 2, 2.5, bathZ - 1.35); roomGroups['Bathroom'].add(showerTap);

// Bucket
const bucketMat = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.6, transparent: false, opacity: 1.0, depthWrite: true });
const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.5, 10), bucketMat);
bucket.position.set(bathX + 0.5, 0.55, bathZ + 0.5); roomGroups['Bathroom'].add(bucket);
const bucketHandle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.015, 6, 12, Math.PI), chromeMat);
bucketHandle.position.set(bathX + 0.5, 0.85, bathZ + 0.5);
bucketHandle.rotation.x = Math.PI; roomGroups['Bathroom'].add(bucketHandle);

// Mirror — allowed transparent with metalness
const mirrorMat = new THREE.MeshStandardMaterial({
    color: 0xCCDDFF, transparent: true, opacity: 0.30,
    metalness: 0.95, roughness: 0.05, depthWrite: false
});
const mirror = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.6), mirrorMat);
mirror.position.set(bathX - 1.5, 2.5, bathZ - 2.2);
roomGroups['Bathroom'].add(mirror);

// ═══════════════════════════════════════════════
//  2BHK ROOM APPLIANCE DEFINITIONS
// ═══════════════════════════════════════════════
const bhk2RoomDefs = [
    {
        room: 'Hall', appliances: [
            { type: 'fan', name: 'Ceiling Fan', watt: 75, emoji: '🌀', x: 5, y: H - 0.3, z: 4 },
            { type: 'light', name: 'Light Bulb', watt: 60, emoji: '💡', x: 2, y: H - 0.5, z: 0 },
            { type: 'ac', name: 'Air Conditioner', watt: 1500, emoji: '❄️', x: 10, y: 5, z: -4.5 },
            { type: 'tv', name: 'Television', watt: 180, emoji: '📺', x: 0, y: 0, z: 0 },
        ]
    },
    {
        room: 'Bedroom 1', appliances: [
            { type: 'fan', name: 'Ceiling Fan', watt: 75, emoji: '🌀', x: -7, y: H - 0.3, z: -8.5 },
            { type: 'light', name: 'Light Bulb', watt: 60, emoji: '💡', x: -10, y: H - 0.5, z: -9 },
            { type: 'ac', name: 'Air Conditioner', watt: 1500, emoji: '❄️', x: -4, y: 5, z: -D2 / 2 + 0.7 },
            { type: 'generic', name: 'Laptop Charger', watt: 65, emoji: '💻' },
            { type: 'generic', name: 'Mobile Charger', watt: 10, emoji: '📱' },
        ]
    },
    {
        room: 'Bedroom 2', appliances: [
            { type: 'fan', name: 'Ceiling Fan', watt: 75, emoji: '🌀', x: 7, y: H - 0.3, z: -8.5 },
            { type: 'light', name: 'Light Bulb', watt: 60, emoji: '💡', x: 10, y: H - 0.5, z: -9 },
            { type: 'tablefan', name: 'Table Fan', watt: 55, emoji: '🌀', x: 10, y: 1.8, z: -7 },
            { type: 'generic', name: 'Mobile Charger', watt: 10, emoji: '📱' },
        ]
    },
    {
        room: 'Kitchen', appliances: [
            { type: 'light', name: 'Light Bulb', watt: 60, emoji: '💡', x: -9.5, y: H - 0.5, z: -1 },
            { type: 'fridge', name: 'Refrigerator', watt: 350, emoji: '🧊', x: -7, y: 0.3, z: 1 },
            { type: 'generic', name: 'Microwave', watt: 1200, emoji: '🔲' },
            { type: 'generic', name: 'Induction Stove', watt: 1800, emoji: '🍳' },
            { type: 'generic', name: 'Water Purifier', watt: 40, emoji: '💧' },
        ]
    },
    {
        room: 'Bathroom', appliances: [
            { type: 'light', name: 'Light Bulb', watt: 40, emoji: '💡', x: -9.5, y: H - 0.5, z: 7.5 },
            { type: 'tap', name: 'Wash Basin Tap', watt: 5, emoji: '🚿', x: 0, y: 0, z: 0 },
            { type: 'generic', name: 'Water Heater', watt: 2000, emoji: '🔥' },
        ]
    }
];

// Create 2BHK appliances
bhk2RoomDefs.forEach(roomDef => {
    roomDef.appliances.forEach(a => {
        let obj = null;
        if (a.type === 'light') {
            const lb = createLightBulb(a.x, a.y, a.z);
            bhk2Group.add(lb.group); applianceGroup.remove(lb.group);
            obj = { ...a, mesh: lb, on: true, kind: 'light' };
            bhk2AnimData.lights.push(obj);
        } else if (a.type === 'fan') {
            const f = createFan(a.x, a.y, a.z);
            bhk2Group.add(f.group); applianceGroup.remove(f.group);
            obj = { ...a, mesh: f, on: true, kind: 'fan' };
            bhk2AnimData.fans.push(obj);
        } else if (a.type === 'ac') {
            const ac2 = createAC(a.x, a.y, a.z);
            bhk2Group.add(ac2.group); bhk2Group.add(ac2.particles);
            applianceGroup.remove(ac2.group); applianceGroup.remove(ac2.particles);
            obj = { ...a, mesh: ac2, on: true, kind: 'ac' };
            bhk2AnimData.acs.push(obj);
        } else if (a.type === 'fridge') {
            const fr = createFridge(a.x, a.y, a.z);
            bhk2Group.add(fr.group); applianceGroup.remove(fr.group);
            obj = { ...a, mesh: fr, on: true, kind: 'fridge' };
        } else if (a.type === 'tablefan') {
            const tf = createTableFan(a.x, a.y, a.z);
            roomGroups[roomDef.room].add(tf.group);
            applianceGroup.remove(tf.group);
            const t = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.2), tableMat);
            t.position.set(a.x, 0.75, a.z); roomGroups[roomDef.room].add(t);
            obj = { ...a, mesh: tf, on: true, kind: 'tablefan' };
            bhk2AnimData.tableFans.push(obj);
        } else if (a.type === 'tv') {
            obj = { ...a, mesh: { screen: hallTvScreen }, on: false, kind: 'tv' };
        } else if (a.type === 'tap') {
            obj = { ...a, on: false, kind: 'tap' };
        } else if (a.type === 'generic') {
            obj = { ...a, mesh: null, on: true, kind: 'generic' };
        }
        if (obj) { obj.room = roomDef.room; bhk2Appliances.push(obj); }
    });
});

// ═══════════════════════════════════════════════
//  1BHK APPLIANCE STATE + TV
// ═══════════════════════════════════════════════
const simpleAppliances = [
    { name: 'Light Bulb', watt: 60, emoji: '💡', on: true, kind: 'light', mesh: light1, room: 'Hall' },
    { name: 'Ceiling Fan', watt: 75, emoji: '🌀', on: true, kind: 'fan', mesh: fan1, room: 'Hall' },
    { name: 'Air Conditioner', watt: 1500, emoji: '❄️', on: true, kind: 'ac', mesh: ac, room: 'Hall' },
    { name: 'Television', watt: 150, emoji: '📺', on: false, kind: 'tv', mesh: null, room: 'Hall' },
    { name: 'WiFi Router', watt: 10, emoji: '📶', on: true, kind: 'generic', mesh: null, room: 'Hall' },
    { name: 'Charging Port', watt: 15, emoji: '🔌', on: true, kind: 'generic', mesh: null, room: 'Hall' },
    { name: 'Refrigerator', watt: 350, emoji: '🧊', on: true, kind: 'fridge', mesh: fridge, room: 'Kitchen' },
    { name: 'Microwave', watt: 1200, emoji: '🔲', on: false, kind: 'generic', mesh: null, room: 'Kitchen' },
    { name: 'Induction Stove', watt: 1800, emoji: '🍳', on: false, kind: 'generic', mesh: null, room: 'Kitchen' },
    { name: 'Water Purifier', watt: 40, emoji: '💧', on: true, kind: 'generic', mesh: null, room: 'Kitchen' },
    { name: 'Mixer Grinder', watt: 600, emoji: '🔄', on: false, kind: 'generic', mesh: null, room: 'Kitchen' },
    { name: 'Light Bulb', watt: 60, emoji: '💡', on: true, kind: 'light', mesh: light2, room: 'Bedroom' },
    { name: 'Table Fan', watt: 55, emoji: '🌀', on: true, kind: 'tablefan', mesh: tableFan, room: 'Bedroom' },
    { name: 'Laptop Charger', watt: 65, emoji: '💻', on: false, kind: 'generic', mesh: null, room: 'Bedroom' },
    { name: 'Mobile Charger', watt: 10, emoji: '📱', on: false, kind: 'generic', mesh: null, room: 'Bedroom' }
];

// Simple house TV
const simpleTvFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.4, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111, transparent: false, opacity: 1.0, depthWrite: true }));
simpleTvFrame.position.set(5, 4, -4.8); houseGroup.add(simpleTvFrame);
const simpleTvScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.2), new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x000000, transparent: false, opacity: 1.0, depthWrite: true }));
simpleTvScreen.position.set(5, 4, -4.73); houseGroup.add(simpleTvScreen);
simpleAppliances[3].mesh = { frame: simpleTvFrame, screen: simpleTvScreen };

// ═══════════════════════════════════════════════
//  ROOF DATA — used by solar.js
// ═══════════════════════════════════════════════
const ROOF_DATA_2BHK = {
    centerX: 0, centerZ: 0,
    y: H + 0.3, peakY: H + 0.3 + roofH + 1,
    width: W2, depth: D2,
    slopeAngle: Math.atan2(roofH + 1, W2 / 2 + 0.8),
    slopeAxis: 'x',
};

window.ROOF_2BHK = {
    centerX: 24, centerZ: 0,
    roofY: H + 0.3 + roofH + 1 > 0 ? H + 0.3 + roofH + 1 : 5.5,
    width: W2, depth: D2,
    slopeAngle: Math.atan2(roofH + 1, W2 / 2 + 0.8),
};

const wallCount2BHK = bhk2TransWalls.length + bhk2PartWalls.length + 2;
console.log('[HOUSE-2BHK] Built — walls:', wallCount2BHK, '— roof data exported, window.ROOF_2BHK set');
