const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("creditcard")
        .setDescription("View your credit card details"),

    async execute(interaction) {

        const user = await EconomyUser.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        const card = user.creditCard;

        if (!card || !card.active) {
            return interaction.reply({
                content: "❌ You do not have an active credit card. Use /ccapply",
                ephemeral: false
            });
        }

        const available = card.limit - card.balance;

        const embed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle("💳 Credit Card Overview")
            .addFields(
                {
                    name: "Limit",
                    value: `${card.limit}`,
                    inline: true
                },
                {
                    name: "Balance",
                    value: `${card.balance}`,
                    inline: true
                },
                {
                    name: "Available",
                    value: `${available}`,
                    inline: true
                },
                {
                    name: "Interest",
                    value: `${(card.interestRate * 100).toFixed(1)}%`,
                    inline: true
                }
            )
            .setFooter({
                text: "Bank of Biscuit Credit System"
            });

        return interaction.reply({ embeds: [embed] });
    }
};