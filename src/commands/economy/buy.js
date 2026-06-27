const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const ShopItem = require("../../database/models/ShopItem");

const {
    getInventory,
    addItem
} = require("../../services/shopService");

const { getUser, removeWallet } = require("../../services/economyService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item from the shop")
        .addStringOption(o =>
            o.setName("item").setDescription("Item name or ID").setRequired(true)
        ),

    async execute(interaction) {

        const input = interaction.options.getString("item");
        const userId = interaction.user.id;

        const user = await getUser(userId);

        const item =
            (await ShopItem.findById(input)) ||
            (await ShopItem.findOne({ name: new RegExp(`^${input}$`, "i") }));

        if (!item) {
            return interaction.reply({
                content: "Item not found.",
                ephemeral: true
            });
        }

        if (item.status !== "available") {
            return interaction.reply({
                content: "This item is not available.",
                ephemeral: true
            });
        }

        if (item.stock !== -1 && item.stock <= 0) {
            return interaction.reply({
                content: "This item is out of stock.",
                ephemeral: true
            });
        }

        if (user.wallet < item.price) {
            return interaction.reply({
                content: "Not enough Twinkies.",
                ephemeral: true
            });
        }

        await removeWallet(userId, item.price);

        await addItem(userId, item._id, 1);

        if (item.stock !== -1) {
            item.stock -= 1;
            await item.save();
        }

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("🛒 Purchase Successful")
                    .setColor(0x2ecc71)
                    .setDescription(`You bought **${item.name}** for ${item.price} Twinkies`)
            ],
            ephemeral: true
        });
    }
};