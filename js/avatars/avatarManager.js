// ═══════════════════════════════════════════════
//  AVATAR MANAGER — Registry & Dynamic Switching
// ═══════════════════════════════════════════════
const AvatarManager = (() => {
  const registry = {};
  let currentId = null;
  let currentPivots = null;

  // Deep dispose helper — recursively disposes all geometries/materials
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
        emoji: cfg.emoji || '🧑'
      }));
    },

    getCurrent() {
      return currentId;
    },

    getPivots() {
      return currentPivots;
    },

    load(id) {
      try {
        const cfg = registry[id];
        if (!cfg) { console.warn('Avatar not found:', id); return; }

        // Save current transform
        const pos = boyGroup.position.clone();
        const rot = boyGroup.rotation.clone();
        const scl = boyGroup.scale.clone();

        // Deep dispose all current children
        while (boyGroup.children.length > 0) {
          const child = boyGroup.children[0];
          deepDispose(child);
          boyGroup.remove(child);
        }

        // Build new mesh
        const pivots = cfg.buildMesh(boyGroup);
        currentPivots = pivots;
        currentId = id;

        // Apply speed
        if (typeof boyState !== 'undefined') {
          boyState.speed = cfg.speed || 8;
        }

        // Restore transform
        boyGroup.position.copy(pos);
        boyGroup.rotation.copy(rot);
        boyGroup.scale.copy(scl);

        // Update selector UI highlight
        document.querySelectorAll('.avatar-card').forEach(card => {
          card.classList.toggle('selected', card.dataset.avatarId === id);
        });

        console.log('Avatar loaded:', cfg.name);
      } catch (e) {
        console.error('Avatar load error:', e);
      }
    }
  };
})();
