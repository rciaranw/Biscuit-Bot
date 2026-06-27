const EconomyUser = require("../../database/models/EconomyUser");
const {
    increaseCredit,
    decreaseCredit
} = require("../credit/creditEngine");

/**
 * Base loan config
 */
const loanConfig = {

    maxMultiplier: {
        poor: 1.2,
        fair: 2,
        good: 4,
        veryGood: 6,
        excellent: 10
    },

    interestRates: {
        poor: 0.25,
        fair: 0.18,
        good: 0.12,
        veryGood: 0.08,
        excellent: 0.05
    }
};

/**
 * Calculate max loan based on wallet + credit
 */
function calculateMaxLoan(user) {

    const tier = user.creditTier || "fair";
    const multiplier = loanConfig.maxMultiplier[tier] || 1;

    const base = (user.wallet || 0) * multiplier;

    // minimum floor so poor users still get tiny access
    return Math.max(100, Math.floor(base));
}

/**
 * Apply for loan
 */
async function requestLoan(userId, amount) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) {
        return { ok: false, reason: "User not found" };
    }

    const tier = user.creditTier || "fair";
    const maxLoan = calculateMaxLoan(user);

    if (amount > maxLoan) {
        return {
            ok: false,
            reason: `Loan denied. Max allowed: ${maxLoan}`
        };
    }

    if (!user.loans) user.loans = [];

    const interest = loanConfig.interestRates[tier];

    const repayment = Math.floor(amount + (amount * interest));

    user.wallet += amount;

    user.loans.push({
        amount,
        interest,
        repayment,
        paid: 0,
        status: "active",
        createdAt: Date.now()
    });

    await user.save();

    return {
        ok: true,
        amount,
        repayment,
        interest
    };
}

/**
 * Repay loan
 */
async function repayLoan(userId, amount) {

    const user = await EconomyUser.findOne({ userId });

    if (!user || !user.loans) {
        return { ok: false, reason: "No loans found" };
    }

    const activeLoan = user.loans.find(l => l.status === "active");

    if (!activeLoan) {
        return { ok: false, reason: "No active loan" };
    }

    if ((user.wallet || 0) < amount) {
        return { ok: false, reason: "Insufficient wallet balance" };
    }

    const { applyOverdraft } = require("../economy/banking/overdraftEngine");

await applyOverdraft(user.userId, amount);
    activeLoan.paid += amount;

    // fully paid
    if (activeLoan.paid >= activeLoan.repayment) {

        activeLoan.status = "paid";

        await increaseCredit(user, 10, "Loan fully repaid");

    }

    await user.save();

    return {
        ok: true,
        remaining: Math.max(0, activeLoan.repayment - activeLoan.paid)
    };
}

module.exports = {
    requestLoan,
    repayLoan,
    calculateMaxLoan
};