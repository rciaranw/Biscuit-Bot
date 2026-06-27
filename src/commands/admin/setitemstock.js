const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const config = require("../../utils/config");
const ShopItem = require("../../database/models/ShopItem");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setitemstock")
        .setDescription("Set item stock")
        .addStringOption(o =>
            o.setName("name").setDescription("Item name").setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("stock").setDescription("Stock amount").setRequired(true)
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
        const stock = interaction.options.getInteger("stock");

        const item = await ShopItem.findOne({ name });

        if (!item) {
            return interaction.reply({
                content: "Item not found.",
                ephemeral: true
            });
        }

        item.stock = stock;
        await item.save();

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Stock Updated")
                    .setColor(0xf1c40f)
                    .setDescription(`${item.name} stock set to ${stock}`)
            ],
            ephemeral: true
        });
    }
};