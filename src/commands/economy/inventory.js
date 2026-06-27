const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const Inventory = require("../../database/models/Inventory");
const ShopItem = require("../../database/models/ShopItem");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("View your inventory"),

    async execute(interaction) {

        const inv = await Inventory.findOne({
            userId: interaction.user.id
        }).populate("items.itemId");

        if (!inv || !inv.items.length) {
            return interaction.reply({
                content: "Your inventory is empty.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("🎒 Inventory")
            .setColor(0x95a5a6)
            .setDescription(
                inv.items.map(i => {
                    const item = i.itemId;
                    if (!item) return null;

                    return `**${item.name}** x${i.quantity}`;
                }).filter(Boolean).join("\n")
            );

        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};