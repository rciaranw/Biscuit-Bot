const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    getCreditTier
} = require("../../economy/credit/creditEngine");

const {
    getLedger
} = require("../../economy/ledger/ledgerEngine");

const {
    stocks
} = require("../../economy/stocks/stockRegistry");

function calculatePortfolioValue(user) {

    if (!user.portfolio) return 0;

    let total = 0;

    for (const [stockId, qty] of Object.entries(user.portfolio)) {

        const stock = stocks[stockId];

        if (!stock) continue;

        total += stock.price * qty;
    }

    return total;
}

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

        const target = interaction.options.getUser("user") || interaction.user;

        const user = await EconomyUser.findOne({
            userId: target.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        const wallet = user.wallet || 0;
        const bank = user.bank || 0;

        const credit = user.creditScore || 0;
        const tier = getCreditTier(credit);

        const overdraftArranged = user.overdraft?.arrangedUsed || 0;
        const overdraftUnarranged = user.overdraft?.unarrangedUsed || 0;

        const loan = user.loans?.find(l => l.status === "active");

        const portfolioValue = calculatePortfolioValue(user);

        const ledger = await getLedger(target.id, 5);

        const assets = user.assets || [];

        const embed = new EmbedBuilder()
            .setTitle(`📊 Financial Overview — ${target.username}`)
            .setColor(0x2c3e50)
            .addFields(

                {
                    name: "💰 Wallet",
                    value: `${wallet} Twinkies`,
                    inline: true
                },
                {
                    name: "🏦 Bank",
                    value: `${bank} Twinkies`,
                    inline: true
                },
                {
                    name: "📈 Net Worth",
                    value: `${wallet + bank + portfolioValue} Twinkies`,
                    inline: true
                },

                {
                    name: "💳 Credit Score",
                    value: `${credit} (${tier})`,
                    inline: true
                },
                {
                    name: "💸 Loan",
                    value: loan
                        ? `${loan.repayment - loan.paid} remaining`
                        : "None",
                    inline: true
                },
                {
                    name: "🏦 Overdraft",
                    value: `Arranged: ${overdraftArranged}\nUnarranged: ${overdraftUnarranged}`,
                    inline: true
                },

                {
                    name: "📊 Stocks",
                    value: `${portfolioValue} Twinkies`,
                    inline: true
                },
                {
                    name: "🏠 Assets",
                    value: assets.length
                        ? assets.join(", ")
                        : "None",
                    inline: true
                },
                {
                    name: "📜 Recent Activity",
                    value: ledger.length
                        ? ledger.map(l =>
                            `**${l.type}** ${l.amount}`
                        ).join("\n")
                        : "No recent activity"
                }
            )
            .setFooter({
                text: "Bank of Biscuit Financial Intelligence"
            });

        return interaction.reply({
            embeds: [embed]
        });
    }
};