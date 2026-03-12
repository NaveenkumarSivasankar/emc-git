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
const bhk1Origin = { x: -22, z: -4 };
const bhk2Origin = { x: 24, z: -4 };

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
    // Partition walls stay SOLID — no transparency
    // Doors provide the visual openings between rooms
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
    const ox1 = -22, oz1 = -4;

    // Sofa (center 9, -3.5, size — trimmed for walkway)
    addCollisionBox(furnitureBoxes1BHK, 9, -3.5, 2.6, 1.2, ox1, oz1);
    // Bookshelf (center 12, 0, size 2.5×0.9)
    addCollisionBox(furnitureBoxes1BHK, 12, 0, 1.5, 0.7, ox1, oz1);
    // Bed (center 3, -8.5, size — trimmed for walkway)
    addCollisionBox(furnitureBoxes1BHK, 3, -8.5, 1.8, 2.3, ox1, oz1);
    // Wardrobe (center -11, -8, size 2.4×1)
    addCollisionBox(furnitureBoxes1BHK, -11, -8, 1.5, 0.8, ox1, oz1);
    // Kitchen counter (center -10, -3.5, size 4×0.9)
    addCollisionBox(furnitureBoxes1BHK, -10, -3.5, 2.5, 0.7, ox1, oz1);
    // Table+fan (center 10, 6, size 2×1.5)
    addCollisionBox(furnitureBoxes1BHK, 10, 6, 1.3, 1, ox1, oz1);
    // Fridge (center -12, 5, size 1.4×1.2)
    addCollisionBox(furnitureBoxes1BHK, -12, 5, 1, 0.9, ox1, oz1);
    // Dining table (center 5, 5)
    addCollisionBox(furnitureBoxes1BHK, 5, 5, 1.2, 0.8, ox1, oz1);
    // TV Stand (center 13, -3)
    addCollisionBox(furnitureBoxes1BHK, 13, -3, 0.6, 1.0, ox1, oz1);

    // ── 1BHK WALL SEGMENTS (partition walls with door gaps) ──
    // Wall thickness = 0.15 (half = 0.15)
    const wt = 0.15;

    // pw1: horizontal wall at z=-5, door gap at x=2 (gap: x=1.1 to 2.9)
    // Segment left: x=-13.8 to 1.1
    addCollisionBox(furnitureBoxes1BHK, -6.35, -5, 7.45, wt, ox1, oz1);
    // Segment right: x=2.9 to 13.8
    addCollisionBox(furnitureBoxes1BHK, 8.35, -5, 5.45, wt, ox1, oz1);

    // pw2: vertical wall at x=-4, door gap at z=3 (gap: z=2.1 to 3.9)
    // Segment bottom: z=-5 to 2.1
    addCollisionBox(furnitureBoxes1BHK, -4, -1.45, wt, 3.55, ox1, oz1);
    // Segment top: z=3.9 to 11
    addCollisionBox(furnitureBoxes1BHK, -4, 7.45, wt, 3.55, ox1, oz1);

    // 2BHK furniture (local coords, bhk2Group at 24, 0)
    const ox2 = 24, oz2 = -4;

    // Bed 1 (center -7, -9) — trimmed to leave walkway
    addCollisionBox(furnitureBoxes2BHK, -7, -9, 1.5, 1.8, ox2, oz2);
    // Bed 2 (center 7, -9) — trimmed to leave walkway
    addCollisionBox(furnitureBoxes2BHK, 7, -9, 1.5, 1.8, ox2, oz2);
    // Hall sofa (center 10, 2) — moved slightly inward, reduced footprint
    addCollisionBox(furnitureBoxes2BHK, 10, 2, 2.2, 1.0, ox2, oz2);
    // Kitchen counter (center -11, -3.5)
    addCollisionBox(furnitureBoxes2BHK, -11, -3.5, 2.0, 0.6, ox2, oz2);
    // Kitchen fridge (center -7, 1)
    addCollisionBox(furnitureBoxes2BHK, -7, 1, 0.8, 0.7, ox2, oz2);
    // Toilet area (center -7.5, 10)
    addCollisionBox(furnitureBoxes2BHK, -7.5, 10, 0.7, 0.7, ox2, oz2);
    // Basin (center -11, 6)
    addCollisionBox(furnitureBoxes2BHK, -11, 6, 0.6, 0.6, ox2, oz2);
    // Wardrobes (Bedroom 1 center -12, -9, Bedroom 2 center 12, -9)
    addCollisionBox(furnitureBoxes2BHK, -12, -9, 0.8, 0.6, ox2, oz2);
    addCollisionBox(furnitureBoxes2BHK, 12, -9, 0.8, 0.6, ox2, oz2);
    // TV Stand in Hall (center 13, 8)
    addCollisionBox(furnitureBoxes2BHK, 13, 8, 0.6, 0.8, ox2, oz2);

    // ── 2BHK WALL SEGMENTS (partition walls with door gaps) ──

    // Wall 1: horizontal at z=-5
    // Door gap at x=-3 (Bed1, gap: -3.9 to -2.1) and x=9 (Bed2, gap: 8.1 to 9.9)
    // Segment 1: x=-14 to -3.9
    addCollisionBox(furnitureBoxes2BHK, -8.95, -5, 5.05, wt, ox2, oz2);
    // Segment 2: x=-2.1 to 8.1
    addCollisionBox(furnitureBoxes2BHK, 3, -5, 5.1, wt, ox2, oz2);
    // Segment 3: x=9.9 to 14
    addCollisionBox(furnitureBoxes2BHK, 11.85, -5, 1.95, wt, ox2, oz2);

    // Wall 2: vertical at x=0, z=-12 to -5 (between bedrooms, NO door)
    addCollisionBox(furnitureBoxes2BHK, 0, -8.5, wt, 3.5, ox2, oz2);

    // Wall 3: vertical at x=-5 (Hall/Kitchen/Bath)
    // Door gap at z=-1 (Kitchen, gap: -1.9 to -0.1) and z=7 (Bathroom, gap: 6.1 to 7.9)
    // Segment 1: z=-5 to -1.9
    addCollisionBox(furnitureBoxes2BHK, -5, -3.45, wt, 1.55, ox2, oz2);
    // Segment 2: z=-0.1 to 6.1
    addCollisionBox(furnitureBoxes2BHK, -5, 3, wt, 3.1, ox2, oz2);
    // Segment 3: z=7.9 to 12
    addCollisionBox(furnitureBoxes2BHK, -5, 9.95, wt, 2.05, ox2, oz2);

    // Wall 4: horizontal at z=3 (Kitchen/Bathroom separator, solid)
    addCollisionBox(furnitureBoxes2BHK, -9.5, 3, 4.5, wt, ox2, oz2);

    // ── OUTER WALL COLLISION BOXES (prevent escaping house) ──
    const owt = 0.4; // outer wall half-thickness

    // 1BHK outer walls (local origin -22, 0 — house W=28, D=22)
    // Back wall z=-11
    addCollisionBox(furnitureBoxes1BHK, 0, -11, 14, owt, ox1, oz1);
    // Front wall left of door gap
    addCollisionBox(furnitureBoxes1BHK, -9, 11, 5, owt, ox1, oz1);
    // Front wall right of door gap
    addCollisionBox(furnitureBoxes1BHK, 9, 11, 5, owt, ox1, oz1);
    // Left wall x=-14
    addCollisionBox(furnitureBoxes1BHK, -14, 0, owt, 11, ox1, oz1);
    // Right wall x=14
    addCollisionBox(furnitureBoxes1BHK, 14, 0, owt, 11, ox1, oz1);

    // 2BHK outer walls (local origin 24, 0 — house W=28, D=24)
    // Back wall z=-12
    addCollisionBox(furnitureBoxes2BHK, 0, -12, 14, owt, ox2, oz2);
    // Front wall left of door gap
    addCollisionBox(furnitureBoxes2BHK, -9, 12, 5, owt, ox2, oz2);
    // Front wall right of door gap
    addCollisionBox(furnitureBoxes2BHK, 9, 12, 5, owt, ox2, oz2);
    // Left wall x=-14
    addCollisionBox(furnitureBoxes2BHK, -14, 0, owt, 12, ox2, oz2);
    // Right wall x=14
    addCollisionBox(furnitureBoxes2BHK, 14, 0, owt, 12, ox2, oz2);
}

function checkFurnitureCollision(newX, newZ) {
    if (boyState.mode !== 'indoor') return false;

    const boxes = boyState.insideHouse === '1bhk' ? furnitureBoxes1BHK : furnitureBoxes2BHK;
    const boyRadius = 0.04; // slimmed down for easier navigation through doors/furniture

    for (const box of boxes) {
        // Expanded box by boy radius
        if (newX > box.xMin - boyRadius && newX < box.xMax + boyRadius &&
            newZ > box.zMin - boyRadius && newZ < box.zMax + boyRadius) {
            return true; // collision!
        }
    }

    // Check closed interactive doors
    if (typeof interactiveDoors !== 'undefined') {
        const originX = boyState.insideHouse === '1bhk' ? -22 : 24;
        const originZ = boyState.insideHouse === '1bhk' ? -4 : -4;
        for (const door of interactiveDoors) {
            // Skip doors belonging to the other house
            if (Math.abs(door.worldX - originX) > 20) continue;

            // If the door is opening/open, its collision is disabled
            // We use a small threshold to allow passing through even as it starts opening
            if (door.targetAngle > 0.05 || door.currentAngle > 0.05) continue;

            // Door bounding box (closed pos)
            let dx, dz;
            if (Math.abs(door.baseRY) < 0.1) {
                // Rotated 0 (aligned along X)
                dx = 0.9; // half of 1.8 width
                dz = 0.15; // slightly larger than half of 0.25 depth
            } else {
                // Rotated 90 deg (aligned along Z)
                dx = 0.15;
                dz = 0.9;
            }

            const xMin = door.worldX - dx;
            const xMax = door.worldX + dx;
            const zMin = door.worldZ - dz;
            const zMax = door.worldZ + dz;

            if (newX > xMin - boyRadius && newX < xMax + boyRadius &&
                newZ > zMin - boyRadius && newZ < zMax + boyRadius) {
                return true;
            }
        }
    }

    return false;
}

// ═══════════════════════════════════════════════
//  ANIMATED DOORS
//  Doors pivot open when boy approaches
// ═══════════════════════════════════════════════
const interactiveDoors = [];

function createInteractiveDoor(parent, x, y, z, ry, hingeOffset, openAngle, houseOriginX, houseOriginZ, wallColor) {
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a2e10, roughness: 0.6 });
    const handleMat2 = new THREE.MeshStandardMaterial({ color: 0xd4a843, metalness: 0.9, roughness: 0.2 });
    const wallFillMat = new THREE.MeshStandardMaterial({ color: wallColor || 0xe8d5b7, roughness: 0.85, side: THREE.DoubleSide });

    const isVerticalWall = Math.abs(ry - Math.PI / 2) < 0.1;

    // Pivot group positioned at hinge edge
    const pivot = new THREE.Group();
    pivot.position.set(x + hingeOffset.x, 0, z + hingeOffset.z);
    pivot.rotation.y = ry || 0;
    parent.add(pivot);

    // Door mesh offset from pivot (so it swings around the hinge)
    // For vertical walls (ry=PI/2), the pivot is rotated, so we must compute
    // the local-space offset that produces the correct world-space position.
    // The door center should be at (x, y, z) in parent space.
    // Pivot is at (x + hingeOffset.x, 0, z + hingeOffset.z).
    // We need local offset that, after rotation by ry, lands at (-hingeOffset.x, y, -hingeOffset.z) in world.
    // For ry=PI/2: world(x,z) = local(z, -x), so local(x,z) = world(-z, x)
    let doorLocalX, doorLocalZ;
    let handleLocalX, handleLocalZ;
    if (isVerticalWall) {
        // World offset needed: (-hingeOffset.x, -hingeOffset.z) = (0, 0.9)
        // local = world rotated back: (-worldZ, worldX) = (-0.9, 0)
        doorLocalX = hingeOffset.z;   // = -0.9 for hingeOffset.z = -0.9
        doorLocalZ = -hingeOffset.x;  // = 0 for hingeOffset.x = 0
        handleLocalX = hingeOffset.z - 0.6;
        handleLocalZ = -hingeOffset.x + 0.15;
    } else {
        doorLocalX = -hingeOffset.x;
        doorLocalZ = -hingeOffset.z;
        handleLocalX = -hingeOffset.x + 0.6;
        handleLocalZ = -hingeOffset.z + 0.15;
    }

    const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.5, 0.25), doorMat);
    door.position.set(doorLocalX, y, doorLocalZ);
    pivot.add(door);

    // Handle
    const handle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), handleMat2);
    handle.position.set(handleLocalX, y, handleLocalZ);
    pivot.add(handle);

    // Frame top
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.15, 0.28), frameMat);
    frameTop.position.set(doorLocalX, y + 1.85, doorLocalZ);
    pivot.add(frameTop);

    // ── TRANSOM (wall above door to fill gap to ceiling) ──
    // Door top: y + 1.85 + 0.075 ≈ y + 1.93 = ~4.0
    // Wall top: H/2 + 0.3 + H/2 = 7.3 (H=7)
    const transomH = 3.3; // from ~4.0 to ~7.3
    const transomGeo = isVerticalWall
        ? new THREE.BoxGeometry(0.22, transomH, 1.8)
        : new THREE.BoxGeometry(1.8, transomH, 0.22);
    const transom = new THREE.Mesh(transomGeo, wallFillMat);
    transom.position.set(x, y + 1.93 + transomH / 2, z);
    parent.add(transom);

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

function updateDoors() {
    if (boyState.mode !== 'indoor') return;

    const bx = boyGroup.position.x;
    const bz = boyGroup.position.z;

    interactiveDoors.forEach(d => {
        const dist = Math.sqrt((bx - d.worldX) ** 2 + (bz - d.worldZ) ** 2);

        // Set target angle based on proximity
        d.targetAngle = dist < d.triggerRadius ? d.openAngle : 0;

        // Smooth lerp rotation (faster for snappier response)
        d.currentAngle += (d.targetAngle - d.currentAngle) * 0.30;

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
        s.currentAngle += (s.targetAngle - s.currentAngle) * 0.15;
        mainDoor1BHK_pivot.rotation.y = s.currentAngle;
    }
    // 2BHK main door
    if (typeof mainDoor2BHK_pivot !== 'undefined') {
        const s = mainDoorState['2bhk'];
        s.currentAngle += (s.targetAngle - s.currentAngle) * 0.15;
        mainDoor2BHK_pivot.rotation.y = s.currentAngle;
    }
}

// ═══════════════════════════════════════════════
//  INITIALIZATION — deferred until all scripts loaded
// ═══════════════════════════════════════════════
function initInteriors() {
    initPartitionRefs();
    initFurnitureCollision();

    // ── Create interactive interior doors ──
    const ox1 = -22, oz1 = -4;
    const ox2 = 24, oz2 = -4;

    // 1BHK interior doors (in partition walls)
    // Wall color for 1BHK: 0xe8d5b7, door gap width: 1.8, door width: 1.8
    // Bedroom door (horizontal wall z=-5, gap center x=2, hingeOffset=-0.9)
    if (typeof houseGroup !== 'undefined') {
        createInteractiveDoor(houseGroup, 2, 2.05, -5, 0, { x: -0.9, z: 0 }, Math.PI / 2, ox1, oz1, 0xe8d5b7);
        // Kitchen door (vertical wall x=-4, gap center z=3, hingeOffset=-0.9)
        createInteractiveDoor(houseGroup, -4, 2.05, 3, Math.PI / 2, { x: 0, z: -0.9 }, Math.PI / 2, ox1, oz1, 0xe8d5b7);
    }

    // 2BHK interior doors (in partition walls)
    // Wall color for 2BHK: 0xe0d0b8, door gap width: 1.8, door width: 1.8
    if (typeof bhk2Group !== 'undefined') {
        // Bedroom 1 door (horizontal wall z=-5, gap center x=-3, hingeOffset=-0.9)
        createInteractiveDoor(bhk2Group, -3, 2.05, -5, 0, { x: -0.9, z: 0 }, Math.PI / 2, ox2, oz2, 0xe0d0b8);
        // Bedroom 2 door (horizontal wall z=-5, gap center x=9, hingeOffset=-0.9)
        createInteractiveDoor(bhk2Group, 9, 2.05, -5, 0, { x: -0.9, z: 0 }, Math.PI / 2, ox2, oz2, 0xe0d0b8);
        // Kitchen door (vertical wall x=-5, gap center z=-1, hingeOffset=-0.9)
        createInteractiveDoor(bhk2Group, -5, 2.05, -1, Math.PI / 2, { x: 0, z: -0.9 }, Math.PI / 2, ox2, oz2, 0xe0d0b8);
        // Bathroom door (vertical wall x=-5, gap center z=7, hingeOffset=-0.9)
        createInteractiveDoor(bhk2Group, -5, 2.05, 7, Math.PI / 2, { x: 0, z: -0.9 }, Math.PI / 2, ox2, oz2, 0xe0d0b8);
    }
}

// Init after all scripts are loaded
window.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all house scripts have run
    setTimeout(initInteriors, 100);
});
