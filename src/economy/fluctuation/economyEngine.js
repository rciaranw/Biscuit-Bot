const EconomyUser = require("../../database/models/EconomyUser");

/**
 * =========================
 * GLOBAL ECONOMY STATE
 * =========================
 */

const economyState = {
    inflation: 1.0,
    stability: 1.0,
    lastUpdated: Date.now()
};

/**
 * Random helper
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * =========================
 * CORE FLUCTUATION ENGINE
 * =========================
 * Runs periodically (scheduler hook)
 */
async function processEconomyFluctuations(client) {

    const now = Date.now();
    const hoursPassed = (now - economyState.lastUpdated) / (1000 * 60 * 60);

    if (hoursPassed < 6) return; // prevent over-fluctuation

    // =========================
    // BASE RANDOM SHIFT
    // =========================
    const inflationShift = (Math.random() - 0.5) * 0.05; // -2.5% to +2.5%
    const stabilityShift = (Math.random() - 0.5) * 0.03;

    economyState.inflation += inflationShift;
    economyState.stability += stabilityShift;

    economyState.inflation = clamp(economyState.inflation, 0.7, 1.8);
    economyState.stability = clamp(economyState.stability, 0.4, 1.2);

    economyState.lastUpdated = now;

    console.log(
        `[ECON] Inflation: ${economyState.inflation.toFixed(3)} | Stability: ${economyState.stability.toFixed(3)}`
    );

    // =========================
    // APPLY GLOBAL EFFECTS
    // =========================
    const users = await EconomyUser.find({});

    for (const user of users) {

        let changed = false;

        // =========================
        // INFLATION IMPACT
        // =========================
        if (user.wallet) {
            const decay = Math.floor(user.wallet * (economyState.inflation - 1) * -0.01);
            user.wallet += decay;
            changed = true;
        }

        // =========================
        // JOB PAY VOLATILITY
        // =========================
        if (user.job && user.job.title !== "unemployed") {

            if (!user.job.baseMultiplier) {
                user.job.baseMultiplier = 1.0;
            }

            const jobShift = (Math.random() - 0.5) * 0.1;

            user.job.baseMultiplier = clamp(
                user.job.baseMultiplier + jobShift,
                0.8,
                1.4
            );

            changed = true;
        }

        // =========================
        // CREDIT PRESSURE FROM ECONOMY
        // =========================
        if (user.creditCard?.active) {

            if (economyState.stability < 0.6) {
                user.creditCard.interestRate += 0.01;
                changed = true;
            }
        }

        // =========================
        // LOAN ENVIRONMENT EFFECTS
        // =========================
        if (user.loans?.length) {

            for (const loan of user.loans) {

                if (loan.status === "ACTIVE") {

                    // unstable economy increases risk
                    if (economyState.stability < 0.7) {
                        loan.interestRate += 0.005;
                        changed = true;
                    }
                }
            }
        }

        if (changed) {
            await user.save();
        }
    }
}

/**
 * =========================
 * SHOP PRICE MULTIPLIER
 * =========================
 */
function getShopMultiplier() {
    return economyState.inflation;
}

/**
 * =========================
 * JOB PAY MULTIPLIER
 * =========================
 */
function getJobMultiplier() {
    return economyState.stability;
}

/**
 * =========================
 * EXPORTS
 * =========================
 */
module.exports = {
    economyState,
    processEconomyFluctuations,
    getShopMultiplier,
    getJobMultiplier
};