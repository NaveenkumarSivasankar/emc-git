// ═══════════════════════════════════════════════
//  INTERIOR INTERACTION SYSTEM
//  Room transparency, furniture collision, door animation
//  FIXED: Walls now SOLID (opacity 1.0) except glass/mirror
// ═══════════════════════════════════════════════

// ── ROOM DEFINITIONS (local coords relative to house origin) ──
const bhk1Rooms = [
    { name: 'Hall', xMin: -4, xMax: 14, zMin: -5, zMax: 11 },
    { name: 'Kitchen', xMin: -14, xMax: -4, zMin: -5, zMax: 11 },
    { name: 'Bedroom', xMin: -14, xMax: 14, zMin: -11, zMax: -5 }
];
const bhk2Rooms = [
    { name: 'Hall', xMin: -5, xMax: 14, zMin: -5, zMax: 12 },
    { name: 'Kitchen', xMin: -14, xMax: -5, zMin: -5, zMax: 3 },
    { name: 'Bathroom', xMin: -14, xMax: -5, zMin: 3, zMax: 12 },
    { name: 'Bedroom 1', xMin: -14, xMax: 0, zMin: -12, zMax: -5 },
    { name: 'Bedroom 2', xMin: 0, xMax: 14, zMin: -12, zMax: -5 }
];

// House world origins
const bhk1Origin = { x: -22, z: 0 };
const bhk2Origin = { x: 24, z: 0 };

function getBoyRoom() {
    if (boyState.mode !== 'indoor') return null;
    const bx = boyGroup.position.x;
    const bz = boyGroup.position.z;

    if (boyState.insideHouse === '1bhk') {
        const lx = bx - bhk1Origin.x;
        const lz = bz - bhk1Origin.z;
        for (const r of bhk1Rooms) {
            if (lx >= r.xMin && lx <= r.xMax && lz >= r.zMin && lz <= r.zMax) return r.name;
        }
    } else if (boyState.insideHouse === '2bhk') {
        const lx = bx - bhk2Origin.x;
        const lz = bz - bhk2Origin.z;
        for (const r of bhk2Rooms) {
            if (lx >= r.xMin && lx <= r.xMax && lz >= r.zMin && lz <= r.zMax) return r.name;
        }
    }
    return null;
}

// ═══════════════════════════════════════════════
//  ROOM-BASED TRANSPARENCY
//  Partition walls go transparent near boy, outer walls stay SOLID
//  Energy Vision mode overrides this
// ═══════════════════════════════════════════════

const bhk1PartitionRooms = [
    { mesh: null, rooms: ['Hall', 'Kitchen', 'Bedroom'] },  // pw1 (horizontal, z=-5)
    { mesh: null, rooms: ['Hall', 'Kitchen'] }               // pw2 (vertical, x=-4)
];

const bhk2PartitionRooms = [
    { rooms: ['Hall', 'Kitchen', 'Bathroom', 'Bedroom 1', 'Bedroom 2'] },
    { rooms: ['Bedroom 1', 'Bedroom 2'] },
    { rooms: ['Hall', 'Kitchen', 'Bathroom'] },
    { rooms: ['Kitchen', 'Bathroom'] }
];

function initPartitionRefs() {
    if (typeof pw1 !== 'undefined') bhk1PartitionRooms[0].mesh = pw1;
    if (typeof pw2 !== 'undefined') bhk1PartitionRooms[1].mesh = pw2;
    console.log('[Interiors] Partition refs initialized');
}

function updateRoomTransparency() {
    // Skip if Energy Vision is controlling transparency
    if (typeof energyVisionActive !== 'undefined' && energyVisionActive) return;

    const currentRoom = getBoyRoom();

    if (boyState.insideHouse === '1bhk') {
        // Partition walls — transparent when boy is in adjacent room
        bhk1PartitionRooms.forEach(p => {
            if (!p.mesh) return;
            const shouldBeTransparent = currentRoom && p.rooms.includes(currentRoom);
            // FIXED: Use 0.25 for transparent, 1.0 for solid (NOT 0.15/0.9)
            const targetOpacity = shouldBeTransparent ? 0.25 : 1.0;
            p.mesh.material.transparent = targetOpacity < 1.0;
            p.mesh.material.opacity += (targetOpacity - p.mesh.material.opacity) * 0.1;
            p.mesh.material.depthWrite = true;
            p.mesh.material.needsUpdate = true;
        });
    } else if (boyState.insideHouse === '2bhk') {
        bhk2PartWalls.forEach((mesh, i) => {
            if (i >= bhk2PartitionRooms.length) return;
            const shouldBeTransparent = currentRoom && bhk2PartitionRooms[i].rooms.includes(currentRoom);
            const targetOpacity = shouldBeTransparent ? 0.25 : 1.0;
            mesh.material.transparent = targetOpacity < 1.0;
            mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.1;
            mesh.material.depthWrite = true;
            mesh.material.needsUpdate = true;
        });
    }
}

// ═══════════════════════════════════════════════
//  INTERIOR ROOM LIGHTING
//  Each room gets its own PointLight at ceiling center
// ═══════════════════════════════════════════════
function setupInteriorLighting() {
    // Shared ambient fill (so nothing is completely black)
    const ambientFill = new THREE.AmbientLight(0xFFFFFF, 0.5);
    ambientFill.name = 'interiorAmbient';
    scene.add(ambientFill);

    // 1BHK lights
    if (typeof houseGroup !== 'undefined') {
        const hallLight1 = new THREE.PointLight(0xFFF4E0, 1.2, 15);
        hallLight1.position.set(5, 6.2, 3);
        houseGroup.add(hallLight1);

        const kitchenLight1 = new THREE.PointLight(0xFFFFFF, 1.4, 14);
        kitchenLight1.position.set(-9, 6.2, 3);
        houseGroup.add(kitchenLight1);

        const bedroomLight1 = new THREE.PointLight(0xFFE4B5, 0.9, 12);
        bedroomLight1.position.set(0, 6.2, -8);
        houseGroup.add(bedroomLight1);

        // Bedside lamp
        const bedsideLamp = new THREE.PointLight(0xFFAA44, 0.4, 3);
        bedsideLamp.position.set(-8, 2.5, -8);
        houseGroup.add(bedsideLamp);

        console.log('[Interiors] 1BHK room lights added');
    }

    // 2BHK lights
    if (typeof bhk2Group !== 'undefined') {
        const hallLight2 = new THREE.PointLight(0xFFF4E0, 1.2, 15);
        hallLight2.position.set(5, 6.2, 4);
        bhk2Group.add(hallLight2);

        const kitchenLight2 = new THREE.PointLight(0xFFFFFF, 1.4, 14);
        kitchenLight2.position.set(-9.5, 6.2, -1);
        bhk2Group.add(kitchenLight2);

        const bathroomLight2 = new THREE.PointLight(0xF0F8FF, 1.1, 10);
        bathroomLight2.position.set(-9.5, 6.2, 7.5);
        bhk2Group.add(bathroomLight2);

        const bed1Light = new THREE.PointLight(0xFFE4B5, 0.9, 12);
        bed1Light.position.set(-7, 6.2, -8.5);
        bhk2Group.add(bed1Light);

        const bed2Light = new THREE.PointLight(0xFFE4B5, 0.9, 12);
        bed2Light.position.set(7, 6.2, -8.5);
        bhk2Group.add(bed2Light);

        // Bedroom bedsides
        const bedsideLamp2a = new THREE.PointLight(0xFFAA44, 0.4, 3);
        bedsideLamp2a.position.set(-10, 2.5, -9);
        bhk2Group.add(bedsideLamp2a);

        const bedsideLamp2b = new THREE.PointLight(0xFFAA44, 0.4, 3);
        bedsideLamp2b.position.set(10, 2.5, -9);
        bhk2Group.add(bedsideLamp2b);

        console.log('[Interiors] 2BHK room lights added');
    }
}

// ═══════════════════════════════════════════════
//  FURNITURE COLLISION
//  AABB boxes for solid furniture pieces
// ═══════════════════════════════════════════════
const furnitureBoxes1BHK = [];
const furnitureBoxes2BHK = [];

function addCollisionBox(list, centerX, centerZ, halfW, halfD, houseOriginX, houseOriginZ) {
    const worldX = centerX + houseOriginX;
    const worldZ = centerZ + houseOriginZ;
    list.push({
        xMin: worldX - halfW,
        xMax: worldX + halfW,
        zMin: worldZ - halfD,
        zMax: worldZ + halfD
    });
}

function initFurnitureCollision() {
    // 1BHK furniture (local coords, houseGroup at -22, 0)
    const ox1 = -22, oz1 = 0;

    addCollisionBox(furnitureBoxes1BHK, 9, -3.5, 3, 1.5, ox1, oz1);
    addCollisionBox(furnitureBoxes1BHK, 12, 0, 1.5, 0.7, ox1, oz1);
    addCollisionBox(furnitureBoxes1BHK, 3, -8.5, 2, 2.5, ox1, oz1);
    addCollisionBox(furnitureBoxes1BHK, -11, -8, 1.5, 0.8, ox1, oz1);
    addCollisionBox(furnitureBoxes1BHK, -10, -3.5, 2.5, 0.7, ox1, oz1);
    addCollisionBox(furnitureBoxes1BHK, 10, 6, 1.3, 1, ox1, oz1);
    addCollisionBox(furnitureBoxes1BHK, -12, 5, 1, 0.9, ox1, oz1);

    // 1BHK Wall segments
    const wt = 0.15;
    addCollisionBox(furnitureBoxes1BHK, -5, -5, 9, wt, ox1, oz1);
    addCollisionBox(furnitureBoxes1BHK, 10, -5, 4, wt, ox1, oz1);
    addCollisionBox(furnitureBoxes1BHK, -4, -1.5, wt, 3.5, ox1, oz1);
    addCollisionBox(furnitureBoxes1BHK, -4, 7.5, wt, 3.5, ox1, oz1);

    // 2BHK furniture (local coords, bhk2Group at 24, 0)
    const ox2 = 24, oz2 = 0;

    addCollisionBox(furnitureBoxes2BHK, -7, -9, 1.8, 2.2, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, 7, -9, 1.8, 2.2, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, 11, 3, 2.7, 1.5, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, 5, 3, 1.5, 0.8, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, -11, -3.5, 2.5, 0.7, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, -7, 1, 1, 0.9, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, -7.5, 10, 0.7, 0.7, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, -11, 6, 0.6, 0.6, ox2, oz2);

    // 2BHK wall segments
    addCollisionBox(furnitureBoxes2BHK, -10, -5, 4, wt, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, 0, -5, 4, wt, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, 10, -5, 4, wt, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, 0, -8.5, wt, 3.5, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, -5, -3.5, wt, 1.5, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, -5, 3, wt, 3, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, -5, 10, wt, 2, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, -9.5, 3, 4.5, wt, ox2, oz2);

    console.log('[Interiors] Furniture collision initialized —', furnitureBoxes1BHK.length, '1BHK boxes,', furnitureBoxes2BHK.length, '2BHK boxes');
}

function checkFurnitureCollision(newX, newZ) {
    if (boyState.mode !== 'indoor') return false;
    const boxes = boyState.insideHouse === '1bhk' ? furnitureBoxes1BHK : furnitureBoxes2BHK;
    const boyRadius = 0.22;
    for (const box of boxes) {
        if (newX > box.xMin - boyRadius && newX < box.xMax + boyRadius &&
            newZ > box.zMin - boyRadius && newZ < box.zMax + boyRadius) {
            return true;
        }
    }
    return false;
}

function resolveSliding(oldX, oldZ, newX, newZ) {
    if (boyState.mode !== 'indoor') return { x: newX, z: newZ };
    if (!checkFurnitureCollision(newX, newZ)) return { x: newX, z: newZ };
    if (!checkFurnitureCollision(newX, oldZ)) return { x: newX, z: oldZ };
    if (!checkFurnitureCollision(oldX, newZ)) return { x: oldX, z: newZ };
    return { x: oldX, z: oldZ };
}

// ═══════════════════════════════════════════════
//  ANIMATED DOORS
// ═══════════════════════════════════════════════
const interactiveDoors = [];

function createInteractiveDoor(parent, x, y, z, ry, hingeOffset, openAngle, houseOriginX, houseOriginZ) {
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a2e10, roughness: 0.6 });
    const handleMat2 = new THREE.MeshStandardMaterial({ color: 0xd4a843, metalness: 0.9, roughness: 0.2 });

    const pivot = new THREE.Group();
    pivot.position.set(x + hingeOffset.x, 0, z + hingeOffset.z);
    pivot.rotation.y = ry || 0;
    parent.add(pivot);

    const door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.5, 0.25), doorMat);
    door.position.set(-hingeOffset.x, y, -hingeOffset.z);
    pivot.add(door);

    const handle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), handleMat2);
    handle.position.set(-hingeOffset.x + 0.5, y, -hingeOffset.z + 0.15);
    pivot.add(handle);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.28), frameMat);
    frameTop.position.set(-hingeOffset.x, y + 1.85, -hingeOffset.z);
    pivot.add(frameTop);

    pivot.userData.baseRY = ry || 0;

    const worldX = x + houseOriginX;
    const worldZ = z + houseOriginZ;

    interactiveDoors.push({
        pivot: pivot,
        currentAngle: 0,
        targetAngle: 0,
        openAngle: openAngle || Math.PI / 2,
        worldX: worldX,
        worldZ: worldZ,
        triggerRadius: 2.5,
        baseRY: ry || 0
    });

    return pivot;
}

function updateDoors(delta) {
    if (boyState.mode !== 'indoor') return;
    if (!delta) delta = 0.016;

    const bx = boyGroup.position.x;
    const bz = boyGroup.position.z;

    interactiveDoors.forEach(d => {
        const dist = Math.sqrt((bx - d.worldX) ** 2 + (bz - d.worldZ) ** 2);
        d.targetAngle = dist < d.triggerRadius ? d.openAngle : 0;
        d.currentAngle += (d.targetAngle - d.currentAngle) * 0.08;
        d.pivot.rotation.y = d.baseRY + d.currentAngle;
    });
}

// ═══════════════════════════════════════════════
//  MAIN DOOR ANIMATION (entry/exit doors)
// ═══════════════════════════════════════════════
const mainDoorState = {
    '1bhk': { currentAngle: 0, targetAngle: 0, isOpen: false },
    '2bhk': { currentAngle: 0, targetAngle: 0, isOpen: false }
};

function openMainDoor(houseId) {
    mainDoorState[houseId].targetAngle = -Math.PI / 2;
    mainDoorState[houseId].isOpen = true;
}

function closeMainDoor(houseId) {
    mainDoorState[houseId].targetAngle = 0;
    mainDoorState[houseId].isOpen = false;
}

function updateMainDoors() {
    if (typeof mainDoor1BHK_pivot !== 'undefined') {
        const s = mainDoorState['1bhk'];
        s.currentAngle += (s.targetAngle - s.currentAngle) * 0.1;
        mainDoor1BHK_pivot.rotation.y = s.currentAngle;
    }
    if (typeof mainDoor2BHK_pivot !== 'undefined') {
        const s = mainDoorState['2bhk'];
        s.currentAngle += (s.targetAngle - s.currentAngle) * 0.1;
        mainDoor2BHK_pivot.rotation.y = s.currentAngle;
    }
}

// ═══════════════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════════════
function initInteriors() {
    initPartitionRefs();
    initFurnitureCollision();
    setupInteriorLighting();
    console.log('[Interiors] All systems initialized');
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(initInteriors, 100);
});
