const { stocks } = require("./stockRegistry");

/**
 * Simulate market movement
 */
function updateMarket() {

    for (const stock of Object.values(stocks)) {

        const change =
            (Math.random() - 0.5) *
            stock.volatility *
            stock.price;

        stock.price = Math.max(1, Math.floor(stock.price + change));

        // trend tracking (simple momentum)
        stock.trend = change;
    }

    return stocks;
}

function getMarketSnapshot() {
    return Object.values(stocks).map(s => ({
        id: s.id,
        name: s.name,
        price: s.price,
        trend: s.trend
    }));
}

module.exports = {
    updateMarket,
    getMarketSnapshot
};