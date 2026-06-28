const {
    processLoans
} = require("../loans/loanAutomation");

const {
    processCreditCards
} = require("../creditCard/creditCardEngine");

const {
    processEconomyFluctuations
} = require("../fluctuation/economyEngine");

/**
 * =========================
 * GLOBAL SCHEDULER STATE
 * =========================
 */

let schedulerStarted = false;

const INTERVALS = {
    loans: 60 * 60 * 1000,          // 1 hour
    creditCards: 60 * 60 * 1000,    // 1 hour
    economy: 6 * 60 * 60 * 1000     // 6 hours
};

/**
 * =========================
 * START SCHEDULER
 * =========================
 */

function startEconomyScheduler(client) {

    if (schedulerStarted) {
        console.log("⚠️ Economy scheduler already running.");
        return;
    }

    schedulerStarted = true;

    console.log("🌍 Economy Scheduler Initialising...");

    /**
     * LOANS LOOP
     */
    setInterval(async () => {

        try {
            await processLoans(client);
        } catch (err) {
            console.error("❌ Loan automation error:", err);
        }

    }, INTERVALS.loans);

    /**
     * CREDIT CARD LOOP
     */
    setInterval(async () => {

        try {
            await processCreditCards(client);
        } catch (err) {
            console.error("❌ Credit card automation error:", err);
        }

    }, INTERVALS.creditCards);

    /**
     * ECONOMY FLUCTUATION LOOP
     */
    setInterval(async () => {

        try {
            await processEconomyFluctuations(client);
        } catch (err) {
            console.error("❌ Economy fluctuation error:", err);
        }

    }, INTERVALS.economy);

    console.log("✅ Economy Scheduler Running:");
    console.log("   - Loans: every 1h");
    console.log("   - Credit Cards: every 1h");
    console.log("   - Economy Fluctuations: every 6h");
}

/**
 * =========================
 * EXPORTS
 * =========================
 */

module.exports = {
    startEconomyScheduler
};