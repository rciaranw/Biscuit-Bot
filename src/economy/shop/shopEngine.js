const EconomyUser = require("../../database/models/EconomyUser");

const {
    removeMoney
} = require("../economyEngine");

const {
    LEDGER_TYPES,
    writeLedger
} = require("../ledger/ledgerEngine");

async function buyItem(userId, item, client) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) return { ok: false };

    const cost = item.price;

    if ((user.wallet || 0) < cost) {
        return { ok: false, reason: "Not enough funds" };
    }

    await removeMoney(userId, cost, {
        item: item.name
    }, client);

    await writeLedger({
        userId,
        type: LEDGER_TYPES.SHOP,
        amount: -cost,
        meta: {
            item: item.name
        },
        client
    });

    if (!user.assets) user.assets = [];

    user.assets.push(item.name);

    await user.save();

    return { ok: true };
}

module.exports = {
    buyItem
};