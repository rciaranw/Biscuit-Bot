const stocks = {
    BISC: {
        id: "BISC",
        name: "Biscuit Corp",
        price: 100,
        volatility: 0.05,
        trend: 0
    },

    TWNK: {
        id: "TWNK",
        name: "Twinkie Industries",
        price: 50,
        volatility: 0.12,
        trend: 0
    },

    LOTT: {
        id: "LOTT",
        name: "Lottery Holdings",
        price: 200,
        volatility: 0.25,
        trend: 0
    },

    GOVB: {
        id: "GOVB",
        name: "Gov Bonds",
        price: 500,
        volatility: 0.01,
        trend: 0
    }
};

function getStock(id) {
    return stocks[id];
}

function getAllStocks() {
    return Object.values(stocks);
}

module.exports = {
    stocks,
    getStock,
    getAllStocks
};