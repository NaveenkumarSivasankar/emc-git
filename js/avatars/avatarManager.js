// ═══════════════════════════════════════════════
//  AVATAR MANAGER — Registry, Dynamic Switching & GLB Loading
// ═══════════════════════════════════════════════
const AvatarManager = (() => {
  const registry = {};
  let currentId = null;
  let currentPivots = null;
  let currentMixer = null;
  let currentActions = {};
  let isLoading = false;
  const glbCache = {};
  const loader = typeof THREE !== 'undefined' && THREE.GLTFLoader ? new THREE.GLTFLoader() : null;

  // Deep dispose helper
  function deepDispose(obj) {
    while (obj.children.length > 0) {
      deepDispose(obj.children[0]);
      obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => m.dispose());
      } else {
        obj.material.dispose();
      }
    }
  }

  // Clear current avatar from group
  function clearGroup(group) {
    while (group.children.length > 0) {
      const child = group.children[0];
      deepDispose(child);
      group.remove(child);
    }
  }

  // Find a bone by name patterns in the skeleton
  function findBone(skeleton, patterns) {
    if (!skeleton || !skeleton.bones) return null;
    for (const bone of skeleton.bones) {
      const name = bone.name.toLowerCase();
      for (const pattern of patterns) {
        if (name.includes(pattern.toLowerCase())) return bone;
      }
    }
    return null;
  }

  // Create synthetic pivot groups from GLB model skeleton
  function createPivotsFromSkeleton(model) {
    let skeleton = null;

    // Find SkinnedMesh to get skeleton
    model.traverse(child => {
      if (child.isSkinnedMesh && child.skeleton) {
        skeleton = child.skeleton;
      }
    });

    if (skeleton) {
      const leftArm = findBone(skeleton, ['LeftArm', 'LeftUpperArm', 'L_Arm', 'mixamorig:LeftArm', 'Left_Arm', 'leftShoulder']);
      const rightArm = findBone(skeleton, ['RightArm', 'RightUpperArm', 'R_Arm', 'mixamorig:RightArm', 'Right_Arm', 'rightShoulder']);
      const leftLeg = findBone(skeleton, ['LeftUpLeg', 'LeftUpperLeg', 'L_Leg', 'mixamorig:LeftUpLeg', 'Left_Leg', 'leftUpLeg']);
      const rightLeg = findBone(skeleton, ['RightUpLeg', 'RightUpperLeg', 'R_Leg', 'mixamorig:RightUpLeg', 'Right_Leg', 'rightUpLeg']);
      const spine = findBone(skeleton, ['Spine', 'Spine1', 'mixamorig:Spine', 'torso']);
      const hips = findBone(skeleton, ['Hips', 'mixamorig:Hips', 'pelvis', 'Root']);

      if (leftArm && rightArm && leftLeg && rightLeg) {
        return {
          leftArm: leftArm,
          rightArm: rightArm,
          leftLeg: leftLeg,
          rightLeg: rightLeg,
          torso: spine || hips || model,
          isGLB: true,
          skeleton: skeleton
        };
      }
    }

    // Fallback: create dummy pivots that respond to rotation
    const dummyPivot = () => {
      const g = new THREE.Group();
      g._isDummy = true;
      return g;
    };
    return {
      leftArm: dummyPivot(),
      rightArm: dummyPivot(),
      leftLeg: dummyPivot(),
      rightLeg: dummyPivot(),
      torso: model,
      isGLB: true
    };
  }

  // Show/hide loading overlay
  function showLoading(show) {
    isLoading = show;
    let overlay = document.getElementById('avatar-loading-overlay');
    if (!overlay && show) {
      overlay = document.createElement('div');
      overlay.id = 'avatar-loading-overlay';
      overlay.innerHTML = '<div class="avatar-loading-spinner"></div><div class="avatar-loading-text">Loading Character...</div>';
      document.body.appendChild(overlay);
    }
    if (overlay) {
      overlay.classList.toggle('visible', show);
    }
  }

  return {
    register(id, cfg) {
      registry[id] = cfg;
    },

    getAll() {
      return Object.entries(registry).map(([id, cfg]) => ({
        id,
        name: cfg.name,
        speed: cfg.speed,
        color: cfg.color || '#ffffff',
        emoji: cfg.emoji || '🧑',
        thumbnail: cfg.thumbnail || null,
        isGLB: !!cfg.glbUrl
      }));
    },

    getCurrent() {
      return currentId;
    },

    getPivots() {
      return currentPivots;
    },

    getMixer() {
      return currentMixer;
    },

    getActions() {
      return currentActions;
    },

    isLoading() {
      return isLoading;
    },

    load(id) {
      try {
        const cfg = registry[id];
        if (!cfg) { console.warn('Avatar not found:', id); return; }

        // If this avatar has a GLB URL, load it asynchronously
        if (cfg.glbUrl) {
          this._loadGLB(id, cfg);
          return;
        }

        // Fallback: old shape-based buildMesh
        const pos = boyGroup.position.clone();
        const rot = boyGroup.rotation.clone();
        const scl = boyGroup.scale.clone();

        clearGroup(boyGroup);

        // Stop any current mixer
        if (currentMixer) {
          currentMixer.stopAllAction();
          currentMixer = null;
          currentActions = {};
        }

        const pivots = cfg.buildMesh(boyGroup);
        currentPivots = pivots;
        currentId = id;

        if (typeof boyState !== 'undefined') {
          boyState.speed = cfg.speed || 8;
        }

        boyGroup.position.copy(pos);
        boyGroup.rotation.copy(rot);
        boyGroup.scale.copy(scl);

        document.querySelectorAll('.avatar-card').forEach(card => {
          card.classList.toggle('selected', card.dataset.avatarId === id);
        });

        console.log('Avatar loaded:', cfg.name);
      } catch (e) {
        console.error('Avatar load error:', e);
      }
    },

    _loadGLB(id, cfg) {
      if (!loader) {
        console.warn('GLTFLoader not available, using fallback');
        if (cfg.buildMesh) {
          cfg.glbUrl = null;
          this.load(id);
        }
        return;
      }

      showLoading(true);

      const doLoad = (gltf) => {
        try {
          const pos = boyGroup.position.clone();
          const rot = boyGroup.rotation.clone();
          const scl = boyGroup.scale.clone();

          clearGroup(boyGroup);

          // Stop any current mixer
          if (currentMixer) {
            currentMixer.stopAllAction();
            currentMixer = null;
            currentActions = {};
          }

          const model = gltf.scene.clone();

          // Auto-scale to match character height
          const box = new THREE.Box3().setFromObject(model);
          const modelHeight = box.max.y - box.min.y;
          const targetHeight = cfg.targetHeight || 2.3;
          const scaleFactor = targetHeight / modelHeight;
          model.scale.multiplyScalar(scaleFactor);

          // Re-compute bounding box after scaling
          const scaledBox = new THREE.Box3().setFromObject(model);
          // Center horizontally and position feet at y=0
          model.position.x -= (scaledBox.min.x + scaledBox.max.x) / 2;
          model.position.z -= (scaledBox.min.z + scaledBox.max.z) / 2;
          model.position.y -= scaledBox.min.y;

          // Enable shadows
          model.traverse(child => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.needsUpdate = true;
              }
            }
          });

          boyGroup.add(model);

          // Create pivots from skeleton
          const pivots = createPivotsFromSkeleton(model);
          currentPivots = pivots;
          currentId = id;

          // Setup animation mixer if model has animations
          if (gltf.animations && gltf.animations.length > 0) {
            currentMixer = new THREE.AnimationMixer(model);
            currentActions = {};
            gltf.animations.forEach(clip => {
              const name = clip.name.toLowerCase();
              const action = currentMixer.clipAction(clip);
              if (name.includes('idle') || name.includes('stand')) {
                currentActions.idle = action;
              } else if (name.includes('walk') || name.includes('run')) {
                currentActions.walk = action;
              } else if (name.includes('wave') || name.includes('greet')) {
                currentActions.wave = action;
              }
              // Store first animation as default
              if (!currentActions.default) {
                currentActions.default = action;
              }
            });
            // Play idle by default
            if (currentActions.idle) {
              currentActions.idle.play();
            } else if (currentActions.default) {
              currentActions.default.play();
            }
          }

          if (typeof boyState !== 'undefined') {
            boyState.speed = cfg.speed || 8;
          }

          boyGroup.position.copy(pos);
          boyGroup.rotation.copy(rot);
          boyGroup.scale.copy(scl);

          document.querySelectorAll('.avatar-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.avatarId === id);
          });

          showLoading(false);
          console.log('GLB Avatar loaded:', cfg.name);
        } catch (e) {
          console.error('GLB processing error:', e);
          showLoading(false);
        }
      };

      // Check cache
      if (glbCache[cfg.glbUrl]) {
        doLoad(glbCache[cfg.glbUrl]);
        return;
      }

      loader.load(
        cfg.glbUrl,
        (gltf) => {
          glbCache[cfg.glbUrl] = gltf;
          doLoad(gltf);
        },
        (progress) => {
          if (progress.total > 0) {
            const pct = Math.round((progress.loaded / progress.total) * 100);
            const text = document.querySelector('.avatar-loading-text');
            if (text) text.textContent = `Loading ${cfg.name}... ${pct}%`;
          }
        },
        (error) => {
          console.error('GLB load error:', error, '— trying fallback');
          showLoading(false);
          // Fallback to buildMesh if available
          if (cfg.buildMesh) {
            const tempUrl = cfg.glbUrl;
            cfg.glbUrl = null;
            this.load(id);
            cfg.glbUrl = tempUrl;
          }
        }
      );
    }
  };
})();
