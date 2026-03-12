// ═══════════════════════════════════════════════
//  SCENE SETUP — PBR Photorealistic Lighting
// ═══════════════════════════════════════════════
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// ─── RENDERER ───
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
container.appendChild(renderer.domElement);

// ─── SKY SPHERE (shader gradient) ───
const skyGeo = new THREE.SphereGeometry(500, 32, 32);
const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
        topColor: { value: new THREE.Color(0x0a1628) },
        bottomColor: { value: new THREE.Color(0x87CEEB) },
        horizonColor: { value: new THREE.Color(0xffecd2) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
    },
    vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform vec3 horizonColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize(vWorldPosition + offset).y;
            float t = max(pow(max(h, 0.0), exponent), 0.0);
            // Blend: bottom → horizon → top
            vec3 color = mix(horizonColor, bottomColor, smoothstep(0.0, 0.3, t));
            color = mix(color, topColor, smoothstep(0.3, 1.0, t));
            gl_FragColor = vec4(color, 1.0);
        }
    `
});
const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);

// Fog (atmospheric)
scene.fog = new THREE.FogExp2(0x87CEEB, 0.008);

// ─── CAMERA ───
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 40);

// ─── CSS2D Renderer for labels ───
const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

// ─── CONTROLS ───
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.5;
controls.maxDistance = 120;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.target.set(0, 4, 0);
controls.update();

// Stop following boy when user manually orbits
controls.addEventListener('start', () => {
    if (typeof boyState !== 'undefined' && boyState.mode === 'indoor') {
        boyState.cameraFollow = false;
    }
});

// ═══════════════════════════════════════════════
//  PBR LIGHTING
// ═══════════════════════════════════════════════

// Sun (directional light) — main light source
const sunLight = new THREE.DirectionalLight(0xFFF4E0, 2.5);
sunLight.position.set(50, 80, 30);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 4096;
sunLight.shadow.mapSize.height = 4096;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 300;
sunLight.shadow.camera.left = -60;
sunLight.shadow.camera.right = 60;
sunLight.shadow.camera.top = 60;
sunLight.shadow.camera.bottom = -60;
sunLight.shadow.bias = -0.001;
sunLight.shadow.normalBias = 0.02;
scene.add(sunLight);

// Hemisphere light (sky/ground bounce)
const ambientLight = new THREE.HemisphereLight(
    0x87CEEB,  // sky color
    0x4a3728,  // ground color
    0.6
);
scene.add(ambientLight);

// Fill light (soft blue from opposite side)
const fillLight = new THREE.DirectionalLight(0x8ec8f0, 0.3);
fillLight.position.set(-30, 15, -20);
scene.add(fillLight);

// Interior lights (activated when inside)
const interiorLight1 = new THREE.PointLight(0xfff5e0, 1.2, 20);
interiorLight1.position.set(0, 5.5, 0);
scene.add(interiorLight1);
const interiorLight2 = new THREE.PointLight(0xfff5e0, 0.8, 15);
interiorLight2.position.set(-3, 4, -2);
scene.add(interiorLight2);
const interiorLight3 = new THREE.PointLight(0xfff5e0, 0.8, 15);
interiorLight3.position.set(3, 4, 2);
scene.add(interiorLight3);

console.log('[SCENE] PBR lighting initialized — ACESFilmic tonemapping, 4096 shadow maps');
