const ShopItem = require("../database/models/ShopItem");
const Inventory = require("../database/models/Inventory");

// =========================
// GET ALL ITEMS
// =========================
async function getShopItems() {
    return ShopItem.find({
        status: "available"
    });
}

// =========================
// GET ITEM
// =========================
async function getItem(itemId) {
    return ShopItem.findById(itemId);
}

// =========================
// GET USER INVENTORY
// =========================
async function getInventory(userId) {

    let inv = await Inventory.findOne({ userId });

    if (!inv) {
        inv = await Inventory.create({
            userId,
            items: []
        });
    }

    return inv;
}

// =========================
// ADD ITEM TO INVENTORY
// =========================
async function addItem(userId, itemId, quantity = 1) {

    const inv = await getInventory(userId);

    const existing = inv.items.find(i => i.itemId.toString() === itemId);

    if (existing) {
        existing.quantity += quantity;
    } else {
        inv.items.push({
            itemId,
            quantity
        });
    }

    await inv.save();

    return inv;
}

// =========================
// REMOVE ITEM
// =========================
async function removeItem(userId, itemId, quantity = 1) {

    const inv = await getInventory(userId);

    const item = inv.items.find(i => i.itemId.toString() === itemId);

    if (!item) return inv;

    item.quantity -= quantity;

    if (item.quantity <= 0) {
        inv.items = inv.items.filter(i => i.itemId.toString() !== itemId);
    }

    await inv.save();

    return inv;
}

module.exports = {
    getShopItems,
    getItem,
    getInventory,
    addItem,
    removeItem
};