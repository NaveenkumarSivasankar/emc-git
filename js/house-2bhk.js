// ═══════════════════════════════════════════════
//  2BHK HOUSE
// ═══════════════════════════════════════════════
const bhk2Group = new THREE.Group();
bhk2Group.position.set(16, 0, 0);
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

// Dimensions
const W2 = 20, D2 = 16;
const bhk2WallMat = new THREE.MeshStandardMaterial({ color: 0xe0d0b8, roughness: 0.8, transparent: true, opacity: 1 });
const bhk2RoofMat = new THREE.MeshStandardMaterial({ color: 0x6B3410, roughness: 0.7, metalness: 0.1, transparent: true, opacity: 1 });
const bhk2DoorMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7, transparent: true, opacity: 1 });
const bhk2TransWalls = [];

function addBhk2Wall(w, h, d, x, y, z, transp) {
    const mat = transp ? bhk2WallMat.clone() : bhk2WallMat;
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    roomGroups['Structure'].add(m); if (transp) bhk2TransWalls.push(m); return m;
}

// Floor
const bhk2Floor = new THREE.Mesh(new THREE.BoxGeometry(W2, 0.3, D2), floorMat);
bhk2Floor.position.y = 0.15; bhk2Floor.receiveShadow = true; roomGroups['Structure'].add(bhk2Floor);

// Walls
addBhk2Wall(W2, H, 0.3, 0, H / 2 + 0.3, -D2 / 2, false);
addBhk2Wall(0.3, H, D2, -W2 / 2, H / 2 + 0.3, 0, true);
addBhk2Wall(0.3, H, D2, W2 / 2, H / 2 + 0.3, 0, true);
// Front walls: extend past side walls (overlap by 0.15) to eliminate corner gaps
addBhk2Wall(8.9, H, 0.3, -5.7, H / 2 + 0.3, D2 / 2, true);
addBhk2Wall(8.9, H, 0.3, 5.7, H / 2 + 0.3, D2 / 2, true);
addBhk2Wall(2.5, 3.0, 0.3, 0, H - 1.2, D2 / 2, true);

// Door
const bhk2Door = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4, 0.35), bhk2DoorMat);
bhk2Door.position.set(0, 2.3, D2 / 2); roomGroups['Structure'].add(bhk2Door);

// Roof
const bhk2RoofShape = new THREE.Shape();
bhk2RoofShape.moveTo(-W2 / 2 - 0.8, 0); bhk2RoofShape.lineTo(0, roofH + 1); bhk2RoofShape.lineTo(W2 / 2 + 0.8, 0); bhk2RoofShape.lineTo(-W2 / 2 - 0.8, 0);
const bhk2Roof = new THREE.Mesh(new THREE.ExtrudeGeometry(bhk2RoofShape, { depth: D2 + 1.6, bevelEnabled: false }), bhk2RoofMat);
bhk2Roof.position.set(0, H + 0.3, -D2 / 2 - 0.8); bhk2Roof.castShadow = true; roomGroups['Structure'].add(bhk2Roof);

// Windows
function addBhk2Window(x, y, z, ry) {
    const wg = new THREE.Group();
    wg.add(new THREE.Mesh(new THREE.BoxGeometry(2, 1.8, 0.15), windowFrameMat));
    const gl = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.5, 0.06), glassMat); gl.position.z = 0.06; wg.add(gl);
    wg.position.set(x, y, z); wg.rotation.y = ry || 0; roomGroups['Structure'].add(wg);
}
addBhk2Window(-5.5, 4, D2 / 2 + 0.15, 0); addBhk2Window(5.5, 4, D2 / 2 + 0.15, 0);
addBhk2Window(-W2 / 2 - 0.15, 4, -2, Math.PI / 2); addBhk2Window(W2 / 2 + 0.15, 4, -2, Math.PI / 2);
addBhk2Window(-W2 / 2 - 0.15, 4, 3, Math.PI / 2); addBhk2Window(W2 / 2 + 0.15, 4, 3, Math.PI / 2);

// 2BHK label
const bhk2LabelDiv = document.createElement('div');
bhk2LabelDiv.className = 'appliance-label';
bhk2LabelDiv.innerHTML = '<span class="name" style="font-size:1.1rem;">🏢 2BHK House</span>';
const bhk2Label = new THREE.CSS2DObject(bhk2LabelDiv);
bhk2Label.position.set(0, H + roofH + 4, 0);
bhk2Group.add(bhk2Label);

// ═══════════════════════════════════════════════
//  PARTITION WALLS
// ═══════════════════════════════════════════════
const partWallMat = new THREE.MeshStandardMaterial({ color: 0xf0e6d3, roughness: 0.85, transparent: true, opacity: 0.35 });
const bhk2PartWalls = [];
function addPartWall(w, h, d, x, y, z, room) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), partWallMat.clone());
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    (room ? roomGroups[room] : roomGroups['Structure']).add(m);
    bhk2PartWalls.push(m); return m;
}
addPartWall(W2 - 0.4, H, 0.2, 0, H / 2 + 0.3, -2.5);
addPartWall(0.2, H, D2 / 2 - 2.5 - 0.2, 0, H / 2 + 0.3, -(D2 / 2 + 2.5) / 2);
addPartWall(0.2, H, D2 / 2 + 2.5 - 0.2, -5, H / 2 + 0.3, (D2 / 2 - 2.5) / 2 + 0.1);
addPartWall(W2 / 2 - 5 - 0.2, H, 0.2, -(5 + W2 / 2) / 2, H / 2 + 0.3, 4);

// Room doors
const roomDoorMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 });
function addRoomDoor(x, y, z, ry, room) {
    const d = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.5, 0.25), roomDoorMat);
    d.position.set(x, y, z); d.rotation.y = ry || 0;
    (room ? roomGroups[room] : roomGroups['Structure']).add(d);
    const frameMat2 = new THREE.MeshStandardMaterial({ color: 0x4a2e10, roughness: 0.6 });
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.28), frameMat2);
    frameTop.position.set(x, y + 1.85, z); frameTop.rotation.y = ry || 0;
    (room ? roomGroups[room] : roomGroups['Structure']).add(frameTop);
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0xd4a843, metalness: 0.9, roughness: 0.2 }));
    h.position.set(x + (ry ? 0 : 0.5), y, z + (ry ? 0.5 : 0));
    (room ? roomGroups[room] : roomGroups['Structure']).add(h);
}
addRoomDoor(-3, 2.05, -2.5, 0, 'Bedroom 1');
addRoomDoor(3, 2.05, -2.5, 0, 'Bedroom 2');
addRoomDoor(-5, 2.05, 0.5, Math.PI / 2, 'Kitchen');
addRoomDoor(-5, 2.05, 5.5, Math.PI / 2, 'Bathroom');

// ═══════════════════════════════════════════════
//  FLOOR TILES
// ═══════════════════════════════════════════════
const tileColors = { hall: 0xd4b896, bed1: 0xa8c8e8, bed2: 0xc8b4d8, kitchen: 0xf5f5f5, bath: 0x88ccbb };
function addFloorTile(color, w, d, x, z, room) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ color: color, roughness: 0.75 }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.32, z); m.receiveShadow = true;
    (room ? roomGroups[room] : roomGroups['Structure']).add(m);
}
addFloorTile(tileColors.hall, W2 / 2 - 5 - 0.2, D2 / 2 + 2.5 - 0.3, (W2 / 2 - 5) / 2 + 0.1, (D2 / 2 - 2.5) / 2, 'Hall');
addFloorTile(tileColors.bed1, W2 / 2 - 0.3, D2 / 2 - 2.5 - 0.3, -W2 / 4, -(D2 / 2 + 2.5) / 2, 'Bedroom 1');
addFloorTile(tileColors.bed2, W2 / 2 - 0.3, D2 / 2 - 2.5 - 0.3, W2 / 4, -(D2 / 2 + 2.5) / 2, 'Bedroom 2');
for (let ki = 0; ki < 6; ki++) for (let kj = 0; kj < 6; kj++) {
    addFloorTile((ki + kj) % 2 === 0 ? 0xf5f5f5 : 0x333333, 0.8, 0.8, -W2 / 2 + 0.7 + ki * 0.85, -2.1 + kj * 0.95, 'Kitchen');
}
addFloorTile(tileColors.bath, W2 / 2 - 5 - 0.2, D2 / 2 - 4 - 0.2, -(5 + W2 / 2) / 2, (D2 / 2 + 4) / 2, 'Bathroom');

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
    addRoomLabel('🏠 Hall', (W2 / 2 - 5) / 2, 4, (D2 / 2 - 2.5) / 2, 'Hall'),
    addRoomLabel('🛏️ Bedroom 1', -W2 / 4, 4, -(D2 / 2 + 2.5) / 2, 'Bedroom 1'),
    addRoomLabel('🛏️ Bedroom 2', W2 / 4, 4, -(D2 / 2 + 2.5) / 2, 'Bedroom 2'),
    addRoomLabel('🍳 Kitchen', -(5 + W2 / 2) / 2, 4, 0.75, 'Kitchen'),
    addRoomLabel('🚿 Bathroom', -(5 + W2 / 2) / 2, 4, (D2 / 2 + 4) / 2, 'Bathroom')
];

// ═══════════════════════════════════════════════
//  2BHK APPLIANCES
// ═══════════════════════════════════════════════
const bhk2Appliances = [];
const bhk2AnimData = { fans: [], tableFans: [], acs: [], lights: [] };

// Beds
function createBed(x, y, z, color, room) {
    const g = new THREE.Group();
    const frameMat2 = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7 });
    function addPart(geo, mat, px, py, pz, shadow) {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(px, py, pz); if (shadow) m.castShadow = true; g.add(m);
    }
    addPart(new THREE.BoxGeometry(2.8, 0.5, 3.5), frameMat2, 0, 0.25, 0, true);
    addPart(new THREE.BoxGeometry(2.6, 0.3, 3.3), new THREE.MeshStandardMaterial({ color: color, roughness: 0.9 }), 0, 0.65, 0, false);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
    addPart(new THREE.BoxGeometry(0.8, 0.15, 0.5), pillowMat, -0.5, 0.88, -1.3, false);
    addPart(new THREE.BoxGeometry(0.8, 0.15, 0.5), pillowMat, 0.5, 0.88, -1.3, false);
    addPart(new THREE.BoxGeometry(2.8, 1.5, 0.2), frameMat2, 0, 1, -1.7, false);
    g.position.set(x, y, z); roomGroups[room].add(g);
}
createBed(-W2 / 4, 0.3, -(D2 / 2 + 2.5) / 2, 0x6495ED, 'Bedroom 1');
createBed(W2 / 4, 0.3, -(D2 / 2 + 2.5) / 2, 0xDDA0DD, 'Bedroom 2');

// Hall Furniture
const hallSofaMat = new THREE.MeshStandardMaterial({ color: 0x4a6fa5, roughness: 0.8 });
const hallSofaSeat = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.6, 2), hallSofaMat);
hallSofaSeat.position.set(W2 / 2 - 2.8, 0.9, 1); hallSofaSeat.castShadow = true; roomGroups['Hall'].add(hallSofaSeat);
const hallSofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.2, 0.4), hallSofaMat);
hallSofaBack.position.set(W2 / 2 - 2.8, 1.5, 2); hallSofaBack.castShadow = true; roomGroups['Hall'].add(hallSofaBack);
const hallArmMat = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.75 });
const hallArmL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 2), hallArmMat);
hallArmL.position.set(W2 / 2 - 4.85, 1.1, 1); roomGroups['Hall'].add(hallArmL);
const hallArmR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 2), hallArmMat);
hallArmR.position.set(W2 / 2 - 0.75, 1.1, 1); roomGroups['Hall'].add(hallArmR);
for (let ci = 0; ci < 2; ci++) {
    const cush = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.6), new THREE.MeshStandardMaterial({ color: 0x6b8fc4, roughness: 0.85 }));
    cush.position.set(W2 / 2 - 2.8 + ci * 2.2 - 1.1, 1.3, 1); roomGroups['Hall'].add(cush);
}

// Coffee Table
const coffeeTableMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.7 });
const coffeeTop = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 1.2), coffeeTableMat);
coffeeTop.position.set((W2 / 2 - 5) / 2, 0.95, 1); coffeeTop.castShadow = true; roomGroups['Hall'].add(coffeeTop);
for (let li = 0; li < 4; li++) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6), coffeeTableMat);
    leg.position.set((W2 / 2 - 5) / 2 + (li < 2 ? -1 : 1), 0.62, 1 + (li % 2 === 0 ? -0.45 : 0.45));
    roomGroups['Hall'].add(leg);
}

// Hall TV
const hallTvFrame = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 0.15), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.5 }));
hallTvFrame.position.set((W2 / 2 - 5) / 2, 4.2, -2.3); roomGroups['Hall'].add(hallTvFrame);
const tvMat2bhk = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000, roughness: 0.1 });
const hallTvScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.9), tvMat2bhk);
hallTvScreen.position.set((W2 / 2 - 5) / 2, 4.2, -2.22); roomGroups['Hall'].add(hallTvScreen);

// Decorative plant
const potMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });
const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.6, 8), potMat);
pot.position.set(-4.5, 0.6, D2 / 2 - 1); roomGroups['Hall'].add(pot);
const plant = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.9 }));
plant.position.set(-4.5, 1.3, D2 / 2 - 1); roomGroups['Hall'].add(plant);

// Kitchen
const counterMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.3 });
const counter = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 0.8), counterMat);
counter.position.set(-W2 / 2 + 1.8, 1.2, -1.5); counter.castShadow = true; roomGroups['Kitchen'].add(counter);
const stove = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.6), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.3 }));
stove.position.set(-W2 / 2 + 1.8, 2.15, -1.5); roomGroups['Kitchen'].add(stove);
const kitchenSink = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.8), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.2 }));
kitchenSink.position.set(-W2 / 2 + 1.8, 2.12, 1); roomGroups['Kitchen'].add(kitchenSink);
const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 });
const cabinet = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 0.5), cabinetMat);
cabinet.position.set(-W2 / 2 + 1.5, 4.5, -2.3); roomGroups['Kitchen'].add(cabinet);

// ═══════════════════════════════════════════════
//  BATHROOM FIXTURES
// ═══════════════════════════════════════════════
const bathX = -(5 + W2 / 2) / 2;
const bathZ = (D2 / 2 + 4) / 2;
const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.3 });
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });

// Toilet
const toiletBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 0.7, 12), whiteMat);
toiletBowl.position.set(bathX + 1, 0.65, bathZ + 1.2); roomGroups['Bathroom'].add(toiletBowl);
const toiletSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 12), whiteMat);
toiletSeat.position.set(bathX + 1, 1.03, bathZ + 1.2); roomGroups['Bathroom'].add(toiletSeat);
const toiletTank = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.3), whiteMat);
toiletTank.position.set(bathX + 1, 0.9, bathZ + 1.7); roomGroups['Bathroom'].add(toiletTank);
const flush = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.15), chromeMat);
flush.position.set(bathX + 1, 1.35, bathZ + 1.6); roomGroups['Bathroom'].add(flush);

// Basin
const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 0.15, 12), whiteMat);
basin.position.set(bathX - 0.6, 1.3, bathZ - 1); roomGroups['Bathroom'].add(basin);
const basinStand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.2, 8), whiteMat);
basinStand.position.set(bathX - 0.6, 0.6, bathZ - 1); roomGroups['Bathroom'].add(basinStand);
const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), chromeMat);
tap.position.set(bathX - 0.6, 1.55, bathZ - 1.2); roomGroups['Bathroom'].add(tap);
const tapSpout = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.2), chromeMat);
tapSpout.position.set(bathX - 0.6, 1.73, bathZ - 1.1); roomGroups['Bathroom'].add(tapSpout);

// Water stream
const waterStream = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1), new THREE.MeshStandardMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.6 }));
waterStream.position.set(bathX - 0.6, 1.2, bathZ - 1); waterStream.visible = false; roomGroups['Bathroom'].add(waterStream);

// Shower
const showerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.5, 6), chromeMat);
showerPipe.position.set(bathX + 1.5, 2.05, bathZ - 1); roomGroups['Bathroom'].add(showerPipe);
const showerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.08, 12), chromeMat);
showerHead.position.set(bathX + 1.5, 3.8, bathZ - 1); roomGroups['Bathroom'].add(showerHead);
const showerTap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 6), chromeMat);
showerTap.position.set(bathX + 1.5, 2.5, bathZ - 0.85); roomGroups['Bathroom'].add(showerTap);

// Bucket
const bucketMat = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.6 });
const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.5, 10), bucketMat);
bucket.position.set(bathX + 0.4, 0.55, bathZ + 0.2); roomGroups['Bathroom'].add(bucket);
const bucketHandle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.015, 6, 12, Math.PI), chromeMat);
bucketHandle.position.set(bathX + 0.4, 0.85, bathZ + 0.2);
bucketHandle.rotation.x = Math.PI; roomGroups['Bathroom'].add(bucketHandle);

// ═══════════════════════════════════════════════
//  2BHK ROOM APPLIANCE DEFINITIONS
// ═══════════════════════════════════════════════
const bhk2RoomDefs = [
    {
        room: 'Hall', appliances: [
            { type: 'fan', name: 'Ceiling Fan', watt: 75, x: (W2 / 2 - 5) / 2, y: H - 0.3, z: (D2 / 2 - 2.5) / 2 },
            { type: 'light', name: 'Light', watt: 60, x: (W2 / 2 - 5) / 2 - 2, y: H - 0.5, z: 0 },
            { type: 'ac', name: 'AC', watt: 1500, x: W2 / 2 - 1.5, y: 5, z: -2.3 },
            { type: 'tv', name: 'Television', watt: 180, x: 0, y: 0, z: 0 },
        ]
    },
    {
        room: 'Bedroom 1', appliances: [
            { type: 'fan', name: 'Ceiling Fan', watt: 75, x: -W2 / 4, y: H - 0.3, z: -(D2 / 2 + 2.5) / 2 },
            { type: 'light', name: 'Light', watt: 60, x: -W2 / 4 - 2, y: H - 0.5, z: -(D2 / 2 + 2.5) / 2 - 1 },
            { type: 'ac', name: 'AC', watt: 1500, x: -W2 / 4 + 2, y: 5, z: -D2 / 2 + 0.7 },
        ]
    },
    {
        room: 'Bedroom 2', appliances: [
            { type: 'fan', name: 'Ceiling Fan', watt: 75, x: W2 / 4, y: H - 0.3, z: -(D2 / 2 + 2.5) / 2 },
            { type: 'light', name: 'Light', watt: 60, x: W2 / 4 + 2, y: H - 0.5, z: -(D2 / 2 + 2.5) / 2 - 1 },
            { type: 'tablefan', name: 'Table Fan', watt: 55, x: W2 / 4 + 3, y: 1.8, z: -(D2 / 2 + 2.5) / 2 + 1 },
        ]
    },
    {
        room: 'Kitchen', appliances: [
            { type: 'light', name: 'Light', watt: 60, x: -(5 + W2 / 2) / 2, y: H - 0.5, z: 0.75 },
            { type: 'fridge', name: 'Refrigerator', watt: 350, x: -W2 / 2 + 0.9, y: 0.3, z: 2 },
        ]
    },
    {
        room: 'Bathroom', appliances: [
            { type: 'light', name: 'Light', watt: 40, x: -(5 + W2 / 2) / 2, y: H - 0.5, z: (D2 / 2 + 4) / 2 },
            { type: 'tap', name: 'Wash Basin Tap', watt: 5, x: 0, y: 0, z: 0 },
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
        }
        if (obj) { obj.room = roomDef.room; bhk2Appliances.push(obj); }
    });
});

// ═══════════════════════════════════════════════
//  1BHK APPLIANCE STATE + TV
// ═══════════════════════════════════════════════
const simpleAppliances = [
    { name: 'Light Bulb 1', watt: 60, emoji: '💡', on: true, kind: 'light', mesh: light1, room: 'Hall' },
    { name: 'Ceiling Fan', watt: 75, emoji: '🌀', on: true, kind: 'fan', mesh: fan1, room: 'Hall' },
    { name: 'Refrigerator', watt: 350, emoji: '🧊', on: true, kind: 'fridge', mesh: fridge, room: 'Kitchen' },
    { name: 'Air Conditioner', watt: 1500, emoji: '❄️', on: true, kind: 'ac', mesh: ac, room: 'Hall' },
    { name: 'Light Bulb 2', watt: 60, emoji: '💡', on: true, kind: 'light', mesh: light2, room: 'Bedroom' },
    { name: 'Table Fan', watt: 55, emoji: '🌀', on: true, kind: 'tablefan', mesh: tableFan, room: 'Bedroom' },
    { name: 'Television', watt: 150, emoji: '📺', on: false, kind: 'tv', mesh: null, room: 'Hall' }
];

// Simple house TV
const simpleTvFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.4, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111 }));
simpleTvFrame.position.set(3, 4, -0.8); houseGroup.add(simpleTvFrame);
const simpleTvScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.2), new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x000000 }));
simpleTvScreen.position.set(3, 4, -0.73); houseGroup.add(simpleTvScreen);
simpleAppliances[6].mesh = { frame: simpleTvFrame, screen: simpleTvScreen };
