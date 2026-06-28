const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    getActiveLoans
} = require("../../economy/loans/loanEngine");

const {
    getOverdraftDebt
} = require("../../economy/overdraft/overdraftEngine");

const {
    getCreditTier
} = require("../../economy/credit/creditEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("View your full financial overview")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("View another user's balance")
                .setRequired(false)
        ),

    async execute(interaction) {

        const targetUser = interaction.options.getUser("user") || interaction.user;

        const user = await EconomyUser.findOne({
            userId: targetUser.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        // =========================
        // CORE VALUES
        // =========================
        const wallet = user.wallet || 0;
        const bank = user.bank || 0;
        const credit = user.creditScore ?? 50;

        // =========================
        // LOANS
        // =========================
        const loans = getActiveLoans(user);
        const loanDebt = loans.reduce((sum, l) => sum + (l.remaining || 0), 0);

        // =========================
        // OVERDRAFT
        // =========================
        const overdraftDebt = getOverdraftDebt(user);

        // =========================
        // NET WORTH CALCULATION
        // =========================
        const netWorth =
            wallet +
            bank -
            loanDebt -
            overdraftDebt;

        // =========================
        // CREDIT TIER
        // =========================
        const tier = getCreditTier(credit);

        // =========================
        // EMBED
        // =========================
        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle(`💰 Financial Overview - ${targetUser.username}`)
            .addFields(
                {
                    name: "💵 Wallet",
                    value: `${wallet} Twinkies`,
                    inline: true
                },
                {
                    name: "🏦 Bank",
                    value: `${bank} Twinkies`,
                    inline: true
                },
                {
                    name: "📉 Loans",
                    value: `${loanDebt} Twinkies`,
                    inline: true
                },
                {
                    name: "⚠️ Overdraft",
                    value: `${overdraftDebt} Twinkies`,
                    inline: true
                },
                {
                    name: "📊 Net Worth",
                    value: `${netWorth} Twinkies`,
                    inline: true
                },
                {
                    name: "🧠 Credit Score",
                    value: `${credit} (${tier})`,
                    inline: true
                }
            )
            .setFooter({
                text: "Bank of Biscuit Financial Overview System"
            });

        // =========================
        // JOB INFO (if exists)
        // =========================
        if (user.job && user.job.title && user.job.title !== "unemployed") {
            embed.addFields({
                name: "💼 Employment",
                value: `Job: **${user.job.title}**
Level: ${user.job.level || 1}
XP: ${user.job.experience || 0}`,
                inline: false
            });
        }

        return interaction.reply({
            embeds: [embed]
        });
    }
};