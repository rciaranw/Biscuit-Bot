const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    issueCreditCard,
    getCreditCardLimit
} = require("../../economy/creditCard/creditCardEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ccapply")
        .setDescription("Apply for a Bank of Biscuit credit card"),

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

        const result = issueCreditCard(user);

        if (!result.ok) {
            return interaction.reply({
                content: `❌ ${result.reason}`,
                ephemeral: false
            });
        }

        await user.save();

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle("💳 Credit Card Approved")
            .setDescription("Welcome to revolving debt.")
            .addFields(
                {
                    name: "Limit",
                    value: `${result.card.limit} Twinkies`,
                    inline: true
                },
                {
                    name: "Interest Rate",
                    value: `${(result.card.interestRate * 100).toFixed(1)}%`,
                    inline: true
                }
            )
            .setFooter({
                text: "Bank of Biscuit Credit Division"
            });

        return interaction.reply({ embeds: [embed] });
    }
};