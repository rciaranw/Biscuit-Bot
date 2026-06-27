const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const config = require("../../utils/config");
const ShopItem = require("../../database/models/ShopItem");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setitemstatus")
        .setDescription("Enable or disable a shop item")
        .addStringOption(o =>
            o.setName("name").setDescription("Item name").setRequired(true)
        )
        .addStringOption(o =>
            o.setName("status")
                .setDescription("available / disabled")
                .setRequired(true)
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
        const status = interaction.options.getString("status");

        if (!["available", "disabled"].includes(status)) {
            return interaction.reply({
                content: "Invalid status.",
                ephemeral: true
            });
        }

        const item = await ShopItem.findOne({ name });

        if (!item) {
            return interaction.reply({
                content: "Item not found.",
                ephemeral: true
            });
        }

        item.status = status;
        await item.save();

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Status Updated")
                    .setColor(0x3498db)
                    .setDescription(`${item.name} is now ${status}`)
            ],
            ephemeral: true
        });
    }
};