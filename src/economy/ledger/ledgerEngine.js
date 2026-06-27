const EconomyUser = require("../../database/models/EconomyUser");
const config = require("../../utils/config");

const LEDGER_TYPES = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE",
    TRANSFER: "TRANSFER",
    LOAN: "LOAN",
    TAX: "TAX",
    SHOP: "SHOP",
    STOCK: "STOCK",
    OVERDRAFT: "OVERDRAFT",
    JOB: "JOB",
    ROB: "ROB"
};

/**
 * Write ledger entry
 */
async function writeLedger({
    userId,
    type,
    amount,
    balanceAfter = null,
    meta = {},
    client = null
}) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) return null;

    if (!user.ledger) user.ledger = [];

    const entry = {
        type,
        amount,
        balanceAfter: balanceAfter ?? user.wallet,
        meta,
        timestamp: Date.now()
    };

    user.ledger.push(entry);

    // cap ledger size
    if (user.ledger.length > 200) {
        user.ledger.shift();
    }

    await user.save();

    // Discord log channel
    if (client && config.channels?.moneyLogs) {

        const channel = client.channels.cache.get(config.channels.moneyLogs);

        if (channel) {
            channel.send(
                `📜 **LEDGER** | <@${userId}> | ${type} | ${amount} Twinkies`
            );
        }
    }

    return entry;
}

/**
 * Get recent ledger entries
 */
async function getLedger(userId, limit = 10) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) return [];

    return (user.ledger || [])
        .slice(-limit)
        .reverse();
}

/**
 * Snapshot for balance command
 */
async function getFinancialSnapshot(userId) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) return null;

    return {
        wallet: user.wallet || 0,
        bank: user.bank || 0,
        credit: user.creditScore || 0,
        overdraft: user.overdraft || null,
        loans: user.loans || [],
        portfolio: user.portfolio || {},
        assets: user.assets || [],
        ledgerCount: user.ledger?.length || 0
    };
}

module.exports = {
    writeLedger,
    getLedger,
    getFinancialSnapshot,
    LEDGER_TYPES
};