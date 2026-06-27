const EconomyUser = require("../../database/models/EconomyUser");

const {
    decreaseCredit,
    increaseCredit
} = require("../credit/creditEngine");

/**
 * Arranged overdraft rules
 */
const arrangedRules = {
    poor: 100,
    fair: 300,
    good: 800,
    veryGood: 1500,
    excellent: 3000
};

/**
 * Interest rates
 */
const interestRates = {
    arranged: 0.05,     // 5% weekly
    unarranged: 0.20    // 20% weekly
};

/**
 * Get arranged overdraft limit
 */
function getArrangedLimit(user) {
    const tier = user.creditTier || "fair";
    return arrangedRules[tier] || 100;
}

/**
 * Apply overdraft usage when spending
 */
async function applyOverdraft(userId, amount) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) return null;

    if (!user.wallet) user.wallet = 0;
    if (!user.overdraft) {
        user.overdraft = {
            arrangedUsed: 0,
            unarrangedUsed: 0,
            limit: getArrangedLimit(user)
        };
    }

    let remaining = amount;

    // STEP 1: wallet first
    if (user.wallet >= remaining) {
        user.wallet -= remaining;
        remaining = 0;
    } else {
        remaining -= user.wallet;
        user.wallet = 0;
    }

    // STEP 2: arranged overdraft
    const arrangedAvailable = user.overdraft.limit - user.overdraft.arrangedUsed;

    if (arrangedAvailable > 0 && remaining > 0) {

        const use = Math.min(arrangedAvailable, remaining);

        user.overdraft.arrangedUsed += use;
        remaining -= use;

        // small credit penalty for reliance
        await decreaseCredit(user, 1, "Used arranged overdraft");
    }

    // STEP 3: unarranged overdraft (danger zone)
    if (remaining > 0) {

        user.overdraft.unarrangedUsed += remaining;

        // heavy credit hit
        await decreaseCredit(user, 10, "Entered unarranged overdraft");
    }

    await user.save();

    return user;
}

/**
 * Weekly interest tick (run via scheduler later)
 */
async function applyOverdraftInterest(user) {

    if (!user.overdraft) return;

    const arrangedInterest =
        user.overdraft.arrangedUsed * interestRates.arranged;

    const unarrangedInterest =
        user.overdraft.unarrangedUsed * interestRates.unarranged;

    const totalInterest = arrangedInterest + unarrangedInterest;

    user.overdraft.arrangedUsed += arrangedInterest;
    user.overdraft.unarrangedUsed += unarrangedInterest;

    // credit penalty for sustained debt
    if (user.overdraft.unarrangedUsed > 0) {
        await decreaseCredit(user, 5, "Overdraft interest penalty");
    }

    return totalInterest;
}

/**
 * Repay overdraft manually
 */
async function repayOverdraft(userId, amount) {

    const user = await EconomyUser.findOne({ userId });

    if (!user || !user.overdraft) {
        return { ok: false, reason: "No overdraft data" };
    }

    let remaining = amount;

    // pay arranged first
    const arrangedPay = Math.min(user.overdraft.arrangedUsed, remaining);
    user.overdraft.arrangedUsed -= arrangedPay;
    remaining -= arrangedPay;

    // then unarranged
    const unarrangedPay = Math.min(user.overdraft.unarrangedUsed, remaining);
    user.overdraft.unarrangedUsed -= unarrangedPay;
    remaining -= unarrangedPay;

    // credit reward for repayment discipline
    if (arrangedPay + unarrangedPay > 0) {
        await increaseCredit(user, 2, "Overdraft repayment");
    }

    await user.save();

    return {
        ok: true,
        remainingArranged: user.overdraft.arrangedUsed,
        remainingUnarranged: user.overdraft.unarrangedUsed
    };
}

module.exports = {
    applyOverdraft,
    applyOverdraftInterest,
    repayOverdraft,
    getArrangedLimit
};