// Cached vector for camera position (avoid clone per frame)
const _camPos = new THREE.Vector3();

function updateWallTransparency() {
    // Skip visibility updates during entry/exit transition
    if (typeof boyState !== 'undefined' && boyState.mode === 'transitioning') return;

    // When indoor, hide roof and other house, but keep walls and doors visible
    if (typeof boyState !== 'undefined' && boyState.mode === 'indoor') {
        if (boyState.insideHouse === '1bhk') {
            transparentWalls.forEach(wall => {
                wall.material.opacity = 0;
                wall.material.transparent = true;
                wall.material.needsUpdate = true;
            });
            roofMat.opacity = 1; roofMat.needsUpdate = true; // Keep roof SOLID to hide objects above
            // Keep door visible (don't set doorMat.opacity to 0)
            labels.forEach(label => {
                label.element.style.opacity = 1;
                label.element.style.display = 'block';
            });
            environmentGroup.visible = false;
            bhk2Group.visible = false;
            if (typeof poleGroup !== 'undefined') poleGroup.visible = false;
            if (typeof entry1BHK !== 'undefined') entry1BHK.visible = false;
            if (typeof entry2BHK !== 'undefined') entry2BHK.visible = false;
        } else if (boyState.insideHouse === '2bhk') {
            bhk2TransWalls.forEach(wall => {
                wall.material.opacity = 0;
                wall.material.transparent = true;
                wall.material.needsUpdate = true;
            });
            bhk2RoofMat.opacity = 1; bhk2RoofMat.needsUpdate = true; // Keep roof SOLID
            // Keep door visible (don't set bhk2DoorMat.opacity to 0)
            roomLabels.forEach(label => {
                label.element.style.opacity = 1;
                label.element.style.display = 'block';
            });
            environmentGroup.visible = false;
            houseGroup.visible = false;
            if (typeof poleGroup !== 'undefined') poleGroup.visible = false;
            if (typeof entry1BHK !== 'undefined') entry1BHK.visible = false;
            if (typeof entry2BHK !== 'undefined') entry2BHK.visible = false;
        }
        return;
    }

    // Outdoor: restore visibility — walls stay SOLID (no camera-distance transparency)
    houseGroup.visible = true;
    bhk2Group.visible = true;
    environmentGroup.visible = true;
    if (typeof poleGroup !== 'undefined') poleGroup.visible = true;
    if (typeof entry1BHK !== 'undefined') entry1BHK.visible = true;
    if (typeof entry2BHK !== 'undefined') entry2BHK.visible = true;

    // Restore wall opacity to full (solid)
    transparentWalls.forEach(wall => {
        wall.material.opacity = 1;
        wall.material.transparent = false;
        wall.material.needsUpdate = true;
    });
    roofMat.opacity = 1; roofMat.needsUpdate = true;
    doorMat.opacity = 1; doorMat.needsUpdate = true;
    labels.forEach(label => {
        label.element.style.opacity = 0;
        label.element.style.display = 'none';
    });

    bhk2TransWalls.forEach(wall => {
        wall.material.opacity = 1;
        wall.material.transparent = false;
        wall.material.needsUpdate = true;
    });
    bhk2RoofMat.opacity = 1; bhk2RoofMat.needsUpdate = true;
    bhk2DoorMat.opacity = 1; bhk2DoorMat.needsUpdate = true;
    bhk2WallMat.opacity = 1; bhk2WallMat.needsUpdate = true;
    roomLabels.forEach(label => {
        label.element.style.opacity = 0;
        label.element.style.display = 'none';
    });
}


// ═══════════════════════════════════════════════
//  ANIMATION LOOP (optimized)
// ═══════════════════════════════════════════════
const clock = new THREE.Clock();
let frameCount = 0;

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    frameCount++;

    controls.update();

    const isIndoor = typeof boyState !== 'undefined' && boyState.mode === 'indoor';

    // Clouds, sun, birds — skip when indoor (invisible objects)
    if (!isIndoor) {
        clouds.forEach((cloud, i) => {
            cloud.position.x += delta * (0.3 + i * 0.1);
            if (cloud.position.x > 45) cloud.position.x = -45;
        });

        sunMesh.position.y = 35 + Math.sin(elapsed * 0.1) * 2;
        sunGlow.position.copy(sunMesh.position);
        sunGlow.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.1);

        birds.forEach(bird => {
            const angle = bird.startAngle + elapsed * bird.circleSpeed;
            bird.group.position.x = bird.circleRadius * Math.cos(angle);
            bird.group.position.z = -10 + bird.circleRadius * Math.sin(angle) * 0.5;
            bird.group.position.y = bird.baseY + Math.sin(elapsed * 0.5 + bird.flapPhase) * bird.bobAmount;
            const flapAngle = Math.sin(elapsed * bird.flapSpeed + bird.flapPhase) * 0.5;
            bird.leftWing.rotation.z = flapAngle;
            bird.rightWing.rotation.z = -flapAngle;
            const nextAngle = angle + 0.01;
            const dx = Math.cos(nextAngle) - Math.cos(angle);
            const dz = Math.sin(nextAngle) - Math.sin(angle);
            bird.group.rotation.y = Math.atan2(dx, dz);
        });
    }

    // Determine which house to animate (skip inactive house for performance)
    const activeHouse = (typeof boyState !== 'undefined' && boyState.mode === 'indoor')
        ? boyState.insideHouse
        : (typeof currentFocusedHouse !== 'undefined' ? currentFocusedHouse : 'simple');

    // 1BHK appliances (only if active)
    if (activeHouse === 'simple' || activeHouse === '1bhk') {
        const sa = simpleAppliances;
        if (sa[1].on) fan1.blades.rotation.y += delta * 5;
        if (sa[5] && sa[5].on && typeof tableFan !== 'undefined') tableFan.blades.rotation.z += delta * 8;
        if (sa[3] && sa[3].on && typeof ac !== 'undefined') {
            const positions = ac.particlePositions;
            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3 + 1] -= delta * 0.5;
                if (positions[i * 3 + 1] < ac.baseY - 3) {
                    positions[i * 3 + 1] = ac.baseY - 0.3;
                    positions[i * 3] = ac.group.position.x + (Math.random() - 0.5) * 2;
                    positions[i * 3 + 2] = ac.group.position.z + 0.5 + Math.random() * 1.5;
                }
            }
            ac.particles.geometry.attributes.position.needsUpdate = true;
        }
        if (typeof ac !== 'undefined') ac.particles.visible = sa[3] ? sa[3].on : false;
        if (sa[0].on) {
            light1.bulbMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 3) * 0.3;
            light1.pointLight.intensity = 0.6 + Math.sin(elapsed * 3) * 0.3;
        } else { light1.bulbMat.emissiveIntensity = 0; light1.pointLight.intensity = 0; }
        if (sa[4] && sa[4].on) {
            light2.bulbMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 3) * 0.3;
            light2.pointLight.intensity = 0.6 + Math.sin(elapsed * 3) * 0.3;
        } else if (sa[4]) { light2.bulbMat.emissiveIntensity = 0; light2.pointLight.intensity = 0; }
    }

    // 2BHK appliances (only if active)
    if (activeHouse === '2bhk') {
        bhk2AnimData.fans.forEach(f => { if (f.on) f.mesh.blades.rotation.y += delta * 5; });
        bhk2AnimData.tableFans.forEach(tf => { if (tf.on) tf.mesh.blades.rotation.z += delta * 8; });
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

    // Solar panels animation
    for (let i = 0; i < solarPanels.length; i++) {
        const p = solarPanels[i];
        if (!p.animating) continue;
        p.frame++;
        const t = Math.min(p.frame / 30, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        p.group.position.y = p.targetY + 14 * (1 - eased);
        if (t >= 1) {
            p.group.position.y = p.targetY;
            p.animating = false;
        }
    }

    // Boy character animation — works in EXTERIOR and INTERIOR states
    updateBoy(delta);

    // Energy flow sphere animation
    if (typeof updateEnergyFlow === 'function') updateEnergyFlow(delta);

    // Entry circle pulse animation
    updateEntryCircles(elapsed);

    // Wall transparency — throttle to every 3rd frame for performance
    if (frameCount % 3 === 0) {
        updateWallTransparency();
    }

    // TV flicker (only for active house)
    const tvList = activeHouse === '2bhk' ? bhk2Appliances : simpleAppliances;
    tvList.forEach(a => {
        if (a.kind === 'tv' && a.on && a.mesh && a.mesh.screen) {
            const noise = 0.8 + Math.random() * 0.4;
            a.mesh.screen.material.emissiveIntensity = noise;
            if (Math.random() > 0.9) {
                a.mesh.screen.material.emissive.setHSL(0.6, 0.4, 0.3 + Math.random() * 0.2);
            }
        }
    });

    // Water animation
    if (typeof waterStream !== 'undefined' && waterStream.visible) {
        waterStream.scale.y = 1 + Math.sin(elapsed * 20) * 0.05;
        waterStream.material.opacity = 0.5 + Math.sin(elapsed * 15) * 0.1;
    }

    labelRenderer.render(scene, camera);
    renderer.render(scene, camera);
}

// ═══════════════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════════════
buildAppliancePanel();
buildRoomNavPanel();
updateStats();
animate();

console.log('[Main] EnergyWorld initialized — all systems active');

// ═══════════════════════════════════════════════
//  RESIZE
// ═══════════════════════════════════════════════
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
