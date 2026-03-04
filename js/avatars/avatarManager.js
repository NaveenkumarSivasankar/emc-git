// ═══════════════════════════════════════════════
//  AVATAR MANAGER — Registry & Dynamic Switching
// ═══════════════════════════════════════════════
const AvatarManager = (() => {
  const registry = {};
  let currentId = null;
  let currentPivots = null;

  return {
    /**
     * Register an avatar definition.
     * @param {string} id   unique key e.g. "shinchan"
     * @param {object} cfg  { name, speed, color, emoji, buildMesh(group) => pivots }
     */
    register(id, cfg) {
      registry[id] = cfg;
    },

    /**
     * Returns array of { id, name, speed, color, emoji }
     */
    getAll() {
      return Object.entries(registry).map(([id, cfg]) => ({
        id,
        name: cfg.name,
        speed: cfg.speed,
        color: cfg.color || '#ffffff',
        emoji: cfg.emoji || '🧑'
      }));
    },

    /**
     * Get current avatar id
     */
    getCurrent() {
      return currentId;
    },

    /**
     * Get current pivots for animation
     */
    getPivots() {
      return currentPivots;
    },

    /**
     * Load an avatar by id — rebuilds boyGroup mesh
     * @param {string} id
     */
    load(id) {
      const cfg = registry[id];
      if (!cfg) { console.warn('Avatar not found:', id); return; }

      // Save current position & rotation
      const pos = boyGroup.position.clone();
      const rot = boyGroup.rotation.clone();
      const scl = boyGroup.scale.clone();

      // Remove all children from boyGroup
      while (boyGroup.children.length > 0) {
        const child = boyGroup.children[0];
        boyGroup.remove(child);
        // Dispose geometry & material
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }

      // Build new mesh
      const pivots = cfg.buildMesh(boyGroup);
      currentPivots = pivots;
      currentId = id;

      // Apply speed
      boyState.speed = cfg.speed || 8;

      // Restore transform
      boyGroup.position.copy(pos);
      boyGroup.rotation.copy(rot);
      boyGroup.scale.copy(scl);

      // Update selector UI highlight
      document.querySelectorAll('.avatar-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.avatarId === id);
      });
    }
  };
})();
