const EconomyUser = require("../../database/models/EconomyUser");

const {
    increaseCredit,
    decreaseCredit,
    getCreditTier
} = require("../credit/creditEngine");

const {
    logTransaction
} = require("../ledger/ledgerEngine");

/**
 * CREDIT CARD LIMITS BASED ON CREDIT SCORE
 */
function getCreditCardLimit(user) {

    const credit = user.creditScore || 50;

    if (credit >= 85) return 5000;
    if (credit >= 70) return 2500;
    if (credit >= 50) return 1000;
    if (credit >= 30) return 500;

    return 0;
}

/**
 * INTEREST RATE (REVOLVING DEBT)
 */
function getCreditCardInterest(user) {

    const credit = user.creditScore || 50;

    if (credit >= 85) return 0.12;
    if (credit >= 70) return 0.18;
    if (credit >= 50) return 0.25;
    if (credit >= 30) return 0.35;

    return 0.5;
}

/**
 * ISSUE CREDIT CARD
 */
function issueCreditCard(user) {

    if (!user.creditCard) user.creditCard = null;

    const limit = getCreditCardLimit(user);

    if (limit <= 0) {
        return {
            ok: false,
            reason: "Credit score too low for credit card"
        };
    }

    user.creditCard = {
        limit,
        balance: 0,
        interestRate: getCreditCardInterest(user),
        active: true,
        createdAt: Date.now(),
        history: []
    };

    increaseCredit(user, 5, "Credit card approved");

    return {
        ok: true,
        card: user.creditCard
    };
}

/**
 * USE CREDIT CARD (SPEND MONEY YOU DON'T HAVE)
 */
function useCreditCard(user, amount, meta = {}) {

    if (!user.creditCard?.active) {
        return {
            ok: false,
            reason: "No active credit card"
        };
    }

    const card = user.creditCard;

    const available = card.limit - card.balance;

    if (amount > available) {
        return {
            ok: false,
            reason: "Credit limit exceeded"
        };
    }

    card.balance += amount;

    card.history.push({
        type: "SPEND",
        amount,
        timestamp: Date.now(),
        meta
    });

    // CREDIT IMPACT (debt increases risk)
    decreaseCredit(user, 2, "Credit card usage");

    logTransaction(user, {
        type: "CREDIT_CARD_SPEND",
        amount: -amount,
        balanceAfter: user.wallet,
        source: "CREDIT_CARD",
        meta
    });

    return {
        ok: true,
        balance: card.balance
    };
}

/**
 * PAY CREDIT CARD
 */
function payCreditCard(user, amount) {

    if (!user.creditCard?.active) {
        return {
            ok: false,
            reason: "No active credit card"
        };
    }

    if ((user.bank || 0) < amount) {
        return {
            ok: false,
            reason: "Insufficient bank balance"
        };
    }

    const card = user.creditCard;

    user.bank -= amount;
    card.balance -= amount;

    if (card.balance < 0) card.balance = 0;

    card.history.push({
        type: "PAYMENT",
        amount,
        timestamp: Date.now()
    });

    addCredit(user, 4, "Credit card payment made");

    logTransaction(user, {
        type: "CREDIT_CARD_PAYMENT",
        amount: -amount,
        balanceAfter: user.bank,
        source: "CREDIT_CARD"
    });

    return {
        ok: true,
        remaining: card.balance
    };
}

/**
 * MONTHLY INTEREST PROCESSOR (HOOK INTO SCHEDULER LATER)
 */
function processCreditCards(user) {

    if (!user.creditCard?.active) return;

    const card = user.creditCard;

    if (card.balance <= 0) return;

    const monthlyInterest = card.balance * card.interestRate;

    card.balance += monthlyInterest;

    card.history.push({
        type: "INTEREST",
        amount: monthlyInterest,
        timestamp: Date.now()
    });

    // HEAVY CREDIT DAMAGE IF HIGH DEBT
    if (card.balance > card.limit * 0.7) {
        removeCredit(user, 5, "High credit card utilization");
    }
}

module.exports = {
    issueCreditCard,
    useCreditCard,
    payCreditCard,
    processCreditCards,
    getCreditCardLimit,
    getCreditCardInterest
};