// ═══════════════════════════════════════════════
//  ACHIEVEMENT SYSTEM — Badges, Certificate, Progress
//  Tracks player exploration and awards achievements
// ═══════════════════════════════════════════════

(function () {
    // ─── PLAYER PROGRESS ───
    window.playerProgress = window.playerProgress || {
        visited: {},
        roomsEntered: [],
        appliancesToggled: 0,
        solarPanelsAdded: 0,
        comparisonViews: 0,
        energyVisionUsed: false,
        co2Saved: 0,
        badges: [],
        certificateGenerated: false
    };

    // ─── BADGE DEFINITIONS ───
    const BADGES = [
        { id: 'first_steps', icon: '🏠', name: 'First Steps', desc: 'Enter any building', color: '#4CAF50', check: () => Object.keys(window.playerProgress.visited).length > 0 },
        { id: 'home_explorer', icon: '🗺️', name: 'Home Explorer', desc: 'Visit both houses', color: '#2196F3', check: () => window.playerProgress.visited['1bhk'] && window.playerProgress.visited['2bhk'] },
        { id: 'student_scholar', icon: '📚', name: 'Student Scholar', desc: 'Visit the school', color: '#9C27B0', check: () => window.playerProgress.visited['school'] },
        { id: 'solar_pioneer', icon: '☀️', name: 'Solar Pioneer', desc: 'Add 3+ solar panels', color: '#FF9800', check: () => window.playerProgress.solarPanelsAdded >= 3 },
        { id: 'grid_master', icon: '⚡', name: 'Grid Master', desc: 'Visit the Grid Office', color: '#F44336', check: () => window.playerProgress.visited['grid-office'] },
        { id: 'energy_saver', icon: '💰', name: 'Energy Saver', desc: 'Toggle 5+ appliances', color: '#00BCD4', check: () => window.playerProgress.appliancesToggled >= 5 },
        { id: 'vision_hero', icon: '👁️', name: 'Vision Hero', desc: 'Use Energy Vision mode', color: '#E91E63', check: () => window.playerProgress.energyVisionUsed },
        { id: 'energy_expert', icon: '🎓', name: 'Energy Expert', desc: 'Earn all other badges', color: '#FFD700', check: () => window.playerProgress.badges.length >= 7 },
    ];

    // ─── CSS ───
    const style = document.createElement('style');
    style.textContent = `
        #badge-tray {
            position: fixed; top: 60px; left: 50%; transform: translateX(-50%);
            display: flex; gap: 6px; z-index: 900;
            background: rgba(0,0,0,0.6); padding: 6px 14px; border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(8px);
        }
        .badge-slot {
            width: 34px; height: 34px; border-radius: 50%;
            background: rgba(255,255,255,0.05);
            border: 2px solid rgba(255,255,255,0.15);
            display: flex; align-items: center; justify-content: center;
            font-size: 1rem; filter: grayscale(1) opacity(0.3);
            transition: all 0.3s ease;
            cursor: pointer; position: relative;
        }
        .badge-slot.earned {
            filter: none; opacity: 1;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }
        .badge-slot:hover::after {
            content: attr(data-tooltip);
            position: absolute; bottom: -28px; left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9); color: #FFE066;
            padding: 3px 8px; border-radius: 6px; font-size: 0.65rem;
            white-space: nowrap; pointer-events: none;
            font-family: 'Outfit', sans-serif;
        }
        #badge-popup {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%) scale(0);
            z-index: 3000; text-align: center;
            background: linear-gradient(160deg, #1a1a2e, #2d1b4e);
            border: 3px solid #FFD700;
            border-radius: 20px; padding: 30px 40px;
            box-shadow: 0 0 60px rgba(255,215,0,0.4);
            transition: transform 0.4s cubic-bezier(.34,1.56,.64,1);
            font-family: 'Outfit', serif;
        }
        #badge-popup.show { transform: translate(-50%, -50%) scale(1); }
        .badge-popup-icon { font-size: 3rem; animation: badgeBounce 0.5s ease; }
        .badge-popup-title { color: #FFD700; font-size: 1.5rem; font-weight: 800; margin: 8px 0 4px; }
        .badge-popup-desc { color: #ccc; font-size: 0.9rem; }
        .badge-popup-shine {
            position: absolute; inset: -20px; border-radius: 22px;
            background: radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%);
            animation: shineRotate 2s linear infinite; pointer-events: none;
        }
        @keyframes badgeBounce { 0%{transform:scale(0)} 60%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes shineRotate { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        .badge-particles {
            position: absolute; inset: 0; pointer-events: none; overflow: hidden;
        }
        .badge-particle {
            position: absolute; width: 6px; height: 6px; border-radius: 50%;
            animation: particleBurst 1s ease-out forwards;
        }
        @keyframes particleBurst {
            0% { transform: translate(0,0) scale(1); opacity: 1; }
            100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }

        #certificate-overlay {
            position: fixed; inset: 0; z-index: 4000;
            background: rgba(0,0,0,0.85); display: none;
            align-items: center; justify-content: center;
            flex-direction: column;
        }
        #certificate-overlay.active { display: flex; }
        #certificate-canvas { border-radius: 8px; box-shadow: 0 8px 40px rgba(0,0,0,0.6); max-width: 90vw; max-height: 75vh; }
        .cert-actions { margin-top: 16px; display: flex; gap: 12px; }
        .cert-btn {
            padding: 10px 24px; border: none; border-radius: 30px;
            font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 600;
            cursor: pointer; transition: all 0.2s;
        }
        .cert-btn-download { background: linear-gradient(135deg, #FFD700, #FF9800); color: #1a1a2e; }
        .cert-btn-close { background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
    `;
    document.head.appendChild(style);

    // ─── BADGE TRAY ───
    const tray = document.createElement('div');
    tray.id = 'badge-tray';
    BADGES.forEach(b => {
        const slot = document.createElement('div');
        slot.className = 'badge-slot';
        slot.id = 'badge-' + b.id;
        slot.textContent = b.icon;
        slot.setAttribute('data-tooltip', b.name + ': ' + b.desc);
        slot.style.borderColor = b.color + '40';
        tray.appendChild(slot);
    });
    document.body.appendChild(tray);

    // ─── BADGE POPUP ───
    const popup = document.createElement('div');
    popup.id = 'badge-popup';
    popup.innerHTML = '<div class="badge-popup-shine"></div><div class="badge-particles" id="badge-particles"></div><div class="badge-popup-icon" id="badge-popup-icon"></div><div class="badge-popup-title" id="badge-popup-title"></div><div class="badge-popup-desc" id="badge-popup-desc"></div>';
    document.body.appendChild(popup);

    // ─── CERTIFICATE OVERLAY ───
    const certOverlay = document.createElement('div');
    certOverlay.id = 'certificate-overlay';
    certOverlay.innerHTML = '<canvas id="certificate-canvas" width="1200" height="850"></canvas><div class="cert-actions"><button class="cert-btn cert-btn-download" onclick="downloadCertificate()">📥 Download</button><button class="cert-btn cert-btn-close" onclick="closeCertificate()">✕ Close</button></div>';
    document.body.appendChild(certOverlay);

    // ─── BADGE AWARD ───
    function awardBadge(badge) {
        if (window.playerProgress.badges.includes(badge.id)) return;
        window.playerProgress.badges.push(badge.id);

        // Update tray
        const slot = document.getElementById('badge-' + badge.id);
        if (slot) {
            slot.classList.add('earned');
            slot.style.borderColor = badge.color;
            slot.style.boxShadow = '0 0 12px ' + badge.color + '60';
        }

        // Show popup
        document.getElementById('badge-popup-icon').textContent = badge.icon;
        document.getElementById('badge-popup-title').textContent = badge.name + ' Unlocked!';
        document.getElementById('badge-popup-desc').textContent = badge.desc;
        popup.style.borderColor = badge.color;
        popup.classList.add('show');

        // Particles
        const particleContainer = document.getElementById('badge-particles');
        particleContainer.innerHTML = '';
        const colors = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', badge.color];
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'badge-particle';
            p.style.background = colors[i % colors.length];
            p.style.left = '50%';
            p.style.top = '50%';
            const angle = (i / 20) * Math.PI * 2;
            const dist = 80 + Math.random() * 60;
            p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
            p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
            p.style.animationDelay = (Math.random() * 0.2) + 's';
            particleContainer.appendChild(p);
        }

        // Sound (Web Audio API)
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime + 0.5);
        } catch (e) { /* Audio not available */ }

        // Auto-close popup
        setTimeout(() => popup.classList.remove('show'), 3000);

        console.log('[BADGE] Awarded: ' + badge.name);

        // Check for Energy Expert (all other badges)
        if (window.playerProgress.badges.length === BADGES.length - 1) {
            const expert = BADGES.find(b => b.id === 'energy_expert');
            if (expert && !window.playerProgress.badges.includes('energy_expert')) {
                setTimeout(() => {
                    awardBadge(expert);
                    setTimeout(generateCertificate, 2000);
                }, 3500);
            }
        }
    }

    // ─── CHECK BADGES ───
    window.checkBadges = function () {
        BADGES.forEach(b => {
            if (!window.playerProgress.badges.includes(b.id) && b.check()) {
                awardBadge(b);
            }
        });
    };

    // ─── CERTIFICATE GENERATION ───
    function generateCertificate() {
        if (window.playerProgress.certificateGenerated) return;
        window.playerProgress.certificateGenerated = true;

        const canvas = document.getElementById('certificate-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Background
        const bg = ctx.createLinearGradient(0, 0, 1200, 850);
        bg.addColorStop(0, '#0D1B2A');
        bg.addColorStop(0.5, '#1A2744');
        bg.addColorStop(1, '#0D1B2A');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, 1200, 850);

        // Ornate border
        ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 4;
        ctx.strokeRect(30, 30, 1140, 790);
        ctx.strokeStyle = '#C0A030'; ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, 1120, 770);
        // Corner flourishes
        const corners = [[40, 40], [1160, 40], [40, 810], [1160, 810]];
        corners.forEach(([cx, cy]) => {
            ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#FFD700'; ctx.fill();
        });

        // Title
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 42px Georgia, serif'; ctx.textAlign = 'center';
        ctx.fillText('🎓 ENERGY EXPERT CERTIFICATE 🎓', 600, 120);

        // Subtitle
        ctx.fillStyle = '#B0BEC5'; ctx.font = '18px Georgia, serif';
        ctx.fillText('Sustain-ED Energy Education Program', 600, 165);

        // Horizontal rule
        ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(200, 190); ctx.lineTo(1000, 190); ctx.stroke();

        // Body text
        ctx.fillStyle = '#FFFFFF'; ctx.font = '20px Georgia, serif';
        ctx.fillText('This is to certify that the student has successfully', 600, 250);
        ctx.fillText('completed the EnergyWorld exploration program', 600, 285);
        ctx.fillText('and demonstrated understanding of:', 600, 320);

        // Topics (with checkmarks)
        ctx.font = '16px Georgia, serif'; ctx.textAlign = 'left';
        const topics = [
            '✅ Electricity generation and distribution',
            '✅ Solar energy conversion (photovoltaic effect)',
            '✅ Power grid operations and transmission',
            '✅ Energy conservation strategies',
            '✅ Cost comparison: Grid vs Solar',
            '✅ Environmental impact of energy choices',
        ];
        topics.forEach((t, i) => {
            ctx.fillStyle = i % 2 === 0 ? '#A5D6A7' : '#81D4FA';
            ctx.fillText(t, 300, 370 + i * 30);
        });

        // Badges earned
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 18px Georgia, serif';
        ctx.fillText('Badges Earned:', 600, 580);
        BADGES.forEach((b, i) => {
            const bx = 250 + i * 90;
            ctx.font = '24px sans-serif';
            ctx.fillText(b.icon, bx, 620);
            ctx.font = '9px Georgia, serif'; ctx.fillStyle = '#999';
            ctx.fillText(b.name, bx, 640);
            ctx.fillStyle = '#FFD700';
        });

        // Footer
        ctx.fillStyle = '#FFD700'; ctx.font = 'italic 14px Georgia, serif'; ctx.textAlign = 'center';
        const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillText('Awarded on ' + dateStr, 600, 720);
        ctx.fillText('Sustain-ED — Energy for Everyone', 600, 750);

        // Sun emblem
        ctx.fillStyle = '#FFD700';
        ctx.beginPath(); ctx.arc(600, 770, 0, 0, 0); // placeholder
        ctx.font = '32px sans-serif';
        ctx.fillText('☀️', 600, 800);

        // Show overlay
        certOverlay.classList.add('active');
    }

    window.downloadCertificate = function () {
        const canvas = document.getElementById('certificate-canvas');
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'EnergyExpert-Certificate.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    window.closeCertificate = function () {
        certOverlay.classList.remove('active');
    };

    // ─── TRACK VISITS ───
    window.trackBuildingVisit = function (buildingId) {
        if (!window.playerProgress.visited[buildingId]) {
            window.playerProgress.visited[buildingId] = true;
            console.log('[PROGRESS] Visited: ' + buildingId);
            checkBadges();
        }
    };

    // ─── TRACK APPLIANCE TOGGLE ───
    window.addEventListener('applianceToggled', () => {
        window.playerProgress.appliancesToggled++;
        checkBadges();
    });

    console.log('[ACHIEVEMENTS] System initialized — 8 badges, certificate generation enabled');
})();
