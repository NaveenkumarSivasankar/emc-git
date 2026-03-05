// ═══════════════════════════════════════════════
//  WALL + ROOF TRANSPARENCY
// ═══════════════════════════════════════════════
function updateWallTransparency() {
    const camPos = camera.position.clone();
    const distSimple = camPos.distanceTo(new THREE.Vector3(-14, 4, 0));
    const tSimple = THREE.MathUtils.clamp((distSimple - 6) / 14, 0, 1);

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
    roomLabels.forEach(label => {
        label.element.style.opacity = 1 - t2BHK;
        label.element.style.display = (1 - t2BHK) > 0.2 ? 'block' : 'none';
    });

    // Hide environment & other house when inside a house
    const insideSimple = tSimple < 0.3;
    const inside2BHK = t2BHK < 0.3;
    environmentGroup.visible = !insideSimple && !inside2BHK;
    bhk2Group.visible = !insideSimple;   // hide 2BHK when inside 1BHK
    houseGroup.visible = !inside2BHK;    // hide 1BHK when inside 2BHK
}

// ═══════════════════════════════════════════════
//  ZOOM HINT
// ═══════════════════════════════════════════════
let hintTimeout;
controls.addEventListener('change', () => {
    const hint = document.getElementById('zoom-hint');
    if (camera.position.distanceTo(controls.target) < 15) {
        if (hint) {
            hint.classList.add('hidden');
        }
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

    // Clouds
    clouds.forEach((cloud, i) => {
        cloud.position.x += delta * (0.3 + i * 0.1);
        if (cloud.position.x > 45) cloud.position.x = -45;
    });

    // Sun
    sunMesh.position.y = 35 + Math.sin(elapsed * 0.1) * 2;
    sunGlow.position.copy(sunMesh.position);
    sunGlow.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.1);

    // ─── BIRDS ANIMATION ───
    birds.forEach(bird => {
        const angle = bird.startAngle + elapsed * bird.circleSpeed;
        bird.group.position.x = bird.circleRadius * Math.cos(angle);
        bird.group.position.z = -10 + bird.circleRadius * Math.sin(angle) * 0.5;
        bird.group.position.y = bird.baseY + Math.sin(elapsed * 0.5 + bird.flapPhase) * bird.bobAmount;

        // Wing flapping
        const flapAngle = Math.sin(elapsed * bird.flapSpeed + bird.flapPhase) * 0.5;
        bird.leftWing.rotation.z = flapAngle;
        bird.rightWing.rotation.z = -flapAngle;

        // Face movement direction
        const nextAngle = angle + 0.01;
        const dx = Math.cos(nextAngle) - Math.cos(angle);
        const dz = Math.sin(nextAngle) - Math.sin(angle);
        bird.group.rotation.y = Math.atan2(dx, dz);
    });

    // 1BHK appliances
    if (!is2BHK) {
        const sa = simpleAppliances;
        if (sa[1].on) fan1.blades.rotation.y += delta * 5;
        if (sa[5].on) tableFan.blades.rotation.z += delta * 8;
        if (sa[3].on) {
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
        ac.particles.visible = sa[3].on;
        if (sa[0].on) {
            light1.bulbMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 3) * 0.3;
            light1.pointLight.intensity = 0.6 + Math.sin(elapsed * 3) * 0.3;
        } else { light1.bulbMat.emissiveIntensity = 0; light1.pointLight.intensity = 0; }
        if (sa[4].on) {
            light2.bulbMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 3) * 0.3;
            light2.pointLight.intensity = 0.6 + Math.sin(elapsed * 3) * 0.3;
        } else { light2.bulbMat.emissiveIntensity = 0; light2.pointLight.intensity = 0; }
    }

    // 2BHK appliances
    if (is2BHK) {
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

    // Boy character animation
    updateBoy(delta);

    // Entry circle pulse animation
    updateEntryCircles(elapsed);

    updateWallTransparency();

    // TV flicker
    [...simpleAppliances, ...bhk2Appliances].forEach(a => {
        if (a.kind === 'tv' && a.on && a.mesh && a.mesh.screen) {
            const noise = 0.8 + Math.random() * 0.4;
            a.mesh.screen.material.emissiveIntensity = noise;
            if (Math.random() > 0.9) {
                a.mesh.screen.material.emissive.setHSL(0.6, 0.4, 0.3 + Math.random() * 0.2);
            }
        }
    });

    // Water animation
    if (waterStream.visible) {
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

// ═══════════════════════════════════════════════
//  RESIZE
// ═══════════════════════════════════════════════
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
