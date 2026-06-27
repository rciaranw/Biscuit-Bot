const shopItems = {

    /* =========================
        BASIC ITEMS
    ========================= */
    phone: {
        id: "phone",
        name: "Smartphone",
        price: 500,
        type: "asset",
        description: "Required for most modern jobs"
    },

    laptop: {
        id: "laptop",
        name: "Laptop",
        price: 1200,
        type: "asset",
        description: "Useful for finance, tech, and remote jobs"
    },

    /* =========================
        TRANSPORT
    ========================= */
    bicycle: {
        id: "bicycle",
        name: "Bicycle",
        price: 150,
        type: "asset",
        description: "Basic transport"
    },

    car: {
        id: "car",
        name: "Car",
        price: 5000,
        type: "asset",
        description: "Required for delivery driver, paramedic etc"
    },

    /* =========================
        HOUSING (FUTURE CREDIT SYSTEM)
    ========================= */
    rentedFlat: {
        id: "rentedFlat",
        name: "Rented Flat",
        price: 1500,
        type: "asset",
        description: "Improves stability + credit score"
    },

    house: {
        id: "house",
        name: "House",
        price: 25000,
        type: "asset",
        description: "Long term financial stability"
    },

    /* =========================
        LUXURY ITEMS (FUTURE CREDIT + INFLATION HOOK)
    ========================= */
    luxuryWatch: {
        id: "luxuryWatch",
        name: "Luxury Watch",
        price: 10000,
        type: "luxury",
        description: "No gameplay benefit. Just flexing."
    },

    gamingPC: {
        id: "gamingPC",
        name: "Gaming PC",
        price: 3000,
        type: "luxury",
        description: "Improves lifestyle score"
    }

};

function getItem(itemId) {
    return shopItems[itemId];
}

function getAllItems() {
    return Object.values(shopItems);
}

module.exports = {
    shopItems,
    getItem,
    getAllItems
};