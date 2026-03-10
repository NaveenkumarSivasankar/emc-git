// ═══════════════════════════════════════════════
//  2BHK HOUSE
// ═══════════════════════════════════════════════
const bhk2Group = new THREE.Group();
bhk2Group.position.set(24, 0, -4);
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
const bhk2WallMat = new THREE.MeshStandardMaterial({ color: 0xe0d0b8, roughness: 0.8, transparent: true, opacity: 1, side: THREE.DoubleSide });
const bhk2RoofMat = new THREE.MeshStandardMaterial({ color: 0x6B3410, roughness: 0.7, metalness: 0.1, transparent: true, opacity: 1 });
const bhk2DoorMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7, transparent: true, opacity: 1 });
const bhk2TransWalls = [];

function addBhk2Wall(w, h, d, x, y, z, transp) {
    const mat = transp ? bhk2WallMat.clone() : bhk2WallMat;
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    roomGroups['Structure'].add(m); if (transp) bhk2TransWalls.push(m); return m;
}


const bhk2Floor = new THREE.Mesh(new THREE.BoxGeometry(W2, 0.3, D2), floorMat);
bhk2Floor.position.y = 0.15; bhk2Floor.receiveShadow = true; roomGroups['Structure'].add(bhk2Floor);


addBhk2Wall(W2, H, 0.3, 0, H / 2 + 0.3, -D2 / 2, false);  // Back
addBhk2Wall(0.3, H, D2, -W2 / 2, H / 2 + 0.3, 0, true);     // Left
addBhk2Wall(0.3, H, D2, W2 / 2, H / 2 + 0.3, 0, true);      // Right
// Front walls with door gap
addBhk2Wall((W2 - 3) / 2, H, 0.3, -(W2 + 3) / 4, H / 2 + 0.3, D2 / 2, true);
addBhk2Wall((W2 - 3) / 2, H, 0.3, (W2 + 3) / 4, H / 2 + 0.3, D2 / 2, true);
addBhk2Wall(3, 3.0, 0.3, 0, H - 1.2, D2 / 2, true);

// Front door (animated pivot door)
const mainDoor2BHK_pivot = new THREE.Group();
mainDoor2BHK_pivot.position.set(-1.5, 0, D2 / 2); // hinge at left edge
roomGroups['Structure'].add(mainDoor2BHK_pivot);
const mainDoor2BHK_mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.35), bhk2DoorMat);
mainDoor2BHK_mesh.position.set(1.5, 2.3, 0);
mainDoor2BHK_pivot.add(mainDoor2BHK_mesh);

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
addBhk2Window(-7, 4, D2 / 2 + 0.15, 0); addBhk2Window(7, 4, D2 / 2 + 0.15, 0);
addBhk2Window(-W2 / 2 - 0.15, 4, -4, Math.PI / 2); addBhk2Window(W2 / 2 + 0.15, 4, -4, Math.PI / 2);
addBhk2Window(-W2 / 2 - 0.15, 4, 5, Math.PI / 2); addBhk2Window(W2 / 2 + 0.15, 4, 5, Math.PI / 2);



// ═══════════════════════════════════════════════
//  PARTITION WALLS
//  Layout:
//    Hall:      x=-5 to 14, z=-5 to 12   (right-front, 19×17)
//    Kitchen:   x=-14 to -5, z=-5 to 3   (left-center, 9×8)
//    Bathroom:  x=-14 to -5, z=3 to 12   (left-front, 9×9)
//    Bedroom1:  x=-14 to 0,  z=-12 to -5 (left-back, 14×7)
//    Bedroom2:  x=0 to 14,   z=-12 to -5 (right-back, 14×7)
// ═══════════════════════════════════════════════
const partWallMat = new THREE.MeshStandardMaterial({ color: 0xf0e6d3, roughness: 0.85, side: THREE.DoubleSide });
const bhk2PartWalls = [];
function addPartWall(w, h, d, x, y, z, room) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), partWallMat.clone());
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    (room ? roomGroups[room] : roomGroups['Structure']).add(m);
    bhk2PartWalls.push(m); return m;
}

// Horizontal wall at z=-5 (separates front from bedrooms, full width)
addPartWall(W2 - 0.4, H, 0.2, 0, H / 2 + 0.3, -5);
// Vertical wall at x=0 (separates Bedroom 1 from Bedroom 2, z=-12 to -5)
addPartWall(0.2, H, 7, 0, H / 2 + 0.3, -8.5);
// Vertical wall at x=-5 (separates Hall from Kitchen/Bath, z=-5 to 12)
addPartWall(0.2, H, 17, -5, H / 2 + 0.3, 3.5);
// Horizontal wall at z=3 (separates Kitchen from Bathroom, x=-14 to -5)
addPartWall(9, H, 0.2, -9.5, H / 2 + 0.3, 3);

// Room doors (interactive — swing open on approach)
createInteractiveDoor(bhk2Group, -5, 2.05, -5, 0, { x: -0.75, z: 0 }, Math.PI / 2, 24, 0);       // Bedroom 1
createInteractiveDoor(bhk2Group, 5, 2.05, -5, 0, { x: -0.75, z: 0 }, -Math.PI / 2, 24, 0);      // Bedroom 2
createInteractiveDoor(bhk2Group, -5, 2.05, -1, Math.PI / 2, { x: 0, z: -0.75 }, Math.PI / 2, 24, 0);  // Kitchen
createInteractiveDoor(bhk2Group, -5, 2.05, 7, Math.PI / 2, { x: 0, z: -0.75 }, Math.PI / 2, 24, 0);   // Bathroom

// ═══════════════════════════════════════════════
//  FLOOR TILES
// ═══════════════════════════════════════════════
const tileColors = { hall: 0xd4b896, bed1: 0xa8c8e8, bed2: 0xc8b4d8, kitchen: 0xf5f5f5, bath: 0x88ccbb };
function addFloorTile(color, w, d, x, z, room) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ color: color, roughness: 0.75 }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.32, z); m.receiveShadow = true;
    (room ? roomGroups[room] : roomGroups['Structure']).add(m);
}
// Hall: x=-5 to 14, z=-5 to 12
addFloorTile(tileColors.hall, 18.5, 16.5, 4.5, 3.5, 'Hall');
// Bedroom 1: x=-14 to 0, z=-12 to -5
addFloorTile(tileColors.bed1, 13.5, 6.5, -7, -8.5, 'Bedroom 1');
// Bedroom 2: x=0 to 14, z=-12 to -5
addFloorTile(tileColors.bed2, 13.5, 6.5, 7, -8.5, 'Bedroom 2');
// Kitchen checkered: x=-14 to -5, z=-5 to 3
for (let ki = 0; ki < 8; ki++) for (let kj = 0; kj < 7; kj++) {
    addFloorTile((ki + kj) % 2 === 0 ? 0xf5f5f5 : 0x333333, 1, 1, -13.5 + ki * 1.1, -4.5 + kj * 1.1, 'Kitchen');
}
// Bathroom: x=-14 to -5, z=3 to 12
addFloorTile(tileColors.bath, 8.5, 8.5, -9.5, 7.5, 'Bathroom');

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

let hallTvScreen = null;
let waterStream = null;

window.load2BHKFurniture = function () {
    if (window.bhk2FurnitureLoaded) return;
    window.bhk2FurnitureLoaded = true;

    // Beds (centered in each bedroom)
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
    createBed(-7, 0.3, -9, 0x6495ED, 'Bedroom 1');
    createBed(7, 0.3, -9, 0xDDA0DD, 'Bedroom 2');

    // Hall Furniture — sofa against right wall
    const hallSofaMat = new THREE.MeshStandardMaterial({ color: 0x4a6fa5, roughness: 0.8 });
    const hallSofaSeat = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.6, 2), hallSofaMat);
    hallSofaSeat.position.set(11, 0.9, 3); hallSofaSeat.castShadow = true; roomGroups['Hall'].add(hallSofaSeat);
    const hallSofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.2, 0.4), hallSofaMat);
    hallSofaBack.position.set(11, 1.5, 4); hallSofaBack.castShadow = true; roomGroups['Hall'].add(hallSofaBack);
    const hallArmMat = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.75 });
    const hallArmL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 2), hallArmMat);
    hallArmL.position.set(8.9, 1.1, 3); roomGroups['Hall'].add(hallArmL);
    const hallArmR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 2), hallArmMat);
    hallArmR.position.set(13.1, 1.1, 3); roomGroups['Hall'].add(hallArmR);
    for (let ci = 0; ci < 2; ci++) {
        const cush = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.6), new THREE.MeshStandardMaterial({ color: 0x6b8fc4, roughness: 0.85 }));
        cush.position.set(11 + ci * 2.2 - 1.1, 1.3, 3); roomGroups['Hall'].add(cush);
    }

    // Coffee Table (in front of sofa)
    const coffeeTableMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.7 });
    const coffeeTop = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 1.2), coffeeTableMat);
    coffeeTop.position.set(5, 0.95, 3); coffeeTop.castShadow = true; roomGroups['Hall'].add(coffeeTop);
    for (let li = 0; li < 4; li++) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6), coffeeTableMat);
        leg.position.set(5 + (li < 2 ? -1 : 1), 0.62, 3 + (li % 2 === 0 ? -0.45 : 0.45));
        roomGroups['Hall'].add(leg);
    }

    // Hall TV (on partition wall facing sofa)
    const hallTvFrame = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 0.15), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.5 }));
    hallTvFrame.position.set(5, 4.2, -4.8); roomGroups['Hall'].add(hallTvFrame);
    const tvMat2bhk = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000, roughness: 0.1 });
    hallTvScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.9), tvMat2bhk);
    hallTvScreen.position.set(5, 4.2, -4.72); roomGroups['Hall'].add(hallTvScreen);

    // Decorative plant (near entrance)
    const potMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.6, 8), potMat);
    pot.position.set(-4, 0.6, 10); roomGroups['Hall'].add(pot);
    const plant = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.9 }));
    plant.position.set(-4, 1.3, 10); roomGroups['Hall'].add(plant);

    // Kitchen (x=-14 to -5, z=-5 to 3)
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.3 });
    const counter = new THREE.Mesh(new THREE.BoxGeometry(4, 1.8, 0.8), counterMat);
    counter.position.set(-11, 1.2, -3.5); counter.castShadow = true; roomGroups['Kitchen'].add(counter);
    const stove = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.6), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.3 }));
    stove.position.set(-11, 2.15, -3.5); roomGroups['Kitchen'].add(stove);
    const kitchenSink = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.8), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.2 }));
    kitchenSink.position.set(-11, 2.12, -1); roomGroups['Kitchen'].add(kitchenSink);
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 });
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 0.5), cabinetMat);
    cabinet.position.set(-11, 4.5, -4.2); roomGroups['Kitchen'].add(cabinet);

    // ═══════════════════════════════════════════════
    //  BATHROOM FIXTURES (x=-14 to -5, z=3 to 12)
    // ═══════════════════════════════════════════════
    const bathX = -9.5;
    const bathZ = 7.5;
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.3 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });

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

    // Water stream
    waterStream = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1), new THREE.MeshStandardMaterial({ color: 0x4fc3f7, transparent: true, opacity: 0.6 }));
    waterStream.position.set(bathX - 1.5, 1.2, bathZ - 1.5); waterStream.visible = false; roomGroups['Bathroom'].add(waterStream);

    // Shower
    const showerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.5, 6), chromeMat);
    showerPipe.position.set(bathX + 2, 2.05, bathZ - 1.5); roomGroups['Bathroom'].add(showerPipe);
    const showerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.08, 12), chromeMat);
    showerHead.position.set(bathX + 2, 3.8, bathZ - 1.5); roomGroups['Bathroom'].add(showerHead);
    const showerTap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 6), chromeMat);
    showerTap.position.set(bathX + 2, 2.5, bathZ - 1.35); roomGroups['Bathroom'].add(showerTap);

    // Bucket
    const bucketMat = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.6 });
    const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.5, 10), bucketMat);
    bucket.position.set(bathX + 0.5, 0.55, bathZ + 0.5); roomGroups['Bathroom'].add(bucket);
    const bucketHandle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.015, 6, 12, Math.PI), chromeMat);
    bucketHandle.position.set(bathX + 0.5, 0.85, bathZ + 0.5);
    bucketHandle.rotation.x = Math.PI; roomGroups['Bathroom'].add(bucketHandle);

    // Connect lazily created TV screen to appliance data
    const tvApp = bhk2Appliances.find(a => a.kind === 'tv');
    if (tvApp && tvApp.mesh) tvApp.mesh.screen = hallTvScreen;

}; // end load2BHKFurniture

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
            obj = { ...a, mesh: { screen: null }, on: false, kind: 'tv' };
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
    // Hall
    { name: 'Light Bulb', watt: 60, emoji: '💡', on: true, kind: 'light', mesh: light1, room: 'Hall' },
    { name: 'Ceiling Fan', watt: 75, emoji: '🌀', on: true, kind: 'fan', mesh: fan1, room: 'Hall' },
    { name: 'Air Conditioner', watt: 1500, emoji: '❄️', on: true, kind: 'ac', mesh: ac, room: 'Hall' },
    { name: 'Television', watt: 150, emoji: '📺', on: false, kind: 'tv', mesh: null, room: 'Hall' },
    { name: 'WiFi Router', watt: 10, emoji: '📶', on: true, kind: 'generic', mesh: null, room: 'Hall' },
    { name: 'Charging Port', watt: 15, emoji: '🔌', on: true, kind: 'generic', mesh: null, room: 'Hall' },
    // Kitchen
    { name: 'Refrigerator', watt: 350, emoji: '🧊', on: true, kind: 'fridge', mesh: fridge, room: 'Kitchen' },
    { name: 'Microwave', watt: 1200, emoji: '🔲', on: false, kind: 'generic', mesh: null, room: 'Kitchen' },
    { name: 'Induction Stove', watt: 1800, emoji: '🍳', on: false, kind: 'generic', mesh: null, room: 'Kitchen' },
    { name: 'Water Purifier', watt: 40, emoji: '💧', on: true, kind: 'generic', mesh: null, room: 'Kitchen' },
    { name: 'Mixer Grinder', watt: 600, emoji: '🔄', on: false, kind: 'generic', mesh: null, room: 'Kitchen' },
    // Bedroom
    { name: 'Light Bulb', watt: 60, emoji: '💡', on: true, kind: 'light', mesh: light2, room: 'Bedroom' },
    { name: 'Table Fan', watt: 55, emoji: '🌀', on: true, kind: 'tablefan', mesh: tableFan, room: 'Bedroom' },
    { name: 'Laptop Charger', watt: 65, emoji: '💻', on: false, kind: 'generic', mesh: null, room: 'Bedroom' },
    { name: 'Mobile Charger', watt: 10, emoji: '📱', on: false, kind: 'generic', mesh: null, room: 'Bedroom' }
];

// Simple house TV (positioned on back wall of hall)
const simpleTvFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.4, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111 }));
simpleTvFrame.position.set(5, 4, -4.8); houseGroup.add(simpleTvFrame);
const simpleTvScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.2), new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x000000 }));
simpleTvScreen.position.set(5, 4, -4.73); houseGroup.add(simpleTvScreen);
simpleAppliances[3].mesh = { frame: simpleTvFrame, screen: simpleTvScreen };

// ═══════════════════════════════════════════════
//  ROOF DATA — used by solar.js for panel placement
// ═══════════════════════════════════════════════
const ROOF_DATA_2BHK = {
    centerX: 0,           // local to bhk2Group
    centerZ: 0,
    y: H + 0.3,           // exact roof base height
    peakY: H + 0.3 + roofH + 1,
    width: W2,
    depth: D2,
    slopeAngle: Math.atan2(roofH + 1, W2 / 2 + 0.8),
    slopeAxis: 'x',
};
console.log('[HOUSE-2BHK] Built — roof data exported');
