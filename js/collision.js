// ═══════════════════════════════════════════════
//  COLLISION SYSTEM — AABB Walls + Door Triggers
// ═══════════════════════════════════════════════

class CollisionSystem {
  constructor() {
    this.walls = [];      // Array of THREE.Box3
    this.doors = [];      // Array of { box: Box3, leadsTo: string }
  }

  /**
   * Add a wall from a mesh's bounding box
   */
  addWall(mesh) {
    const box = new THREE.Box3().setFromObject(mesh);
    this.walls.push(box);
    const min = box.min;
    const max = box.max;
    console.log(`[COLLISION] Wall added: {minX: ${min.x.toFixed(1)}, maxX: ${max.x.toFixed(1)}, minZ: ${min.z.toFixed(1)}, maxZ: ${max.z.toFixed(1)}}`);
  }

  /**
   * Add a wall from explicit AABB bounds (world coords)
   */
  addWallBox(xMin, xMax, zMin, zMax, yMin, yMax) {
    yMin = yMin || 0;
    yMax = yMax || 10;
    const box = new THREE.Box3(
      new THREE.Vector3(xMin, yMin, zMin),
      new THREE.Vector3(xMax, yMax, zMax)
    );
    this.walls.push(box);
  }

  /**
   * Add a door trigger zone
   */
  addDoor(position, size, leadsTo) {
    const box = new THREE.Box3().setFromCenterAndSize(position, size);
    this.doors.push({ box, leadsTo });
    console.log(`[COLLISION] Door added: leadsTo=${leadsTo}`);
  }

  /**
   * Resolve collision — call AFTER computing proposed position.
   * Returns { blocked, position } where position is the corrected location.
   */
  resolveCollision(boyMesh, proposedPosition) {
    const boyRadius = 0.3;
    const boyBox = new THREE.Box3(
      new THREE.Vector3(
        proposedPosition.x - boyRadius,
        proposedPosition.y,
        proposedPosition.z - boyRadius
      ),
      new THREE.Vector3(
        proposedPosition.x + boyRadius,
        proposedPosition.y + 1.8,
        proposedPosition.z + boyRadius
      )
    );

    let wasBlocked = false;

    for (const wall of this.walls) {
      if (wall.intersectsBox(boyBox)) {
        // Push boy OUT of wall — find shortest escape axis
        const center = new THREE.Vector3();
        boyBox.getCenter(center);
        const wallCenter = new THREE.Vector3();
        wall.getCenter(wallCenter);

        const dx = center.x - wallCenter.x;
        const dz = center.z - wallCenter.z;

        // Determine overlap on each axis for proper push-out
        const overlapX = (boyBox.max.x - boyBox.min.x) / 2 + (wall.max.x - wall.min.x) / 2 - Math.abs(dx);
        const overlapZ = (boyBox.max.z - boyBox.min.z) / 2 + (wall.max.z - wall.min.z) / 2 - Math.abs(dz);

        if (overlapX > 0 && overlapZ > 0) {
          // Push along the axis with smallest overlap (minimum penetration)
          if (overlapX < overlapZ) {
            proposedPosition.x += (dx > 0 ? overlapX : -overlapX);
          } else {
            proposedPosition.z += (dz > 0 ? overlapZ : -overlapZ);
          }
          wasBlocked = true;
        }
      }
    }

    return { blocked: wasBlocked, position: proposedPosition };
  }

  /**
   * Check if boy has entered a door zone
   */
  checkDoorEntry(boyMesh) {
    const boyPos = boyMesh.position;
    for (const door of this.doors) {
      if (door.box.containsPoint(boyPos)) {
        return door.leadsTo;
      }
    }
    return null;
  }

  /**
   * Clear all walls and doors (used when switching scenes)
   */
  clear() {
    this.walls = [];
    this.doors = [];
  }

  /**
   * Clear and rebuild for a specific context
   */
  setupExterior() {
    this.clear();
    // 1BHK house perimeter walls (world coords: house at x=-22)
    // Back wall
    this.addWallBox(-36, -8, -11.15, -10.85);
    // Left wall
    this.addWallBox(-36.15, -35.85, -11, 11);
    // Right wall
    this.addWallBox(-8.15, -7.85, -11, 11);
    // Front wall left of door
    this.addWallBox(-36, -23.25, 10.85, 11.15);
    // Front wall right of door
    this.addWallBox(-20.75, -8, 10.85, 11.15);

    // 2BHK house perimeter walls (world coords: house at x=24)
    // Back wall
    this.addWallBox(10, 38, -12.15, -11.85);
    // Left wall
    this.addWallBox(9.85, 10.15, -12, 12);
    // Right wall
    this.addWallBox(37.85, 38.15, -12, 12);
    // Front wall left of door
    this.addWallBox(10, 22.75, 11.85, 12.15);
    // Front wall right of door
    this.addWallBox(25.25, 38, 11.85, 12.15);

    // Front dividing wall between houses
    this.addWallBox(-7, 9.5, 9.8, 10.2);

    // Door trigger zones
    this.addDoor(
      new THREE.Vector3(-22, 1, 12),
      new THREE.Vector3(3, 3, 2),
      '1bhk'
    );
    this.addDoor(
      new THREE.Vector3(24, 1, 13),
      new THREE.Vector3(3, 3, 2),
      '2bhk'
    );

    console.log(`[COLLISION] Exterior setup: ${this.walls.length} walls, ${this.doors.length} doors`);
  }

  setupInterior(houseId) {
    this.clear();

    if (houseId === '1bhk') {
      // 1BHK interior walls (world coords, house at x=-22)
      // Outer walls
      this.addWallBox(-36, -8, -11.15, -10.85);   // Back
      this.addWallBox(-36.15, -35.85, -11, 11);    // Left
      this.addWallBox(-8.15, -7.85, -11, 11);      // Right
      this.addWallBox(-36, -23.25, 10.85, 11.15);  // Front left
      this.addWallBox(-20.75, -8, 10.85, 11.15);   // Front right

      // Partition walls (with door gaps)
      this.addWallBox(-35.8, -25.85, -6.6, -6.4);  // Horizontal left of gap
      this.addWallBox(-24.15, -12.2, -6.6, -6.4);  // Horizontal right of gap
      this.addWallBox(-26.1, -25.9, -4.65, -2.85); // Vertical partition top
      this.addWallBox(-26.1, -25.9, -1.15, 6.65);  // Vertical partition bottom

      // Furniture collision boxes
      this.addWallBox(-19.5, -14.5, -5.75, -3.4);  // Bed
      this.addWallBox(-33, -31, -8.5, -7.5);        // Wardrobe
      this.addWallBox(-32, -28, -3.8, -3.2);        // Counter
      this.addWallBox(-15.75, -12.25, -6.65, -2.0); // Bookshelf area
      this.addWallBox(-13.3, -10.7, -4.75, -3.25);  // Sofa

      // Exit door trigger
      this.addDoor(
        new THREE.Vector3(-22, 1, 8),
        new THREE.Vector3(3, 3, 2),
        'exit'
      );

      console.log(`[COLLISION] Interior 1BHK setup: ${this.walls.length} walls`);

    } else if (houseId === '2bhk') {
      // 2BHK interior walls (world coords, house at x=24)
      // Outer walls
      this.addWallBox(10, 38, -12.15, -11.85);    // Back
      this.addWallBox(9.85, 10.15, -12, 12);      // Left
      this.addWallBox(37.85, 38.15, -12, 12);     // Right
      this.addWallBox(10, 22.75, 11.85, 12.15);   // Front left
      this.addWallBox(25.25, 38, 11.85, 12.15);   // Front right

      // Partitions
      this.addWallBox(10.2, 20.25, -5.1, -4.9);   // Horizontal left
      this.addWallBox(21.75, 30.25, -5.1, -4.9);  // Horizontal middle
      this.addWallBox(31.75, 37.8, -5.1, -4.9);   // Horizontal right
      this.addWallBox(23.9, 24.1, -11.9, -5.1);   // Vertical bedroom divider
      this.addWallBox(18.9, 19.1, -5.0, -2.75);   // Vertical kitchen top
      this.addWallBox(18.9, 19.1, -1.25, 4.75);   // Vertical kitchen middle
      this.addWallBox(18.9, 19.1, 6.25, 12);      // Vertical kitchen bottom
      this.addWallBox(10.1, 18.9, 6.9, 7.1);      // Horizontal kitchen/bath

      // Furniture
      this.addWallBox(16.6, 19.4, -10, -7);       // Bed 1
      this.addWallBox(30.6, 33.4, -10, -7);       // Bed 2
      this.addWallBox(34.95, 37.45, 2, 5.2);      // Hall sofa
      this.addWallBox(28.5, 30.5, 2.5, 3.5);      // Coffee table
      this.addWallBox(12.5, 14.5, -4, -3);         // Kitchen counter

      // Exit door trigger
      this.addDoor(
        new THREE.Vector3(24, 1, 9),
        new THREE.Vector3(3, 3, 2),
        'exit'
      );

      console.log(`[COLLISION] Interior 2BHK setup: ${this.walls.length} walls`);
    }
  }
}

// Global collision system instance
const collisionSystem = new CollisionSystem();
