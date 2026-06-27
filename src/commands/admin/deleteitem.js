const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const config = require("../../utils/config");
const ShopItem = require("../../database/models/ShopItem");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deleteitem")
        .setDescription("Delete a shop item")
        .addStringOption(o =>
            o.setName("name").setDescription("Item name").setRequired(true)
        ),

    async execute(interaction) {

        const adminId = config.adminId;

        if (Array.isArray(adminId)) {
            if (!adminId.includes(interaction.user.id)) {
                return interaction.reply({
                    content: "You are not allowed to use this command.",
                    ephemeral: true
                });
            }
        } else {
            if (interaction.user.id !== adminId) {
                return interaction.reply({
                    content: "You are not allowed to use this command.",
                    ephemeral: true
                });
            }
        }

        const name = interaction.options.getString("name");

        const item = await ShopItem.findOneAndDelete({ name });

        if (!item) {
            return interaction.reply({
                content: "Item not found.",
                ephemeral: true
            });
        }

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Item Deleted")
                    .setColor(0xe74c3c)
                    .setDescription(`Deleted **${item.name}**`)
            ],
            ephemeral: true
        });
    }
};