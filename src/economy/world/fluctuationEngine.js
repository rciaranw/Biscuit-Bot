const {
    stocks
} = require("../stocks/stockRegistry");

const EconomyUser = require("../../database/models/EconomyUser");

let economyState = {
    inflation: 1.0,
    interestRate: 0.05,
    marketMood: 0 // -1 bearish, +1 bullish
};

/**
 * Runs every cycle (you will later attach to cron / interval)
 */
async function tickEconomy(client) {

    // random global shift
    const shift = (Math.random() - 0.5) * 0.05;

    economyState.inflation = Math.max(0.8, Math.min(1.8, economyState.inflation + shift));

    economyState.marketMood = (Math.random() - 0.5);

    // interest rate reacts to inflation
    economyState.interestRate = Math.max(
        0.01,
        Math.min(0.2, economyState.inflation * 0.04)
    );

    // push stock volatility
    for (const stock of Object.values(stocks)) {

        stock.volatility = Math.max(
            0.01,
            Math.min(0.5, stock.volatility + economyState.marketMood * 0.01)
        );
    }

    // optional logging channel hook later
    console.log("[ECONOMY] Tick updated:", economyState);

    return economyState;
}

function getEconomyState() {
    return economyState;
}

module.exports = {
    tickEconomy,
    getEconomyState
};