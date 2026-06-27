const { SlashCommandBuilder } = require("discord.js");
const { buyItem } = require("../../services/shopService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item from the shop")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("Item ID")
                .setRequired(true)
        ),

    async execute(interaction) {

        const itemId = interaction.options.getString("item");

        try {

            const { item } = await buyItem(interaction.user.id, itemId);

            return interaction.reply({
                content: `🛒 You bought **${item.name}** for **${item.price} Twinkies**`
            });

        } catch (err) {

            return interaction.reply({
                content: err.message,
                ephemeral: true
            });

        }
    }
};