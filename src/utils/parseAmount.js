module.exports = function parseAmount(input, balance) {

    if (!input) return null;

    if (typeof input === "string") {
        input = input.toLowerCase();
    }

    if (input === "all") {
        return balance;
    }

    const amount = parseInt(input);

    if (isNaN(amount) || amount <= 0) {
        return null;
    }

    if (amount > balance) {
        return null;
    }

    return amount;
};