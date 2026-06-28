const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    takeLoan,
    getMaxLoanAmount,
    getInterestRate
} = require("../../economy/loans/loanEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loan")
        .setDescription("Apply for a loan from the Bank of Biscuit")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Amount you want to borrow")
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {

        const amount = interaction.options.getInteger("amount");

        const user = await EconomyUser.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "❌ No economy profile found.",
                ephemeral: false
            });
        }

        const maximum = getMaxLoanAmount(user);

        if (maximum <= 0) {
            return interaction.reply({
                content: "❌ Your credit score is currently too low to qualify for a loan.",
                ephemeral: false
            });
        }

        const result = await takeLoan(user, amount);

        if (!result.ok) {
            return interaction.reply({
                content: `❌ ${result.reason}`,
                ephemeral: false
            });
        }

        await user.save();

        const loan = result.loan;

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle("🏦 Loan Approved")
            .setDescription("The Bank of Biscuit has approved your application.")
            .addFields(
                {
                    name: "Borrowed",
                    value: `${loan.principal.toLocaleString()} Twinkies`,
                    inline: true
                },
                {
                    name: "Interest",
                    value: `${(loan.interestRate * 100).toFixed(1)}%`,
                    inline: true
                },
                {
                    name: "Monthly Repayment",
                    value: `${loan.repayment.toLocaleString()} Twinkies`,
                    inline: true
                },
                {
                    name: "Remaining Balance",
                    value: `${loan.remaining.toLocaleString()} Twinkies`,
                    inline: true
                },
                {
                    name: "Loan ID",
                    value: loan.id,
                    inline: true
                },
                {
                    name: "Maximum Available",
                    value: `${maximum.toLocaleString()} Twinkies`,
                    inline: true
                }
            )
            .setFooter({
                text: "Remember: the Bank of Biscuit always gets paid."
            });

        return interaction.reply({
            embeds: [embed]
        });
    }
};