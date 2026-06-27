const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getUser } = require("../../services/economyService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("View your items"),

    async execute(interaction) {

        const user = await getUser(interaction.user.id);

        const items = user.inventory;

        const embed = new EmbedBuilder()
            .setTitle("🎒 Your Inventory")
            .setColor(0x3498db)
            .setDescription(
                items.length
                    ? items.map(i => `**${i.itemId}** x${i.quantity}`).join("\n")
                    : "You have nothing. Empty. Like your financial decisions."
            );

        return interaction.reply({ embeds: [embed] });
    }
};