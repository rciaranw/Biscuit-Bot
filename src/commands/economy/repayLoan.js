const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    repayLoan
} = require("../../economy/loans/loanEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("repayloan")
        .setDescription("Repay your active loan")
        .addIntegerOption(opt =>
            opt.setName("amount")
                .setDescription("Amount to repay")
                .setRequired(true)
        ),

    async execute(interaction) {

        const amount = interaction.options.getInteger("amount");

        const result = await repayLoan(interaction.user.id, amount);

        if (!result.ok) {
            return interaction.reply({
                content: `❌ ${result.reason}`,
                ephemeral: false
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("💸 Loan Repayment")
            .setColor(0xf1c40f)
            .addFields(
                {
                    name: "Paid",
                    value: `${amount} Twinkies`,
                    inline: true
                },
                {
                    name: "Remaining",
                    value: `${result.remaining} Twinkies`,
                    inline: true
                }
            )
            .setFooter({
                text: "Bank of Biscuit Credit System"
            });

        return interaction.reply({
            embeds: [embed]
        });
    }
};