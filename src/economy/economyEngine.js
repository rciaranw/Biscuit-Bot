const EconomyUser = require("../database/models/EconomyUser");

const {
    writeLedger,
    LEDGER_TYPES
} = require("./ledger/ledgerEngine");

/**
 * ADD MONEY (central safe function)
 */
async function addMoney(userId, amount, meta = {}, client = null) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) return null;

    user.wallet = (user.wallet || 0) + amount;

    await user.save();

    await writeLedger({
        userId,
        type: LEDGER_TYPES.INCOME,
        amount,
        balanceAfter: user.wallet,
        meta,
        client
    });

    return user.wallet;
}

/**
 * REMOVE MONEY (central safe function)
 */
async function removeMoney(userId, amount, meta = {}, client = null) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) return null;

    user.wallet = (user.wallet || 0) - amount;

    await user.save();

    await writeLedger({
        userId,
        type: LEDGER_TYPES.EXPENSE,
        amount: -amount,
        balanceAfter: user.wallet,
        meta,
        client
    });

    return user.wallet;
}

module.exports = {
    addMoney,
    removeMoney
};