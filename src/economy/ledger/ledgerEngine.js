const EconomyUser = require("../../database/models/EconomyUser");

/**
 * =========================
 * LEDGER STORAGE MODEL
 * =========================
 * We store EVERYTHING as immutable entries
 */

function ensureLedger(user) {
    if (!user.ledger) {
        user.ledger = [];
    }
    return user.ledger;
}

/**
 * Add a transaction to ledger
 */
function logTransaction(user, entry) {

    const ledger = ensureLedger(user);

    const record = {
        id: Date.now().toString(),
        type: entry.type || "UNKNOWN",
        amount: entry.amount || 0,
        balanceAfter: entry.balanceAfter ?? null,
        source: entry.source || "SYSTEM",
        meta: entry.meta || {},
        timestamp: Date.now()
    };

    ledger.push(record);

    // prevent infinite growth (safety cap)
    if (ledger.length > 500) {
        ledger.splice(0, ledger.length - 500);
    }

    return record;
}

/**
 * Get full ledger
 */
function getLedger(user, limit = 20) {

    const ledger = ensureLedger(user);

    return ledger
        .slice(-limit)
        .reverse();
}

/**
 * Filter ledger by type
 */
function getLedgerByType(user, type) {

    const ledger = ensureLedger(user);

    return ledger.filter(l => l.type === type);
}

/**
 * Summaries (useful for /econstats later)
 */
function getLedgerSummary(user) {

    const ledger = ensureLedger(user);

    let income = 0;
    let expense = 0;

    for (const entry of ledger) {

        if (entry.amount > 0) income += entry.amount;
        if (entry.amount < 0) expense += Math.abs(entry.amount);
    }

    return {
        totalEntries: ledger.length,
        income,
        expense,
        net: income - expense
    };
}

module.exports = {
    logTransaction,
    getLedger,
    getLedgerByType,
    getLedgerSummary
};