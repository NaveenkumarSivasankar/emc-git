// ═══════════════════════════════════════════════
//  SCENE SETUP
// ═══════════════════════════════════════════════
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Sky gradient background
const skyCanvas = document.createElement('canvas');
skyCanvas.width = 2;
skyCanvas.height = 512;
const skyCtx = skyCanvas.getContext('2d');
const skyGrad = skyCtx.createLinearGradient(0, 0, 0, 512);
skyGrad.addColorStop(0, '#0a1628');
skyGrad.addColorStop(0.3, '#1a3a5c');
skyGrad.addColorStop(0.5, '#3d7ab5');
skyGrad.addColorStop(0.7, '#7ec8e3');
skyGrad.addColorStop(0.85, '#c9e8f5');
skyGrad.addColorStop(1, '#ffecd2');
skyCtx.fillStyle = skyGrad;
skyCtx.fillRect(0, 0, 2, 512);
const skyTexture = new THREE.CanvasTexture(skyCanvas);
scene.background = skyTexture;

// Fog
scene.fog = new THREE.FogExp2(0x7ec8e3, 0.012);

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 40);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
container.appendChild(renderer.domElement);

// CSS2D Renderer for labels
const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.5;
controls.maxDistance = 70;
controls.maxPolarAngle = Math.PI / 2.05;
controls.target.set(0, 4, 0);
controls.update();

// ═══════════════════════════════════════════════
//  LIGHTING
// ═══════════════════════════════════════════════
const ambientLight = new THREE.AmbientLight(0xffecd2, 0.7);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
sunLight.position.set(15, 25, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.left = -25;
sunLight.shadow.camera.right = 25;
sunLight.shadow.camera.top = 25;
sunLight.shadow.camera.bottom = -25;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 60;
sunLight.shadow.bias = -0.001;
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0x8ec8f0, 0.4);
fillLight.position.set(-10, 8, -5);
scene.add(fillLight);

// Interior lights — brighter so appliances are clearly visible
const interiorLight1 = new THREE.PointLight(0xfff5e0, 1.2, 20);
interiorLight1.position.set(0, 5.5, 0);
scene.add(interiorLight1);
const interiorLight2 = new THREE.PointLight(0xfff5e0, 0.8, 15);
interiorLight2.position.set(-3, 4, -2);
scene.add(interiorLight2);
const interiorLight3 = new THREE.PointLight(0xfff5e0, 0.8, 15);
interiorLight3.position.set(3, 4, 2);
scene.add(interiorLight3);

// ═══════════════════════════════════════════════
//  GROUND
// ═══════════════════════════════════════════════
const groundGeo = new THREE.PlaneGeometry(120, 120);
const groundMat = new THREE.MeshStandardMaterial({
    color: 0x4a8c3f,
    roughness: 0.9,
    metalness: 0.0
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Pathway
const pathGeo = new THREE.PlaneGeometry(2.5, 10);
const pathMat = new THREE.MeshStandardMaterial({ color: 0xb8a089, roughness: 0.95 });
const pathway = new THREE.Mesh(pathGeo, pathMat);
pathway.rotation.x = -Math.PI / 2;
pathway.position.set(0, 0.02, 9);
pathway.receiveShadow = true;
scene.add(pathway);


const sunGeo = new THREE.SphereGeometry(3, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
sunMesh.position.set(30, 35, -20);
scene.add(sunMesh);


const sunGlowGeo = new THREE.SphereGeometry(5, 32, 32);
const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xffee88, transparent: true, opacity: 0.15 });
const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
sunGlow.position.copy(sunMesh.position);
scene.add(sunGlow);

// ═══════════════════════════════════════════════
//  CLOUDS
// ═══════════════════════════════════════════════
function createCloud(x, y, z, scale) {
    const group = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0 });
    const positions = [
        [0, 0, 0, 1.5],
        [1.5, 0.2, 0.3, 1.2],
        [-1.3, 0.1, -0.2, 1.1],
        [0.5, 0.6, 0, 1.0],
        [-0.5, 0.5, 0.2, 0.9]
    ];
    positions.forEach(([px, py, pz, r]) => {
        const geo = new THREE.SphereGeometry(r, 12, 12);
        const mesh = new THREE.Mesh(geo, cloudMat);
        mesh.position.set(px, py, pz);
        group.add(mesh);
    });
    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    scene.add(group);
    return group;
}

const clouds = [
    createCloud(-15, 20, -10, 1.5),
    createCloud(20, 22, -15, 1.8),
    createCloud(5, 18, -25, 1.2),
    createCloud(-25, 24, -20, 1.4),
    createCloud(30, 19, -8, 1.0)
];

// ═══════════════════════════════════════════════
//  HOUSE STRUCTURE
// ═══════════════════════════════════════════════
const houseGroup = new THREE.Group();
houseGroup.position.set(-11, 0, 0);
scene.add(houseGroup);

// Dimensions (declared early so labels can use them)
const W = 12, D = 10, H = 6, roofH = 4;

// Simple house ground label
const simpleLabelDiv = document.createElement('div');
simpleLabelDiv.className = 'appliance-label';
simpleLabelDiv.innerHTML = '<span class="name" style="font-size:1.1rem;">🏠 Simple House</span>';
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

// Floor
const floorGeo = new THREE.BoxGeometry(W, 0.3, D);
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.position.y = 0.15;
floor.receiveShadow = true;
houseGroup.add(floor);

// Walls (stored for transparency control)
const transparentWalls = [];

function createWall(w, h, d, x, y, z, mat, isTransparent) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const m = isTransparent ? wallMatTransparent.clone() : mat;
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    houseGroup.add(mesh);
    if (isTransparent) transparentWalls.push(mesh);
    return mesh;
}

// Back wall
createWall(W, H, 0.3, 0, H / 2 + 0.3, -D / 2, wallMat, false);

// Left wall
createWall(0.3, H, D, -W / 2, H / 2 + 0.3, 0, wallMat, true);

// Right wall
createWall(0.3, H, D, W / 2, H / 2 + 0.3, 0, wallMat, true);

// Front wall – left section
createWall(4, H, 0.3, -4, H / 2 + 0.3, D / 2, wallMat, true);

// Front wall – right section
createWall(4, H, 0.3, 4, H / 2 + 0.3, D / 2, wallMat, true);

// Front wall – above door
createWall(4, 2, 0.3, 0, H - 0.7, D / 2, wallMat, true);

// Door
const doorGeo = new THREE.BoxGeometry(2, 4, 0.35);
const door = new THREE.Mesh(doorGeo, doorMat);
door.position.set(0, 2.3, D / 2);
door.castShadow = true;
houseGroup.add(door);

// Door handle
const handleGeo = new THREE.SphereGeometry(0.12, 8, 8);
const handleMat = new THREE.MeshStandardMaterial({ color: 0xd4a843, metalness: 0.9, roughness: 0.2 });
const handle = new THREE.Mesh(handleGeo, handleMat);
handle.position.set(0.6, 2.5, D / 2 + 0.2);
houseGroup.add(handle);

// Windows (front)
function createWindow(x, y, z, rotY) {
    const group = new THREE.Group();
    // Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2, 1.8, 0.15), windowFrameMat);
    group.add(frame);
    // Glass
    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.5, 0.06), glassMat);
    glass.position.z = 0.06;
    group.add(glass);
    // Cross bars
    const barH = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.08), windowFrameMat);
    barH.position.z = 0.08;
    group.add(barH);
    const barV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.5, 0.08), windowFrameMat);
    barV.position.z = 0.08;
    group.add(barV);
    group.position.set(x, y, z);
    group.rotation.y = rotY || 0;
    houseGroup.add(group);
}

createWindow(-4, 4, D / 2 + 0.15, 0);
createWindow(4, 4, D / 2 + 0.15, 0);
// Side windows
createWindow(-W / 2 - 0.15, 4, -1.5, Math.PI / 2);
createWindow(W / 2 + 0.15, 4, -1.5, Math.PI / 2);
createWindow(-W / 2 - 0.15, 4, 2.5, Math.PI / 2);
createWindow(W / 2 + 0.15, 4, 2.5, Math.PI / 2);

// Roof
const roofShape = new THREE.Shape();
roofShape.moveTo(-W / 2 - 0.8, 0);
roofShape.lineTo(0, roofH);
roofShape.lineTo(W / 2 + 0.8, 0);
roofShape.lineTo(-W / 2 - 0.8, 0);

const roofExtrudeSettings = { depth: D + 1.6, bevelEnabled: false };
const roofGeo = new THREE.ExtrudeGeometry(roofShape, roofExtrudeSettings);
const roof = new THREE.Mesh(roofGeo, roofMat);
roof.position.set(0, H + 0.3, -D / 2 - 0.8);
roof.castShadow = true;
roof.receiveShadow = true;
houseGroup.add(roof);

// Chimney
const chimneyGeo = new THREE.BoxGeometry(1.2, 3, 1.2);
const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.85 });
const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
chimney.position.set(4, H + roofH - 0.5, -2);
chimney.castShadow = true;
houseGroup.add(chimney);

// Chimney top
const chimneyTopGeo = new THREE.BoxGeometry(1.5, 0.3, 1.5);
const chimneyTop = new THREE.Mesh(chimneyTopGeo, chimneyMat);
chimneyTop.position.set(4, H + roofH + 1, -2);
houseGroup.add(chimneyTop);

// ═══════════════════════════════════════════════
//  INTERIOR ROOM DETAILS (Simple House Room System)
// ═══════════════════════════════════════════════
const simpleRoomGroups = {
    'Living Room': new THREE.Group(),
    'Bedroom': new THREE.Group(),
    'Bathroom': new THREE.Group(),
    'Structure': new THREE.Group()
};
Object.values(simpleRoomGroups).forEach(g => houseGroup.add(g));

// Alias for backward compat
const interiorGroup = simpleRoomGroups['Living Room'];

// Interior wall color (painted)
const intWallMat = new THREE.MeshStandardMaterial({ color: 0xf5efe6, roughness: 0.9, side: THREE.BackSide });

// ── Simple House Partition Walls ──
const simplePartWallMat = new THREE.MeshStandardMaterial({ color: 0xf0e6d3, roughness: 0.85, transparent: true, opacity: 0.35 });

// Horizontal wall at z = -1.5 separating living room (front) from bedroom/bathroom (back)
const simplePartH = new THREE.Mesh(new THREE.BoxGeometry(W - 0.4, H, 0.2), simplePartWallMat.clone());
simplePartH.position.set(0, H / 2 + 0.3, -1.5);
simplePartH.castShadow = true;
simpleRoomGroups['Structure'].add(simplePartH);

// Vertical wall at x = 0 separating bedroom (left) from bathroom (right)
const simplePartV = new THREE.Mesh(new THREE.BoxGeometry(0.2, H, D / 2 - 1.5 - 0.2), simplePartWallMat.clone());
simplePartV.position.set(0, H / 2 + 0.3, -(D / 2 + 1.5) / 2);
simplePartV.castShadow = true;
simpleRoomGroups['Structure'].add(simplePartV);

// Room doors in partition walls
const simpleRoomDoorMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 });
// Bedroom door (in horizontal wall, left side)
const simpleBedDoor = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.5, 0.25), simpleRoomDoorMat);
simpleBedDoor.position.set(-3, 2.05, -1.5);
simpleRoomGroups['Structure'].add(simpleBedDoor);
const simpleBedDoorHandle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0xd4a843, metalness: 0.9, roughness: 0.2 }));
simpleBedDoorHandle.position.set(-2.5, 2.05, -1.3);
simpleRoomGroups['Structure'].add(simpleBedDoorHandle);

// Bathroom door (in horizontal wall, right side)
const simpleBathDoor = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.5, 0.25), simpleRoomDoorMat);
simpleBathDoor.position.set(3, 2.05, -1.5);
simpleRoomGroups['Structure'].add(simpleBathDoor);
const simpleBathDoorHandle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0xd4a843, metalness: 0.9, roughness: 0.2 }));
simpleBathDoorHandle.position.set(3.5, 2.05, -1.3);
simpleRoomGroups['Structure'].add(simpleBathDoorHandle);

// Room floor tiles
// Living Room floor tile (front half: z from -1.5 to D/2)
const simpleLivingFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.4, D / 2 + 1.5 - 0.3),
    new THREE.MeshStandardMaterial({ color: 0xd4b896, roughness: 0.75 })
);
simpleLivingFloor.rotation.x = -Math.PI / 2;
simpleLivingFloor.position.set(0, 0.32, (D / 2 - 1.5) / 2);
simpleLivingFloor.receiveShadow = true;
simpleRoomGroups['Living Room'].add(simpleLivingFloor);

// Bedroom floor tile (back-left: z from -D/2 to -1.5, x from -W/2 to 0)
const simpleBedFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(W / 2 - 0.3, D / 2 - 1.5 - 0.3),
    new THREE.MeshStandardMaterial({ color: 0xa8c8e8, roughness: 0.75 })
);
simpleBedFloor.rotation.x = -Math.PI / 2;
simpleBedFloor.position.set(-W / 4, 0.32, -(D / 2 + 1.5) / 2);
simpleBedFloor.receiveShadow = true;
simpleRoomGroups['Bedroom'].add(simpleBedFloor);

// Bathroom floor tile (back-right: z from -D/2 to -1.5, x from 0 to W/2)
const simpleBathFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(W / 2 - 0.3, D / 2 - 1.5 - 0.3),
    new THREE.MeshStandardMaterial({ color: 0x88ccbb, roughness: 0.75 })
);
simpleBathFloor.rotation.x = -Math.PI / 2;
simpleBathFloor.position.set(W / 4, 0.32, -(D / 2 + 1.5) / 2);
simpleBathFloor.receiveShadow = true;
simpleRoomGroups['Bathroom'].add(simpleBathFloor);

// Room labels for simple house
function addSimpleRoomLabel(name, x, y, z, room) {
    const div = document.createElement('div');
    div.className = 'appliance-label';
    div.innerHTML = `<span class="name" style="font-size:0.9rem">${name}</span>`;
    const l = new THREE.CSS2DObject(div);
    l.position.set(x, y, z);
    simpleRoomGroups[room].add(l);
    return l;
}
const simpleRoomLabels = [
    addSimpleRoomLabel('🏠 Living Room', 0, 4, (D / 2 - 1.5) / 2, 'Living Room'),
    addSimpleRoomLabel('🛏️ Bedroom', -W / 4, 4, -(D / 2 + 1.5) / 2, 'Bedroom'),
    addSimpleRoomLabel('🚿 Bathroom', W / 4, 4, -(D / 2 + 1.5) / 2, 'Bathroom')
];

// ── Bedroom Furniture ──
// Bed
const simpleBedFrameMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7 });
const simpleBedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 3), simpleBedFrameMat);
simpleBedFrame.position.set(-W / 4, 0.55, -(D / 2 + 1.5) / 2);
simpleBedFrame.castShadow = true;
simpleRoomGroups['Bedroom'].add(simpleBedFrame);

const simpleBedMattress = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.3, 2.8),
    new THREE.MeshStandardMaterial({ color: 0x6495ED, roughness: 0.9 }));
simpleBedMattress.position.set(-W / 4, 0.95, -(D / 2 + 1.5) / 2);
simpleRoomGroups['Bedroom'].add(simpleBedMattress);

// Pillows
const simplePillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
const simplePillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.45), simplePillowMat);
simplePillow1.position.set(-W / 4 - 0.5, 1.18, -(D / 2 + 1.5) / 2 - 1.1);
simpleRoomGroups['Bedroom'].add(simplePillow1);
const simplePillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.45), simplePillowMat);
simplePillow2.position.set(-W / 4 + 0.5, 1.18, -(D / 2 + 1.5) / 2 - 1.1);
simpleRoomGroups['Bedroom'].add(simplePillow2);

// Headboard
const simpleHeadboard = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.3, 0.2), simpleBedFrameMat);
simpleHeadboard.position.set(-W / 4, 1.3, -(D / 2 + 1.5) / 2 - 1.4);
simpleRoomGroups['Bedroom'].add(simpleHeadboard);

// Bedside table
const simpleNightstand = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.8 }));
simpleNightstand.position.set(-W / 4 + 2, 0.7, -(D / 2 + 1.5) / 2 - 1);
simpleNightstand.castShadow = true;
simpleRoomGroups['Bedroom'].add(simpleNightstand);

// Small wardrobe
const simpleWardrobe = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.5, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 }));
simpleWardrobe.position.set(-W / 4 - 2, 2.05, -(D / 2 + 1.5) / 2 + 0.8);
simpleWardrobe.castShadow = true;
simpleRoomGroups['Bedroom'].add(simpleWardrobe);

// ── Bathroom Fixtures ──
const simpleBathX = W / 4;
const simpleBathZ = -(D / 2 + 1.5) / 2;
const simpleWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.3 });
const simpleChromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });

// Toilet
const simpleToiletBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.6, 12), simpleWhiteMat);
simpleToiletBowl.position.set(simpleBathX + 1, 0.6, simpleBathZ + 1);
simpleRoomGroups['Bathroom'].add(simpleToiletBowl);
const simpleToiletSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.05, 12), simpleWhiteMat);
simpleToiletSeat.position.set(simpleBathX + 1, 0.93, simpleBathZ + 1);
simpleRoomGroups['Bathroom'].add(simpleToiletSeat);
const simpleToiletTank = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.25), simpleWhiteMat);
simpleToiletTank.position.set(simpleBathX + 1, 0.8, simpleBathZ + 1.5);
simpleRoomGroups['Bathroom'].add(simpleToiletTank);

// Wash Basin
const simpleBasin = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 0.12, 12), simpleWhiteMat);
simpleBasin.position.set(simpleBathX - 0.5, 1.2, simpleBathZ - 0.8);
simpleRoomGroups['Bathroom'].add(simpleBasin);
const simpleBasinStand = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 1.0, 8), simpleWhiteMat);
simpleBasinStand.position.set(simpleBathX - 0.5, 0.6, simpleBathZ - 0.8);
simpleRoomGroups['Bathroom'].add(simpleBasinStand);
const simpleTap = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 6), simpleChromeMat);
simpleTap.position.set(simpleBathX - 0.5, 1.45, simpleBathZ - 1.0);
simpleRoomGroups['Bathroom'].add(simpleTap);

// Shower
const simpleShowerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3.0, 6), simpleChromeMat);
simpleShowerPipe.position.set(simpleBathX + 1.5, 1.8, simpleBathZ - 0.8);
simpleRoomGroups['Bathroom'].add(simpleShowerPipe);
const simpleShowerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.07, 12), simpleChromeMat);
simpleShowerHead.position.set(simpleBathX + 1.5, 3.3, simpleBathZ - 0.8);
simpleRoomGroups['Bathroom'].add(simpleShowerHead);

// Bucket
const simpleBucket = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.45, 10),
    new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.6 }));
simpleBucket.position.set(simpleBathX + 0.3, 0.52, simpleBathZ);
simpleRoomGroups['Bathroom'].add(simpleBucket);

// Interior lights for new rooms
const bedroomIntLight = new THREE.PointLight(0xfff5e0, 0.9, 12);
bedroomIntLight.position.set(-W / 4, 5.5, -(D / 2 + 1.5) / 2);
simpleRoomGroups['Bedroom'].add(bedroomIntLight);

const bathIntLight = new THREE.PointLight(0xfff5e0, 0.9, 12);
bathIntLight.position.set(W / 4, 5.5, -(D / 2 + 1.5) / 2);
simpleRoomGroups['Bathroom'].add(bathIntLight);

// Carpet / Rug
const rugGeo = new THREE.PlaneGeometry(6, 5);
const rugMat = new THREE.MeshStandardMaterial({ color: 0x8B2252, roughness: 0.95 });
const rug = new THREE.Mesh(rugGeo, rugMat);
rug.rotation.x = -Math.PI / 2;
rug.position.set(0, 0.35, 0.5);
interiorGroup.add(rug);

// Rug border
const rugBorderGeo = new THREE.PlaneGeometry(6.5, 5.5);
const rugBorderMat = new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.9 });
const rugBorder = new THREE.Mesh(rugBorderGeo, rugBorderMat);
rugBorder.rotation.x = -Math.PI / 2;
rugBorder.position.set(0, 0.33, 0.5);
interiorGroup.add(rugBorder);

// Baseboard trim along back wall
const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6 });
const bbGeo = new THREE.BoxGeometry(W - 0.4, 0.3, 0.15);
const bbBack = new THREE.Mesh(bbGeo, baseboardMat);
bbBack.position.set(0, 0.45, -D / 2 + 0.2);
interiorGroup.add(bbBack);


const sofaMat = new THREE.MeshStandardMaterial({ color: 0x4a6fa5, roughness: 0.8 });

const sofaSeat = new THREE.Mesh(new THREE.BoxGeometry(4, 0.6, 1.8), sofaMat);
sofaSeat.position.set(-2.5, 0.9, -3.5);
sofaSeat.castShadow = true;
interiorGroup.add(sofaSeat);

const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(4, 1.2, 0.4), sofaMat);
sofaBack.position.set(-2.5, 1.5, -4.3);
sofaBack.castShadow = true;
interiorGroup.add(sofaBack);

const cushionMat = new THREE.MeshStandardMaterial({ color: 0x6b8fc4, roughness: 0.85 });
for (let ci = 0; ci < 2; ci++) {
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 1.4), cushionMat);
    cushion.position.set(-2.5 + ci * 2 - 1, 1.3, -3.5);
    interiorGroup.add(cushion);
}

const armMat = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.75 });
const armL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 1.8), armMat);
armL.position.set(-4.3, 1.1, -3.5);
interiorGroup.add(armL);
const armR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 1.8), armMat);
armR.position.set(-0.7, 1.1, -3.5);
interiorGroup.add(armR);

// Bookshelf

const shelfMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.8 });
const shelfBody = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 0.8), shelfMat);
shelfBody.position.set(5, 2.3, -3.8);
shelfBody.castShadow = true;
interiorGroup.add(shelfBody);
// Shelf dividers
for (let si = 0; si < 3; si++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.75), shelfMat);
    shelf.position.set(5, 1.0 + si * 1.3, -3.8);
    interiorGroup.add(shelf);
}
// Books (colorful)
const bookColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0xe67e22, 0x1abc9c];
for (let bi = 0; bi < 7; bi++) {
    const bookH = 0.6 + Math.random() * 0.4;
    const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, bookH, 0.6),
        new THREE.MeshStandardMaterial({ color: bookColors[bi], roughness: 0.7 })
    );
    book.position.set(4.3 + bi * 0.22, 1.3 + bookH / 2, -3.8);
    interiorGroup.add(book);
}

// TV on back wall (flat screen)
const tvFrame = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 2, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.5 })
);
tvFrame.position.set(-2.5, 4.2, -D / 2 + 0.25);
interiorGroup.add(tvFrame);
// TV screen (emissive — looks "on")
const tvScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 1.7),
    new THREE.MeshStandardMaterial({ color: 0x225588, emissive: 0x112244, emissiveIntensity: 0.6, roughness: 0.1 })
);
tvScreen.position.set(-2.5, 4.2, -D / 2 + 0.34);
interiorGroup.add(tvScreen);

// Wall clock
const clockFace = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 0.08, 24),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
);
clockFace.rotation.x = Math.PI / 2;
clockFace.position.set(2, 5, -D / 2 + 0.2);
interiorGroup.add(clockFace);
const clockRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.05, 8, 24),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3 })
);
clockRim.position.set(2, 5, -D / 2 + 0.22);
interiorGroup.add(clockRim);

// ═══════════════════════════════════════════════
//  POWER LINE / UTILITY POLE
// ═══════════════════════════════════════════════
const poleGroup = new THREE.Group();

const poleMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
const poleGeo = new THREE.CylinderGeometry(0.2, 0.25, 14, 8);
const pole = new THREE.Mesh(poleGeo, poleMat);
pole.position.set(16, 7, 8);
pole.castShadow = true;
poleGroup.add(pole);

// Cross beam
const crossGeo = new THREE.BoxGeometry(4, 0.2, 0.2);
const crossBeam = new THREE.Mesh(crossGeo, poleMat);
crossBeam.position.set(16, 13.5, 8);
poleGroup.add(crossBeam);

// Wires
const wireMat = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 });
for (let i = -1; i <= 1; i++) {
    const points = [];
    const startX = 16 + i * 1.5;
    for (let t = 0; t <= 20; t++) {
        const frac = t / 20;
        const x = startX + (W / 2 - startX) * frac;
        const y = 13.5 - Math.sin(frac * Math.PI) * 2.5 + (H + 1 - 13.5) * frac;
        const z = 8 + (0 - 8) * frac;
        points.push(new THREE.Vector3(x, y, z));
    }
    const wireGeo = new THREE.BufferGeometry().setFromPoints(points);
    const wire = new THREE.Line(wireGeo, wireMat);
    poleGroup.add(wire);
}
scene.add(poleGroup);

// ═══════════════════════════════════════════════
//  TREES AROUND HOUSES
// ═══════════════════════════════════════════════
function createTree(x, y, z, scale) {
    const treeGroup = new THREE.Group();
    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.15 * scale, 0.25 * scale, 2.5 * scale, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.25 * scale;
    trunk.castShadow = true;
    treeGroup.add(trunk);
    // Foliage layers (multiple spheres for natural look)
    const foliageColors = [0x2d7d2d, 0x3a9d3a, 0x228B22, 0x2e8b2e];
    const foliagePositions = [
        { y: 3.0, r: 1.4 }, { y: 3.8, r: 1.1 }, { y: 4.4, r: 0.75 },
        { y: 3.2, r: 0.9, x: 0.5, z: 0.3 }, { y: 3.2, r: 0.9, x: -0.4, z: -0.3 }
    ];
    foliagePositions.forEach((fp, i) => {
        const fGeo = new THREE.SphereGeometry(fp.r * scale, 10, 10);
        const fMat = new THREE.MeshStandardMaterial({ color: foliageColors[i % foliageColors.length], roughness: 0.85 });
        const foliage = new THREE.Mesh(fGeo, fMat);
        foliage.position.set((fp.x || 0) * scale, fp.y * scale, (fp.z || 0) * scale);
        foliage.castShadow = true;
        treeGroup.add(foliage);
    });
    treeGroup.position.set(x, y, z);
    scene.add(treeGroup);
    return treeGroup;
}

// Trees around simple house (centered at -11, 0, 0)
// Create trees around simple house
createTree(-14, 0, 8, 1.2); createTree(-8, 0, 8, 1.0);
createTree(-16, 0, -6, 1.3); createTree(-6, 0, -6, 1.1);
createTree(-11, 0, -9, 0.9);
// Create trees around 2BHK (shifted further away to avoid interior)
createTree(4, 0, -10, 1.2); createTree(28, 0, -10, 1.4);
createTree(16, 0, -12, 1.0);
// Scattered background trees
createTree(-30, 0, -15, 1.5); createTree(30, 0, -15, 1.6);
createTree(-25, 0, 20, 1.4); createTree(25, 0, 20, 1.3);
createTree(30, 0, 10, 1.2);

// ═══════════════════════════════════════════════
//  ANIMATED BIRDS
// ═══════════════════════════════════════════════
const birds = [];
function createBird(cx, cy, cz, radiusX, radiusZ, speed, phase) {
    const birdGroup = new THREE.Group();
    // Body
    const bodyGeo = new THREE.ConeGeometry(0.12, 0.5, 6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = -Math.PI / 2;
    birdGroup.add(body);
    // Left wing
    const wingGeo = new THREE.PlaneGeometry(0.5, 0.15);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x444444, side: THREE.DoubleSide, roughness: 0.8 });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(0, 0.08, -0.15);
    leftWing.rotation.x = 0;
    birdGroup.add(leftWing);
    // Right wing
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(0, 0.08, 0.15);
    rightWing.rotation.x = 0;
    birdGroup.add(rightWing);
    // Tail
    const tailGeo = new THREE.PlaneGeometry(0.2, 0.08);
    const tail = new THREE.Mesh(tailGeo, wingMat);
    tail.position.set(-0.3, 0.05, 0);
    birdGroup.add(tail);
    birdGroup.position.set(cx, cy, cz);
    scene.add(birdGroup);
    birds.push({
        group: birdGroup, leftWing, rightWing,
        cx, cy, cz, radiusX, radiusZ, speed, phase,
        flapSpeed: 5 + Math.random() * 3
    });
    return birdGroup;
}

createBird(0, 22, -5, 18, 12, 0.3, 0);
createBird(-5, 24, -8, 15, 10, 0.25, 1.2);
createBird(8, 20, -3, 20, 14, 0.35, 2.5);
createBird(-10, 26, -10, 12, 8, 0.2, 3.8);
createBird(15, 23, -6, 16, 11, 0.28, 5.0);
createBird(-3, 21, -4, 14, 9, 0.32, 0.7);

// ═══════════════════════════════════════════════
//  INTERIOR APPLIANCES
// ═══════════════════════════════════════════════
const applianceGroup = new THREE.Group();
houseGroup.add(applianceGroup);

const appliances = [
    { name: 'Light Bulb', watt: 60, emoji: '💡' },
    { name: 'Ceiling Fan', watt: 75, emoji: '🌀' },
    { name: 'Refrigerator', watt: 350, emoji: '🧊' },
    { name: 'Air Conditioner', watt: 1500, emoji: '❄️' },
    { name: 'Light Bulb 2', watt: 60, emoji: '💡' },
    { name: 'Table Fan', watt: 55, emoji: '🌀' }
];
const totalWatt = appliances.reduce((s, a) => s + a.watt, 0);

// ── Light bulb (hanging) ──
function createLightBulb(x, y, z) {
    const g = new THREE.Group();
    // Wire
    const wireGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6);
    const wireMat2 = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const wire = new THREE.Mesh(wireGeo, wireMat2);
    wire.position.y = 0.75;
    g.add(wire);
    // Lamp shade
    const shadeGeo = new THREE.CylinderGeometry(0.15, 0.5, 0.35, 12, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.6, side: THREE.DoubleSide });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.y = 0.15;
    g.add(shade);
    // Bulb (bigger, brighter)
    const bulbGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffdd44, emissiveIntensity: 1.5, transparent: true, opacity: 0.95 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.y = -0.05;
    g.add(bulb);
    // Stronger point light
    const pl = new THREE.PointLight(0xffdd44, 1.5, 12);
    pl.position.y = -0.05;
    g.add(pl);
    g.position.set(x, y, z);
    applianceGroup.add(g);
    return { group: g, bulbMat, pointLight: pl };
}

const light1 = createLightBulb(-3, H - 0.5, 0);
const light2 = createLightBulb(3, H - 0.5, -1);

// ── Ceiling Fan ──
function createFan(x, y, z) {
    const g = new THREE.Group();
    // Rod
    const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.position.y = 0.6;
    g.add(rod);
    // Motor hub
    const hubGeo = new THREE.CylinderGeometry(0.3, 0.25, 0.3, 12);
    const hub = new THREE.Mesh(hubGeo, rodMat);
    g.add(hub);
    // Blades
    const bladesGroup = new THREE.Group();
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.6, metalness: 0.2 });
    for (let i = 0; i < 4; i++) {
        const bladeGeo = new THREE.BoxGeometry(2.5, 0.05, 0.4);
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.x = 1.25;
        const bladeWrapper = new THREE.Group();
        bladeWrapper.add(blade);
        bladeWrapper.rotation.y = (Math.PI / 2) * i;
        bladesGroup.add(bladeWrapper);
    }
    bladesGroup.position.y = -0.1;
    g.add(bladesGroup);
    g.position.set(x, y, z);
    applianceGroup.add(g);
    return { group: g, blades: bladesGroup };
}

const fan1 = createFan(0, H - 0.3, 1);

// ── Refrigerator ──
function createFridge(x, y, z) {
    const g = new THREE.Group();
    const fridgeMat = new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.3, metalness: 0.6 });
    // Body
    const bodyGeo = new THREE.BoxGeometry(1.4, 3.2, 1.2);
    const body = new THREE.Mesh(bodyGeo, fridgeMat);
    body.position.y = 1.6;
    body.castShadow = true;
    g.add(body);
    // Door line
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const lineGeo = new THREE.BoxGeometry(1.35, 0.04, 0.05);
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(0, 2.0, 0.61);
    g.add(line);
    // Handle
    const hGeo = new THREE.BoxGeometry(0.06, 0.8, 0.1);
    const hMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const h1 = new THREE.Mesh(hGeo, hMat);
    h1.position.set(0.5, 2.7, 0.65);
    g.add(h1);
    const h2 = new THREE.Mesh(hGeo, hMat);
    h2.position.set(0.5, 1.3, 0.65);
    g.add(h2);
    g.position.set(x, y, z);
    applianceGroup.add(g);
    return { group: g };
}

const fridge = createFridge(-5, 0.3, -3.5);

// ── Air Conditioner (wall-mounted) ──
function createAC(x, y, z) {
    const g = new THREE.Group();
    const acMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.3, metalness: 0.4 });
    const bodyGeo = new THREE.BoxGeometry(2.5, 0.7, 0.6);
    const body = new THREE.Mesh(bodyGeo, acMat);
    body.castShadow = true;
    g.add(body);
    // Vent lines
    const ventMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    for (let i = -3; i <= 3; i++) {
        const ventGeo = new THREE.BoxGeometry(2.2, 0.02, 0.05);
        const vent = new THREE.Mesh(ventGeo, ventMat);
        vent.position.set(0, -0.15 + i * 0.05, 0.31);
        g.add(vent);
    }
    // LED indicator
    const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const ledMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-1.0, 0.2, 0.31);
    g.add(led);
    g.position.set(x, y, z);
    applianceGroup.add(g);

    // Cool air particles
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = x + (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = y - Math.random() * 2.5;
        positions[i * 3 + 2] = z + 0.5 + Math.random() * 1.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xaaddff, size: 0.08, transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(particleGeo, particleMat);
    applianceGroup.add(particles);
    return { group: g, particles, particlePositions: positions, baseY: y };
}

const ac = createAC(3, 5, -D / 2 + 0.7);

// ── Table Fan ──
function createTableFan(x, y, z) {
    const g = new THREE.Group();
    // Base
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.4 });
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.2, 12);
    const base = new THREE.Mesh(baseGeo, baseMat);
    g.add(base);
    // Stand
    const standGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 6);
    const stand = new THREE.Mesh(standGeo, baseMat);
    stand.position.y = 0.5;
    g.add(stand);
    // Motor
    const motorGeo = new THREE.SphereGeometry(0.3, 12, 12);
    const motor = new THREE.Mesh(motorGeo, baseMat);
    motor.position.y = 0.9;
    g.add(motor);
    // Blades group
    const bladesGroup = new THREE.Group();
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x4488aa, metalness: 0.3, roughness: 0.5, transparent: true, opacity: 0.8 });
    for (let i = 0; i < 3; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.8, 0.02, 0.2);
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.x = 0.4;
        const wrapper = new THREE.Group();
        wrapper.add(blade);
        wrapper.rotation.z = (Math.PI * 2 / 3) * i;
        bladesGroup.add(wrapper);
    }
    bladesGroup.position.set(0, 0.9, 0.35);
    bladesGroup.rotation.x = -Math.PI / 10;
    g.add(bladesGroup);
    g.position.set(x, y, z);
    applianceGroup.add(g);
    return { group: g, blades: bladesGroup };
}

const tableFan = createTableFan(4, 0.3, 2);

// ── Simple table for fan ──
const tableGeo = new THREE.BoxGeometry(2, 1.5, 1.5);
const tableMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.8 });
const table = new THREE.Mesh(tableGeo, tableMat);
table.position.set(4, 1.05, 2);
table.castShadow = true;
applianceGroup.add(table);
// Adjust fan position on table
tableFan.group.position.y = 1.8;

// ═══════════════════════════════════════════════
//  APPLIANCE LABELS (CSS2D)
// ═══════════════════════════════════════════════
function createLabel(text, watt, position) {
    const div = document.createElement('div');
    div.className = 'appliance-label';
    div.innerHTML = `<span class="name">${text}</span><br><span class="watt">${watt}W</span>`;
    const label = new THREE.CSS2DObject(div);
    label.position.copy(position);
    applianceGroup.add(label);
    return label;
}

const labels = [
    createLabel('💡 Light Bulb', 60, new THREE.Vector3(-3, H + 0.8, 0)),
    createLabel('🌀 Ceiling Fan', 75, new THREE.Vector3(0, H + 1, 1)),
    createLabel('🧊 Refrigerator', 350, new THREE.Vector3(-5, 4, -3.5)),
    createLabel('❄️ AC Unit', 1500, new THREE.Vector3(3, 6.2, -D / 2 + 0.7)),
    createLabel('💡 Light Bulb', 60, new THREE.Vector3(3, H + 0.8, -1)),
    createLabel('🌀 Table Fan', 55, new THREE.Vector3(4, 3.5, 2))
];

// ═══════════════════════════════════════════════
//  SHARED STATE (declared before 2BHK so it's accessible)
// ═══════════════════════════════════════════════
let currentPanelCount = 0;
let isSolarMode = false;

// ═══════════════════════════════════════════════
//  2BHK ROOM SYSTEM
// ═══════════════════════════════════════════════
const bhk2Group = new THREE.Group();
bhk2Group.position.set(16, 0, 0);
scene.add(bhk2Group);
let is2BHK = true;

// Room Groups for independent visibility
const roomGroups = {
    'Hall': new THREE.Group(),
    'Bedroom 1': new THREE.Group(),
    'Bedroom 2': new THREE.Group(),
    'Kitchen': new THREE.Group(),
    'Bathroom': new THREE.Group(),
    'Structure': new THREE.Group() // Walls/Roof/Floor
};
Object.values(roomGroups).forEach(g => bhk2Group.add(g));

// 2BHK house exterior shell (enlarged: W2=20, D2=16)
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
addBhk2Wall(W2, H, 0.3, 0, H / 2 + 0.3, -D2 / 2, false); // back
addBhk2Wall(0.3, H, D2, -W2 / 2, H / 2 + 0.3, 0, true); // left
addBhk2Wall(0.3, H, D2, W2 / 2, H / 2 + 0.3, 0, true); // right
addBhk2Wall(5, H, 0.3, -5.5, H / 2 + 0.3, D2 / 2, true); // front left
addBhk2Wall(5, H, 0.3, 5.5, H / 2 + 0.3, D2 / 2, true); // front right
addBhk2Wall(6, 2, 0.3, 0, H - 0.7, D2 / 2, true); // front top
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

// Room partition walls — semi-transparent for clear room visibility
const partWallMat = new THREE.MeshStandardMaterial({ color: 0xf0e6d3, roughness: 0.85, transparent: true, opacity: 0.35 });
const bhk2PartWalls = [];
function addPartWall(w, h, d, x, y, z, room) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), partWallMat.clone());
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    (room ? roomGroups[room] : roomGroups['Structure']).add(m);
    bhk2PartWalls.push(m); return m;
}
// Horizontal wall: separates bedrooms (back) from hall/kitchen at z=-2.5
addPartWall(W2 - 0.4, H, 0.2, 0, H / 2 + 0.3, -2.5);
// Vertical wall between bedroom1 and bedroom2 at x=0
addPartWall(0.2, H, D2 / 2 - 2.5 - 0.2, 0, H / 2 + 0.3, -(D2 / 2 + 2.5) / 2);
// Vertical wall separating kitchen/bath from hall at x=-5
addPartWall(0.2, H, D2 / 2 + 2.5 - 0.2, -5, H / 2 + 0.3, (D2 / 2 - 2.5) / 2 + 0.1);
// Horizontal wall separating kitchen from bathroom at z=4
addPartWall(W2 / 2 - 5 - 0.2, H, 0.2, -(5 + W2 / 2) / 2, H / 2 + 0.3, 4);

// Room doors in partition walls
const roomDoorMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 });
function addRoomDoor(x, y, z, ry, room) {
    const d = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.5, 0.25), roomDoorMat);
    d.position.set(x, y, z); d.rotation.y = ry || 0;
    (room ? roomGroups[room] : roomGroups['Structure']).add(d);
    // Door frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x4a2e10, roughness: 0.6 });
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.28), frameMat);
    frameTop.position.set(x, y + 1.85, z); frameTop.rotation.y = ry || 0;
    (room ? roomGroups[room] : roomGroups['Structure']).add(frameTop);
    // Handle
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0xd4a843, metalness: 0.9, roughness: 0.2 }));
    h.position.set(x + (ry ? 0 : 0.5), y, z + (ry ? 0.5 : 0));
    (room ? roomGroups[room] : roomGroups['Structure']).add(h);
}
addRoomDoor(-3, 2.05, -2.5, 0, 'Bedroom 1');  // Bedroom1 door
addRoomDoor(3, 2.05, -2.5, 0, 'Bedroom 2');   // Bedroom2 door
addRoomDoor(-5, 2.05, 0.5, Math.PI / 2, 'Kitchen');  // Kitchen door
addRoomDoor(-5, 2.05, 5.5, Math.PI / 2, 'Bathroom');  // Bathroom door

// Room colored floor tiles (using W2/D2)
const tileColors = { hall: 0xd4b896, bed1: 0xa8c8e8, bed2: 0xc8b4d8, kitchen: 0xf5f5f5, bath: 0x88ccbb };
function addFloorTile(color, w, d, x, z, room) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ color: color, roughness: 0.75 }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.32, z); m.receiveShadow = true;
    (room ? roomGroups[room] : roomGroups['Structure']).add(m);
}
// Hall (right side, z=-2.5 to D2/2)
addFloorTile(tileColors.hall, W2 / 2 - 5 - 0.2, D2 / 2 + 2.5 - 0.3, (W2 / 2 - 5) / 2 + 0.1, (D2 / 2 - 2.5) / 2, 'Hall');
// Bedroom 1 (left back)
addFloorTile(tileColors.bed1, W2 / 2 - 0.3, D2 / 2 - 2.5 - 0.3, -W2 / 4, -(D2 / 2 + 2.5) / 2, 'Bedroom 1');
// Bedroom 2 (right back)
addFloorTile(tileColors.bed2, W2 / 2 - 0.3, D2 / 2 - 2.5 - 0.3, W2 / 4, -(D2 / 2 + 2.5) / 2, 'Bedroom 2');
// Kitchen checkerboard (left, z=-2.5 to 4)
for (let ki = 0; ki < 6; ki++) for (let kj = 0; kj < 6; kj++) {
    addFloorTile((ki + kj) % 2 === 0 ? 0xf5f5f5 : 0x333333, 0.8, 0.8, -W2 / 2 + 0.7 + ki * 0.85, -2.1 + kj * 0.95, 'Kitchen');
}
// Bathroom (left, z=4 to D2/2)
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

// === 2BHK Appliances (room-specific) ===
const bhk2Appliances = [];
const bhk2AnimData = { fans: [], tableFans: [], acs: [], lights: [] };

// Helper: create bed
function createBed(x, y, z, color, room) {
    const g = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.7 });
    function addPart(geo, mat, px, py, pz, shadow) {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(px, py, pz);
        if (shadow) m.castShadow = true;
        g.add(m);
    }
    addPart(new THREE.BoxGeometry(2.8, 0.5, 3.5), frameMat, 0, 0.25, 0, true);
    addPart(new THREE.BoxGeometry(2.6, 0.3, 3.3), new THREE.MeshStandardMaterial({ color: color, roughness: 0.9 }), 0, 0.65, 0, false);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
    addPart(new THREE.BoxGeometry(0.8, 0.15, 0.5), pillowMat, -0.5, 0.88, -1.3, false);
    addPart(new THREE.BoxGeometry(0.8, 0.15, 0.5), pillowMat, 0.5, 0.88, -1.3, false);
    addPart(new THREE.BoxGeometry(2.8, 1.5, 0.2), frameMat, 0, 1, -1.7, false);
    g.position.set(x, y, z);
    roomGroups[room].add(g);
}
createBed(-W2 / 4, 0.3, -(D2 / 2 + 2.5) / 2, 0x6495ED, 'Bedroom 1');
createBed(W2 / 4, 0.3, -(D2 / 2 + 2.5) / 2, 0xDDA0DD, 'Bedroom 2');

// ── Hall Furniture ──
// Sofa in hall
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
// Sofa cushions
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

const hallTvFrame = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 0.15), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.5 }));
hallTvFrame.position.set((W2 / 2 - 5) / 2, 4.2, -2.3); roomGroups['Hall'].add(hallTvFrame);
const tvMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000, roughness: 0.1 });
const hallTvScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.9), tvMat);
hallTvScreen.position.set((W2 / 2 - 5) / 2, 4.2, -2.22); roomGroups['Hall'].add(hallTvScreen);
// Decorative plant in hall corner
const potMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });
const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.6, 8), potMat);
pot.position.set(-4.5, 0.6, D2 / 2 - 1); roomGroups['Hall'].add(pot);
const plant = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.9 }));
plant.position.set(-4.5, 1.3, D2 / 2 - 1); roomGroups['Hall'].add(plant);

// Kitchen counter & stove (repositioned for larger kitchen)
const counterMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.3 });
const counter = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 0.8), counterMat);
counter.position.set(-W2 / 2 + 1.8, 1.2, -1.5); counter.castShadow = true;
roomGroups['Kitchen'].add(counter);
const stove = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.6), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.3 }));
stove.position.set(-W2 / 2 + 1.8, 2.15, -1.5); roomGroups['Kitchen'].add(stove);
// Kitchen sink
const kitchenSink = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.8), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.2 }));
kitchenSink.position.set(-W2 / 2 + 1.8, 2.12, 1); roomGroups['Kitchen'].add(kitchenSink);
// Kitchen wall cabinet
const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.7 });
const cabinet = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 0.5), cabinetMat);
cabinet.position.set(-W2 / 2 + 1.5, 4.5, -2.3); roomGroups['Kitchen'].add(cabinet);

// ── Bathroom fixtures (repositioned for larger bathroom) ──
const bathX = -(5 + W2 / 2) / 2;
const bathZ = (D2 / 2 + 4) / 2;
const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.3 });
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });

// Western Toilet
const toiletBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 0.7, 12), whiteMat);
toiletBowl.position.set(bathX + 1, 0.65, bathZ + 1.2); roomGroups['Bathroom'].add(toiletBowl);
const toiletSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 12), whiteMat);
toiletSeat.position.set(bathX + 1, 1.03, bathZ + 1.2); roomGroups['Bathroom'].add(toiletSeat);
const toiletTank = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.3), whiteMat);
toiletTank.position.set(bathX + 1, 0.9, bathZ + 1.7); roomGroups['Bathroom'].add(toiletTank);
const flush = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.15), chromeMat);
flush.position.set(bathX + 1, 1.35, bathZ + 1.6); roomGroups['Bathroom'].add(flush);

// Wash Basin / Sink
const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 0.15, 12), whiteMat);
basin.position.set(bathX - 0.6, 1.3, bathZ - 1); roomGroups['Bathroom'].add(basin);
const basinStand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.2, 8), whiteMat);
basinStand.position.set(bathX - 0.6, 0.6, bathZ - 1); roomGroups['Bathroom'].add(basinStand);
const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6), chromeMat);
tap.position.set(bathX - 0.6, 1.55, bathZ - 1.2); roomGroups['Bathroom'].add(tap);
const tapSpout = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.2), chromeMat);
tapSpout.position.set(bathX - 0.6, 1.73, bathZ - 1.1); roomGroups['Bathroom'].add(tapSpout);

// Water stream (hidden initially)
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

// 2BHK room appliance definitions
const bhk2RoomDefs = [
    {
        room: 'Hall', appliances: [
            { type: 'fan', name: 'Ceiling Fan', watt: 75, x: (W2 / 2 - 5) / 2, y: H - 0.3, z: (D2 / 2 - 2.5) / 2 },
            { type: 'light', name: 'Light', watt: 60, x: (W2 / 2 - 5) / 2 - 2, y: H - 0.5, z: 0 },
            { type: 'ac', name: 'AC', watt: 1500, x: W2 / 2 - 1.5, y: 5, z: -2.3 },
            { type: 'tv', name: 'Television', watt: 180, x: 0, y: 0, z: 0 }, // Position handled by hall furniture logic
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
            { type: 'tap', name: 'Wash Basin Tap', watt: 5, x: 0, y: 0, z: 0 }, // Animation logic
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
            // Add small table
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
//  SIMPLE HOUSE APPLIANCE ON/OFF STATE
// ═══════════════════════════════════════════════
// Create bedroom appliances
const bedroomFan = createFan(-W / 4, H - 0.3, -(D / 2 + 1.5) / 2);
simpleRoomGroups['Bedroom'].add(bedroomFan.group);
applianceGroup.remove(bedroomFan.group);

const bedroomLight = createLightBulb(-W / 4 + 2, H - 0.5, -(D / 2 + 1.5) / 2 - 1);
simpleRoomGroups['Bedroom'].add(bedroomLight.group);
applianceGroup.remove(bedroomLight.group);

const bedroomAC = createAC(-W / 4 + 1, 5, -D / 2 + 0.7);
simpleRoomGroups['Bedroom'].add(bedroomAC.group);
simpleRoomGroups['Bedroom'].add(bedroomAC.particles);
applianceGroup.remove(bedroomAC.group);
applianceGroup.remove(bedroomAC.particles);

// Create bathroom appliance
const bathroomLight = createLightBulb(W / 4, H - 0.5, -(D / 2 + 1.5) / 2);
simpleRoomGroups['Bathroom'].add(bathroomLight.group);
applianceGroup.remove(bathroomLight.group);

// Bedroom appliance labels
createLabel('🌀 Ceiling Fan', 75, new THREE.Vector3(-W / 4, H + 1, -(D / 2 + 1.5) / 2));
createLabel('💡 Light', 60, new THREE.Vector3(-W / 4 + 2, H + 0.8, -(D / 2 + 1.5) / 2 - 1));
createLabel('❄️ AC', 1500, new THREE.Vector3(-W / 4 + 1, 6.2, -D / 2 + 0.7));
createLabel('💡 Light', 40, new THREE.Vector3(W / 4, H + 0.8, -(D / 2 + 1.5) / 2));

const simpleAnimData = { fans: [], tableFans: [], acs: [], lights: [] };

const simpleAppliances = [
    { name: 'Light Bulb 1', watt: 60, emoji: '💡', on: true, kind: 'light', mesh: light1, room: 'Living Room' },
    { name: 'Ceiling Fan', watt: 75, emoji: '🌀', on: true, kind: 'fan', mesh: fan1, room: 'Living Room' },
    { name: 'Refrigerator', watt: 350, emoji: '🧊', on: true, kind: 'fridge', mesh: fridge, room: 'Living Room' },
    { name: 'Air Conditioner', watt: 1500, emoji: '❄️', on: true, kind: 'ac', mesh: ac, room: 'Living Room' },
    { name: 'Light Bulb 2', watt: 60, emoji: '💡', on: true, kind: 'light', mesh: light2, room: 'Living Room' },
    { name: 'Table Fan', watt: 55, emoji: '🌀', on: true, kind: 'tablefan', mesh: tableFan, room: 'Living Room' },
    { name: 'Television', watt: 150, emoji: '📺', on: false, kind: 'tv', mesh: null, room: 'Living Room' },
    // Bedroom appliances
    { name: 'Bedroom Fan', watt: 75, emoji: '🌀', on: true, kind: 'fan', mesh: bedroomFan, room: 'Bedroom' },
    { name: 'Bedroom Light', watt: 60, emoji: '💡', on: true, kind: 'light', mesh: bedroomLight, room: 'Bedroom' },
    { name: 'Bedroom AC', watt: 1500, emoji: '❄️', on: true, kind: 'ac', mesh: bedroomAC, room: 'Bedroom' },
    // Bathroom appliance
    { name: 'Bathroom Light', watt: 40, emoji: '💡', on: true, kind: 'light', mesh: bathroomLight, room: 'Bathroom' }
];

// Register animated appliances for simple house
simpleAnimData.fans.push(simpleAppliances[7]); // bedroom fan
simpleAnimData.lights.push(simpleAppliances[8]); // bedroom light
simpleAnimData.acs.push(simpleAppliances[9]); // bedroom AC
simpleAnimData.lights.push(simpleAppliances[10]); // bathroom light
// Create simple house TV
const simpleTvGroup = new THREE.Group();
const simpleTvFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.4, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111 }));
simpleTvFrame.position.set(-13, 3.5, -4.3); simpleTvGroup.add(simpleTvFrame);
const simpleTvScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.2), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000 }));
simpleTvScreen.position.set(-13, 3.5, -4.24); simpleTvGroup.add(simpleTvScreen);
scene.add(simpleTvGroup);
simpleAppliances[6].mesh = { frame: simpleTvFrame, screen: simpleTvScreen };

// === Appliance ON/OFF Toggle System ===
let currentFocusedHouse = null; // 'simple' or '2bhk'
let currentRoom = null; // null = full view, or room name for 2BHK

function addDynamicAppliance(type) {
    const isSimple = (currentFocusedHouse === 'simple');
    const room = isSimple ? null : (currentRoom || 'Hall');
    const list = isSimple ? simpleAppliances : bhk2Appliances;
    const count = list.filter(a => a.type === type && (isSimple || a.room === room)).length;

    let obj = null;
    let mesh = null;
    const name = type.charAt(0).toUpperCase() + type.slice(1) + ' ' + (count + 1);

    // Placement logic
    let x = 0, y = 3, z = 0;
    if (isSimple) {
        x = -11 + (count % 3 - 1) * 2;
        z = (Math.floor(count / 3)) * 2 - 2;
    } else {
        const center = roomCenters[room] || { x: 0, z: 0 };
        x = center.x + (count % 3 - 1) * 2;
        z = center.z + (Math.floor(count / 3)) * 2 - 2;
    }

    if (type === 'light') {
        mesh = createLight(x, H - 0.5, z);
        obj = { type, name, watt: 60, emoji: '💡', on: true, kind: 'light', mesh };
    } else if (type === 'fan') {
        mesh = createFan(x, H - 0.3, z);
        obj = { type, name, watt: 75, emoji: '🌀', on: true, kind: 'fan', mesh };
        (isSimple ? simpleAnimData : bhk2AnimData).fans.push(obj);
    } else if (type === 'ac') {
        mesh = createAC(isSimple ? -11 + 4 : x, 5, isSimple ? -4.3 : z);
        obj = { type, name, watt: 1500, emoji: '❄️', on: true, kind: 'ac', mesh };
        (isSimple ? simpleAnimData : bhk2AnimData).acs.push(obj);
    } else if (type === 'tv') {
        const w = isSimple ? 2.5 : 4;
        const h = isSimple ? 1.4 : 2.2;
        const tvGroup = new THREE.Group();
        const frame = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), new THREE.MeshStandardMaterial({ color: 0x111111 }));
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, h * 0.85), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x000000 }));
        screen.position.z = 0.051; tvGroup.add(frame, screen);
        tvGroup.position.set(x, 4, isSimple ? -4.2 : z - 1);
        mesh = { group: tvGroup, screen };
        obj = { type, name, watt: 150, emoji: '📺', on: true, kind: 'tv', mesh };
        // Set initial image
        const tex = tvTextures[Math.floor(Math.random() * tvTextures.length)];
        screen.material.map = tex; screen.material.emissiveMap = tex;
        screen.material.emissiveIntensity = 1.0;
    } else if (type === 'fridge') {
        mesh = createFridge(x, 0.3, z);
        obj = { type, name, watt: 350, emoji: '🧊', on: true, kind: 'fridge', mesh };
    } else if (type === 'tablefan') {
        mesh = createTableFan(x, 1.8, z);
        // Table
        const t = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.0), tableMat);
        t.position.set(x, 0.6, z);
        mesh.group.add(t); // add table to group
        obj = { type, name, watt: 55, emoji: '🎐', on: true, kind: 'tablefan', mesh };
        (isSimple ? simpleAnimData : bhk2AnimData).tableFans.push(obj);
    }

    if (obj && mesh) {
        if (isSimple) {
            houseGroup.add(mesh.group || mesh);
            simpleAppliances.push(obj);
        } else {
            roomGroups[room].add(mesh.group || mesh);
            if (applianceGroup.children.includes(mesh.group || mesh)) applianceGroup.remove(mesh.group || mesh);
            obj.room = room;
            bhk2Appliances.push(obj);
        }
        buildAppliancePanel(currentRoom);
        recalcWattage();
    }
}

function toggleAppliance(idx, isOn) {
    const a = bhk2Appliances[idx];
    if (!a) return;
    a.on = isOn;
    if (a.kind === 'light') {
        a.mesh.pointLight.intensity = isOn ? 1.5 : 0;
        a.mesh.bulbMat.emissiveIntensity = isOn ? 1.5 : 0;
        a.mesh.bulbMat.opacity = isOn ? 0.95 : 0.3;
    } else if (a.kind === 'ac') {
        a.mesh.particles.visible = isOn;
    } else if (a.kind === 'tv') {
        const screen = a.mesh.screen;
        screen.material.emissiveIntensity = isOn ? 1.0 : 0;
        if (isOn) {
            const tex = tvTextures[Math.floor(Math.random() * tvTextures.length)];
            screen.material.map = tex; screen.material.emissiveMap = tex;
        } else {
            screen.material.map = null; screen.material.emissiveMap = null;
        }
        screen.material.needsUpdate = true;
    } else if (a.kind === 'tap') {
        waterStream.visible = isOn;
    }
    recalcWattage();
}

function toggleSimpleAppliance(idx, isOn) {
    const a = simpleAppliances[idx];
    if (!a) return;
    a.on = isOn;
    if (a.kind === 'light') {
        a.mesh.pointLight.intensity = isOn ? 1.5 : 0;
        a.mesh.bulbMat.emissiveIntensity = isOn ? 1.5 : 0;
        a.mesh.bulbMat.opacity = isOn ? 0.95 : 0.3;
    } else if (a.kind === 'ac') {
        a.mesh.particles.visible = isOn;
    } else if (a.kind === 'tv') {
        const screen = a.mesh.screen;
        screen.material.emissiveIntensity = isOn ? 1.0 : 0;
        if (isOn) {
            const tex = tvTextures[Math.floor(Math.random() * tvTextures.length)];
            screen.material.map = tex; screen.material.emissiveMap = tex;
        } else {
            screen.material.map = null; screen.material.emissiveMap = null;
        }
        screen.material.needsUpdate = true;
    }
    recalcWattage();
}

function addDynamicAC() {
    if (currentFocusedHouse === 'simple') {
        const count = simpleAppliances.filter(a => a.name.includes('New AC')).length;
        const newACMesh = createAC(-11 + 2 + count * 0.5, 5, -4.3);
        const a = { name: 'New AC ' + (count + 1), watt: 1500, emoji: '❄️', on: true, kind: 'ac', mesh: newACMesh };
        simpleAppliances.push(a);
    } else {
        const room = currentRoom || 'Hall';
        const count = bhk2Appliances.filter(a => a.name.includes('New AC') && a.room === room).length;
        let x = 0, y = 5, z = 0;
        if (room === 'Hall') { x = W2 / 2 - 1.5; z = -2.3 + count * 0.5; }
        else if (room === 'Bedroom 1') { x = -W2 / 4 + 2; z = -D2 / 2 + 0.7 + count * 0.5; }
        else if (room === 'Bedroom 2') { x = W2 / 4 - 2; z = -D2 / 2 + 0.7 + count * 0.5; }
        else { x = 0; z = 0; }

        const acMesh = createAC(x, y, z);
        roomGroups[room].add(acMesh.group);
        applianceGroup.remove(acMesh.group);

        const obj = { type: 'ac', name: 'New AC ' + (count + 1), watt: 1500, x, y, z, mesh: acMesh, on: true, kind: 'ac', room: room };
        bhk2Appliances.push(obj);
        bhk2AnimData.acs.push(obj);
    }
    buildAppliancePanel(currentRoom);
    recalcWattage();
}

function recalcWattage() {
    let total = 0;
    if (currentFocusedHouse === '2bhk') {
        bhk2Appliances.forEach(a => { if (a.on) total += a.watt; });
    } else {
        simpleAppliances.forEach(a => { if (a.on) total += a.watt; });
    }
    document.getElementById('stat-consumption').textContent = total.toLocaleString() + ' W';
    const panelsNeeded = Math.max(1, Math.ceil(total / 350));
    document.getElementById('stat-panels').textContent = currentPanelCount + ' / ' + panelsNeeded + ' needed';
    const coverageRatio = Math.min(currentPanelCount / panelsNeeded, 1);
    const monthlySaving = Math.round(coverageRatio * total * 0.72 * 30 / 1000 * 8);
    const co2Saved = Math.round(coverageRatio * total * 0.0007 * 365);
    document.getElementById('stat-savings').textContent = '₹' + monthlySaving.toLocaleString();
    document.getElementById('stat-co2').textContent = co2Saved + ' kg/yr';
    updateEnergyGraphs();
}

// Load TV Textures
const textureLoader = new THREE.TextureLoader();
const tvTextures = [
    textureLoader.load('tv_screen_nature.png'),
    textureLoader.load('tv_screen_city.png')
];

// Build the appliance control panel HTML
function buildAppliancePanel(filterRoom) {
    const panel = document.getElementById('appliance-panel');
    let html = '<div class="add-section"><div class="room-header">➕ Add Appliances</div>';
    html += '<div class="app-grid" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1);">';
    const appTypes = [
        { type: 'light', emoji: '💡', label: 'Light' },
        { type: 'fan', emoji: '🌀', label: 'Fan' },
        { type: 'ac', emoji: '❄️', label: 'AC' },
        { type: 'tv', emoji: '📺', label: 'TV' },
        { type: 'fridge', emoji: '🧊', label: 'Fridge' },
        { type: 'tablefan', emoji: '🎐', label: 'TFan' }
    ];
    appTypes.forEach(app => {
        html += `<button class="add-tile-btn" onclick="addDynamicAppliance('${app.type}')" 
                           style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:8px; border-radius:8px; color:#fff; cursor:pointer; font-size:0.75rem;">
                           <div style="font-size:1.2rem; margin-bottom:4px;">${app.emoji}</div>${app.label}</button>`;
    });
    html += '</div></div>';

    if (currentFocusedHouse === 'simple') {
        // Group simple house appliances by room
        const simpleGrouped = {};
        simpleAppliances.forEach((a, i) => {
            const r = a.room || 'Living Room';
            if (filterRoom && r !== filterRoom) return;
            if (!simpleGrouped[r]) simpleGrouped[r] = [];
            simpleGrouped[r].push({ ...a, idx: i });
        });
        for (const room in simpleGrouped) {
            const emojis = { 'Living Room': '🏠', 'Bedroom': '🛏️', 'Bathroom': '🚿' };
            html += `<div class="room-section"><div class="room-header">${emojis[room] || ''} ${room}</div>`;
            simpleGrouped[room].forEach(a => {
                html += `<div class="appliance-row">
                            <div><span class="app-name">${a.emoji} ${a.name}</span><br><span class="app-watt">${a.watt}W</span></div>
                            <label class="toggle"><input type="checkbox" ${a.on ? 'checked' : ''} onchange="toggleSimpleAppliance(${a.idx},this.checked)"><span class="slider"></span></label>
                        </div>`;
            });
            html += '</div>';
        }
    } else {
        const grouped = {};
        bhk2Appliances.forEach((a, i) => {
            if (filterRoom && a.room !== filterRoom) return;
            if (!grouped[a.room]) grouped[a.room] = [];
            grouped[a.room].push({ ...a, idx: i });
        });
        for (const room in grouped) {
            html += `<div class="room-section"><div class="room-header">${room}</div>`;
            grouped[room].forEach(a => {
                html += `<div class="appliance-row">
                            <div><span class="app-name">${a.name}</span><br><span class="app-watt">${a.watt}W</span></div>
                            <label class="toggle"><input type="checkbox" ${a.on ? 'checked' : ''} onchange="toggleAppliance(${a.idx},this.checked)"><span class="slider"></span></label>
                        </div>`;
            });
            html += '</div>';
        }
    }
    panel.innerHTML = html;
}
buildAppliancePanel();

// ═══════════════════════════════════════════════
//  2BHK ROOM NAVIGATION SYSTEM
// ═══════════════════════════════════════════════
// Room center positions (relative to bhk2Group at x=13)
// Room center positions (relative to bhk2Group at x=16)
const roomCenters = {
    'Hall': { x: 2.5, z: 2.75 },
    'Bedroom 1': { x: -5, z: -5.25 },
    'Bedroom 2': { x: 5, z: -5.25 },
    'Kitchen': { x: -7.5, z: 0.75 },
    'Bathroom': { x: -7.5, z: 6 }
};

function buildRoomNavPanel() {
    const navPanel = document.getElementById('room-nav-panel');
    const rooms = ['Hall', 'Bedroom 1', 'Bedroom 2', 'Kitchen', 'Bathroom'];
    const emojis = { 'Hall': '🏠', 'Bedroom 1': '🛏️', 'Bedroom 2': '🛏️', 'Kitchen': '🍳', 'Bathroom': '🚿' };
    let html = '<button id="back-to-full-btn" onclick="exitRoomView()">🔙 Back to Full View</button>';
    rooms.forEach(room => {
        html += `<button class="room-nav-btn" id="room-btn-${room.replace(' ', '-')}" onclick="enterRoom('${room}')">${emojis[room]} ${room}</button>`;
    });
    navPanel.innerHTML = html;
}
buildRoomNavPanel();

function enterRoom(roomName) {
    currentRoom = roomName;
    const center = roomCenters[roomName];
    if (!center) return;
    // Animate camera to the room (world coords: bhk2Group.position.x + room center)
    const worldX = 16 + center.x;
    const worldZ = center.z;
    controls.target.set(worldX, 3, worldZ);
    camera.position.set(worldX + 2.5, 9, worldZ + 7.5);
    controls.update();

    // Room Isolation Visibility
    Object.keys(roomGroups).forEach(name => {
        if (name === 'Structure') roomGroups[name].visible = true;
        else roomGroups[name].visible = (name === roomName);
    });

    // Show back button and highlight room nav
    document.getElementById('back-to-full-btn').style.display = 'inline-block';
    document.querySelectorAll('.room-nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('room-btn-' + roomName.replace(' ', '-'));
    if (activeBtn) activeBtn.classList.add('active');
    // Update appliance panel to show only this room
    buildAppliancePanel(roomName);
}

function exitRoomView() {
    currentRoom = null;
    // Return to full 2BHK view
    controls.target.set(16, 4, 0);
    camera.position.set(16, 12, 20);
    controls.update();

    // Restore all visibility
    Object.values(roomGroups).forEach(g => g.visible = true);

    document.getElementById('back-to-full-btn').style.display = 'none';
    document.querySelectorAll('.room-nav-btn').forEach(btn => btn.classList.remove('active'));
    buildAppliancePanel();
}

// ═══════════════════════════════════════════════
//  SIMPLE HOUSE ROOM NAVIGATION SYSTEM
// ═══════════════════════════════════════════════
const simpleRoomCenters = {
    'Living Room': { x: 0, z: 2.25 },
    'Bedroom': { x: -W / 4, z: -(D / 2 + 1.5) / 2 },
    'Bathroom': { x: W / 4, z: -(D / 2 + 1.5) / 2 }
};

let currentSimpleRoom = null;

function buildSimpleRoomNavPanel() {
    const navPanel = document.getElementById('simple-room-nav-panel');
    const rooms = ['Living Room', 'Bedroom', 'Bathroom'];
    const emojis = { 'Living Room': '🏠', 'Bedroom': '🛏️', 'Bathroom': '🚿' };
    let html = '<button id="simple-back-btn" class="room-nav-btn" style="display:none;background:linear-gradient(135deg,#ff6b6b,#ee5a24);border:none;color:#fff;font-weight:600;box-shadow:0 2px 10px rgba(238,90,36,0.3);" onclick="exitSimpleRoomView()">🔙 Back</button>';
    rooms.forEach(room => {
        html += `<button class="room-nav-btn" id="simple-room-btn-${room.replace(/\s/g, '-')}" onclick="enterSimpleRoom('${room}')">${emojis[room]} ${room}</button>`;
    });
    navPanel.innerHTML = html;
}
buildSimpleRoomNavPanel();

function enterSimpleRoom(roomName) {
    currentSimpleRoom = roomName;
    currentRoom = roomName; // for buildAppliancePanel filtering
    const center = simpleRoomCenters[roomName];
    if (!center) return;
    // Camera to the room (world coords: houseGroup at -11)
    const worldX = -11 + center.x;
    const worldZ = center.z;
    controls.target.set(worldX, 3, worldZ);
    camera.position.set(worldX + 2, 8, worldZ + 6);
    controls.update();

    // Room Isolation: show only selected room + structure
    Object.keys(simpleRoomGroups).forEach(name => {
        if (name === 'Structure') simpleRoomGroups[name].visible = true;
        else simpleRoomGroups[name].visible = (name === roomName);
    });

    // Show back button and highlight room nav
    document.getElementById('simple-back-btn').style.display = 'inline-block';
    document.querySelectorAll('#simple-room-nav-panel .room-nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('simple-room-btn-' + roomName.replace(/\s/g, '-'));
    if (activeBtn) activeBtn.classList.add('active');
    // Update appliance panel
    buildAppliancePanel(roomName);
}

function exitSimpleRoomView() {
    currentSimpleRoom = null;
    currentRoom = null;
    // Return to full simple house view
    controls.target.set(-11, 4, 0);
    camera.position.set(-11, 12, 20);
    controls.update();

    // Restore all room visibility
    Object.values(simpleRoomGroups).forEach(g => g.visible = true);

    document.getElementById('simple-back-btn').style.display = 'none';
    document.querySelectorAll('#simple-room-nav-panel .room-nav-btn').forEach(btn => btn.classList.remove('active'));
    buildAppliancePanel();
}

// ═══════════════════════════════════════════════
//  ENERGY GRAPHS SYSTEM
// ═══════════════════════════════════════════════
let barChart = null;
let doughnutChart = null;
let graphsVisible = false;

function toggleEnergyGraphs() {
    graphsVisible = !graphsVisible;
    document.getElementById('energy-graphs-panel').classList.toggle('visible', graphsVisible);
    document.getElementById('graph-overlay').classList.toggle('visible', graphsVisible);
    if (graphsVisible) {
        updateEnergyGraphs();
    }
}

function updateEnergyGraphs() {
    if (!graphsVisible) return;

    const appList = (currentFocusedHouse === '2bhk') ? bhk2Appliances : simpleAppliances;
    const roomData = {};

    appList.forEach(a => {
        const room = a.room || 'Other';
        if (!roomData[room]) roomData[room] = 0;
        if (a.on) roomData[room] += a.watt;
    });

    const roomNames = Object.keys(roomData);
    const roomWatts = Object.values(roomData);
    const totalWatts = roomWatts.reduce((s, w) => s + w, 0);
    const roomPercentages = roomWatts.map(w => totalWatts > 0 ? Math.round(w / totalWatts * 100) : 0);

    const chartColors = [
        'rgba(255, 215, 0, 0.85)',
        'rgba(0, 210, 255, 0.85)',
        'rgba(108, 92, 231, 0.85)',
        'rgba(0, 184, 148, 0.85)',
        'rgba(255, 71, 87, 0.85)',
        'rgba(253, 203, 110, 0.85)'
    ];
    const chartBorders = [
        'rgba(255, 215, 0, 1)',
        'rgba(0, 210, 255, 1)',
        'rgba(108, 92, 231, 1)',
        'rgba(0, 184, 148, 1)',
        'rgba(255, 71, 87, 1)',
        'rgba(253, 203, 110, 1)'
    ];

    // Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy();
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: roomNames,
            datasets: [{
                label: 'Energy (W)',
                data: roomWatts,
                backgroundColor: chartColors.slice(0, roomNames.length),
                borderColor: chartBorders.slice(0, roomNames.length),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { family: 'Outfit' },
                    bodyFont: { family: 'Outfit' },
                    callbacks: {
                        label: ctx => ctx.parsed.y + ' W'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#aaa', font: { family: 'Outfit', size: 11 } },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: '#aaa', font: { family: 'Outfit', size: 11 }, callback: v => v + 'W' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });

    // Doughnut Chart
    const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
    if (doughnutChart) doughnutChart.destroy();
    doughnutChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
            labels: roomNames.map((n, i) => n + ' (' + roomPercentages[i] + '%)'),
            datasets: [{
                data: roomWatts,
                backgroundColor: chartColors.slice(0, roomNames.length),
                borderColor: 'rgba(15, 15, 35, 0.9)',
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ccc',
                        font: { family: 'Outfit', size: 12 },
                        padding: 12,
                        usePointStyle: true,
                        pointStyleWidth: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { family: 'Outfit' },
                    bodyFont: { family: 'Outfit' },
                    callbacks: {
                        label: ctx => ctx.label + ': ' + ctx.parsed + 'W'
                    }
                }
            }
        }
    });
}

// Focus camera on a house
function focusHouse(which) {
    currentFocusedHouse = which;
    currentRoom = null;
    document.getElementById('back-to-full-btn').style.display = 'none';
    // Restore all room visibility for both houses
    Object.values(simpleRoomGroups).forEach(g => g.visible = true);
    Object.values(roomGroups).forEach(g => g.visible = true);
    if (which === 'simple') {
        controls.target.set(-11, 4, 0);
        camera.position.set(-11, 12, 20);
        document.getElementById('room-nav-panel').classList.remove('visible');
        document.getElementById('simple-room-nav-panel').classList.add('visible');
        document.getElementById('solar-mount-point').style.display = 'flex';
        document.getElementById('panel-counter').classList.add('visible');
    } else {
        controls.target.set(16, 4, 0);
        camera.position.set(16, 12, 20);
        document.getElementById('room-nav-panel').classList.add('visible');
        document.getElementById('simple-room-nav-panel').classList.remove('visible');
        document.getElementById('solar-mount-point').style.display = 'flex';
        document.getElementById('panel-counter').classList.add('visible');
    }
    controls.update();
    buildAppliancePanel();
    recalcWattage();
    // Update solar panel instances if needed
    updateSolarInstance();
}

let currentSolarTarget = 'simple';
function updateSolarInstance() {
    const is2BHK = (currentFocusedHouse === '2bhk');
    const targetW = is2BHK ? 20 : 15;
    const targetH = 5.5;
    const targetRoofH = 3.5;
    const slopeAngle = Math.atan2(targetRoofH, targetW / 2 + 0.8);

    solarPanels.forEach((p, index) => {
        if (is2BHK) roomGroups['Structure'].add(p.group);
        else houseGroup.add(p.group);

        // Recalculate position on roof
        const col = index % 5;
        const row = Math.floor(index / 5);
        const xPos = (is2BHK ? -4.5 : -3.6) + col * (is2BHK ? 2.3 : 2.0);
        const zPos = -2.0 + row * 2.5;
        const roofY = targetH + 0.3 + targetRoofH - Math.abs(xPos) * (targetRoofH / (targetW / 2 + 0.8));

        p.targetY = roofY + 0.15;
        p.group.position.x = xPos;
        p.group.position.z = zPos;
        if (!p.animating && p.group.visible) {
            p.group.position.y = p.targetY;
        }
        p.group.rotation.x = -slopeAngle * (xPos >= 0 ? 1 : -1) * 0.5;
        p.group.rotation.z = xPos >= 0 ? -slopeAngle * 0.3 : slopeAngle * 0.3;
    });
}
// Keep toggleUpgrade for backward compat
function toggleUpgrade() { focusHouse('2bhk'); }

// ═══════════════════════════════════════════════
//  SOLAR PANELS
// ═══════════════════════════════════════════════
const solarPanels = [];
const maxPanels = 10;

const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.25, metalness: 0.8 });
const panelFrameMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.3 });

function createSolarPanel(index) {
    const g = new THREE.Group();
    // Panel body
    const panelGeo = new THREE.BoxGeometry(1.8, 0.08, 1.2);
    const panel = new THREE.Mesh(panelGeo, panelMat);
    g.add(panel);
    // Grid lines
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x283593 });
    for (let i = -2; i <= 2; i++) {
        const hLine = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.01, 0.02), gridMat);
        hLine.position.set(0, 0.05, i * 0.24);
        g.add(hLine);
    }
    for (let i = -3; i <= 3; i++) {
        const vLine = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.01, 1.15), gridMat);
        vLine.position.set(i * 0.25, 0.05, 0);
        g.add(vLine);
    }
    // Frame border
    const frameParts = [
        new THREE.BoxGeometry(1.85, 0.12, 0.06),
        new THREE.BoxGeometry(1.85, 0.12, 0.06),
        new THREE.BoxGeometry(0.06, 0.12, 1.2),
        new THREE.BoxGeometry(0.06, 0.12, 1.2)
    ];
    const framePositions = [
        [0, 0, 0.6], [0, 0, -0.6], [-0.9, 0, 0], [0.9, 0, 0]
    ];
    frameParts.forEach((geo, i) => {
        const mesh = new THREE.Mesh(geo, panelFrameMat);
        mesh.position.set(...framePositions[i]);
        g.add(mesh);
    });

    // Position on roof
    const col = index % 5;
    const row = Math.floor(index / 5);
    const xPos = -3.6 + col * 2.0;
    const zPos = -2.0 + row * 2.5;
    // Calculate roof Y position (triangular roof)
    const slopeAngle = Math.atan2(roofH, W / 2 + 0.8);
    const roofY = H + 0.3 + roofH - Math.abs(xPos) * (roofH / (W / 2 + 0.8));

    g.position.set(xPos, roofY + 15, zPos); // Start above (animation)
    g.rotation.x = -slopeAngle * (xPos >= 0 ? 1 : -1) * 0.5;
    g.rotation.z = xPos >= 0 ? -slopeAngle * 0.3 : slopeAngle * 0.3;
    g.visible = false;

    houseGroup.add(g);
    solarPanels.push({ group: g, targetY: roofY + 0.15, animating: false });
    return g;
}

for (let i = 0; i < maxPanels; i++) {
    createSolarPanel(i);
}

// ═══════════════════════════════════════════════
//  SOLAR / GRID TOGGLE
// ═══════════════════════════════════════════════
const funFacts = [
    "The sun produces enough energy in 1 hour to power the entire Earth for a year!",
    "Solar panels can last 25-30 years or more!",
    "A single solar panel can prevent 1 ton of CO₂ per year!",
    "India receives about 300 sunny days per year — perfect for solar!",
    "Solar energy is the most abundant energy source on Earth!",
    "The cost of solar panels has dropped by 99% since 1977!",
    "Solar panels work even on cloudy days — they use light, not heat!",
    "One solar panel can charge 120 smartphones in a day!"
];

function updateStats() {
    const panelsNeeded = Math.ceil(totalWatt / 350);
    document.getElementById('stat-consumption').textContent = totalWatt.toLocaleString() + ' W';
    document.getElementById('stat-panels').textContent = currentPanelCount + ' / ' + panelsNeeded + ' needed';

    const coverageRatio = Math.min(currentPanelCount / panelsNeeded, 1);
    const monthlySaving = Math.round(coverageRatio * totalWatt * 0.72 * 30 / 1000 * 8); // approx INR
    const co2Saved = Math.round(coverageRatio * totalWatt * 0.0007 * 365);

    document.getElementById('stat-savings').textContent = '₹' + monthlySaving.toLocaleString();
    document.getElementById('stat-co2').textContent = co2Saved + ' kg/yr';
    document.getElementById('stat-fact').textContent = funFacts[Math.floor(Math.random() * funFacts.length)];
    document.getElementById('panel-num').textContent = currentPanelCount;
}

function toggleSolar() {
    isSolarMode = !isSolarMode;
    const btn = document.getElementById('solar-btn');
    const btnText = document.getElementById('solar-btn-text');
    const btnIcon = document.getElementById('solar-btn-icon');
    const panelCounter = document.getElementById('panel-counter');

    if (isSolarMode) {
        btn.className = 'solar-mode';
        btnText.textContent = 'Switch to Grid';
        btnIcon.textContent = '⚡';
        panelCounter.classList.add('visible');

        // Start with 0 panels — kid adds them one by one with + button
        currentPanelCount = 0;
        solarPanels.forEach(p => {
            p.group.visible = false;
            p.group.position.y = p.targetY + 15;
        });

    } else {
        btn.className = 'grid-mode';
        btnText.textContent = 'Switch to Solar Energy';
        btnIcon.textContent = '☀️';
        panelCounter.classList.remove('visible');
        currentPanelCount = 0;

        // Hide all panels
        solarPanels.forEach(p => {
            p.group.visible = false;
            p.group.position.y = p.targetY + 15;
        });

        // Restore power lines
        poleGroup.children.forEach(child => {
            if (child.material) {
                child.material.opacity = 1;
            }
        });
    }
    updatePowerLines();
    updateStats();
}

function updatePowerLines() {
    // Fade power lines proportional to solar coverage
    const panelsNeeded = Math.ceil(totalWatt / 350);
    const coverage = panelsNeeded > 0 ? Math.min(currentPanelCount / panelsNeeded, 1) : 0;
    const poleOpacity = isSolarMode ? Math.max(0.1, 1 - coverage) : 1;
    poleGroup.children.forEach(child => {
        if (child.material) {
            child.material.transparent = true;
            child.material.opacity = poleOpacity;
        }
    });
}

function animatePanelsIn(count) {
    solarPanels.forEach((p, i) => {
        if (i < count) {
            p.group.visible = true;
            p.group.position.y = p.targetY + 15;
            p.animating = true;
            p.delay = i * 8; // stagger animation
            p.frame = 0;
        } else {
            p.group.visible = false;
            p.group.position.y = p.targetY + 15;
        }
    });
}

function changePanelCount(delta) {
    if (!isSolarMode) return;
    const newCount = Math.max(0, Math.min(maxPanels, currentPanelCount + delta));
    if (newCount === currentPanelCount) return;

    if (delta > 0) {
        // Add ONE panel with animation
        const idx = currentPanelCount;
        solarPanels[idx].group.visible = true;
        solarPanels[idx].group.position.y = solarPanels[idx].targetY + 15;
        solarPanels[idx].animating = true;
        solarPanels[idx].delay = 0;
        solarPanels[idx].frame = 0;
    } else {
        // Remove the last panel
        const idx = currentPanelCount - 1;
        solarPanels[idx].group.visible = false;
        solarPanels[idx].group.position.y = solarPanels[idx].targetY + 15;
        solarPanels[idx].animating = false;
    }

    currentPanelCount = newCount;
    updatePowerLines();
    updateStats();
}

// ═══════════════════════════════════════════════
//  WALL + ROOF TRANSPARENCY (zoom-based)
// ═══════════════════════════════════════════════
function updateWallTransparency() {
    const camPos = camera.position.clone();
    // Simple house center in world: (-11, 4, 0)
    const distSimple = camPos.distanceTo(new THREE.Vector3(-11, 4, 0));
    const tSimple = THREE.MathUtils.clamp((distSimple - 6) / 14, 0, 1);

    // Simple house walls/roof/door
    transparentWalls.forEach(wall => {
        wall.material.opacity = tSimple;
        wall.material.transparent = true;
        wall.material.needsUpdate = true;
    });
    roofMat.opacity = tSimple; roofMat.needsUpdate = true;
    doorMat.opacity = tSimple; doorMat.needsUpdate = true;
    labels.forEach(label => {
        label.element.style.opacity = 1 - tSimple;
        label.element.style.display = (1 - tSimple) > 0.2 ? 'block' : 'none';
    });
    // Simple house room labels
    simpleRoomLabels.forEach(label => {
        label.element.style.opacity = 1 - tSimple;
        label.element.style.display = (1 - tSimple) > 0.2 ? 'block' : 'none';
    });

    // 2BHK house center in world: (16, 4, 0)
    const dist2BHK = camPos.distanceTo(new THREE.Vector3(16, 4, 0));
    const t2BHK = THREE.MathUtils.clamp((dist2BHK - 8) / 14, 0, 1);

    bhk2TransWalls.forEach(wall => {
        wall.material.opacity = t2BHK;
        wall.material.transparent = true;
        wall.material.needsUpdate = true;
    });
    bhk2RoofMat.opacity = t2BHK; bhk2RoofMat.needsUpdate = true;
    bhk2DoorMat.opacity = t2BHK; bhk2DoorMat.needsUpdate = true;
    bhk2WallMat.opacity = t2BHK; bhk2WallMat.needsUpdate = true;
    // 2BHK room labels
    roomLabels.forEach(label => {
        label.element.style.opacity = 1 - t2BHK;
        label.element.style.display = (1 - t2BHK) > 0.2 ? 'block' : 'none';
    });
}

// ═══════════════════════════════════════════════
//  ZOOM HINT
// ═══════════════════════════════════════════════
let hintTimeout;
controls.addEventListener('change', () => {
    const hint = document.getElementById('zoom-hint');
    if (camera.position.distanceTo(controls.target) < 15) {
        hint.classList.add('hidden');
    }
    clearTimeout(hintTimeout);
});

// ═══════════════════════════════════════════════
//  ANIMATION LOOP
// ═══════════════════════════════════════════════
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    controls.update();

    // Animate clouds
    clouds.forEach((cloud, i) => {
        cloud.position.x += delta * (0.3 + i * 0.1);
        if (cloud.position.x > 45) cloud.position.x = -45;
    });

    // Animate sun
    sunMesh.position.y = 35 + Math.sin(elapsed * 0.1) * 2;
    sunGlow.position.copy(sunMesh.position);
    sunGlow.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.1);

    // Animate birds
    birds.forEach(bird => {
        const t = elapsed * bird.speed + bird.phase;
        bird.group.position.x = bird.cx + Math.sin(t) * bird.radiusX;
        bird.group.position.z = bird.cz + Math.cos(t) * bird.radiusZ;
        bird.group.position.y = bird.cy + Math.sin(t * 1.5) * 1.5;
        // Face direction of travel
        bird.group.rotation.y = t + Math.PI / 2;
        // Wing flapping
        const flapAngle = Math.sin(elapsed * bird.flapSpeed) * 0.6;
        bird.leftWing.rotation.x = flapAngle;
        bird.rightWing.rotation.x = -flapAngle;
    });

    // Animate simple house appliances (respecting ON/OFF)
    simpleAppliances.forEach(a => {
        if (a.kind === 'fan' && a.on) a.mesh.blades.rotation.y += delta * 5;
        if (a.kind === 'tablefan' && a.on) a.mesh.blades.rotation.z += delta * 8;
        if (a.kind === 'ac' && a.on && a.mesh.particlePositions) {
            const positions = a.mesh.particlePositions;
            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3 + 1] -= delta * 0.5;
                if (positions[i * 3 + 1] < a.mesh.baseY - 3) {
                    positions[i * 3 + 1] = a.mesh.baseY - 0.3;
                    positions[i * 3] = a.mesh.group.position.x + (Math.random() - 0.5) * 2;
                    positions[i * 3 + 2] = a.mesh.group.position.z + 0.5 + Math.random() * 1.5;
                }
            }
            a.mesh.particles.geometry.attributes.position.needsUpdate = true;
        }
        if (a.kind === 'light' && a.on) {
            a.mesh.bulbMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 3) * 0.3;
            a.mesh.pointLight.intensity = 0.6 + Math.sin(elapsed * 3) * 0.3;
        }
    });

    // Animate 2BHK appliances (respecting ON/OFF)
    if (is2BHK) {
        bhk2AnimData.fans.forEach(f => {
            if (f.on) f.mesh.blades.rotation.y += delta * 5;
        });
        bhk2AnimData.tableFans.forEach(tf => {
            if (tf.on) tf.mesh.blades.rotation.z += delta * 8;
        });
        bhk2AnimData.acs.forEach(a2 => {
            if (a2.on && a2.mesh.particlePositions) {
                const p = a2.mesh.particlePositions;
                for (let i = 0; i < p.length / 3; i++) {
                    p[i * 3 + 1] -= delta * 0.5;
                    if (p[i * 3 + 1] < a2.mesh.baseY - 3) {
                        p[i * 3 + 1] = a2.mesh.baseY - 0.3;
                        p[i * 3] = a2.mesh.group.position.x + (Math.random() - 0.5) * 2;
                        p[i * 3 + 2] = a2.mesh.group.position.z + 0.5 + Math.random() * 1.5;
                    }
                }
                a2.mesh.particles.geometry.attributes.position.needsUpdate = true;
            }
        });
        bhk2AnimData.lights.forEach(l => {
            if (l.on) {
                l.mesh.bulbMat.emissiveIntensity = 1.2 + Math.sin(elapsed * 3) * 0.3;
                l.mesh.pointLight.intensity = 1.2 + Math.sin(elapsed * 3) * 0.3;
            }
        });
    }

    // Animate solar panels dropping in
    solarPanels.forEach(p => {
        if (p.animating) {
            p.frame++;
            if (p.frame > p.delay) {
                const dy = (p.targetY - p.group.position.y) * 0.08;
                p.group.position.y += dy;
                if (Math.abs(p.group.position.y - p.targetY) < 0.05) {
                    p.group.position.y = p.targetY;
                    p.animating = false;
                }
            }
        }
    });

    // Wall transparency
    updateWallTransparency();

    // Render
    // TV Screen Flicker Animation
    [...simpleAppliances, ...bhk2Appliances].forEach(a => {
        if (a.kind === 'tv' && a.on && a.mesh && a.mesh.screen) {
            const noise = 0.8 + Math.random() * 0.4;
            a.mesh.screen.material.emissiveIntensity = noise;
            if (Math.random() > 0.9) {
                a.mesh.screen.material.emissive.setHSL(0.6, 0.4, 0.3 + Math.random() * 0.2);
            }
        }
    });

    // Tap water animation
    if (waterStream.visible) {
        waterStream.scale.y = 1 + Math.sin(elapsed * 20) * 0.05;
        waterStream.material.opacity = 0.5 + Math.sin(elapsed * 15) * 0.1;
    }

    labelRenderer.render(scene, camera);
    renderer.render(scene, camera);
}

animate();
updateStats();

// ═══════════════════════════════════════════════
//  RESIZE
// ═══════════════════════════════════════════════
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
