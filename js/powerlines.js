// ═══════════════════════════════════════════════
//  ENERGY VISION MODE — Power Lines, Watt Labels, HUD
//  Toggle: 'V' key or ⚡ button
// ═══════════════════════════════════════════════

let energyVisionActive = false;
const visionWires = [];
const visionOrbs = [];
const visionLabels = [];
let visionHUD = null;

// ─── WIRE NETWORK DEFINITIONS ────────
// Each wire connects a meter point to an appliance location
// Paths are in LOCAL coords relative to house group
const WIRE_DEFS_1BHK = [
  // Hall light
  {
    appliance: 'Light Bulb', room: 'Hall', watt: 60,
    path: [[-13, 3.5, 11], [-13, 6.5, 11], [-13, 6.5, 3], [-9, 6.5, 3]]
  },
  // Ceiling fan
  {
    appliance: 'Ceiling Fan', room: 'Hall', watt: 75,
    path: [[-13, 3.5, 11], [-13, 6.5, 11], [-4, 6.5, 6], [5, 6.5, 3]]
  },
  // AC
  {
    appliance: 'Air Conditioner', room: 'Hall', watt: 1500,
    path: [[-13, 3.5, 11], [-13, 6.5, 11], [-4, 6.5, -5], [3, 5.5, -10]]
  },
  // Fridge
  {
    appliance: 'Refrigerator', room: 'Kitchen', watt: 350,
    path: [[-13, 3.5, 11], [-13, 5, 11], [-13, 5, 5], [-12, 2, 5]]
  },
  // Bedroom light
  {
    appliance: 'Light Bulb', room: 'Bedroom', watt: 60,
    path: [[-13, 3.5, 11], [-13, 6.5, 11], [0, 6.5, -5], [3, 6.5, -8]]
  },
  // Table fan
  {
    appliance: 'Table Fan', room: 'Bedroom', watt: 55,
    path: [[-13, 3.5, 11], [-13, 4, 11], [10, 4, 11], [10, 2, 6]]
  },
];

const WIRE_DEFS_2BHK = [
  // Hall light
  {
    appliance: 'Light Bulb', room: 'Hall', watt: 60,
    path: [[13, 3.5, 12], [13, 6.5, 12], [2, 6.5, 0], [2, 6.5, 0]]
  },
  // Hall fan
  {
    appliance: 'Ceiling Fan', room: 'Hall', watt: 75,
    path: [[13, 3.5, 12], [13, 6.5, 12], [5, 6.7, 4]]
  },
  // Hall AC
  {
    appliance: 'Air Conditioner', room: 'Hall', watt: 1500,
    path: [[13, 3.5, 12], [13, 6, 12], [13, 6, -4.5], [10, 5, -4.5]]
  },
  // Bedroom 1 fan
  {
    appliance: 'Ceiling Fan', room: 'Bedroom 1', watt: 75,
    path: [[13, 3.5, 12], [-5, 6.5, 12], [-7, 6.7, -8.5]]
  },
  // Bedroom 1 light
  {
    appliance: 'Light Bulb', room: 'Bedroom 1', watt: 60,
    path: [[13, 3.5, 12], [-5, 6.5, 12], [-10, 6.5, -9]]
  },
  // Bedroom 1 AC
  {
    appliance: 'Air Conditioner', room: 'Bedroom 1', watt: 1500,
    path: [[13, 3.5, 12], [-5, 5, 12], [-5, 5, -12], [-4, 5, -11.3]]
  },
  // Bedroom 2 fan
  {
    appliance: 'Ceiling Fan', room: 'Bedroom 2', watt: 75,
    path: [[13, 3.5, 12], [13, 6.5, 12], [7, 6.7, -8.5]]
  },
  // Bedroom 2 light
  {
    appliance: 'Light Bulb', room: 'Bedroom 2', watt: 60,
    path: [[13, 3.5, 12], [13, 6.5, 12], [10, 6.5, -9]]
  },
  // Kitchen light
  {
    appliance: 'Light Bulb', room: 'Kitchen', watt: 60,
    path: [[13, 3.5, 12], [-5, 6.5, 12], [-9.5, 6.5, -1]]
  },
  // Kitchen fridge
  {
    appliance: 'Refrigerator', room: 'Kitchen', watt: 350,
    path: [[13, 3.5, 12], [-5, 4, 12], [-7, 2, 1]]
  },
  // Bathroom light
  {
    appliance: 'Light Bulb', room: 'Bathroom', watt: 40,
    path: [[13, 3.5, 12], [-5, 6.5, 12], [-9.5, 6.5, 7.5]]
  },
];

// ─── WATT → COLOR MAP ────────
function getWireColor(watt, isOn) {
  if (!isOn) return { color: 0x444444, emissive: 0x222222, label: 'Off', intensity: 0.2 };
  if (watt >= 1000) return { color: 0xFF4500, emissive: 0xFF2200, label: 'High', intensity: 1.5 };
  if (watt >= 200) return { color: 0xFFD700, emissive: 0xFFAA00, label: 'Med', intensity: 1.0 };
  return { color: 0x00FF88, emissive: 0x00CC66, label: 'Low', intensity: 0.7 };
}

// ─── CREATE WIRE GEOMETRY ────────
function createWire(points3D, colorInfo, parentGroup) {
  const pts = points3D.map(p => new THREE.Vector3(p[0], p[1], p[2]));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.3);

  // Main wire tube
  const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: colorInfo.color,
    emissive: colorInfo.emissive,
    emissiveIntensity: colorInfo.intensity,
    roughness: 0.3,
    metalness: 0.5,
    transparent: true,
    opacity: 0.9,
  });
  const wire = new THREE.Mesh(tubeGeo, tubeMat);
  parentGroup.add(wire);

  // Glow halo (wider, transparent)
  const glowGeo = new THREE.TubeGeometry(curve, 32, 0.12, 8, false);
  const glowMat = new THREE.MeshBasicMaterial({
    color: colorInfo.color,
    transparent: true,
    opacity: 0.15,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  parentGroup.add(glow);

  return { wire, glow, tubeMat, glowMat, curve };
}

// ─── CREATE ORB (traveling energy particle) ────────
function createOrb(curve, colorInfo, parentGroup) {
  const orbGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const orbMat = new THREE.MeshBasicMaterial({
    color: colorInfo.color,
    transparent: true,
    opacity: 0.9,
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  parentGroup.add(orb);

  // Point light on orb
  const light = new THREE.PointLight(colorInfo.color, 0.4, 2);
  orb.add(light);

  return { orb, orbMat, light, curve, progress: Math.random(), speed: 0.3 + Math.random() * 0.2 };
}

// ─── CREATE WATT LABEL ────────
function createWattLabel(name, watt, isOn, worldPos) {
  const colorInfo = getWireColor(watt, isOn);
  const div = document.createElement('div');
  div.className = 'ev-watt-label';
  div.innerHTML = `<span class="ev-name">${name}</span><br><span class="ev-watts" style="color:${isOn ? '#' + colorInfo.color.toString(16).padStart(6, '0') : '#888'}">${watt}W ${isOn ? '⚡' : '○'}</span>`;
  div.style.cssText = 'background:rgba(0,0,0,0.85);border:1px solid rgba(255,255,255,0.3);border-radius:8px;padding:4px 8px;font-family:Georgia,serif;font-size:0.7rem;color:#fff;pointer-events:none;white-space:nowrap;text-align:center;backdrop-filter:blur(6px)';

  const label = new THREE.CSS2DObject(div);
  label.position.copy(worldPos);
  label.position.y += 1.2;
  return label;
}

// ─── INJECT VISION CSS ────────
(function injectVisionCSS() {
  const s = document.createElement('style');
  s.id = 'ev-styles';
  s.textContent = `
    .ev-name{font-weight:bold;color:#FFE066;font-size:0.72rem}
    .ev-watts{font-weight:bold;font-size:0.85rem}
    #ev-hud{position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:600}
    #ev-hud .ev-border{position:absolute;inset:0;border:3px solid rgba(255,100,0,0.4);border-radius:0;pointer-events:none;animation:evBorderPulse 2s infinite}
    @keyframes evBorderPulse{0%,100%{border-color:rgba(255,100,0,0.3)}50%{border-color:rgba(255,100,0,0.7)}}
    #ev-legend{position:fixed;top:80px;right:20px;background:rgba(0,0,0,0.85);border:1px solid rgba(255,100,0,0.4);border-radius:12px;padding:12px 16px;z-index:650;font-family:Georgia,serif;backdrop-filter:blur(10px)}
    .ev-legend-title{color:#FFE066;font-size:0.85rem;font-weight:bold;margin-bottom:8px;text-align:center}
    .ev-legend-row{display:flex;align-items:center;gap:8px;margin:4px 0;font-size:0.75rem;color:#ddd}
    .ev-legend-dot{width:12px;height:12px;border-radius:50%;display:inline-block}
    #ev-total{position:fixed;top:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);border:1px solid rgba(255,100,0,0.4);border-radius:14px;padding:10px 24px;z-index:650;font-family:Georgia,serif;text-align:center;backdrop-filter:blur(10px)}
    .ev-total-label{color:#FF8C00;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.08em}
    .ev-total-value{color:#FFE066;font-size:1.5rem;font-weight:bold}
    `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════
//  TOGGLE ENERGY VISION
// ═══════════════════════════════════════════════
function toggleEnergyVision() {
  if (typeof boyState === 'undefined' || boyState.mode !== 'indoor') {
    if (typeof showToast === 'function') showToast('⚠️ Enter a house first to use Energy Vision!');
    return;
  }

  energyVisionActive = !energyVisionActive;
  console.log('[VISION] Energy Vision:', energyVisionActive ? 'ON' : 'OFF');

  const btn = document.getElementById('vision-btn');
  if (btn) btn.classList.toggle('active', energyVisionActive);

  if (energyVisionActive) {
    showPowerLines();
    showWattLabels();
    showVisionHUD();
    fadeWalls(0.18);
    if (typeof showToast === 'function') showToast('⚡ Energy Vision ON — see the power flow!');
  } else {
    hidePowerLines();
    hideWattLabels();
    hideVisionHUD();
    fadeWalls(0);
    if (typeof showToast === 'function') showToast('Energy Vision OFF');
  }
}

// ═══════════════════════════════════════════════
//  WALL TRANSPARENCY
// ═══════════════════════════════════════════════
function fadeWalls(targetOpacity) {
  // For Energy Vision: make walls semi-transparent (0.18) or fully transparent (0 = inside mode default)
  const allWalls = [];

  if (currentHouseId === '1bhk') {
    allWalls.push(...transparentWalls);
    // Also fade partition walls
    if (typeof pw1 !== 'undefined') allWalls.push(pw1);
    if (typeof pw2 !== 'undefined') allWalls.push(pw2);
  } else if (currentHouseId === '2bhk') {
    allWalls.push(...bhk2TransWalls);
    allWalls.push(...bhk2PartWalls);
  }

  allWalls.forEach(w => {
    if (!w || !w.material) return;
    w.material.transparent = true;
    w.material.opacity = targetOpacity;
    w.material.needsUpdate = true;
  });

  // Roof
  if (currentHouseId === '1bhk') {
    roofMat.opacity = targetOpacity; roofMat.needsUpdate = true;
  } else if (currentHouseId === '2bhk') {
    bhk2RoofMat.opacity = targetOpacity; bhk2RoofMat.needsUpdate = true;
  }
}

// ═══════════════════════════════════════════════
//  SHOW / HIDE POWER LINES
// ═══════════════════════════════════════════════
function showPowerLines() {
  hidePowerLines(); // Clean previous

  const defs = (currentHouseId === '2bhk') ? WIRE_DEFS_2BHK : WIRE_DEFS_1BHK;
  const parentGroup = (currentHouseId === '2bhk') ? bhk2Group : houseGroup;
  const appList = (currentHouseId === '2bhk') ? bhk2Appliances : simpleAppliances;

  defs.forEach(def => {
    // Find matching appliance to check on/off
    const app = appList.find(a => a.name === def.appliance && a.room === def.room);
    const isOn = app ? app.on : false;
    const colorInfo = getWireColor(def.watt, isOn);

    const wireObj = createWire(def.path, colorInfo, parentGroup);
    wireObj.def = def;
    wireObj.isOn = isOn;
    visionWires.push(wireObj);

    // Create orb only for ON appliances
    if (isOn) {
      const orbObj = createOrb(wireObj.curve, colorInfo, parentGroup);
      orbObj.wireIndex = visionWires.length - 1;
      visionOrbs.push(orbObj);
    }
  });
}

function hidePowerLines() {
  const parentGroup = (currentHouseId === '2bhk') ? bhk2Group : houseGroup;

  visionWires.forEach(w => {
    if (w.wire && w.wire.parent) w.wire.parent.remove(w.wire);
    if (w.glow && w.glow.parent) w.glow.parent.remove(w.glow);
    if (w.wire) { w.wire.geometry.dispose(); w.wire.material.dispose(); }
    if (w.glow) { w.glow.geometry.dispose(); w.glow.material.dispose(); }
  });
  visionWires.length = 0;

  visionOrbs.forEach(o => {
    if (o.orb && o.orb.parent) o.orb.parent.remove(o.orb);
    if (o.orb) { o.orb.geometry.dispose(); o.orbMat.dispose(); }
  });
  visionOrbs.length = 0;
}

// ═══════════════════════════════════════════════
//  SHOW / HIDE WATT LABELS
// ═══════════════════════════════════════════════
function showWattLabels() {
  hideWattLabels();

  const defs = (currentHouseId === '2bhk') ? WIRE_DEFS_2BHK : WIRE_DEFS_1BHK;
  const parentGroup = (currentHouseId === '2bhk') ? bhk2Group : houseGroup;
  const appList = (currentHouseId === '2bhk') ? bhk2Appliances : simpleAppliances;

  // De-duplicate by appliance+room
  const seen = new Set();
  defs.forEach(def => {
    const key = def.appliance + '|' + def.room;
    if (seen.has(key)) return;
    seen.add(key);

    const app = appList.find(a => a.name === def.appliance && a.room === def.room);
    const isOn = app ? app.on : false;
    const endPt = def.path[def.path.length - 1];
    const pos = new THREE.Vector3(endPt[0], endPt[1], endPt[2]);

    const label = createWattLabel(def.appliance, def.watt, isOn, pos);
    parentGroup.add(label);
    visionLabels.push(label);
  });
}

function hideWattLabels() {
  visionLabels.forEach(l => {
    if (l.parent) l.parent.remove(l);
  });
  visionLabels.length = 0;
}

// ═══════════════════════════════════════════════
//  SHOW / HIDE HUD
// ═══════════════════════════════════════════════
function showVisionHUD() {
  hideVisionHUD();

  // Calculate total consumption
  const appList = (currentHouseId === '2bhk') ? bhk2Appliances : simpleAppliances;
  let totalOn = 0;
  appList.forEach(a => { if (a.on) totalOn += a.watt; });

  // HUD border glow
  const hud = document.createElement('div');
  hud.id = 'ev-hud';
  hud.innerHTML = '<div class="ev-border"></div>';
  document.body.appendChild(hud);

  // Legend
  const legend = document.createElement('div');
  legend.id = 'ev-legend';
  legend.innerHTML = `
        <div class="ev-legend-title">⚡ Power Load</div>
        <div class="ev-legend-row"><span class="ev-legend-dot" style="background:#FF4500;box-shadow:0 0 8px #FF4500"></span> High (1000W+)</div>
        <div class="ev-legend-row"><span class="ev-legend-dot" style="background:#FFD700;box-shadow:0 0 8px #FFD700"></span> Medium (200-999W)</div>
        <div class="ev-legend-row"><span class="ev-legend-dot" style="background:#00FF88;box-shadow:0 0 8px #00FF88"></span> Low (&lt;200W)</div>
        <div class="ev-legend-row"><span class="ev-legend-dot" style="background:#444"></span> Off</div>
    `;
  document.body.appendChild(legend);

  // Total consumption display
  const total = document.createElement('div');
  total.id = 'ev-total';
  total.innerHTML = `
        <div class="ev-total-label">Live Consumption</div>
        <div class="ev-total-value">${totalOn.toLocaleString()} W</div>
    `;
  document.body.appendChild(total);

  visionHUD = { hud, legend, total };
}

function hideVisionHUD() {
  ['ev-hud', 'ev-legend', 'ev-total'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  visionHUD = null;
}

// ═══════════════════════════════════════════════
//  ANIMATE — called from main.js animate loop
// ═══════════════════════════════════════════════
function animatePowerLines(elapsed) {
  // Pulse wire glow
  visionWires.forEach(w => {
    if (!w.isOn) return;
    const pulse = 0.6 + Math.sin(elapsed * 4) * 0.3;
    w.tubeMat.emissiveIntensity = w.isOn ? pulse * 1.5 : 0.2;
    w.glowMat.opacity = w.isOn ? pulse * 0.2 : 0.05;

    // High-watt wires: color shift  (orange ↔ red)
    if (w.def.watt >= 1000 && w.isOn) {
      const hue = 0.05 + Math.sin(elapsed * 6) * 0.03; // orange-red range
      w.tubeMat.color.setHSL(hue, 1, 0.5);
      w.tubeMat.emissive.setHSL(hue, 1, 0.3);
    }
  });
}

function animateOrbs(delta) {
  visionOrbs.forEach(o => {
    o.progress += o.speed * delta;
    if (o.progress > 1) o.progress = 0;

    const pt = o.curve.getPoint(o.progress);
    o.orb.position.copy(pt);

    // Subtle scale pulse
    const s = 0.8 + Math.sin(o.progress * Math.PI * 4) * 0.3;
    o.orb.scale.setScalar(s);
  });
}

// ═══════════════════════════════════════════════
//  LIVE UPDATE — call when appliance toggled
// ═══════════════════════════════════════════════
function updateEnergyVisionWires() {
  if (!energyVisionActive) return;

  // Rebuild wires with updated on/off states
  showPowerLines();
  showWattLabels();

  // Update HUD total
  if (visionHUD && visionHUD.total) {
    const appList = (currentHouseId === '2bhk') ? bhk2Appliances : simpleAppliances;
    let totalOn = 0;
    appList.forEach(a => { if (a.on) totalOn += a.watt; });
    const val = visionHUD.total.querySelector('.ev-total-value');
    if (val) val.textContent = totalOn.toLocaleString() + ' W';
  }
}

// Make available globally
window.toggleEnergyVision = toggleEnergyVision;
window.updateEnergyVisionWires = updateEnergyVisionWires;

console.log('[POWERLINES] Energy Vision Mode ready — press V to toggle');
