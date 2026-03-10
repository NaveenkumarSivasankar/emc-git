// ═══════════════════════════════════════════════
//  INTERIOR INTERACTION SYSTEM
//  Room transparency, furniture collision, door animation
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
//  Only the room the boy is in gets transparent walls/partitions
// ═══════════════════════════════════════════════

// Tag partition walls with which rooms they border
// 1BHK partitions: pw1 (z=-5, between Hall/Kitchen and Bedroom), pw2 (x=-4, between Hall and Kitchen)
// Partition visibility: make transparent when boy is in either adjacent room
const bhk1PartitionRooms = [
    { mesh: null, rooms: ['Hall', 'Kitchen', 'Bedroom'] },  // pw1 (horizontal, z=-5)
    { mesh: null, rooms: ['Hall', 'Kitchen'] }               // pw2 (vertical, x=-4)
];

// 2BHK partitions stored in bhk2PartWalls array (indices match addPartWall order)
const bhk2PartitionRooms = [
    { rooms: ['Hall', 'Kitchen', 'Bathroom', 'Bedroom 1', 'Bedroom 2'] },  // z=-5 horizontal
    { rooms: ['Bedroom 1', 'Bedroom 2'] },                                  // x=0 vertical
    { rooms: ['Hall', 'Kitchen', 'Bathroom'] },                              // x=-5 vertical
    { rooms: ['Kitchen', 'Bathroom'] }                                       // z=3 horizontal
];

function initPartitionRefs() {
    // Link 1BHK partitions (pw1, pw2 are global from house-1bhk.js)
    if (typeof pw1 !== 'undefined') bhk1PartitionRooms[0].mesh = pw1;
    if (typeof pw2 !== 'undefined') bhk1PartitionRooms[1].mesh = pw2;
}

function updateRoomTransparency() {
    if (boyState.insideHouse === '1bhk') {
        // Make ALL partition walls transparent so rooms are clearly visible
        bhk1PartitionRooms.forEach(p => {
            if (!p.mesh) return;
            const targetOpacity = 0.1;
            p.mesh.material.transparent = true;
            p.mesh.material.opacity += (targetOpacity - p.mesh.material.opacity) * 0.1;
            p.mesh.material.needsUpdate = true;
        });
    } else if (boyState.insideHouse === '2bhk') {
        // Make ALL 2BHK partition walls transparent so rooms are clearly visible
        bhk2PartWalls.forEach((mesh, i) => {
            const targetOpacity = 0.1;
            mesh.material.transparent = true;
            mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.1;
            mesh.material.needsUpdate = true;
        });
    }
}

// ═══════════════════════════════════════════════
//  FURNITURE COLLISION
//  AABB boxes for solid furniture pieces
// ═══════════════════════════════════════════════
const furnitureBoxes1BHK = [];
const furnitureBoxes2BHK = [];

function addCollisionBox(list, centerX, centerZ, halfW, halfD, houseOriginX, houseOriginZ) {
    // Store in world coords
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

    // Sofa (center 9, -3.5, size 5×2.2)
    addCollisionBox(furnitureBoxes1BHK, 9, -3.5, 3, 1.5, ox1, oz1);
    // Bookshelf (center 12, 0, size 2.5×0.9)
    addCollisionBox(furnitureBoxes1BHK, 12, 0, 1.5, 0.7, ox1, oz1);
    // Bed (center 3, -8.5, size 3.5×4.2)
    addCollisionBox(furnitureBoxes1BHK, 3, -8.5, 2, 2.5, ox1, oz1);
    // Wardrobe (center -11, -8, size 2.4×1)
    addCollisionBox(furnitureBoxes1BHK, -11, -8, 1.5, 0.8, ox1, oz1);
    // Kitchen counter (center -10, -3.5, size 4×0.9)
    addCollisionBox(furnitureBoxes1BHK, -10, -3.5, 2.5, 0.7, ox1, oz1);
    // Table+fan (center 10, 6, size 2×1.5)
    addCollisionBox(furnitureBoxes1BHK, 10, 6, 1.3, 1, ox1, oz1);
    // Fridge (center -12, 5, size 1.4×1.2)
    addCollisionBox(furnitureBoxes1BHK, -12, 5, 1, 0.9, ox1, oz1);

    // ── 1BHK WALL SEGMENTS (partition walls with door gaps) ──
    // Wall thickness = 0.15 (half = 0.15)
    const wt = 0.15;

    // pw1: horizontal wall at z=-5, x from -14 to 14 (W=28)
    // Door gap at local x=5, gap width=3 (x: 3.5 to 6.5)
    // Segment left: x=-14 to 3.5
    addCollisionBox(furnitureBoxes1BHK, -5.25, -5, 8.75, wt, ox1, oz1);
    // Segment right: x=6.5 to 14
    addCollisionBox(furnitureBoxes1BHK, 10.25, -5, 3.75, wt, ox1, oz1);

    // pw2: vertical wall at x=-4, z from -5 to 11 (kitchenDepth=16)
    // Door gap at local z=3, gap width=3 (z: 1.5 to 4.5)
    // Segment bottom: z=-5 to 1.5
    addCollisionBox(furnitureBoxes1BHK, -4, -1.75, wt, 3.25, ox1, oz1);
    // Segment top: z=4.5 to 11
    addCollisionBox(furnitureBoxes1BHK, -4, 7.75, wt, 3.25, ox1, oz1);

    // 2BHK furniture (local coords, bhk2Group at 24, 0)
    const ox2 = 24, oz2 = 0;

    // Bed 1 (center -7, -9) — trimmed to leave walkway
    addCollisionBox(furnitureBoxes2BHK, -7, -9, 1.5, 1.8, ox2, oz2);
    // Bed 2 (center 7, -9) — trimmed to leave walkway
    addCollisionBox(furnitureBoxes2BHK, 7, -9, 1.5, 1.8, ox2, oz2);
    // Hall sofa (center 10, 2) — moved slightly inward, reduced footprint
    addCollisionBox(furnitureBoxes2BHK, 10, 2, 2.2, 1.0, ox2, oz2);
    // Coffee table (center 3, 1) — moved away from Bedroom 2 door gap
    addCollisionBox(furnitureBoxes2BHK, 3, 1, 1.2, 0.6, ox2, oz2);
    // Kitchen counter (center -11, -3.5)
    addCollisionBox(furnitureBoxes2BHK, -11, -3.5, 2.0, 0.6, ox2, oz2);
    // Kitchen fridge (center -7, 1)
    addCollisionBox(furnitureBoxes2BHK, -7, 1, 0.8, 0.7, ox2, oz2);
    // Toilet area (center -7.5, 10)
    addCollisionBox(furnitureBoxes2BHK, -7.5, 10, 0.7, 0.7, ox2, oz2);
    // Basin (center -11, 6)
    addCollisionBox(furnitureBoxes2BHK, -11, 6, 0.6, 0.6, ox2, oz2);

    // ── 2BHK WALL SEGMENTS (partition walls with door gaps) ──

    // Wall 1: horizontal at z=-5, full width (x=-14 to 14)
    // Door gap at x=-5 (Bedroom1 door, x: -6.5 to -3.5) and x=5 (Bedroom2 door, x: 3.5 to 6.5)
    // Segment 1: x=-14 to -6.5
    addCollisionBox(furnitureBoxes2BHK, -10.25, -5, 3.75, wt, ox2, oz2);
    // Segment 2: x=-3.5 to 3.5
    addCollisionBox(furnitureBoxes2BHK, 0, -5, 3.5, wt, ox2, oz2);
    // Segment 3: x=6.5 to 14
    addCollisionBox(furnitureBoxes2BHK, 10.25, -5, 3.75, wt, ox2, oz2);

    // NOTE: Main front door collision boxes REMOVED — entry/exit is gated
    // by ENTER/ESCAPE key prompts, so blocking movement at doorways is
    // unnecessary and was causing the "stuck after entering" bug.

    // Wall 2: vertical at x=0, z=-12 to -5 (between bedrooms, NO door)
    addCollisionBox(furnitureBoxes2BHK, 0, -8.5, wt, 3.5, ox2, oz2);

    // Wall 3: vertical at x=-5, z=-5 to 12 (Hall/Kitchen/Bath separator)
    // Door gap at z=-1 (Kitchen door, z: -2.5 to 0.5) and z=7 (Bathroom door, z: 5.5 to 8.5)
    // Segment 1: z=-5 to -2.5
    addCollisionBox(furnitureBoxes2BHK, -5, -3.75, wt, 1.25, ox2, oz2);
    // Segment 2: z=0.5 to 5.5
    addCollisionBox(furnitureBoxes2BHK, -5, 3, wt, 2.5, ox2, oz2);
    // Segment 3: z=8.5 to 12
    addCollisionBox(furnitureBoxes2BHK, -5, 10.25, wt, 1.75, ox2, oz2);

    // Wall 4: horizontal at z=3, x=-14 to -5 (Kitchen/Bathroom separator, NO door)
    addCollisionBox(furnitureBoxes2BHK, -9.5, 3, 4.5, wt, ox2, oz2);
}

function checkFurnitureCollision(newX, newZ) {
    if (boyState.mode !== 'indoor') return false;

    const boxes = boyState.insideHouse === '1bhk' ? furnitureBoxes1BHK : furnitureBoxes2BHK;
    const boyRadius = 0.22; // slimmed for easier navigation through doors

    for (const box of boxes) {
        if (newX > box.xMin - boyRadius && newX < box.xMax + boyRadius &&
            newZ > box.zMin - boyRadius && newZ < box.zMax + boyRadius) {
            return true;
        }
    }
    return false;
}

// Sliding collision: try to move on each axis independently
// Returns { x, z } of the best valid position
function resolveSliding(oldX, oldZ, newX, newZ) {
    if (boyState.mode !== 'indoor') return { x: newX, z: newZ };
    // Both axes OK
    if (!checkFurnitureCollision(newX, newZ)) return { x: newX, z: newZ };
    // Try X only
    if (!checkFurnitureCollision(newX, oldZ)) return { x: newX, z: oldZ };
    // Try Z only
    if (!checkFurnitureCollision(oldX, newZ)) return { x: oldX, z: newZ };
    // Fully blocked
    return { x: oldX, z: oldZ };
}

// ═══════════════════════════════════════════════
//  ANIMATED DOORS
//  Doors pivot open when boy approaches
// ═══════════════════════════════════════════════
const interactiveDoors = [];

function createInteractiveDoor(parent, x, y, z, ry, hingeOffset, openAngle, houseOriginX, houseOriginZ) {
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a2e10, roughness: 0.6 });
    const handleMat2 = new THREE.MeshStandardMaterial({ color: 0xd4a843, metalness: 0.9, roughness: 0.2 });

    // Pivot group positioned at hinge edge
    const pivot = new THREE.Group();
    pivot.position.set(x + hingeOffset.x, 0, z + hingeOffset.z);
    pivot.rotation.y = ry || 0;
    parent.add(pivot);

    // Door mesh offset from pivot (so it swings around the hinge)
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.5, 0.25), doorMat);
    door.position.set(-hingeOffset.x, y, -hingeOffset.z);
    pivot.add(door);

    // Handle
    const handle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), handleMat2);
    handle.position.set(-hingeOffset.x + 0.5, y, -hingeOffset.z + 0.15);
    pivot.add(handle);

    // Frame top
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.28), frameMat);
    frameTop.position.set(-hingeOffset.x, y + 1.85, -hingeOffset.z);
    pivot.add(frameTop);

    // Store base rotation for animation
    pivot.userData.baseRY = ry || 0;

    // World position of door center (for proximity check)
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
    if (!delta) delta = 0.016; // fallback ~60fps

    const bx = boyGroup.position.x;
    const bz = boyGroup.position.z;

    interactiveDoors.forEach(d => {
        const dist = Math.sqrt((bx - d.worldX) ** 2 + (bz - d.worldZ) ** 2);

        // Set target angle based on proximity
        d.targetAngle = dist < d.triggerRadius ? d.openAngle : 0;

        // Smooth lerp rotation
        d.currentAngle += (d.targetAngle - d.currentAngle) * 0.08;

        // Apply: base rotation + animated swing
        d.pivot.rotation.y = d.baseRY + d.currentAngle;
    });
}

// ═══════════════════════════════════════════════
//  MAIN DOOR ANIMATION (entry/exit doors)
//  Animated on ENTER/ESC key press only
// ═══════════════════════════════════════════════
const mainDoorState = {
    '1bhk': { currentAngle: 0, targetAngle: 0, isOpen: false },
    '2bhk': { currentAngle: 0, targetAngle: 0, isOpen: false }
};

function openMainDoor(houseId) {
    mainDoorState[houseId].targetAngle = -Math.PI / 2; // swing open outward
    mainDoorState[houseId].isOpen = true;
}

function closeMainDoor(houseId) {
    mainDoorState[houseId].targetAngle = 0;
    mainDoorState[houseId].isOpen = false;
}

function updateMainDoors() {
    // 1BHK main door
    if (typeof mainDoor1BHK_pivot !== 'undefined') {
        const s = mainDoorState['1bhk'];
        s.currentAngle += (s.targetAngle - s.currentAngle) * 0.1;
        mainDoor1BHK_pivot.rotation.y = s.currentAngle;
    }
    // 2BHK main door
    if (typeof mainDoor2BHK_pivot !== 'undefined') {
        const s = mainDoorState['2bhk'];
        s.currentAngle += (s.targetAngle - s.currentAngle) * 0.1;
        mainDoor2BHK_pivot.rotation.y = s.currentAngle;
    }
}

// ═══════════════════════════════════════════════
//  INITIALIZATION — deferred until all scripts loaded
// ═══════════════════════════════════════════════
function initInteriors() {
    initPartitionRefs();
    initFurnitureCollision();
}

// Init after all scripts are loaded
window.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all house scripts have run
    setTimeout(initInteriors, 100);
});
