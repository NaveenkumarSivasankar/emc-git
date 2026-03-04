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
    const kw = (d.watts / 1000).toFixed(3);
    const dailyUnits = d.perDay;
    const weeklyUnits = d.perWeek;
    const monthlyUnits = d.perMonth;
    const tariffRate = getTariffRate(monthlyUnits);
    const monthlyCost = d.monthlyCost;

    return '' +
        '<div class="learn-step">' +
        '<div class="learn-step-num">⚡ Step 1</div>' +
        '<div class="learn-step-title">Convert Watts → Kilowatts</div>' +
        '<div class="learn-step-calc">' +
        '<span class="calc-input">' + d.watts + ' W</span>' +
        '<span class="calc-op">÷</span>' +
        '<span class="calc-input">1000</span>' +
        '<span class="calc-op">=</span>' +
        '<span class="calc-result">' + kw + ' kW</span>' +
        '</div>' +
        '</div>' +

        '<div class="learn-step">' +
        '<div class="learn-step-num">🕐 Step 2</div>' +
        '<div class="learn-step-title">Daily Energy (Units / Day)</div>' +
        '<div class="learn-step-calc">' +
        '<span class="calc-input">' + kw + ' kW</span>' +
        '<span class="calc-op">×</span>' +
        '<span class="calc-input">' + d.hoursPerDay + ' hrs</span>' +
        '<span class="calc-op">=</span>' +
        '<span class="calc-result">' + dailyUnits + ' units/day</span>' +
        '</div>' +
        '</div>' +

        '<div class="learn-step">' +
        '<div class="learn-step-num">📅 Step 3</div>' +
        '<div class="learn-step-title">Weekly Energy</div>' +
        '<div class="learn-step-calc">' +
        '<span class="calc-input">' + dailyUnits + '</span>' +
        '<span class="calc-op">×</span>' +
        '<span class="calc-input">7 days</span>' +
        '<span class="calc-op">=</span>' +
        '<span class="calc-result">' + weeklyUnits + ' units/week</span>' +
        '</div>' +
        '</div>' +

        '<div class="learn-step">' +
        '<div class="learn-step-num">📆 Step 4</div>' +
        '<div class="learn-step-title">Monthly Energy</div>' +
        '<div class="learn-step-calc">' +
        '<span class="calc-input">' + dailyUnits + '</span>' +
        '<span class="calc-op">×</span>' +
        '<span class="calc-input">30 days</span>' +
        '<span class="calc-op">=</span>' +
        '<span class="calc-result">' + monthlyUnits + ' units/month</span>' +
        '</div>' +
        '</div>' +

        '<div class="learn-step">' +
        '<div class="learn-step-num">💰 Step 5</div>' +
        '<div class="learn-step-title">Electricity Cost (TN Tariff)</div>' +
        '<div class="learn-step-calc">' +
        '<span class="calc-input">' + monthlyUnits + ' units</span>' +
        '<span class="calc-op">×</span>' +
        '<span class="calc-input">₹' + tariffRate + '</span>' +
        '<span class="calc-op">=</span>' +
        '<span class="calc-result cost">₹' + monthlyCost + '/month</span>' +
        '</div>' +
        '<div class="learn-tariff-note">' +
        '📋 TN Tariff: 0-100 = Free | 101-200 = ₹1.5 | 201-500 = ₹3 | 501-1000 = ₹4.5' +
        '</div>' +
        '</div>';
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
