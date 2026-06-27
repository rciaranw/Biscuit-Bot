const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getAllItems
} = require("../../economy/shop/shopCatalog");

const {
    buyItem
} = require("../../economy/shop/shopEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("View or buy items")
        .addStringOption(opt =>
            opt.setName("item")
                .setDescription("Item to buy")
                .setRequired(false)
                .addChoices(
                    ...getAllItems().map(i => ({
                        name: `${i.name} - ${i.price} Twinkies`,
                        value: i.id
                    }))
                )
        ),

    async execute(interaction, client) {

        const itemId = interaction.options.getString("item");

        // VIEW SHOP
        if (!itemId) {

            const items = getAllItems();

            const embed = new EmbedBuilder()
                .setTitle("🏪 Biscuit Shop")
                .setColor(0xf1c40f)
                .setDescription(
                    items.map(i =>
                        `**${i.name}** - ${i.price} Twinkies\n_${i.description}_`
                    ).join("\n\n")
                );

            return interaction.reply({
                embeds: [embed]
            });
        }

        // BUY ITEM
        const result = await buyItem(interaction.user.id, itemId, client);

        if (!result.ok) {
            return interaction.reply({
                content: `❌ ${result.reason}`,
                ephemeral: false
            });
        }

        return interaction.reply({
            content: `🛒 You bought **${result.item}** for ${result.price} Twinkies`,
            ephemeral: false
        });
    }
};