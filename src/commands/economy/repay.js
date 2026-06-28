const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    repayLoan
} = require("../../economy/loans/loanEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("repay")
        .setDescription("Repay a loan")
        .addStringOption(opt =>
            opt.setName("loanid")
                .setDescription("Loan ID")
                .setRequired(true)
        )
        .addIntegerOption(opt =>
            opt.setName("amount")
                .setDescription("Amount to repay")
                .setRequired(true)
        ),

    async execute(interaction) {

        const loanId = interaction.options.getString("loanid");
        const amount = interaction.options.getInteger("amount");

        const user = await EconomyUser.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        const result = repayLoan(user, loanId, amount);

        if (!result.ok) {
            return interaction.reply({
                content: `❌ ${result.reason}`,
                ephemeral: false
            });
        }

        await user.save();

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle("💸 Loan Repayment")
            .setDescription(`You repaid **${amount} Twinkies**`)
            .addFields({
                name: "Status",
                value: result.completed ? "Loan Fully Repaid 🎉" : "Partial repayment",
                inline: false
            });

        return interaction.reply({
            embeds: [embed]
        });
    }
};