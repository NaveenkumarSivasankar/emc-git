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

    const appliancesList = is2BHK ? bhk2Appliances : simpleAppliances;
    const data = getApplianceEnergyData(appliancesList);

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
    content.innerHTML = buildDashboardHTML(data, totalDailyUnits, totalWeeklyUnits, totalMonthlyUnits, weeklyBill, totalBill, solarKW);

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

// ═══════════════════════════════════════════════
//  SECTION BUILDER
// ═══════════════════════════════════════════════
function buildDashboardHTML(data, dailyU, weeklyU, monthlyU, weeklyBill, monthlyBill, solarKW) {
    const houseName = is2BHK ? '2BHK' : '1BHK';
    const nz = calculateNetZero(monthlyU, solarKW);
    const netZeroNeeded = Math.max(0, Math.ceil(monthlyU - nz.solarMonthly));

    return '' +

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
                return '<div class="energy-tooltip">' +
                    '<div class="tt-header">' + d.name + ' <span>' + d.watts + 'W</span></div>' +
                    '<div class="tt-row"><span>⚡ Monthly</span><b>' + d.perMonth + ' kWh</b></div>' +
                    '<div class="tt-row"><span>📅 Weekly</span><b>' + d.perWeek + ' kWh</b></div>' +
                    '<div class="tt-row"><span>🕐 Daily</span><b>' + d.perDay + ' kWh</b></div>' +
                    '<div class="tt-divider"></div>' +
                    '<div class="tt-cost">💰 ₹' + d.monthlyCost + '/month</div>' +
                    '<div class="tt-hint">👆 Click to see step-by-step math!</div>' +
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
