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

// Interior lights
const interiorLight1 = new THREE.PointLight(0xfff5e0, 1.2, 20);
interiorLight1.position.set(0, 5.5, 0);
scene.add(interiorLight1);
const interiorLight2 = new THREE.PointLight(0xfff5e0, 0.8, 15);
interiorLight2.position.set(-3, 4, -2);
scene.add(interiorLight2);
const interiorLight3 = new THREE.PointLight(0xfff5e0, 0.8, 15);
interiorLight3.position.set(3, 4, 2);
scene.add(interiorLight3);


