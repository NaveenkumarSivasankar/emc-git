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

    <div id="ls-steps-output" style="margin-top:14px;"></div>
    `;
}

function buildLearningStepsHTML(watts, hours) {
    const units     = (watts * hours) / 1000;
    const dailyCost = units * 6.5;
    const monthly   = units * 30;
    const monthlyCost = monthly * 6.5;
    const co2Daily  = units * 0.82;

    return `
        <div class="learn-step" style="animation: stepWrite 0.4s ease 0.1s both;">
            <div class="ls-step-num">STEP 1</div>
            <div class="ls-step-title">⚡ Power to Energy</div>
            <div class="ls-step-body">
                <span class="ls-formula">${watts}W × ${hours}h ÷ 1000</span>
                <span class="ls-equals">=</span>
                <span class="ls-result">${units.toFixed(2)} Units</span>
            </div>
            <div class="ls-hint">Watts × Hours gives you Watt-hours. Divide by 1000 for Units (kWh)</div>
        </div>

        <div class="learn-step" style="animation: stepWrite 0.4s ease 0.25s both;">
            <div class="ls-step-num">STEP 2</div>
            <div class="ls-step-title">📅 Daily Usage</div>
            <div class="ls-step-body">
                <span class="ls-formula">${units.toFixed(2)} units × ₹6.50</span>
                <span class="ls-equals">=</span>
                <span class="ls-result">₹${dailyCost.toFixed(2)} / day</span>
            </div>
            <div class="ls-hint">Multiply units by your electricity rate per unit</div>
        </div>

        <div class="learn-step" style="animation: stepWrite 0.4s ease 0.4s both;">
            <div class="ls-step-num">STEP 3</div>
            <div class="ls-step-title">📆 Monthly Units</div>
            <div class="ls-step-body">
                <span class="ls-formula">${units.toFixed(2)} units × 30 days</span>
                <span class="ls-equals">=</span>
                <span class="ls-result">${monthly.toFixed(1)} units/month</span>
            </div>
            <div class="ls-hint">Multiply daily units by 30 to get monthly consumption</div>
        </div>

        <div class="learn-step" style="animation: stepWrite 0.4s ease 0.55s both;">
            <div class="ls-step-num">STEP 4</div>
            <div class="ls-step-title">💰 Monthly Bill</div>
            <div class="ls-step-body">
                <span class="ls-formula">${monthly.toFixed(1)} units × ₹6.50</span>
                <span class="ls-equals">=</span>
                <span class="ls-result">₹${monthlyCost.toFixed(2)} / month</span>
            </div>
            <div class="ls-hint">This is your estimated monthly electricity bill</div>
        </div>

        <div class="learn-step" style="animation: stepWrite 0.4s ease 0.7s both;">
            <div class="ls-step-num">STEP 5</div>
            <div class="ls-step-title">🌍 CO₂ Impact</div>
            <div class="ls-step-body">
                <span class="ls-formula">${units.toFixed(2)} units × 0.82 kg</span>
                <span class="ls-equals">=</span>
                <span class="ls-result">${co2Daily.toFixed(3)} kg CO₂/day</span>
            </div>
            <div class="ls-hint">Every unit of electricity produces 0.82kg of CO₂ emissions</div>
        </div>
    `;
}

window.recalcLearningSteps = function() {
    let output = document.getElementById('ls-steps-output');

    // If div not found create it and append to panel
    if (!output) {
        const panel = document.getElementById('learn-panel');
        if (!panel) return;
        output = document.createElement('div');
        output.id = 'ls-steps-output';
        output.style.marginTop = '12px';
        panel.appendChild(output);
    }

    const watts = parseFloat(document.getElementById('ls-watts')?.value) || 100;
    const hours = parseFloat(document.getElementById('ls-hours')?.value) || 5;

    const units       = +((watts * hours) / 1000).toFixed(4);
    const dailyCost   = +(units * 6.5).toFixed(2);
    const monthly     = +(units * 30).toFixed(3);
    const monthlyCost = +(monthly * 6.5).toFixed(2);
    const co2         = +(units * 0.82).toFixed(4);
    const trees       = +((co2 * 365) / 21).toFixed(1);

    output.style.cssText = 'margin-top:12px;display:block;visibility:visible;opacity:1;';
    output.innerHTML = `
        <div style="background:rgba(91,141,239,0.1);border-left:3px solid #5B8DEF;border-radius:4px;padding:10px 12px;margin-bottom:8px;">
            <div style="font-size:0.62rem;font-weight:900;color:#FFD700;font-family:'Courier New',monospace;letter-spacing:2px;margin-bottom:4px;">STEP 1 — POWER TO ENERGY</div>
            <div style="font-family:'Courier New',monospace;font-size:0.82rem;color:#aaccff;">${watts}W × ${hours}h ÷ 1000 = <span style="color:#2ECC8B;font-weight:900;">${units} kWh</span></div>
            <div style="font-size:0.68rem;color:#666;margin-top:4px;font-style:italic;">Watts × Hours ÷ 1000 = Units (kWh)</div>
        </div>
        <div style="background:rgba(46,204,139,0.1);border-left:3px solid #2ECC8B;border-radius:4px;padding:10px 12px;margin-bottom:8px;">
            <div style="font-size:0.62rem;font-weight:900;color:#FFD700;font-family:'Courier New',monospace;letter-spacing:2px;margin-bottom:4px;">STEP 2 — DAILY COST</div>
            <div style="font-family:'Courier New',monospace;font-size:0.82rem;color:#aaccff;">${units} × ₹6.50 = <span style="color:#2ECC8B;font-weight:900;">₹${dailyCost}/day</span></div>
            <div style="font-size:0.68rem;color:#666;margin-top:4px;font-style:italic;">Units × tariff rate per unit</div>
        </div>
        <div style="background:rgba(245,166,35,0.1);border-left:3px solid #F5A623;border-radius:4px;padding:10px 12px;margin-bottom:8px;">
            <div style="font-size:0.62rem;font-weight:900;color:#FFD700;font-family:'Courier New',monospace;letter-spacing:2px;margin-bottom:4px;">STEP 3 — MONTHLY UNITS</div>
            <div style="font-family:'Courier New',monospace;font-size:0.82rem;color:#aaccff;">${units} × 30 days = <span style="color:#F5A623;font-weight:900;">${monthly} units</span></div>
            <div style="font-size:0.68rem;color:#666;margin-top:4px;font-style:italic;">Daily units × 30 = monthly consumption</div>
        </div>
        <div style="background:rgba(255,107,107,0.1);border-left:3px solid #FF6B6B;border-radius:4px;padding:10px 12px;margin-bottom:8px;">
            <div style="font-size:0.62rem;font-weight:900;color:#FFD700;font-family:'Courier New',monospace;letter-spacing:2px;margin-bottom:4px;">STEP 4 — MONTHLY BILL</div>
            <div style="font-family:'Courier New',monospace;font-size:0.82rem;color:#aaccff;">${monthly} × ₹6.50 = <span style="color:#FF6B6B;font-weight:900;">₹${monthlyCost}/month</span></div>
            <div style="font-size:0.68rem;color:#666;margin-top:4px;font-style:italic;">Monthly units × tariff = electricity bill</div>
        </div>
        <div style="background:rgba(100,200,100,0.1);border-left:3px solid #4CAF50;border-radius:4px;padding:10px 12px;margin-bottom:8px;">
            <div style="font-size:0.62rem;font-weight:900;color:#FFD700;font-family:'Courier New',monospace;letter-spacing:2px;margin-bottom:4px;">STEP 5 — CO₂ IMPACT</div>
            <div style="font-family:'Courier New',monospace;font-size:0.82rem;color:#aaccff;">${units} × 0.82 = <span style="color:#4CAF50;font-weight:900;">${co2} kg CO₂/day</span></div>
            <div style="font-size:0.68rem;color:#666;margin-top:4px;font-style:italic;">🌳 ${trees} trees needed per year to absorb this</div>
        </div>
    `;
};

window.adjustLearningValue = function(field, delta) {
    const id = field === 'watts' ? 'ls-watts' : 'ls-hours';
    const input = document.getElementById(id);
    if (!input) return;
    const current = parseFloat(input.value) || 0;
    const min = field === 'watts' ? 1 : 0.5;
    const max = field === 'watts' ? 5000 : 24;
    input.value = Math.max(min, Math.min(max, current + delta));
    recalcLearningSteps();
};

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
