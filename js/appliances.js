// ═══════════════════════════════════════════════
//  APPLIANCE CREATION FUNCTIONS
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
    const wireGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6);
    const wireMat2 = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const wire = new THREE.Mesh(wireGeo, wireMat2);
    wire.position.y = 0.75; g.add(wire);
    const shadeGeo = new THREE.CylinderGeometry(0.15, 0.5, 0.35, 12, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.6, side: THREE.DoubleSide });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.y = 0.15; g.add(shade);
    const bulbGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffdd44, emissiveIntensity: 1.5, transparent: true, opacity: 0.95 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.y = -0.05; g.add(bulb);
    const pl = new THREE.PointLight(0xffdd44, 1.5, 12);
    pl.position.y = -0.05; g.add(pl);
    g.position.set(x, y, z);
    applianceGroup.add(g);
    return { group: g, bulbMat, pointLight: pl };
}

// Positions for enlarged 1BHK (W=28, D=22, H=7)
// Light1 in kitchen center, Light2 in bedroom center
const light1 = createLightBulb(-9, H - 0.5, 3);
const light2 = createLightBulb(3, H - 0.5, -8);

// ── Ceiling Fan ──
function createFan(x, y, z) {
    const g = new THREE.Group();
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 });
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), rodMat);
    rod.position.y = 0.6; g.add(rod);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.3, 12), rodMat);
    g.add(hub);
    const bladesGroup = new THREE.Group();
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.6, metalness: 0.2 });
    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.05, 0.4), bladeMat);
        blade.position.x = 1.25;
        const wrapper = new THREE.Group();
        wrapper.add(blade);
        wrapper.rotation.y = (Math.PI / 2) * i;
        bladesGroup.add(wrapper);
    }
    bladesGroup.position.y = -0.1; g.add(bladesGroup);
    g.position.set(x, y, z);
    applianceGroup.add(g);
    return { group: g, blades: bladesGroup };
}

// Fan in hall center
const fan1 = createFan(5, H - 0.3, 3);

// ── Refrigerator ──
function createFridge(x, y, z) {
    const g = new THREE.Group();
    const fridgeMat = new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.3, metalness: 0.6 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.2, 1.2), fridgeMat);
    body.position.y = 1.6; body.castShadow = true; g.add(body);
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const line = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.04, 0.05), lineMat);
    line.position.set(0, 2.0, 0.61); g.add(line);
    const hMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 0.1), hMat);
    h1.position.set(0.5, 2.7, 0.65); g.add(h1);
    const h2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 0.1), hMat);
    h2.position.set(0.5, 1.3, 0.65); g.add(h2);
    g.position.set(x, y, z);
    applianceGroup.add(g);
    return { group: g };
}

// Fridge in kitchen (against left wall)
const fridge = createFridge(-12, 0.3, 5);

// ── Air Conditioner ──
function createAC(x, y, z) {
    const g = new THREE.Group();
    const acMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.3, metalness: 0.4 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.7, 0.6), acMat);
    body.castShadow = true; g.add(body);
    const ventMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    for (let i = -3; i <= 3; i++) {
        const vent = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.02, 0.05), ventMat);
        vent.position.set(0, -0.15 + i * 0.05, 0.31); g.add(vent);
    }
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1 }));
    led.position.set(-1.0, 0.2, 0.31); g.add(led);
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

// AC in bedroom (on back wall)
const ac = createAC(3, 5.5, -D / 2 + 0.7);

// ── Table Fan ──
function createTableFan(x, y, z) {
    const g = new THREE.Group();
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.4 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.2, 12), baseMat);
    g.add(base);
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 6), baseMat);
    stand.position.y = 0.5; g.add(stand);
    const motor = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), baseMat);
    motor.position.y = 0.9; g.add(motor);
    const bladesGroup = new THREE.Group();
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x4488aa, metalness: 0.3, roughness: 0.5, transparent: true, opacity: 0.8 });
    for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.2), bladeMat);
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

// Table fan in hall (on a side table)
const tableFan = createTableFan(10, 0.3, 6);

// Table for fan
const tableMat = new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.8 });
const table = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 1.5), tableMat);
table.position.set(10, 1.05, 6); table.castShadow = true; applianceGroup.add(table);
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
    createLabel('💡 Light Bulb', 60, new THREE.Vector3(-9, H + 0.8, 3)),
    createLabel('🌀 Ceiling Fan', 75, new THREE.Vector3(5, H + 1, 3)),
    createLabel('🧊 Refrigerator', 350, new THREE.Vector3(-12, 4, 5)),
    createLabel('❄️ AC Unit', 1500, new THREE.Vector3(3, 6.8, -D / 2 + 0.7)),
    createLabel('💡 Light Bulb', 60, new THREE.Vector3(3, H + 0.8, -8)),
    createLabel('🌀 Table Fan', 55, new THREE.Vector3(10, 4, 6))
];

// ═══════════════════════════════════════════════
//  SHARED STATE
// ═══════════════════════════════════════════════
let currentPanelCount = 0;
let isSolarMode = false;
