// ═══════════════════════════════════════════════
//  COMPARISON MODE — Grid vs Solar Split-Screen
//  Full-screen overlay with animated flow diagrams
//  Triggered by C key or button click
// ═══════════════════════════════════════════════

(function () {
    // ─── CSS ───
    const style = document.createElement('style');
    style.textContent = `
        #compare-overlay {
            position: fixed; inset: 0; z-index: 2000;
            display: none; opacity: 0;
            transition: opacity 0.4s ease;
            font-family: 'Outfit', 'Georgia', serif;
        }
        #compare-overlay.active { display: flex; flex-direction: column; }
        #compare-overlay.visible { opacity: 1; }
        .compare-main { flex: 1; display: flex; }
        .compare-side {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            padding: 20px; position: relative; overflow: hidden;
        }
        .compare-left {
            background: linear-gradient(135deg, #1a1a2e, #2d1b4e, #1a1a2e);
        }
        .compare-right {
            background: linear-gradient(135deg, #0d2818, #1a4d2e, #0d2818);
        }
        .compare-divider {
            width: 60px; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            background: linear-gradient(180deg, #333, #555, #333);
            position: relative; z-index: 1;
        }
        .compare-vs {
            background: linear-gradient(135deg, #FF6B35, #F7C948);
            color: #1a1a2e; font-weight: bold; font-size: 1.2rem;
            padding: 10px 14px; border-radius: 50%;
            animation: vsRotate 8s linear infinite;
            box-shadow: 0 0 20px rgba(255,107,53,0.5);
        }
        @keyframes vsRotate { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(360deg)} }
        .compare-title {
            font-size: 1.5rem; font-weight: 800;
            margin-bottom: 10px; text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }
        .compare-left .compare-title { color: #FF6B6B; }
        .compare-right .compare-title { color: #66FF88; }
        .compare-canvas-wrap {
            width: 90%; max-width: 500px; aspect-ratio: 5/3;
            border-radius: 12px; overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .compare-canvas-wrap canvas { width: 100%; height: 100%; }
        .compare-stats {
            display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
            margin-top: 12px; width: 90%; max-width: 500px;
        }
        .compare-stat {
            background: rgba(255,255,255,0.08); border-radius: 8px;
            padding: 8px 12px; text-align: center;
        }
        .compare-stat-label { font-size: 0.7rem; color: #999; }
        .compare-stat-value { font-size: 1.1rem; font-weight: 700; }
        .compare-left .compare-stat-value { color: #FF6B6B; }
        .compare-right .compare-stat-value { color: #66FF88; }
        .compare-bottom {
            display: flex; justify-content: space-around; align-items: center;
            padding: 12px 20px;
            background: linear-gradient(0deg, rgba(0,0,0,0.9), rgba(0,0,0,0.6));
        }
        .compare-bottom-item {
            text-align: center; flex: 1; padding: 6px;
        }
        .compare-bottom-label { font-size: 0.75rem; color: #888; }
        .compare-bottom-value { font-size: 0.95rem; font-weight: 700; }
        .compare-bottom-grid { color: #FF6B6B; }
        .compare-bottom-solar { color: #66FF88; }
        .compare-close {
            position: absolute; top: 10px; right: 15px; z-index: 10;
            background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
            border-radius: 50%; width: 36px; height: 36px;
            color: #fff; font-size: 1.2rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
        }
        .compare-close:hover { background: rgba(255,255,255,0.25); }
    `;
    document.head.appendChild(style);

    // ─── HTML ───
    const overlay = document.createElement('div');
    overlay.id = 'compare-overlay';
    overlay.innerHTML = `
        <button class="compare-close" onclick="toggleCompareMode()">✕</button>
        <div class="compare-main">
            <div class="compare-side compare-left">
                <div class="compare-title">🏭 GRID ELECTRICITY</div>
                <div class="compare-canvas-wrap"><canvas id="compare-grid-canvas" width="600" height="360"></canvas></div>
                <div class="compare-stats">
                    <div class="compare-stat"><div class="compare-stat-label">CO₂ Emitted</div><div class="compare-stat-value" id="grid-co2-counter">0 kg</div></div>
                    <div class="compare-stat"><div class="compare-stat-label">Efficiency</div><div class="compare-stat-value">33%</div></div>
                    <div class="compare-stat"><div class="compare-stat-label">Cost/kWh</div><div class="compare-stat-value">₹8.00</div></div>
                    <div class="compare-stat"><div class="compare-stat-label">Fuel</div><div class="compare-stat-value">Coal/Gas</div></div>
                </div>
            </div>
            <div class="compare-divider"><div class="compare-vs">VS</div></div>
            <div class="compare-side compare-right">
                <div class="compare-title">☀️ SOLAR ELECTRICITY</div>
                <div class="compare-canvas-wrap"><canvas id="compare-solar-canvas" width="600" height="360"></canvas></div>
                <div class="compare-stats">
                    <div class="compare-stat"><div class="compare-stat-label">CO₂ Saved</div><div class="compare-stat-value" id="solar-co2-counter" style="color:#66FF88">0 kg</div></div>
                    <div class="compare-stat"><div class="compare-stat-label">Efficiency</div><div class="compare-stat-value">22%</div></div>
                    <div class="compare-stat"><div class="compare-stat-label">Cost/kWh</div><div class="compare-stat-value">₹2.50</div></div>
                    <div class="compare-stat"><div class="compare-stat-label">Fuel</div><div class="compare-stat-value">Sunlight ☀️</div></div>
                </div>
            </div>
        </div>
        <div class="compare-bottom">
            <div class="compare-bottom-item"><div class="compare-bottom-label">Monthly Cost</div><div class="compare-bottom-value"><span class="compare-bottom-grid">₹3,500</span> vs <span class="compare-bottom-solar">₹700</span></div></div>
            <div class="compare-bottom-item"><div class="compare-bottom-label">CO₂ / Year</div><div class="compare-bottom-value"><span class="compare-bottom-grid">2,400 kg</span> vs <span class="compare-bottom-solar">0 kg</span></div></div>
            <div class="compare-bottom-item"><div class="compare-bottom-label">Reliability</div><div class="compare-bottom-value"><span class="compare-bottom-grid">Cuts ⚡</span> vs <span class="compare-bottom-solar">Battery 🔋</span></div></div>
            <div class="compare-bottom-item"><div class="compare-bottom-label">Future</div><div class="compare-bottom-value"><span class="compare-bottom-grid">Prices ↑</span> vs <span class="compare-bottom-solar">Free fuel ☀️</span></div></div>
        </div>
    `;
    document.body.appendChild(overlay);

    // ─── CANVAS ANIMATIONS ───
    let compareActive = false;
    let compareStartTime = 0;
    let compareRAF = null;

    function drawGridCanvas(time) {
        const canvas = document.getElementById('compare-grid-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 600, 360);

        // Dark industrial background
        ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, 600, 360);

        // Coal plant
        ctx.fillStyle = '#455A64';
        ctx.fillRect(40, 160, 60, 80);
        // Chimney
        ctx.fillRect(55, 100, 20, 60);
        // Smoke
        ctx.fillStyle = '#666';
        for (let s = 0; s < 5; s++) {
            const sy = 80 - s * 15 - Math.sin(time * 2 + s) * 5;
            const sx = 65 + Math.sin(time * 1.5 + s * 0.5) * 8;
            ctx.beginPath(); ctx.arc(sx, sy, 8 + s * 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#FFF'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
        ctx.fillText('Coal Plant', 70, 255);

        // Generator
        ctx.strokeStyle = '#FFC107'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(200, 200, 25, 0, Math.PI * 2); ctx.stroke();
        // Spinning line
        const gAngle = time * 3;
        ctx.beginPath(); ctx.moveTo(200, 200);
        ctx.lineTo(200 + Math.cos(gAngle) * 20, 200 + Math.sin(gAngle) * 20); ctx.stroke();
        ctx.fillText('Generator', 200, 245);
        ctx.fillText('20,000V', 200, 260);

        // Transformer (step up)
        ctx.fillStyle = '#795548'; ctx.fillRect(290, 180, 30, 40);
        ctx.fillText('Step Up', 305, 240);
        ctx.fillText('400kV', 305, 255);

        // Transmission lines
        ctx.strokeStyle = '#FFEB3B'; ctx.lineWidth = 1.5;
        for (let i = 0; i < 3; i++) {
            const y = 170 + i * 12;
            ctx.beginPath(); ctx.moveTo(330, y + 10); ctx.lineTo(470, y + 10);
            ctx.stroke();
        }
        // Towers
        for (let tx of [360, 440]) {
            ctx.strokeStyle = '#888'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(tx, 240); ctx.lineTo(tx - 5, 165); ctx.lineTo(tx + 5, 165); ctx.lineTo(tx, 240); ctx.stroke();
        }
        ctx.fillStyle = '#FFF'; ctx.fillText('Lines', 400, 250);
        ctx.fillText('22% loss!', 400, 265);

        // Step down transformer
        ctx.fillStyle = '#795548'; ctx.fillRect(480, 185, 20, 30);
        ctx.fillStyle = '#FFF'; ctx.fillText('Step Down', 490, 235);
        ctx.fillText('240V', 490, 250);

        // Home
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath(); ctx.moveTo(545, 170); ctx.lineTo(530, 200); ctx.lineTo(560, 200); ctx.fill();
        ctx.fillStyle = '#795548'; ctx.fillRect(533, 200, 24, 20);
        ctx.fillStyle = '#FFF'; ctx.fillText('Home', 545, 240);

        // Animated electricity flow
        const flowDots = 8;
        const pathPoints = [[100, 200], [175, 200], [290, 200], [330, 195], [470, 195], [490, 200], [530, 205]];
        ctx.fillStyle = '#FFD700';
        for (let d = 0; d < flowDots; d++) {
            const progress = ((time * 0.3 + d / flowDots) % 1);
            const segIndex = Math.floor(progress * (pathPoints.length - 1));
            const segProgress = (progress * (pathPoints.length - 1)) - segIndex;
            if (segIndex < pathPoints.length - 1) {
                const x = pathPoints[segIndex][0] + (pathPoints[segIndex + 1][0] - pathPoints[segIndex][0]) * segProgress;
                const y = pathPoints[segIndex][1] + (pathPoints[segIndex + 1][1] - pathPoints[segIndex][1]) * segProgress;
                ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
            }
        }

        // CO₂ counter (red, ticking up)
        const co2 = Math.floor((time) * 8.2);
        ctx.fillStyle = '#FF5722'; ctx.font = 'bold 14px monospace';
        ctx.fillText('CO₂: ' + co2 + ' g emitted', 300, 320);
        const el = document.getElementById('grid-co2-counter');
        if (el) el.textContent = (co2 / 1000).toFixed(1) + ' kg';
    }

    function drawSolarCanvas(time) {
        const canvas = document.getElementById('compare-solar-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 600, 360);

        // Nature background
        const bg = ctx.createLinearGradient(0, 0, 0, 360);
        bg.addColorStop(0, '#87CEEB');
        bg.addColorStop(0.4, '#B3E5FC');
        bg.addColorStop(0.4, '#2E7D32');
        bg.addColorStop(1, '#1B5E20');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, 600, 360);

        // Sun
        ctx.fillStyle = '#FFD700';
        ctx.beginPath(); ctx.arc(300, 50, 30, 0, Math.PI * 2); ctx.fill();
        // Rays
        for (let r = 0; r < 12; r++) {
            const angle = (r / 12) * Math.PI * 2 + time * 0.3;
            ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(300 + Math.cos(angle) * 35, 50 + Math.sin(angle) * 35);
            ctx.lineTo(300 + Math.cos(angle) * 50, 50 + Math.sin(angle) * 50);
            ctx.stroke();
        }

        // Photons falling
        ctx.fillStyle = '#FFD700';
        for (let p = 0; p < 8; p++) {
            const px = 150 + p * 40;
            const py = 80 + ((time * 80 + p * 30) % 60);
            ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
        }

        // Solar panels
        ctx.fillStyle = '#1565C0';
        for (let pi = 0; pi < 4; pi++) {
            ctx.save();
            ctx.translate(140 + pi * 80, 160);
            ctx.rotate(-0.3);
            ctx.fillRect(-25, -8, 50, 16);
            ctx.strokeStyle = '#B0BEC5'; ctx.lineWidth = 1;
            ctx.strokeRect(-25, -8, 50, 16);
            ctx.restore();
        }
        ctx.fillStyle = '#FFF'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
        ctx.fillText('Solar Panels', 300, 185);

        // Controller
        ctx.fillStyle = '#4CAF50'; ctx.fillRect(130, 210, 25, 20);
        ctx.fillStyle = '#FFF'; ctx.fillText('Controller', 142, 245);

        // Battery
        ctx.fillStyle = '#2196F3'; ctx.fillRect(240, 205, 30, 30);
        ctx.fillStyle = '#FFF'; ctx.fillText('🔋 Battery', 255, 250);
        // Charge level animation
        const chargeH = 25 * (0.6 + Math.sin(time) * 0.3);
        ctx.fillStyle = '#4CAF50'; ctx.fillRect(242, 207 + (28 - chargeH), 26, chargeH);

        // Inverter
        ctx.fillStyle = '#FF9800'; ctx.fillRect(370, 210, 25, 20);
        ctx.fillStyle = '#FFF'; ctx.fillText('Inverter', 382, 245);
        ctx.fillText('DC→AC', 382, 258);

        // Home
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath(); ctx.moveTo(500, 190); ctx.lineTo(480, 215); ctx.lineTo(520, 215); ctx.fill();
        ctx.fillStyle = '#795548'; ctx.fillRect(485, 215, 30, 25);
        ctx.fillStyle = '#FFF'; ctx.fillText('Home', 500, 255);

        // Animated flow
        const solarPath = [[300, 165], [142, 195], [142, 210], [255, 210], [382, 210], [500, 215]];
        ctx.fillStyle = '#FFD700';
        for (let d = 0; d < 6; d++) {
            const progress = ((time * 0.3 + d / 6) % 1);
            const si = Math.floor(progress * (solarPath.length - 1));
            const sp = (progress * (solarPath.length - 1)) - si;
            if (si < solarPath.length - 1) {
                const x = solarPath[si][0] + (solarPath[si + 1][0] - solarPath[si][0]) * sp;
                const y = solarPath[si][1] + (solarPath[si + 1][1] - solarPath[si][1]) * sp;
                ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
            }
        }

        // CO₂ saved counter (green)
        const saved = Math.floor((time) * 8.2);
        ctx.fillStyle = '#4CAF50'; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
        ctx.fillText('CO₂ saved: ' + saved + ' g ☀️', 300, 320);
        const el = document.getElementById('solar-co2-counter');
        if (el) el.textContent = (saved / 1000).toFixed(1) + ' kg';

        // Birds
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
        for (let b = 0; b < 3; b++) {
            const bx = 50 + b * 200 + Math.sin(time * 0.5 + b) * 20;
            const by = 30 + Math.sin(time * 0.3 + b * 2) * 10;
            ctx.beginPath();
            ctx.moveTo(bx - 5, by); ctx.quadraticCurveTo(bx - 2, by - 4, bx, by);
            ctx.quadraticCurveTo(bx + 2, by - 4, bx + 5, by);
            ctx.stroke();
        }
    }

    function animateCompare() {
        if (!compareActive) return;
        const time = (Date.now() - compareStartTime) / 1000;
        drawGridCanvas(time);
        drawSolarCanvas(time);
        compareRAF = requestAnimationFrame(animateCompare);
    }

    // ─── TOGGLE ───
    window.toggleCompareMode = function () {
        const ov = document.getElementById('compare-overlay');
        if (!ov) return;
        if (compareActive) {
            ov.classList.remove('visible');
            setTimeout(() => { ov.classList.remove('active'); compareActive = false; }, 400);
            if (compareRAF) cancelAnimationFrame(compareRAF);
        } else {
            compareActive = true;
            compareStartTime = Date.now();
            ov.classList.add('active');
            requestAnimationFrame(() => ov.classList.add('visible'));
            animateCompare();
            // Track for achievements
            if (window.playerProgress) {
                window.playerProgress.comparisonViews = (window.playerProgress.comparisonViews || 0) + 1;
                if (typeof checkBadges === 'function') checkBadges();
            }
        }
    };

    // C key toggle
    window.addEventListener('keydown', (e) => {
        if (e.key === 'c' || e.key === 'C') {
            // Don't trigger if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            toggleCompareMode();
        }
    });

    console.log('[COMPARE] Grid vs Solar comparison mode initialized — press C to toggle');
})();
