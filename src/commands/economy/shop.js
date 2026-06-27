const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { getShopItems } = require("../../services/shopService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("View the Twinkie shop"),

    async execute(interaction) {

        const items = await getShopItems();

        if (!items.length) {
            return interaction.reply({
                content: "The shop is empty.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("🏪 Twinkie Shop")
            .setColor(0xf1c40f)
            .setDescription(
                items.map(item => {

                    const stock =
                        item.stock === -1
                            ? "∞"
                            : item.stock <= 0
                                ? "OUT OF STOCK"
                                : item.stock;

                    return [
                        `**${item.name}**`,
                        `${item.description}`,
                        `💰 ${item.price} Twinkies | 📦 Stock: ${stock}`,
                        `ID: \`${item._id}\``
                    ].join("\n");
                }).join("\n\n")
            );

        return interaction.reply({
            embeds: [embed]
        });
    }
};