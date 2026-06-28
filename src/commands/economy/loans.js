const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    getActiveLoans
} = require("../../economy/loans/loanEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loans")
        .setDescription("View your active loans"),

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

        const loans = getActiveLoans(user);

        const embed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle("🏦 Active Loans");

        if (!loans.length) {
            embed.setDescription("You have no active loans.");
            return interaction.reply({ embeds: [embed] });
        }

        const loanText = loans.map(l => {

            return `**ID:** ${l.id}
💰 Remaining: ${l.remaining}
📈 Interest: ${(l.interestRate * 100).toFixed(1)}%
📅 Created: <t:${Math.floor(l.createdAt / 1000)}:R>`;
        }).join("\n\n");

        embed.setDescription(loanText);

        return interaction.reply({
            embeds: [embed]
        });
    }
};