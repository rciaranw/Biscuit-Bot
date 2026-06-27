const EconomyUser = require("../../database/models/EconomyUser");

/**
 * Credit tiers (for UI + logic later)
 */
const creditTiers = {
    poor: { min: 0, max: 299 },
    fair: { min: 300, max: 499 },
    good: { min: 500, max: 699 },
    veryGood: { min: 700, max: 849 },
    excellent: { min: 850, max: 1000 }
};

/**
 * Get credit tier
 */
function getCreditTier(score) {

    for (const [tier, range] of Object.entries(creditTiers)) {
        if (score >= range.min && score <= range.max) {
            return tier;
        }
    }

    return "poor";
}

/**
 * Initialise credit system for user
 */
async function ensureCredit(user) {

    if (user.creditScore === undefined || user.creditScore === null) {
        user.creditScore = 500; // neutral starting point
    }

    if (!user.creditHistory) {
        user.creditHistory = [];
    }

    return user;
}

/**
 * Improve credit score
 */
async function increaseCredit(user, amount, reason = "Positive financial action") {

    await ensureCredit(user);

    user.creditScore = Math.min(1000, user.creditScore + amount);

    user.creditHistory.push({
        type: "INCREASE",
        amount,
        reason,
        date: Date.now()
    });

    return user.creditScore;
}

/**
 * Decrease credit score
 */
async function decreaseCredit(user, amount, reason = "Negative financial action") {

    await ensureCredit(user);

    user.creditScore = Math.max(0, user.creditScore - amount);

    user.creditHistory.push({
        type: "DECREASE",
        amount,
        reason,
        date: Date.now()
    });

    return user.creditScore;
}

/**
 * Apply financial behaviour effects
 */
async function applyCreditEvent(user, eventType) {

    switch (eventType) {

        case "WORK_COMPLETE":
            return increaseCredit(user, 1, "Completed work shift");

        case "WORK_STREAK":
            return increaseCredit(user, 2, "Consistent work streak");

        case "LOAN_REPAID":
            return increaseCredit(user, 10, "Repaid loan on time");

        case "MISSED_PAYMENT":
            return decreaseCredit(user, 20, "Missed payment");

        case "UNARRANGED_OVERDRAFT":
            return decreaseCredit(user, 15, "Used unarranged overdraft");

        case "CRIME_ROB":
            return decreaseCredit(user, 30, "Criminal activity detected");

        default:
            return user.creditScore;
    }
}

module.exports = {
    getCreditTier,
    ensureCredit,
    increaseCredit,
    decreaseCredit,
    applyCreditEvent
};