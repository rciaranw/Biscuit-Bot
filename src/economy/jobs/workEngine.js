const EconomyUser = require("../../database/models/EconomyUser");

const {
    addMoney
} = require("../economyEngine");

const {
    writeLedger,
    LEDGER_TYPES
} = require("../ledger/ledgerEngine");

/**
 * Process a work action (NO COMMAND YET)
 */
async function processWork(userId, client) {

    const user = await EconomyUser.findOne({ userId });

    if (!user || !user.job) {
        return {
            ok: false,
            reason: "No job assigned"
        };
    }

    const now = Date.now();
    const cooldown = 1000 * 60 * 60 * 6; // 6 hours

    if (user.job.lastWorked && now - user.job.lastWorked < cooldown) {
        return {
            ok: false,
            reason: "Cooldown active"
        };
    }

    const basePay = user.job.basePay || 100;

    // streak system
    user.job.streak = (user.job.streak || 0) + 1;

    let multiplier = 1;

    if (user.job.streak % 7 === 0) {
        multiplier += 0.15; // pay rise every 7 works
    }

    const payout = Math.floor(basePay * multiplier);

    await addMoney(userId, payout, {
        reason: "Work income"
    }, client);

    await writeLedger({
        userId,
        type: LEDGER_TYPES.JOB,
        amount: payout,
        meta: {
            job: user.job.id,
            streak: user.job.streak
        },
        client
    });

    user.job.lastWorked = now;

    await user.save();

    return {
        ok: true,
        payout,
        streak: user.job.streak
    };
}

module.exports = {
    processWork
};