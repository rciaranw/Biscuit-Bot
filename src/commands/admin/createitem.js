const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const config = require("../../utils/config");
const ShopItem = require("../../database/models/ShopItem");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createitem")
        .setDescription("Create a shop item")
        .addStringOption(o =>
            o.setName("name").setDescription("Item name").setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("price").setDescription("Item price").setRequired(true)
        )
        .addStringOption(o =>
            o.setName("description").setDescription("Item description").setRequired(true)
        )
        .addIntegerOption(o =>
            o.setName("stock").setDescription("Stock (-1 = infinite)").setRequired(false)
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
        const price = interaction.options.getInteger("price");
        const description = interaction.options.getString("description");
        const stock = interaction.options.getInteger("stock") ?? -1;

        const existing = await ShopItem.findOne({ name });

        if (existing) {
            return interaction.reply({
                content: "Item already exists.",
                ephemeral: true
            });
        }

        const item = await ShopItem.create({
            name,
            price,
            description,
            stock
        });

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Item Created")
                    .setColor(0x2ecc71)
                    .addFields(
                        { name: "Name", value: item.name },
                        { name: "Price", value: `${item.price}` },
                        { name: "Stock", value: stock === -1 ? "Infinite" : `${stock}` }
                    )
            ],
            ephemeral: true
        });
    }
};