// ═══════════════════════════════════════════════
//  JACKIE CHAN AVATAR — Tall martial artist, black outfit
// ═══════════════════════════════════════════════
AvatarManager.register('jackieChan', {
  name: 'Kung Fu Master',
  speed: 11,
  color: '#2c3e50',
  emoji: '🥋',
  buildMesh(group) {
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf0c8a0, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const giTopMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.75 });
    const giPantsMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.8 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
    const bandMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.7 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xcc8866, roughness: 0.5 });

    // HEAD — slightly elongated
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 14), skinMat);
    head.position.y = 2.25; head.castShadow = true; group.add(head);

    // Hair — slicked back
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.30, 12, 12), hairMat);
    hair.position.y = 2.35; hair.scale.set(1.0, 0.6, 1.1); group.add(hair);

    // Headband — red
    const headband = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.05, 12), bandMat);
    headband.position.y = 2.30; group.add(headband);
    // Headband tails
    const tail1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.18), bandMat);
    tail1.position.set(-0.05, 2.30, -0.32); tail1.rotation.x = 0.3; group.add(tail1);
    const tail2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.18), bandMat);
    tail2.position.set(0.05, 2.30, -0.32); tail2.rotation.x = 0.4; group.add(tail2);

    // Eyes — narrow determined
    const lEW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    lEW.position.set(-0.09, 2.24, 0.24); group.add(lEW);
    const rEW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    rEW.position.set(0.09, 2.24, 0.24); group.add(rEW);
    const lE = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), eyeMat);
    lE.position.set(-0.09, 2.24, 0.26); group.add(lE);
    const rE = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), eyeMat);
    rE.position.set(0.09, 2.24, 0.26); group.add(rE);

    // Eyebrows — strong
    const browMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const lB = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.03, 0.03), browMat);
    lB.position.set(-0.09, 2.28, 0.24); lB.rotation.z = 0.15; group.add(lB);
    const rB = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.03, 0.03), browMat);
    rB.position.set(0.09, 2.28, 0.24); rB.rotation.z = -0.15; group.add(rB);

    // Mouth — confident smile
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.03), mouthMat);
    mouth.position.set(0, 2.14, 0.26); group.add(mouth);

    // BODY — athletic torso with gi
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.70, 0.28), giTopMat);
    torso.position.y = 1.55; torso.castShadow = true; group.add(torso);

    // Gi lapels — V-neck
    const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.30, 0.03), skinMat);
    lapelL.position.set(-0.08, 1.72, 0.14); lapelL.rotation.z = 0.3; group.add(lapelL);
    const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.30, 0.03), skinMat);
    lapelR.position.set(0.08, 1.72, 0.14); lapelR.rotation.z = -0.3; group.add(lapelR);

    // Belt — black
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.07, 0.30), beltMat);
    belt.position.y = 1.20; group.add(belt);
    // Belt knot
    const knot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.04), beltMat);
    knot.position.set(0.10, 1.14, 0.16); group.add(knot);

    // ARMS — long athletic
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.30, 1.85, 0); group.add(leftArmPivot);
    const lUA = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.38, 0.13), giTopMat);
    lUA.position.set(0, -0.20, 0); lUA.castShadow = true; leftArmPivot.add(lUA);
    const lLA = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.35, 0.11), skinMat);
    lLA.position.set(0, -0.52, 0); leftArmPivot.add(lLA);
    const lH = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
    lH.position.set(0, -0.72, 0); leftArmPivot.add(lH);

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.30, 1.85, 0); group.add(rightArmPivot);
    const rUA = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.38, 0.13), giTopMat);
    rUA.position.set(0, -0.20, 0); rUA.castShadow = true; rightArmPivot.add(rUA);
    const rLA = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.35, 0.11), skinMat);
    rLA.position.set(0, -0.52, 0); rightArmPivot.add(rLA);
    const rH = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
    rH.position.set(0, -0.72, 0); rightArmPivot.add(rH);

    // LEGS — gi pants
    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.13, 1.16, 0); group.add(leftLegPivot);
    const lUL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.42, 0.15), giPantsMat);
    lUL.position.set(0, -0.22, 0); lUL.castShadow = true; leftLegPivot.add(lUL);
    const lLL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.38, 0.13), giPantsMat);
    lLL.position.set(0, -0.60, 0); leftLegPivot.add(lLL);
    const lS = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.22), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 }));
    lS.position.set(0, -0.83, 0.03); leftLegPivot.add(lS);

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.13, 1.16, 0); group.add(rightLegPivot);
    const rUL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.42, 0.15), giPantsMat);
    rUL.position.set(0, -0.22, 0); rUL.castShadow = true; rightLegPivot.add(rUL);
    const rLL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.38, 0.13), giPantsMat);
    rLL.position.set(0, -0.60, 0); rightLegPivot.add(rLL);
    const rS = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.22), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 }));
    rS.position.set(0, -0.83, 0.03); rightLegPivot.add(rS);

    return { leftArm: leftArmPivot, rightArm: rightArmPivot, leftLeg: leftLegPivot, rightLeg: rightLegPivot, torso };
  }
});
