const EconomyUser = require("../database/models/EconomyUser");

/**
 * Get or create an economy profile.
 */
async function getUser(userId) {

    let user = await EconomyUser.findOne({ userId });

    if (!user) {
        user = await EconomyUser.create({ userId });
    }

    return user;
}

/**
 * Wallet
 */
async function addWallet(userId, amount) {

    const user = await getUser(userId);

    user.wallet += amount;
    user.stats.earned += amount;

    await user.save();

    return user;
}

async function removeWallet(userId, amount) {

    const user = await getUser(userId);

    if (user.wallet < amount)
        throw new Error("Insufficient wallet funds.");

    user.wallet -= amount;
    user.stats.spent += amount;

    await user.save();

    return user;
}

/**
 * Bank
 */
async function deposit(userId, amount) {

    const user = await getUser(userId);

    if (user.wallet < amount)
        throw new Error("Insufficient wallet funds.");

    user.wallet -= amount;
    user.bank += amount;

    await user.save();

    return user;
}

async function withdraw(userId, amount) {

    const user = await getUser(userId);

    if (user.bank < amount)
        throw new Error("Insufficient bank funds.");

    user.bank -= amount;
    user.wallet += amount;

    await user.save();

    return user;
}

/**
 * Direct transfer
 */
async function transferMoney(fromId, toId, amount) {

    const sender = await getUser(fromId);
    const receiver = await getUser(toId);

    if (sender.wallet < amount)
        throw new Error("Insufficient wallet funds.");

    sender.wallet -= amount;
    receiver.wallet += amount;

    sender.stats.spent += amount;
    receiver.stats.earned += amount;

    await sender.save();
    await receiver.save();

    return {
        sender,
        receiver
    };
}

module.exports = {
    getUser,
    addWallet,
    removeWallet,
    deposit,
    withdraw,
    transferMoney
};