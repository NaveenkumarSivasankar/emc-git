// ═══════════════════════════════════════════════
//  DOREMON AVATAR — Round blue robotic cat, no ears
// ═══════════════════════════════════════════════
AvatarManager.register('doremon', {
  name: 'Robo Cat',
  speed: 8,
  color: '#2980b9',
  emoji: '🤖',
  buildMesh(group) {
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x2980b9, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.4, metalness: 0.2 });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.5 });
    const bellMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.3, metalness: 0.5 });

    // HEAD
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), blueMat);
    head.position.y = 2.10; head.castShadow = true; group.add(head);
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.36, 14, 14), whiteMat);
    face.position.set(0, 2.02, 0.10); face.scale.set(0.85, 0.85, 0.55); group.add(face);

    // Eyes
    const leftEyeW = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), whiteMat);
    leftEyeW.position.set(-0.08, 2.18, 0.30); leftEyeW.scale.set(0.65, 0.9, 0.4); group.add(leftEyeW);
    const rightEyeW = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), whiteMat);
    rightEyeW.position.set(0.08, 2.18, 0.30); rightEyeW.scale.set(0.65, 0.9, 0.4); group.add(rightEyeW);
    const lP = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), eyeMat);
    lP.position.set(-0.05, 2.17, 0.38); group.add(lP);
    const rP = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), eyeMat);
    rP.position.set(0.05, 2.17, 0.38); group.add(rP);

    // Nose + mouth
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), noseMat);
    nose.position.set(0, 2.08, 0.40); group.add(nose);
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const ml = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.15, 0.01), lineMat);
    ml.position.set(0, 1.96, 0.38); group.add(ml);
    const sm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.02), lineMat);
    sm.position.set(0, 1.90, 0.36); group.add(sm);

    // Whiskers
    [[-1, 0.03], [-1, 0], [-1, -0.03], [1, 0.03], [1, 0], [1, -0.03]].forEach(([s, y]) => {
      const w = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.012, 0.012), lineMat);
      w.position.set(s * 0.24, 2.0 + y, 0.28); w.rotation.z = s * (0.1 + y * 2); group.add(w);
    });

    // Collar + bell
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 12), collarMat);
    collar.position.y = 1.72; group.add(collar);
    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), bellMat);
    bell.position.set(0, 1.68, 0.25); group.add(bell);

    // BODY
    const torso = new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 14), blueMat);
    torso.position.y = 1.38; torso.scale.set(1, 1.0, 0.9); torso.castShadow = true; group.add(torso);
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), whiteMat);
    belly.position.set(0, 1.38, 0.12); belly.scale.set(0.85, 0.9, 0.5); group.add(belly);
    const pocket = new THREE.Mesh(new THREE.CircleGeometry(0.10, 12), whiteMat);
    pocket.position.set(0, 1.28, 0.28); group.add(pocket);

    // ARMS
    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.34, 1.55, 0); group.add(leftArmPivot);
    const la = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.40, 0.14), blueMat);
    la.position.set(0, -0.22, 0); la.castShadow = true; leftArmPivot.add(la);
    const lh = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), whiteMat);
    lh.position.set(0, -0.48, 0); leftArmPivot.add(lh);

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.34, 1.55, 0); group.add(rightArmPivot);
    const ra = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.40, 0.14), blueMat);
    ra.position.set(0, -0.22, 0); ra.castShadow = true; rightArmPivot.add(ra);
    const rh = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), whiteMat);
    rh.position.set(0, -0.48, 0); rightArmPivot.add(rh);

    // LEGS
    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.14, 1.05, 0); group.add(leftLegPivot);
    const ll = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.35, 0.16), blueMat);
    ll.position.set(0, -0.18, 0); ll.castShadow = true; leftLegPivot.add(ll);
    const lf = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 8), whiteMat);
    lf.position.set(0, -0.40, 0.04); lf.scale.set(1, 0.5, 1.3); leftLegPivot.add(lf);

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.14, 1.05, 0); group.add(rightLegPivot);
    const rl = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.35, 0.16), blueMat);
    rl.position.set(0, -0.18, 0); rl.castShadow = true; rightLegPivot.add(rl);
    const rf = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 8), whiteMat);
    rf.position.set(0, -0.40, 0.04); rf.scale.set(1, 0.5, 1.3); rightLegPivot.add(rf);

    // Tail
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), noseMat);
    tail.position.set(0, 1.30, -0.30); group.add(tail);

    return { leftArm: leftArmPivot, rightArm: rightArmPivot, leftLeg: leftLegPivot, rightLeg: rightLegPivot, torso };
  }
});
