// ═══════════════════════════════════════════════
//  APEXCHARTS ENERGY DASHBOARD — v2
//  Clean 4-section layout for kids
// ═══════════════════════════════════════════════
let chartInstances = [];
let currentEnergyData = [];

function destroyAllCharts() {
    chartInstances.forEach(c => { try { c.destroy(); } catch (e) { } });
    chartInstances = [];
}

// ─── OPEN MODAL ───────────────────────────────
function openEnergyModal() {
    const modal = document.getElementById('energy-modal');
    if (!modal) return;

    // Determine which house data to show based on boy's current location
    let appliancesList;
    let modalHouseLabel;

    if (typeof boyState !== 'undefined' && boyState.mode === 'indoor') {
        if (boyState.insideHouse === '1bhk') {
            appliancesList = simpleAppliances;
            modalHouseLabel = '🏠 1BHK House';
        } else if (boyState.insideHouse === '2bhk') {
            appliancesList = bhk2Appliances;
            modalHouseLabel = '🏠 2BHK House';
        } else {
            appliancesList = is2BHK ? bhk2Appliances : simpleAppliances;
            modalHouseLabel = is2BHK ? '🏠 2BHK House' : '🏠 1BHK House';
        }
    } else {
        // Outdoor or fallback — use current selected house
        appliancesList = is2BHK ? bhk2Appliances : simpleAppliances;
        modalHouseLabel = is2BHK ? '🏠 2BHK House' : '🏠 1BHK House';
    }

    const data = getApplianceEnergyData(appliancesList);
    window._currentModalHouseLabel = modalHouseLabel;

    // When outdoors, store which house is selected for switching
    if (typeof boyState !== 'undefined' && boyState.mode !== 'indoor') {
        window._outdoorSelectedHouse = is2BHK ? '2bhk' : '1bhk';
    }

    if (data.length === 0) {
        alert('⚡ No active appliances! Turn on some appliances first.');
        return;
    }

    currentEnergyData = data;
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';

    const totalMonthlyUnits = data.reduce((s, d) => s + d.perMonth, 0);
    const totalWeeklyUnits = data.reduce((s, d) => s + d.perWeek, 0);
    const totalDailyUnits = data.reduce((s, d) => s + d.perDay, 0);
    const totalBill = calculateTNTariffCost(totalMonthlyUnits);
    const weeklyBill = calculateTNTariffCost(totalWeeklyUnits);
    const solarKW = (typeof currentPanelCount !== 'undefined' ? currentPanelCount : 0) * 0.35;

    destroyAllCharts();

    const content = document.getElementById('energy-modal-body');
    content.innerHTML = buildDashboardHTML(data, totalDailyUnits, totalWeeklyUnits, totalMonthlyUnits, weeklyBill, totalBill, solarKW, window._currentModalHouseLabel);

    setTimeout(() => {
        renderBarChart(data);
        renderPieChart(data);
        renderDonutChart(data);
        renderLineChart(data);
        animateNetZeroBar(solarKW, totalMonthlyUnits);
    }, 150);
}

// ─── CLOSE MODAL ──────────────────────────────
function closeEnergyModal() {
    const modal = document.getElementById('energy-modal');
    if (modal) {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
    }
    destroyAllCharts();
    currentEnergyData = [];
}

function switchModalHouse(houseId) {
    window._outdoorSelectedHouse = houseId;

    // Determine appliance list for selected house
    const appliancesList = (houseId === '2bhk') ? bhk2Appliances : simpleAppliances;
    const houseLabel = (houseId === '2bhk') ? '🏠 2BHK House' : '🏠 1BHK House';
    window._currentModalHouseLabel = houseLabel;

    const data = getApplianceEnergyData(appliancesList);
    if (data.length === 0) return;

    currentEnergyData = data;

    const totalMonthlyUnits = data.reduce((s, d) => s + d.perMonth, 0);
    const totalWeeklyUnits = data.reduce((s, d) => s + d.perWeek, 0);
    const totalDailyUnits = data.reduce((s, d) => s + d.perDay, 0);
    const totalBill = calculateTNTariffCost(totalMonthlyUnits);
    const weeklyBill = calculateTNTariffCost(totalWeeklyUnits);
    const solarKW = (typeof currentPanelCount !== 'undefined' ? currentPanelCount : 0) * 0.35;

    destroyAllCharts();

    const content = document.getElementById('energy-modal-body');
    content.innerHTML = buildDashboardHTML(
        data, totalDailyUnits, totalWeeklyUnits,
        totalMonthlyUnits, weeklyBill, totalBill,
        solarKW, houseLabel
    );

    setTimeout(() => {
        renderBarChart(data);
        renderPieChart(data);
        renderDonutChart(data);
        renderLineChart(data);
        animateNetZeroBar(solarKW, totalMonthlyUnits);
    }, 150);
}

// ═══════════════════════════════════════════════
//  SECTION BUILDER
// ═══════════════════════════════════════════════
function buildDashboardHTML(data, dailyU, weeklyU, monthlyU, weeklyBill, monthlyBill, solarKW, houseLabel) {
    const houseName = houseLabel || (is2BHK ? '2BHK' : '1BHK');
    const nz = calculateNetZero(monthlyU, solarKW);
    const netZeroNeeded = Math.max(0, Math.ceil(monthlyU - nz.solarMonthly));

    return '' +

        // ── House Identity Banner ──
        '<div class="house-banner">' +
        '<span class="house-banner-icon">🏠</span>' +
        '<span class="house-banner-title">' + houseName + ' Energy Report</span>' +
        '<span class="house-banner-sub">Showing appliances for this house only</span>' +
        '</div>' +

        // ── House Switcher (outdoor only) ──
        (typeof boyState !== 'undefined' && boyState.mode !== 'indoor' ?
            '<div class="house-switcher">' +
            '<div class="hs-label">👇 Pick a house to explore!</div>' +
            '<div class="hs-tabs">' +
            '<button class="hs-tab ' + (window._outdoorSelectedHouse !== '2bhk' ? 'hs-tab-active' : '') + '" onclick="switchModalHouse(\'1bhk\')">' +
            '<span class="hs-tab-icon">�</span>' +
            '<span class="hs-tab-name">1BHK</span>' +
            '<span class="hs-tab-sub">Small Home</span>' +
            '</button>' +
            '<div class="hs-vs">VS</div>' +
            '<button class="hs-tab ' + (window._outdoorSelectedHouse === '2bhk' ? 'hs-tab-active' : '') + '" onclick="switchModalHouse(\'2bhk\')">' +
            '<span class="hs-tab-icon">🏠</span>' +
            '<span class="hs-tab-name">2BHK</span>' +
            '<span class="hs-tab-sub">Big Home</span>' +
            '</button>' +
            '</div>' +
            '</div>'
            : '')
        +

        // ── Kids Comparison (outdoor only) ──
        (typeof boyState !== 'undefined' && boyState.mode !== 'indoor' ?
            (function () {
                const bhk1Data = getApplianceEnergyData(simpleAppliances);
                const bhk2Data = getApplianceEnergyData(bhk2Appliances);
                const bhk1Units = bhk1Data.reduce((s, d) => s + d.perMonth, 0);
                const bhk2Units = bhk2Data.reduce((s, d) => s + d.perMonth, 0);
                const bhk1Bill = calculateTNTariffCost(bhk1Units);
                const bhk2Bill = calculateTNTariffCost(bhk2Units);
                const winner = bhk1Units < bhk2Units ? '1BHK' : '2BHK';
                const bhk1Pct = Math.round((bhk1Units / (bhk1Units + bhk2Units)) * 100);
                const bhk2Pct = 100 - bhk1Pct;
                return (
                    '<div class="kids-compare">' +

                    '<div class="kc-title">⚡ Which house uses MORE electricity?</div>' +

                    '<div class="kc-houses">' +

                    '<div class="kc-house ' + (winner === '1BHK' ? 'kc-loser' : 'kc-winner') + '">' +
                    '<div class="kc-house-icon">🏡</div>' +
                    '<div class="kc-house-name">1BHK</div>' +
                    '<div class="kc-house-units">' + bhk1Units.toFixed(0) + ' <small>units/mo</small></div>' +
                    '<div class="kc-house-bill">₹' + bhk1Bill + '/month</div>' +
                    '<div class="kc-badge">' + (winner === '1BHK' ? '🌟 Energy Saver!' : '⚠️ Uses More!') + '</div>' +
                    '</div>' +

                    '<div class="kc-vs-col">' +
                    '<div class="kc-vs-text">VS</div>' +
                    '<div class="kc-diff">' +
                    '<div class="kc-diff-label">Difference</div>' +
                    '<div class="kc-diff-value">+' + Math.abs(bhk1Units - bhk2Units).toFixed(0) + ' units</div>' +
                    '</div>' +
                    '</div>' +

                    '<div class="kc-house ' + (winner === '2BHK' ? 'kc-loser' : 'kc-winner') + '">' +
                    '<div class="kc-house-icon">🏠</div>' +
                    '<div class="kc-house-name">2BHK</div>' +
                    '<div class="kc-house-units">' + bhk2Units.toFixed(0) + ' <small>units/mo</small></div>' +
                    '<div class="kc-house-bill">₹' + bhk2Bill + '/month</div>' +
                    '<div class="kc-badge">' + (winner === '2BHK' ? '🌟 Energy Saver!' : '⚠️ Uses More!') + '</div>' +
                    '</div>' +

                    '</div>' +

                    '<div class="kc-bar-label">Energy Usage Comparison</div>' +
                    '<div class="kc-bar-track">' +
                    '<div class="kc-bar-fill kc-bar-1bhk" style="width:' + bhk1Pct + '%">' +
                    '<span>1BHK ' + bhk1Pct + '%</span>' +
                    '</div>' +
                    '<div class="kc-bar-fill kc-bar-2bhk" style="width:' + bhk2Pct + '%">' +
                    '<span>2BHK ' + bhk2Pct + '%</span>' +
                    '</div>' +
                    '</div>' +

                    '<div class="kc-fun-fact">🧠 <b>Did you know?</b> A bigger house usually needs more electricity because it has more rooms and appliances!</div>' +

                    '</div>'
                );
            })()
            : '')
        +

        // ═══ SECTION 1: SUMMARY CARDS ═══
        '<div class="section-label"><span>📋</span> Overview</div>' +
        '<div class="summary-cards">' +

        '<div class="s-card blue">' +
        '<div class="s-card-icon">⚡</div>' +
        '<div class="s-card-body">' +
        '<div class="s-card-label">Weekly Energy</div>' +
        '<div class="s-card-value">' + weeklyU.toFixed(1) + '</div>' +
        '<div class="s-card-unit">units</div>' +
        '<div class="s-card-sub">₹' + weeklyBill + ' / week</div>' +
        '</div>' +
        '</div>' +

        '<div class="s-card green">' +
        '<div class="s-card-icon">💡</div>' +
        '<div class="s-card-body">' +
        '<div class="s-card-label">Monthly Energy</div>' +
        '<div class="s-card-value">' + monthlyU.toFixed(1) + '</div>' +
        '<div class="s-card-unit">units</div>' +
        '<div class="s-card-sub">' + data.length + ' appliances active</div>' +
        '</div>' +
        '</div>' +

        '<div class="s-card orange">' +
        '<div class="s-card-icon">💰</div>' +
        '<div class="s-card-body">' +
        '<div class="s-card-label">Monthly Bill</div>' +
        '<div class="s-card-value">₹' + monthlyBill + '</div>' +
        '<div class="s-card-unit">estimated</div>' +
        '<div class="s-card-sub">TN Tariff Applied</div>' +
        '</div>' +
        '</div>' +

        '<div class="s-card ' + (nz.isNetZero ? 'green' : 'red') + '">' +
        '<div class="s-card-icon">🌞</div>' +
        '<div class="s-card-body">' +
        '<div class="s-card-label">Net Zero Goal</div>' +
        '<div class="s-card-value">' + (nz.isNetZero ? '✅' : netZeroNeeded) + '</div>' +
        '<div class="s-card-unit">' + (nz.isNetZero ? 'Achieved!' : 'units needed') + '</div>' +
        '<div class="s-card-sub">Solar: ' + nz.solarMonthly.toFixed(0) + ' units/mo</div>' +
        '</div>' +
        '</div>' +

        '</div>' +

        // ── Tariff Reference ──
        '<div class="tariff-strip">' +
        '<span class="tariff-title">📋 TN Electricity Tariff:</span>' +
        '<span class="slab free">0-100 units = Free</span>' +
        '<span class="slab s1">101-200 = ₹1.5</span>' +
        '<span class="slab s2">201-500 = ₹3</span>' +
        '<span class="slab s3">501-1000 = ₹4.5</span>' +
        '</div>' +

        // ═══ SECTION 2: MAIN BAR CHART ═══
        '<div class="section-label"><span>📊</span> Energy Consumption by Appliance</div>' +
        '<div class="section-hint">👆 Click any bar to learn how the calculation works!</div>' +
        '<div class="chart-panel main-chart">' +
        '<div id="chart-bar"></div>' +
        '</div>' +

        // ═══ SECTION 3: DISTRIBUTION CHARTS ═══
        '<div class="section-label"><span>🔍</span> Energy Distribution</div>' +
        '<div class="distribution-row">' +
        '<div class="chart-panel half">' +
        '<h3 class="chart-heading">🥧 Energy Share by Appliance</h3>' +
        '<p class="chart-desc">Which appliance uses the most electricity?</p>' +
        '<div id="chart-pie"></div>' +
        '</div>' +
        '<div class="chart-panel half">' +
        '<h3 class="chart-heading">🍩 Cost Share by Appliance</h3>' +
        '<p class="chart-desc">Which appliance costs the most money?</p>' +
        '<div id="chart-donut"></div>' +
        '</div>' +
        '</div>' +

        // ── Line Chart ──
        '<div class="chart-panel main-chart">' +
        '<h3 class="chart-heading">📈 Energy Growth: Day → Week → Month</h3>' +
        '<div id="chart-line"></div>' +
        '</div>' +

        // ═══ SECTION 4: NET ZERO PANEL ═══
        '<div class="section-label"><span>🌞</span> Net Zero Energy Goal</div>' +
        '<div class="netzero-panel">' +
        '<div class="nz-stats">' +
        '<div class="nz-stat">' +
        '<div class="nz-stat-icon">🏠</div>' +
        '<div class="nz-stat-label">House Consumption</div>' +
        '<div class="nz-stat-value">' + monthlyU.toFixed(0) + ' <small>units/month</small></div>' +
        '</div>' +
        '<div class="nz-vs">VS</div>' +
        '<div class="nz-stat">' +
        '<div class="nz-stat-icon">☀️</div>' +
        '<div class="nz-stat-label">Solar Generation</div>' +
        '<div class="nz-stat-value">' + nz.solarMonthly.toFixed(0) + ' <small>units/month</small></div>' +
        '</div>' +
        '</div>' +
        '<div class="nz-progress-label">' +
        '<span>Progress to Net Zero</span>' +
        '<span id="nz-pct-text">0%</span>' +
        '</div>' +
        '<div class="nz-track">' +
        '<div class="nz-fill" id="netzero-fill" style="width:0%"></div>' +
        '</div>' +
        '<div class="nz-formula">' +
        '☀️ Formula: ' + nz.solarKW.toFixed(1) + ' kW × 4 units/day × 30 days = <b>' + nz.solarMonthly.toFixed(0) + ' units/month</b>' +
        '</div>' +
        '<div id="netzero-message" class="nz-message"></div>' +
        '</div>' +

        // ── Kids Energy Report Card ──
        '<div class="kids-score-card">' +
        '<div class="ksc-title">🏆 Your Energy Report Card</div>' +
        '<div class="ksc-scores">' +

        '<div class="ksc-item">' +
        '<div class="ksc-icon">⚡</div>' +
        '<div class="ksc-label">Daily Usage</div>' +
        '<div class="ksc-value">' + dailyU.toFixed(1) + ' units</div>' +
        '<div class="ksc-grade ' + (dailyU < 5 ? 'grade-a' : dailyU < 10 ? 'grade-b' : 'grade-c') + '">' +
        (dailyU < 5 ? '🌟 A+ Excellent' : dailyU < 10 ? '👍 B Good' : '⚠️ C Save More') +
        '</div>' +
        '</div>' +

        '<div class="ksc-item">' +
        '<div class="ksc-icon">💰</div>' +
        '<div class="ksc-label">Monthly Bill</div>' +
        '<div class="ksc-value">₹' + monthlyBill + '</div>' +
        '<div class="ksc-grade ' + (monthlyBill < 200 ? 'grade-a' : monthlyBill < 500 ? 'grade-b' : 'grade-c') + '">' +
        (monthlyBill < 200 ? '🌟 A+ Super Saver' : monthlyBill < 500 ? '👍 B Average' : '⚠️ C High Bill') +
        '</div>' +
        '</div>' +

        '<div class="ksc-item">' +
        '<div class="ksc-icon">🌍</div>' +
        '<div class="ksc-label">CO₂ Impact</div>' +
        '<div class="ksc-value">' + (monthlyU * 0.82).toFixed(1) + ' kg</div>' +
        '<div class="ksc-grade grade-info">🌱 Plant ' + Math.ceil(monthlyU * 0.82 / 21) + ' trees to offset!</div>' +
        '</div>' +

        '</div>' +
        '<div class="ksc-tip">💡 <b>Pro Tip:</b> Turn off lights when leaving a room — it saves ₹' +
        Math.round(60 / 1000 * 8 * 30 * 3) + ' every month!</div>' +
        '</div>' +

        // ── Learning Panel (slide-in, hidden) ──
        '<div id="learn-panel" class="learn-panel">' +
        '<button class="learn-close" onclick="closeLearningPanel()">✕</button>' +
        '<h3 class="learn-title">🎓 How is this calculated?</h3>' +
        '<div id="learn-appliance-name" class="learn-appliance-name"></div>' +
        '<div id="learn-steps"></div>' +
        '</div>';
}

// ─── ANIMATE NET ZERO BAR ─────────────────────
function animateNetZeroBar(solarKW, totalMonthly) {
    const nz = calculateNetZero(totalMonthly, solarKW);
    const fill = document.getElementById('netzero-fill');
    const msg = document.getElementById('netzero-message');
    const pctText = document.getElementById('nz-pct-text');

    if (fill) {
        setTimeout(() => {
            fill.style.width = nz.percentage + '%';
            // Color: green=achieved, yellow=close, red=far
            if (nz.isNetZero) {
                fill.className = 'nz-fill nz-green';
            } else if (nz.percentage >= 50) {
                fill.className = 'nz-fill nz-yellow';
            } else {
                fill.className = 'nz-fill nz-red';
            }
        }, 400);
    }
    if (pctText) {
        setTimeout(() => { pctText.textContent = nz.percentage + '%'; }, 600);
    }

    if (msg) {
        if (nz.isNetZero) {
            msg.className = 'nz-message nz-msg-green';
            msg.innerHTML = '🎉 <b>Great!</b> This house can achieve Net Zero Energy!';
        } else if (solarKW === 0) {
            msg.className = 'nz-message nz-msg-yellow';
            msg.innerHTML = '☀️ <b>Add solar panels</b> to start your Net Zero journey!';
        } else {
            msg.className = 'nz-message nz-msg-red';
            msg.innerHTML = '💡 <b>Try reducing AC usage</b> or adding more panels! Need <b>' + Math.ceil(nz.deficit) + '</b> more units.';
        }
    }
}

// ─── LEARNING PANEL ───────────────────────────
function showLearningPanel(dataIndex) {
    const d = currentEnergyData[dataIndex];
    if (!d) return;
    const panel = document.getElementById('learn-panel');
    const nameEl = document.getElementById('learn-appliance-name');
    const stepsEl = document.getElementById('learn-steps');
    if (nameEl) nameEl.innerHTML = '💡 ' + d.name + ' <span>(' + d.watts + 'W, ' + d.hoursPerDay + ' hrs/day)</span>';
    if (stepsEl) stepsEl.innerHTML = generateLearningSteps(d);
    if (panel) panel.classList.add('visible');
}

function closeLearningPanel() {
    const panel = document.getElementById('learn-panel');
    if (panel) panel.classList.remove('visible');
}

// ═══════════════════════════════════════════════
//  CHART CONFIGS
// ═══════════════════════════════════════════════
const CHART_COLORS = [
    '#5B8DEF', '#F5A623', '#2ECC8B', '#FF6B6B',
    '#A78BFA', '#F472B6', '#22D3EE', '#FBBF24',
    '#818CF8', '#FB923C', '#38BDF8', '#6EE7B7',
    '#FCA5A5', '#93C5FD', '#D1D5DB'
];

function chartBase() {
    return {
        chart: {
            background: 'transparent',
            fontFamily: 'Outfit, sans-serif',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 1200,
                animateGradually: { enabled: true, delay: 120 },
                dynamicAnimation: { enabled: true, speed: 600 }
            },
            toolbar: { show: false },
            dropShadow: { enabled: false }
        },
        theme: { mode: 'dark' },
        grid: {
            borderColor: 'rgba(255,255,255,0.05)',
            strokeDashArray: 4,
            padding: { top: 0, right: 10, bottom: 20, left: 10 }
        },
        legend: {
            labels: { colors: '#bbb' },
            fontSize: '13px',
            fontWeight: 500,
            markers: { radius: 4 }
        },
        colors: CHART_COLORS
    };
}

// ── 1. BAR CHART ──────────────────────────────
function renderBarChart(data) {
    const el = document.getElementById('chart-bar');
    if (!el) return;

    const base = chartBase();
    const config = {
        ...base,
        series: [{ name: 'Monthly Units', data: data.map(d => d.perMonth) }],
        chart: {
            ...base.chart,
            type: 'bar',
            height: 380,
            events: {
                dataPointSelection: function (e, ctx, cfg) {
                    showLearningPanel(cfg.dataPointIndex);
                }
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                columnWidth: '55%',
                distributed: true,
                dataLabels: { position: 'top' }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: v => v.toFixed(1),
            offsetY: -24,
            style: { fontSize: '12px', fontWeight: 700, colors: ['#ccc'] }
        },
        xaxis: {
            categories: data.map(d => d.name),
            labels: {
                style: { colors: '#aaa', fontSize: '11px', fontWeight: 500 },
                rotate: -45,
                rotateAlways: true,
                trim: true,
                maxHeight: 120,
                hideOverlappingLabels: true
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            title: { text: 'Units (kWh/month)', style: { color: '#777', fontSize: '13px', fontWeight: 600 } },
            labels: { style: { colors: '#777', fontSize: '12px' }, formatter: v => v.toFixed(0) }
        },
        fill: {
            type: 'gradient',
            gradient: { shade: 'dark', type: 'vertical', shadeIntensity: 0.2, opacityFrom: 1, opacityTo: 0.8 }
        },
        tooltip: {
            theme: 'dark',
            custom: function ({ dataPointIndex }) {
                const d = data[dataPointIndex];
                const funFacts = [
                    'This appliance runs like ' + Math.round(d.watt / 10) + ' phone chargers!',
                    'In a month it uses ' + d.perMonth + ' units — that could charge ' + Math.round(d.perMonth * 83) + ' phones!',
                    'Saving 1 hour/day saves ' + (d.watt / 1000).toFixed(2) + ' units daily!',
                    'This costs ₹' + (d.monthlyCost / 30).toFixed(1) + ' every single day!'
                ];
                const fact = funFacts[dataPointIndex % funFacts.length];
                return '<div class="energy-tooltip">' +
                    '<div class="tt-header">' + d.name + ' <span>' + d.watts + 'W</span></div>' +
                    '<div class="tt-row"><span>⚡ Monthly</span><b>' + d.perMonth + ' kWh</b></div>' +
                    '<div class="tt-row"><span>📅 Weekly</span><b>' + d.perWeek + ' kWh</b></div>' +
                    '<div class="tt-row"><span>🕐 Daily</span><b>' + d.perDay + ' kWh</b></div>' +
                    '<div class="tt-divider"></div>' +
                    '<div class="tt-cost">💰 ₹' + d.monthlyCost + '/month</div>' +
                    '<div class="tt-funfact">🤩 ' + fact + '</div>' +
                    '<div class="tt-hint">👆 Click to learn the maths!</div>' +
                    '</div>';
            }
        },
        responsive: [{
            breakpoint: 768,
            options: {
                chart: { height: 300 },
                plotOptions: { bar: { columnWidth: '80%', borderRadius: 6 } },
                dataLabels: { style: { fontSize: '9px' } },
                xaxis: { labels: { style: { fontSize: '9px' }, maxHeight: 100 } }
            }
        }]
    };

    const chart = new ApexCharts(el, config);
    chart.render();
    chartInstances.push(chart);
}

// ── 2. PIE CHART ──────────────────────────────
function renderPieChart(data) {
    const el = document.getElementById('chart-pie');
    if (!el) return;

    const base = chartBase();
    const config = {
        ...base,
        series: data.map(d => d.perMonth),
        labels: data.map(d => d.name),
        chart: {
            ...base.chart, type: 'pie', height: 340,
            events: { dataPointSelection: (e, ctx, cfg) => showLearningPanel(cfg.dataPointIndex) }
        },
        stroke: { width: 3, colors: ['#12122a'] },
        tooltip: {
            custom: function ({ series, seriesIndex }) {
                const d = data[seriesIndex];
                const total = series.reduce((s, v) => s + v, 0);
                const pct = ((d.perMonth / total) * 100).toFixed(1);
                return '<div class="energy-tooltip">' +
                    '<div class="tt-header">' + d.name + '</div>' +
                    '<div class="tt-row"><span>⚡ Energy</span><b>' + d.perMonth + ' kWh</b></div>' +
                    '<div class="tt-row"><span>📊 Share</span><b>' + pct + '%</b></div>' +
                    '</div>';
            }
        },
        legend: {
            position: 'bottom', horizontalAlign: 'center',
            labels: { colors: '#bbb' }, fontSize: '12px',
            markers: { radius: 3 }, itemMargin: { horizontal: 6, vertical: 4 }
        }
    };

    const chart = new ApexCharts(el, config);
    chart.render();
    chartInstances.push(chart);
}

// ── 3. DONUT CHART ────────────────────────────
function renderDonutChart(data) {
    const el = document.getElementById('chart-donut');
    if (!el) return;

    const costs = data.map(d => d.monthlyCost);
    const totalCost = costs.reduce((s, c) => s + c, 0);
    const base = chartBase();

    const config = {
        ...base,
        series: costs,
        labels: data.map(d => d.name),
        chart: {
            ...base.chart, type: 'donut', height: 340,
            events: { dataPointSelection: (e, ctx, cfg) => showLearningPanel(cfg.dataPointIndex) }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '58%',
                    labels: {
                        show: true,
                        name: { show: true, color: '#ddd', fontSize: '14px', fontWeight: 600 },
                        value: { show: true, color: '#FFD700', fontSize: '22px', fontWeight: 800, formatter: v => '₹' + v },
                        total: {
                            show: true, label: 'Total Bill',
                            color: '#999', fontSize: '12px',
                            formatter: () => '₹' + totalCost
                        }
                    }
                }
            }
        },
        stroke: { width: 3, colors: ['#12122a'] },
        tooltip: {
            custom: function ({ series, seriesIndex }) {
                const d = data[seriesIndex];
                const pct = totalCost > 0 ? ((d.monthlyCost / totalCost) * 100).toFixed(1) : 0;
                return '<div class="energy-tooltip">' +
                    '<div class="tt-header">' + d.name + '</div>' +
                    '<div class="tt-row"><span>💰 Cost</span><b>₹' + d.monthlyCost + '/mo</b></div>' +
                    '<div class="tt-row"><span>📊 Share</span><b>' + pct + '%</b></div>' +
                    '</div>';
            }
        },
        legend: {
            position: 'bottom', horizontalAlign: 'center',
            labels: { colors: '#bbb' }, fontSize: '12px',
            markers: { radius: 3 }, itemMargin: { horizontal: 6, vertical: 4 }
        }
    };

    const chart = new ApexCharts(el, config);
    chart.render();
    chartInstances.push(chart);
}

// ── 4. LINE CHART ─────────────────────────────
function renderLineChart(data) {
    const el = document.getElementById('chart-line');
    if (!el) return;

    const base = chartBase();
    const series = data.map(d => ({
        name: d.name,
        data: [parseFloat(d.perDay.toFixed(2)), parseFloat(d.perWeek.toFixed(2)), parseFloat(d.perMonth.toFixed(2))]
    }));

    const config = {
        ...base,
        series: series,
        chart: { ...base.chart, type: 'line', height: 340, zoom: { enabled: false } },
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 7, strokeWidth: 2, strokeColors: '#1a1a2e', hover: { size: 10 } },
        xaxis: {
            categories: ['📅 1 Day', '📅 1 Week', '📅 1 Month'],
            labels: { style: { colors: '#aaa', fontSize: '14px', fontWeight: 600 } }
        },
        yaxis: {
            title: { text: 'Units (kWh)', style: { color: '#777', fontSize: '13px' } },
            labels: { style: { colors: '#777', fontSize: '12px' }, formatter: v => v.toFixed(1) }
        },
        tooltip: {
            theme: 'dark', shared: true, intersect: false,
            y: { formatter: v => v.toFixed(2) + ' kWh' }
        },
        legend: {
            position: 'top', labels: { colors: '#bbb' },
            fontSize: '12px', fontWeight: 500, itemMargin: { horizontal: 10 }
        }
    };

    const chart = new ApexCharts(el, config);
    chart.render();
    chartInstances.push(chart);
}
