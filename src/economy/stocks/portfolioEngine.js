const EconomyUser = require("../../database/models/EconomyUser");
const { getStock } = require("./stockRegistry");

async function buyStock(userId, stockId, quantity) {

    const user = await EconomyUser.findOne({ userId });
    const stock = getStock(stockId);

    if (!user || !stock) {
        return { ok: false, reason: "Invalid user or stock" };
    }

    const cost = stock.price * quantity;

    if ((user.wallet || 0) < cost) {
        return { ok: false, reason: "Insufficient funds" };
    }

    user.wallet -= cost;

    if (!user.portfolio) user.portfolio = {};

    if (!user.portfolio[stockId]) {
        user.portfolio[stockId] = 0;
    }

    user.portfolio[stockId] += quantity;

    await user.save();

    return {
        ok: true,
        stock: stock.name,
        spent: cost
    };
}

async function sellStock(userId, stockId, quantity) {

    const user = await EconomyUser.findOne({ userId });
    const stock = getStock(stockId);

    if (!user || !stock) {
        return { ok: false, reason: "Invalid user or stock" };
    }

    if (!user.portfolio?.[stockId] || user.portfolio[stockId] < quantity) {
        return { ok: false, reason: "Not enough shares" };
    }

    const gain = stock.price * quantity;

    user.portfolio[stockId] -= quantity;
    user.wallet += gain;

    await user.save();

    return {
        ok: true,
        earned: gain
    };
}

module.exports = {
    buyStock,
    sellStock
};