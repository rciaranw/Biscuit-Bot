const ShopItem = require("../database/models/ShopItem");
const EconomyUser = require("../database/models/EconomyUser");

const { getUser } = require("./economyService");

// =========================
// GET SHOP ITEMS
// =========================
async function getShopItems() {
    return ShopItem.find({ stock: { $ne: 0 } });
}

// =========================
// BUY ITEM
// =========================
async function buyItem(userId, itemId) {

    const item = await ShopItem.findOne({ itemId });

    if (!item) throw new Error("Item not found.");
    if (item.stock === 0) throw new Error("Item out of stock.");

    const user = await getUser(userId);

    if (user.wallet < item.price) {
        throw new Error("Not enough Twinkies.");
    }

    user.wallet -= item.price;
    user.stats.spent += item.price;

    // inventory handling
    const existing = user.inventory.find(i => i.itemId === itemId);

    if (existing) {
        existing.quantity += 1;
    } else {
        user.inventory.push({
            itemId,
            quantity: 1
        });
    }

    if (item.stock > 0) {
        item.stock -= 1;
        await item.save();
    }

    await user.save();

    return { user, item };
}

module.exports = {
    getShopItems,
    buyItem
};