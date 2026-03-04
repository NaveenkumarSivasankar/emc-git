// ═══════════════════════════════════════════════
//  SHINCHAN AVATAR — Chubby kid, red shirt, thick brows
// ═══════════════════════════════════════════════
AvatarManager.register('shinchan', {
  name: 'Shin-Kid',
  speed: 9,
  color: '#e74c3c',
  emoji: '👦',
  buildMesh(group) {
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFDBAC, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.75 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.8 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.7 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
    const browMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 });
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xcc6666, roughness: 0.5 });

    // HEAD — oversized round
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 14), skinMat);
    head.position.y = 2.0; head.castShadow = true; group.add(head);

    // Hair — bowl cut
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.40, 14, 14), hairMat);
    hair.position.y = 2.12; hair.scale.set(1.02, 0.65, 1.02); group.add(hair);

    // Thick eyebrows (signature)
    const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.06), browMat);
    leftBrow.position.set(-0.12, 2.12, 0.33); group.add(leftBrow);
    const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.06), browMat);
    rightBrow.position.set(0.12, 2.12, 0.33); group.add(rightBrow);

    // Eyes — big round
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eyeMat);
    leftEye.position.set(-0.12, 2.02, 0.32); group.add(leftEye);
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eyeMat);
    rightEye.position.set(0.12, 2.02, 0.32); group.add(rightEye);

    // Eye whites
    const whiteEyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const leftEyeW = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), whiteEyeMat);
    leftEyeW.position.set(-0.12, 2.02, 0.30); group.add(leftEyeW);
    const rightEyeW = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), whiteEyeMat);
    rightEyeW.position.set(0.12, 2.02, 0.30); group.add(rightEyeW);

    // Mouth — open smile
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.04), mouthMat);
    mouth.position.set(0, 1.88, 0.34); group.add(mouth);

    // Cheeks — pink blush
    const blushMat = new THREE.MeshStandardMaterial({ color: 0xff9999, roughness: 0.9, transparent: true, opacity: 0.5 });
    const leftCheek = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), blushMat);
    leftCheek.position.set(-0.22, 1.95, 0.28); group.add(leftCheek);
    const rightCheek = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), blushMat);
    rightCheek.position.set(0.22, 1.95, 0.28); group.add(rightCheek);

    // BODY — chubby red shirt
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.55, 0.30), shirtMat);
    torso.position.y = 1.40; torso.castShadow = true; group.add(torso);

    // Shirt collar
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.32), shirtMat);
    collar.position.y = 1.70; group.add(collar);

    // ARMS
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.32, 1.65, 0); group.add(leftArmPivot);
    const leftUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.30, 0.14), shirtMat);
    leftUpperArm.position.set(0, -0.16, 0); leftUpperArm.castShadow = true; leftArmPivot.add(leftUpperArm);
    const leftLowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.12), skinMat);
    leftLowerArm.position.set(0, -0.40, 0); leftArmPivot.add(leftLowerArm);
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), skinMat);
    leftHand.position.set(0, -0.56, 0); leftArmPivot.add(leftHand);

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.32, 1.65, 0); group.add(rightArmPivot);
    const rightUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.30, 0.14), shirtMat);
    rightUpperArm.position.set(0, -0.16, 0); rightUpperArm.castShadow = true; rightArmPivot.add(rightUpperArm);
    const rightLowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.12), skinMat);
    rightLowerArm.position.set(0, -0.40, 0); rightArmPivot.add(rightLowerArm);
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), skinMat);
    rightHand.position.set(0, -0.56, 0); rightArmPivot.add(rightHand);

    // LEGS — short yellow shorts
    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.13, 1.12, 0); group.add(leftLegPivot);
    const leftUpperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.30, 0.16), pantsMat);
    leftUpperLeg.position.set(0, -0.15, 0); leftUpperLeg.castShadow = true; leftLegPivot.add(leftUpperLeg);
    const leftLowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.30, 0.13), skinMat);
    leftLowerLeg.position.set(0, -0.45, 0); leftLegPivot.add(leftLowerLeg);
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.20), shoeMat);
    leftShoe.position.set(0, -0.66, 0.03); leftLegPivot.add(leftShoe);

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.13, 1.12, 0); group.add(rightLegPivot);
    const rightUpperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.30, 0.16), pantsMat);
    rightUpperLeg.position.set(0, -0.15, 0); rightUpperLeg.castShadow = true; rightLegPivot.add(rightUpperLeg);
    const rightLowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.30, 0.13), skinMat);
    rightLowerLeg.position.set(0, -0.45, 0); rightLegPivot.add(rightLowerLeg);
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.20), shoeMat);
    rightShoe.position.set(0, -0.66, 0.03); rightLegPivot.add(rightShoe);

    return {
      leftArm: leftArmPivot,
      rightArm: rightArmPivot,
      leftLeg: leftLegPivot,
      rightLeg: rightLegPivot,
      torso: torso
    };
  }
});
