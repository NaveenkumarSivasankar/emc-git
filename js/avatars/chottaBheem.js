// ═══════════════════════════════════════════════
//  CHOTTA BHEEM AVATAR — Strong tan kid, orange dhoti, crown
// ═══════════════════════════════════════════════
AvatarManager.register('chottaBheem', {
  name: 'Strong Kid',
  speed: 7,
  color: '#e67e22',
  emoji: '💪',
  buildMesh(group) {
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xD2A06D, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const dhotiMat = new THREE.MeshStandardMaterial({ color: 0xe67e22, roughness: 0.75 });
    const crownMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.4, metalness: 0.5 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xcc6666, roughness: 0.5 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.6 });
    const wristMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.3, metalness: 0.6 });

    // HEAD — slightly wide
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 14), skinMat);
    head.position.y = 2.10; head.castShadow = true; group.add(head);

    // Hair — short spiky
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.33, 12, 12), hairMat);
    hair.position.y = 2.22; hair.scale.set(1.05, 0.55, 1.02); group.add(hair);

    // Hair spikes
    for (let i = 0; i < 5; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 4), hairMat);
      spike.position.set((i - 2) * 0.08, 2.38, -0.02 + Math.random() * 0.06);
      spike.rotation.z = (i - 2) * 0.15;
      group.add(spike);
    }

    // Crown — gold band + points
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.08, 8), crownMat);
    crown.position.y = 2.38; group.add(crown);
    for (let i = 0; i < 5; i++) {
      const point = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.10, 4), crownMat);
      const angle = (i / 5) * Math.PI * 2;
      point.position.set(Math.cos(angle) * 0.20, 2.47, Math.sin(angle) * 0.20);
      group.add(point);
    }

    // Eyes
    const whiteEyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const leftEyeW = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), whiteEyeMat);
    leftEyeW.position.set(-0.11, 2.10, 0.27); group.add(leftEyeW);
    const rightEyeW = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), whiteEyeMat);
    rightEyeW.position.set(0.11, 2.10, 0.27); group.add(rightEyeW);
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
    leftEye.position.set(-0.10, 2.10, 0.30); group.add(leftEye);
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
    rightEye.position.set(0.10, 2.10, 0.30); group.add(rightEye);

    // Smile
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.03), mouthMat);
    mouth.position.set(0, 1.97, 0.30); group.add(mouth);

    // BODY — muscular torso (bare chest)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.60, 0.30), skinMat);
    torso.position.y = 1.48; torso.castShadow = true; group.add(torso);

    // Chest muscles (subtle bumps)
    const chestL = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 8), skinMat);
    chestL.position.set(-0.10, 1.58, 0.14); chestL.scale.set(1, 0.7, 0.4); group.add(chestL);
    const chestR = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 8), skinMat);
    chestR.position.set(0.10, 1.58, 0.14); chestR.scale.set(1, 0.7, 0.4); group.add(chestR);

    // Belt
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.08, 0.32), beltMat);
    belt.position.y = 1.18; group.add(belt);

    // Belt buckle
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.10, 0.04), crownMat);
    buckle.position.set(0, 1.18, 0.17); group.add(buckle);

    // ARMS — muscular
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.35, 1.72, 0); group.add(leftArmPivot);
    const leftUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.35, 0.16), skinMat);
    leftUpperArm.position.set(0, -0.18, 0); leftUpperArm.castShadow = true; leftArmPivot.add(leftUpperArm);
    const leftLowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.30, 0.14), skinMat);
    leftLowerArm.position.set(0, -0.45, 0); leftArmPivot.add(leftLowerArm);
    // Wrist band
    const leftWrist = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8), wristMat);
    leftWrist.position.set(0, -0.33, 0); leftArmPivot.add(leftWrist);
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), skinMat);
    leftHand.position.set(0, -0.62, 0); leftArmPivot.add(leftHand);

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.35, 1.72, 0); group.add(rightArmPivot);
    const rightUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.35, 0.16), skinMat);
    rightUpperArm.position.set(0, -0.18, 0); rightUpperArm.castShadow = true; rightArmPivot.add(rightUpperArm);
    const rightLowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.30, 0.14), skinMat);
    rightLowerArm.position.set(0, -0.45, 0); rightArmPivot.add(rightLowerArm);
    const rightWrist = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8), wristMat);
    rightWrist.position.set(0, -0.33, 0); rightArmPivot.add(rightWrist);
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), skinMat);
    rightHand.position.set(0, -0.62, 0); rightArmPivot.add(rightHand);

    // LEGS — orange dhoti
    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.14, 1.14, 0); group.add(leftLegPivot);
    const leftUpperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.38, 0.16), dhotiMat);
    leftUpperLeg.position.set(0, -0.19, 0); leftUpperLeg.castShadow = true; leftLegPivot.add(leftUpperLeg);
    const leftLowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.35, 0.14), skinMat);
    leftLowerLeg.position.set(0, -0.55, 0); leftLegPivot.add(leftLowerLeg);
    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.24), skinMat);
    leftFoot.position.set(0, -0.76, 0.04); leftLegPivot.add(leftFoot);

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.14, 1.14, 0); group.add(rightLegPivot);
    const rightUpperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.38, 0.16), dhotiMat);
    rightUpperLeg.position.set(0, -0.19, 0); rightUpperLeg.castShadow = true; rightLegPivot.add(rightUpperLeg);
    const rightLowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.35, 0.14), skinMat);
    rightLowerLeg.position.set(0, -0.55, 0); rightLegPivot.add(rightLowerLeg);
    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.24), skinMat);
    rightFoot.position.set(0, -0.76, 0.04); rightLegPivot.add(rightFoot);

    return {
      leftArm: leftArmPivot,
      rightArm: rightArmPivot,
      leftLeg: leftLegPivot,
      rightLeg: rightLegPivot,
      torso: torso
    };
  }
});
