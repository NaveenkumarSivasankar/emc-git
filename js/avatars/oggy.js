// ═══════════════════════════════════════════════
//  OGGY AVATAR — Blue cartoon cat, round body, pointy ears
// ═══════════════════════════════════════════════
AvatarManager.register('oggy', {
  name: 'Blue Cat',
  speed: 10,
  color: '#3498db',
  emoji: '🐱',
  buildMesh(group) {
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.7 });
    const lightBlueMat = new THREE.MeshStandardMaterial({ color: 0x85c1e9, roughness: 0.7 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.5 });
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xcc5555, roughness: 0.5 });

    // HEAD — large round
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 14), blueMat);
    head.position.y = 2.05; head.castShadow = true; group.add(head);

    // Face area — lighter
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), lightBlueMat);
    face.position.set(0, 2.0, 0.15); face.scale.set(0.8, 0.9, 0.5); group.add(face);

    // EARS — pointy triangles
    const earGeo = new THREE.ConeGeometry(0.12, 0.25, 4);
    const leftEar = new THREE.Mesh(earGeo, blueMat);
    leftEar.position.set(-0.22, 2.42, 0); leftEar.rotation.z = -0.3; group.add(leftEar);
    const rightEar = new THREE.Mesh(earGeo, blueMat);
    rightEar.position.set(0.22, 2.42, 0); rightEar.rotation.z = 0.3; group.add(rightEar);

    // Inner ears
    const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xffb6c1, roughness: 0.8 });
    const innerEarGeo = new THREE.ConeGeometry(0.06, 0.14, 4);
    const leftInnerEar = new THREE.Mesh(innerEarGeo, innerEarMat);
    leftInnerEar.position.set(-0.22, 2.42, 0.02); leftInnerEar.rotation.z = -0.3; group.add(leftInnerEar);
    const rightInnerEar = new THREE.Mesh(innerEarGeo, innerEarMat);
    rightInnerEar.position.set(0.22, 2.42, 0.02); rightInnerEar.rotation.z = 0.3; group.add(rightInnerEar);

    // Eyes — big oval whites
    const leftEyeW = new THREE.Mesh(new THREE.SphereGeometry(0.10, 10, 10), whiteMat);
    leftEyeW.position.set(-0.13, 2.08, 0.28); leftEyeW.scale.set(0.8, 1, 0.5); group.add(leftEyeW);
    const rightEyeW = new THREE.Mesh(new THREE.SphereGeometry(0.10, 10, 10), whiteMat);
    rightEyeW.position.set(0.13, 2.08, 0.28); rightEyeW.scale.set(0.8, 1, 0.5); group.add(rightEyeW);

    // Pupils
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
    leftEye.position.set(-0.11, 2.07, 0.34); group.add(leftEye);
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
    rightEye.position.set(0.11, 2.07, 0.34); group.add(rightEye);

    // Nose — red triangle
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), noseMat);
    nose.position.set(0, 1.98, 0.36); group.add(nose);

    // Mouth
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.03), mouthMat);
    mouth.position.set(0, 1.92, 0.34); group.add(mouth);

    // Whiskers
    const whiskerMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5 });
    [[-1, 0.02], [-1, -0.02], [1, 0.02], [1, -0.02]].forEach(([side, yOff]) => {
      const whisker = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.01, 0.01), whiskerMat);
      whisker.position.set(side * 0.22, 1.96 + yOff, 0.30);
      whisker.rotation.z = side * 0.15;
      group.add(whisker);
    });

    // BODY — round chubby
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.30, 12, 12), blueMat);
    torso.position.y = 1.42; torso.scale.set(1, 1.1, 0.85); torso.castShadow = true; group.add(torso);

    // Belly — white
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), whiteMat);
    belly.position.set(0, 1.38, 0.12); belly.scale.set(0.8, 0.9, 0.5); group.add(belly);

    // ARMS
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.30, 1.60, 0); group.add(leftArmPivot);
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.50, 0.12), blueMat);
    leftArm.position.set(0, -0.28, 0); leftArm.castShadow = true; leftArmPivot.add(leftArm);
    const leftPaw = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), blueMat);
    leftPaw.position.set(0, -0.56, 0); leftArmPivot.add(leftPaw);

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.30, 1.60, 0); group.add(rightArmPivot);
    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.50, 0.12), blueMat);
    rightArm.position.set(0, -0.28, 0); rightArm.castShadow = true; rightArmPivot.add(rightArm);
    const rightPaw = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), blueMat);
    rightPaw.position.set(0, -0.56, 0); rightArmPivot.add(rightPaw);

    // LEGS
    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.12, 1.10, 0); group.add(leftLegPivot);
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.45, 0.14), blueMat);
    leftLeg.position.set(0, -0.25, 0); leftLeg.castShadow = true; leftLegPivot.add(leftLeg);
    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.22), blueMat);
    leftFoot.position.set(0, -0.52, 0.04); leftLegPivot.add(leftFoot);

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.12, 1.10, 0); group.add(rightLegPivot);
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.45, 0.14), blueMat);
    rightLeg.position.set(0, -0.25, 0); rightLeg.castShadow = true; rightLegPivot.add(rightLeg);
    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.22), blueMat);
    rightFoot.position.set(0, -0.52, 0.04); rightLegPivot.add(rightFoot);

    // TAIL
    const tailPivot = new THREE.Group();
    tailPivot.position.set(0, 1.30, -0.25); group.add(tailPivot);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.50, 6), blueMat);
    tail.position.set(0, 0.15, -0.12); tail.rotation.x = -0.8; tailPivot.add(tail);
    const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), blueMat);
    tailTip.position.set(0, 0.38, -0.30); tailPivot.add(tailTip);

    return {
      leftArm: leftArmPivot,
      rightArm: rightArmPivot,
      leftLeg: leftLegPivot,
      rightLeg: rightLegPivot,
      torso: torso
    };
  }
});
