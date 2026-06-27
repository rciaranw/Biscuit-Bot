const config = require("./config");

/**
 * Centralised economy logger
 * Logs ALL monetary changes to Discord channel
 */
async function logMoney(client, data) {

    try {
        if (!client || !config?.channels?.moneyLogs) return;

        const channel = await client.channels.fetch(config.channels.moneyLogs)
            .catch(() => null);

        if (!channel) return;

        const {
            userId,
            type,
            amount,
            walletAfter,
            bankAfter,
            reason
        } = data;

        const isPositive = amount >= 0;

        const formattedAmount = `${isPositive ? "📈 +" : "📉 -"}${Math.abs(amount)} Twinkies`;

        const embedLines = [
            `💰 **Economy Transaction Logged**`,
            ``,
            `👤 User: <@${userId}>`,
            `📊 Type: **${type}**`,
            `💸 Amount: ${formattedAmount}`,
            `🏦 Wallet After: ${walletAfter !== undefined ? walletAfter : "N/A"}`,
            `🏛️ Bank After: ${bankAfter !== undefined ? bankAfter : "N/A"}`,
            ``,
            `📝 Reason: ${reason || "No reason provided"}`
        ];

        await channel.send({
            content: embedLines.join("\n")
        });

    } catch (err) {
        console.error("Money logger error:", err);
    }
}

module.exports = {
    logMoney
};