const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getShopItems } = require("../../services/shopService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("View the Twinkies shop"),

    async execute(interaction) {

        const items = await getShopItems();

        const embed = new EmbedBuilder()
            .setTitle("🏪 Twinkies Shop")
            .setColor(0xf1c40f)
            .setDescription(
                items.length
                    ? items.map(i =>
                        `**${i.name}** — ${i.price} Twinkies\n_${i.description}_\nID: \`${i.itemId}\`\n`
                    ).join("\n")
                    : "No items available."
            );

        return interaction.reply({ embeds: [embed] });
    }
};