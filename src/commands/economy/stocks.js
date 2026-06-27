const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getMarketSnapshot
} = require("../../economy/stocks/marketEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stocks")
        .setDescription("View the stock market"),

    async execute(interaction) {

        const market = getMarketSnapshot();

        const embed = new EmbedBuilder()
            .setTitle("📊 Biscuit Stock Market")
            .setColor(0x9b59b6)
            .setDescription(
                market.map(s =>
                    `**${s.name} (${s.id})**\nPrice: ${s.price} Twinkies\nTrend: ${s.trend >= 0 ? "📈" : "📉"}`
                ).join("\n\n")
            );

        return interaction.reply({
            embeds: [embed]
        });
    }
};