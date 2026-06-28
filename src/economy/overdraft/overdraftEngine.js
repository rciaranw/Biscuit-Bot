const EconomyUser = require("../../database/models/EconomyUser");

const {
    removeCredit,
    addCredit
} = require("../credit/creditEngine");

/**
 * OVERDRAFT SETTINGS
 */
const MAX_UNARRANGED_LIMIT = 500; // default emergency buffer
const ARRANGED_LIMIT_CAP = 5000;

/**
 * Ensure overdraft structure exists
 */
function ensureOverdraft(user) {

    if (!user.overdraft) {
        user.overdraft = {
            arrangedLimit: 0,
            used: 0,
            interestRate: 0.25, // HIGH risk
            active: false,
            history: []
        };
    }

    return user.overdraft;
}

/**
 * Check if user is in overdraft
 */
function isInOverdraft(user) {

    ensureOverdraft(user);

    return (user.bank || 0) < 0;
}

/**
 * Calculate total overdraft debt
 */
function getOverdraftDebt(user) {

    ensureOverdraft(user);

    return Math.abs(Math.min(user.bank || 0, 0));
}

/**
 * Apply unarranged overdraft usage
 */
function applyUnarrangedOverdraft(user, amount) {

    ensureOverdraft(user);

    const debt = getOverdraftDebt(user);

    if (debt > MAX_UNARRANGED_LIMIT) {
        return {
            ok: false,
            reason: "Unarranged overdraft limit exceeded"
        };
    }

    user.bank = (user.bank || 0) - amount;

    user.overdraft.history.push({
        type: "UNARRANGED_USE",
        amount,
        timestamp: Date.now()
    });

    // CREDIT DAMAGE (high risk behaviour)
    removeCredit(user, 5, "Used unarranged overdraft");

    return {
        ok: true
    };
}

/**
 * Apply arranged overdraft (bank approved)
 */
function applyArrangedOverdraft(user, limit) {

    ensureOverdraft(user);

    const credit = user.creditScore || 50;

    if (credit < 40) {
        return {
            ok: false,
            reason: "Credit score too low for arranged overdraft"
        };
    }

    const finalLimit = Math.min(limit, ARRANGED_LIMIT_CAP);

    user.overdraft.arrangedLimit = finalLimit;
    user.overdraft.active = true;

    user.overdraft.history.push({
        type: "ARRANGED_GRANTED",
        limit: finalLimit,
        timestamp: Date.now()
    });

    // SMALL CREDIT BOOST (responsible usage)
    addCredit(user, 2, "Approved overdraft agreement");

    return {
        ok: true,
        limit: finalLimit
    };
}

/**
 * Overdraft interest processing (runs with loan automation later)
 */
function processOverdraft(user) {

    ensureOverdraft(user);

    const debt = getOverdraftDebt(user);

    if (debt <= 0) return;

    const rate = user.overdraft.interestRate || 0.25;

    const dailyInterest = Math.floor(debt * (rate / 30));

    user.bank -= dailyInterest;

    user.overdraft.history.push({
        type: "INTEREST",
        amount: dailyInterest,
        timestamp: Date.now()
    });

    // CREDIT IMPACT (debt pressure)
    if (debt > 1000) {
        removeCredit(user, 3, "High overdraft usage");
    }
}

/**
 * Repay overdraft
 */
function repayOverdraft(user, amount) {

    ensureOverdraft(user);

    if ((user.bank || 0) < amount) {
        return {
            ok: false,
            reason: "Insufficient funds"
        };
    }

    user.bank -= amount;

    user.overdraft.history.push({
        type: "REPAYMENT",
        amount,
        timestamp: Date.now()
    });

    // CREDIT RECOVERY
    addCredit(user, 3, "Overdraft repayment");

    return {
        ok: true
    };
}

module.exports = {
    ensureOverdraft,
    isInOverdraft,
    getOverdraftDebt,
    applyUnarrangedOverdraft,
    applyArrangedOverdraft,
    processOverdraft,
    repayOverdraft
};