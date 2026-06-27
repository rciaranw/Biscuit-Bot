const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    requestLoan
} = require("../../economy/loans/loanEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loan")
        .setDescription("Request a loan from the Bank of Biscuit")
        .addIntegerOption(opt =>
            opt.setName("amount")
                .setDescription("Loan amount")
                .setRequired(true)
        ),

    async execute(interaction) {

        const amount = interaction.options.getInteger("amount");

        const result = await requestLoan(interaction.user.id, amount);

        if (!result.ok) {
            return interaction.reply({
                content: `❌ ${result.reason}`,
                ephemeral: false
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("🏦 Loan Approved")
            .setColor(0x2ecc71)
            .addFields(
                {
                    name: "Amount Received",
                    value: `${result.amount} Twinkies`,
                    inline: true
                },
                {
                    name: "Repayment",
                    value: `${result.repayment} Twinkies`,
                    inline: true
                },
                {
                    name: "Interest Rate",
                    value: `${Math.round(result.interest * 100)}%`,
                    inline: true
                }
            )
            .setFooter({
                text: "Bank of Biscuit Lending Division"
            });

        return interaction.reply({
            embeds: [embed]
        });
    }
};