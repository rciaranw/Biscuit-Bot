function parseDuration(input) {
    if (!input) return null;

    const match = input.toLowerCase().match(/^(\d+)(s|m|h|d)$/);

    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
    };

    return value * multipliers[unit];
}

module.exports = {
    parseDuration
};