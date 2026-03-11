// ═══════════════════════════════════════════════
//  ENERGY CALCULATOR
//  Multi-timeframe consumption + Tamil Nadu tariff
//  + Learning mode step generator for kids
// ═══════════════════════════════════════════════

/**
 * Calculate energy consumption across all timeframes
 */
function calculateConsumption(watts, hoursPerDay) {
    const kw = watts / 1000;
    const perDay = kw * hoursPerDay;
    return {
        perMinute: kw * (1 / 60),
        perHour: kw * 1,
        perDay: perDay,
        perWeek: perDay * 7,
        perMonth: perDay * 30
    };
}

/**
 * Tamil Nadu electricity tariff slab calculation
 */
function calculateTNTariffCost(totalUnitsMonth) {
    const units = Math.round(totalUnitsMonth);
    if (units <= 100) return 0;
    let cost = 0;
    if (units <= 200) {
        cost = (units - 100) * 1.5;
    } else if (units <= 500) {
        cost = (100 * 1.5) + (units - 200) * 3;
    } else if (units <= 1000) {
        cost = (100 * 1.5) + (300 * 3) + (units - 500) * 4.5;
    } else {
        cost = (100 * 1.5) + (300 * 3) + (500 * 4.5) + (units - 1000) * 6;
    }
    return Math.round(cost);
}

/**
 * Get the per-unit tariff rate for a given unit count (for display)
 */
function getTariffRate(units) {
    if (units <= 100) return 0;
    if (units <= 200) return 1.5;
    if (units <= 500) return 3;
    if (units <= 1000) return 4.5;
    return 6;
}

/**
 * Build energy data for all active appliances
 */
function getApplianceEnergyData(appliancesList) {
    const results = [];
    appliancesList.forEach(a => {
        if (!a.on) return;
        const hours = DEFAULT_HOURS[a.name] || 8;
        const consumption = calculateConsumption(a.watt, hours);
        const monthUnits = parseFloat(consumption.perMonth.toFixed(2));
        results.push({
            name: a.name,
            watts: a.watt,
            hoursPerDay: hours,
            perMinute: parseFloat(consumption.perMinute.toFixed(5)),
            perHour: parseFloat(consumption.perHour.toFixed(4)),
            perDay: parseFloat(consumption.perDay.toFixed(3)),
            perWeek: parseFloat(consumption.perWeek.toFixed(2)),
            perMonth: monthUnits,
            weeklyCost: calculateTNTariffCost(consumption.perWeek),
            monthlyCost: calculateTNTariffCost(monthUnits)
        });
    });
    return results;
}

/**
 * Get total monthly cost for all active appliances combined
 */
function getTotalMonthlyCost(appliancesList) {
    const data = getApplianceEnergyData(appliancesList);
    const totalUnits = data.reduce((sum, d) => sum + d.perMonth, 0);
    return calculateTNTariffCost(totalUnits);
}

/**
 * Generate kid-friendly step-by-step explanation HTML for one appliance
 */
function generateLearningSteps(applianceData) {
    const d = applianceData;

    return `
    <div class="ls-inputs">
        <div class="ls-input-group">
            <label class="ls-input-label">⚡ Watts</label>
            <div class="ls-input-row">
                <button class="ls-spin" onclick="adjustLearningValue('watts', -10)">−</button>
                <input 
                    class="ls-input" 
                    id="ls-watts" 
                    type="number" 
                    value="${d.watts}" 
                    min="1" 
                    max="5000"
                    oninput="recalcLearningSteps()"
                />
                <button class="ls-spin" onclick="adjustLearningValue('watts', 10)">+</button>
            </div>
        </div>
        <div class="ls-input-group">
            <label class="ls-input-label">🕐 Hours/Day</label>
            <div class="ls-input-row">
                <button class="ls-spin" onclick="adjustLearningValue('hours', -0.5)">−</button>
                <input 
                    class="ls-input" 
                    id="ls-hours" 
                    type="number" 
                    value="${d.hoursPerDay}" 
                    min="0.1" 
                    max="24" 
                    step="0.5"
                    oninput="recalcLearningSteps()"
                />
                <button class="ls-spin" onclick="adjustLearningValue('hours', 0.5)">+</button>
            </div>
        </div>
    </div>

    <div id="ls-steps-output">
        ${buildLearningStepsHTML(d.watts, d.hoursPerDay)}
    </div>
    `;
}

function buildLearningStepsHTML(watts, hoursPerDay) {
    const kw = (watts / 1000).toFixed(3);
    const dailyUnits = (watts / 1000 * hoursPerDay).toFixed(3);
    const weeklyUnits = (dailyUnits * 7).toFixed(2);
    const monthlyUnits = (dailyUnits * 30).toFixed(2);
    const tariffRate = getTariffRate(parseFloat(monthlyUnits));
    const monthlyCost = calculateTNTariffCost(parseFloat(monthlyUnits));

    // Energy level emoji
    const energyEmoji = watts < 100 ? PIXEL_ICONS.star : watts < 500 ? PIXEL_ICONS.bulb : watts < 1000 ? PIXEL_ICONS.heater : PIXEL_ICONS.ac;
    const energyLabel = watts < 100 ? 'Low Energy' : watts < 500 ? 'Medium Energy' : watts < 1000 ? 'High Energy' : 'Very High!';

    return `
    <div class="ls-energy-badge ${watts < 100 ? 'eb-green' : watts < 500 ? 'eb-yellow' : watts < 1000 ? 'eb-orange' : 'eb-red'}">
        ${energyEmoji} ${energyLabel} Appliance
    </div>

    <div class="learn-step">
        <div class="learn-step-num">⚡ Step 1</div>
        <div class="learn-step-title">Convert Watts → Kilowatts</div>
        <div class="learn-step-calc">
            <span class="calc-input">${watts} W</span>
            <span class="calc-op">÷</span>
            <span class="calc-input">1000</span>
            <span class="calc-op">=</span>
            <span class="calc-result">${kw} kW</span>
        </div>
        <div class="ls-tip">💡 Kilowatts is how electricity companies measure power!</div>
    </div>

    <div class="learn-step">
        <div class="learn-step-num">🕐 Step 2</div>
        <div class="learn-step-title">Daily Energy (Units / Day)</div>
        <div class="learn-step-calc">
            <span class="calc-input">${kw} kW</span>
            <span class="calc-op">×</span>
            <span class="calc-input">${hoursPerDay} hrs</span>
            <span class="calc-op">=</span>
            <span class="calc-result">${dailyUnits} units/day</span>
        </div>
        <div class="ls-tip">💡 1 unit = 1 kilowatt used for 1 hour!</div>
    </div>

    <div class="learn-step">
        <div class="learn-step-num">📅 Step 3</div>
        <div class="learn-step-title">Weekly Energy</div>
        <div class="learn-step-calc">
            <span class="calc-input">${dailyUnits}</span>
            <span class="calc-op">×</span>
            <span class="calc-input">7 days</span>
            <span class="calc-op">=</span>
            <span class="calc-result">${weeklyUnits} units/week</span>
        </div>
    </div>

    <div class="learn-step">
        <div class="learn-step-num">📆 Step 4</div>
        <div class="learn-step-title">Monthly Energy</div>
        <div class="learn-step-calc">
            <span class="calc-input">${dailyUnits}</span>
            <span class="calc-op">×</span>
            <span class="calc-input">30 days</span>
            <span class="calc-op">=</span>
            <span class="calc-result">${monthlyUnits} units/month</span>
        </div>
    </div>

    <div class="learn-step">
        <div class="learn-step-num">💰 Step 5</div>
        <div class="learn-step-title">Electricity Cost (TN Tariff)</div>
        <div class="learn-step-calc">
            <span class="calc-input">${monthlyUnits} units</span>
            <span class="calc-op">×</span>
            <span class="calc-input">₹${tariffRate}</span>
            <span class="calc-op">=</span>
            <span class="calc-result cost">₹${monthlyCost}/month</span>
        </div>
        <div class="learn-tariff-note">
            📋 TN Tariff: 0-100 = Free | 101-200 = ₹1.5 | 201-500 = ₹3 | 501-1000 = ₹4.5
        </div>
    </div>

    <div class="ls-fun-compare">
        <div class="ls-fc-title">🤩 Did You Know?</div>
        <div class="ls-fc-row">📱 Could charge <b>${Math.round(parseFloat(monthlyUnits) * 83)}</b> phones in a month!</div>
        <div class="ls-fc-row">💡 Costs just <b>₹${(monthlyCost / 30).toFixed(1)}</b> per day</div>
        <div class="ls-fc-row">🌱 Produces <b>${(parseFloat(monthlyUnits) * 0.82).toFixed(1)} kg</b> of CO₂ monthly</div>
    </div>
    `;
}

function recalcLearningSteps() {
    const wattsInput = document.getElementById('ls-watts');
    const hoursInput = document.getElementById('ls-hours');
    const output = document.getElementById('ls-steps-output');
    if (!wattsInput || !hoursInput || !output) return;

    const watts = Math.max(1, Math.min(5000, parseFloat(wattsInput.value) || 1));
    const hours = Math.max(0.1, Math.min(24, parseFloat(hoursInput.value) || 1));

    // Animate the output swap
    output.style.opacity = '0';
    output.style.transform = 'translateY(6px)';
    setTimeout(() => {
        output.innerHTML = buildLearningStepsHTML(watts, hours);
        output.style.opacity = '1';
        output.style.transform = 'translateY(0)';
    }, 150);
}

function adjustLearningValue(field, delta) {
    const inputId = field === 'watts' ? 'ls-watts' : 'ls-hours';
    const input = document.getElementById(inputId);
    if (!input) return;

    let val = parseFloat(input.value) || 0;
    val = field === 'watts'
        ? Math.max(1, Math.min(5000, val + delta))
        : Math.max(0.1, Math.min(24, val + delta));

    // Round to 1 decimal for hours
    input.value = field === 'hours' ? val.toFixed(1) : Math.round(val);
    recalcLearningSteps();
}

/**
 * Calculate solar generation and Net Zero status
 */
function calculateNetZero(totalMonthlyUnits, solarKW) {
    const solarUnitsPerDay = solarKW * 4;
    const solarMonthly = solarUnitsPerDay * 30;
    const deficit = totalMonthlyUnits - solarMonthly;
    const percentage = totalMonthlyUnits > 0 ? Math.min((solarMonthly / totalMonthlyUnits) * 100, 100) : 0;
    return {
        solarKW: solarKW,
        solarDaily: solarUnitsPerDay,
        solarMonthly: solarMonthly,
        houseMonthly: totalMonthlyUnits,
        deficit: deficit,
        percentage: Math.round(percentage),
        isNetZero: solarMonthly >= totalMonthlyUnits
    };
}
