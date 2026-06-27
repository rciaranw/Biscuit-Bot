const { logMoney } = require("../utils/moneyLogger");
const config = require("../utils/config");

// This is your central treasury state
// (kept in-memory + optionally extendable later to DB snapshotting)
let treasury = {
    balance: 0,
    totalTaxCollected: 0,
    totalFeesCollected: 0,
    totalPayouts: 0
};

/**
 * Get current treasury state
 */
function getTreasury() {
    return treasury;
}

/**
 * Add money into Bank of Biscuit (taxes, fees, shop cuts, etc.)
 */
async function depositToBank(amount, type = "TAX", client = null, meta = {}) {

    treasury.balance += amount;

    if (type === "TAX") treasury.totalTaxCollected += amount;
    if (type === "FEE") treasury.totalFeesCollected += amount;

    if (client && config.channels.moneyLogs) {
        await logMoney(client, {
            userId: "BANK_OF_BISCUIT",
            type,
            amount,
            walletAfter: treasury.balance,
            bankAfter: null,
            reason: meta.reason || "System deposit"
        });
    }

    return treasury.balance;
}

/**
 * Withdraw from Bank of Biscuit (loans, payouts, systems)
 */
async function withdrawFromBank(amount, type = "PAYOUT", client = null, meta = {}) {

    if (treasury.balance < amount) {
        throw new Error("Bank of Biscuit has insufficient funds");
    }

    treasury.balance -= amount;

    if (type === "PAYOUT") treasury.totalPayouts += amount;

    if (client && config.channels.moneyLogs) {
        await logMoney(client, {
            userId: "BANK_OF_BISCUIT",
            type,
            amount: -amount,
            walletAfter: treasury.balance,
            bankAfter: null,
            reason: meta.reason || "System withdrawal"
        });
    }

    return treasury.balance;
}

/**
 * Simulate economic fluctuation (inflation system hook)
 */
function applyInflation(ratePercent) {
    const modifier = 1 - ratePercent / 100;

    treasury.balance = Math.floor(treasury.balance * modifier);

    return treasury.balance;
}

module.exports = {
    getTreasury,
    depositToBank,
    withdrawFromBank,
    applyInflation
};