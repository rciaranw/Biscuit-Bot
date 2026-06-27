const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getCreditTier,
    ensureCredit
} = require("../../economy/credit/creditEngine");

const EconomyUser = require("../../database/models/EconomyUser");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("credit")
        .setDescription("View your credit score or another user's")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("User to check")
                .setRequired(false)
        ),

    async execute(interaction) {

        const target = interaction.options.getUser("user") || interaction.user;

        const user = await EconomyUser.findOne({ userId: target.id });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        await ensureCredit(user);

        const tier = getCreditTier(user.creditScore);

        const embed = new EmbedBuilder()
            .setTitle("💳 Credit Report")
            .setColor(0x3498db)
            .addFields(
                {
                    name: "User",
                    value: `<@${target.id}>`,
                    inline: true
                },
                {
                    name: "Credit Score",
                    value: `${user.creditScore}`,
                    inline: true
                },
                {
                    name: "Tier",
                    value: tier.toUpperCase(),
                    inline: true
                }
            )
            .setFooter({
                text: "Bank of Biscuit Credit Bureau"
            });

        return interaction.reply({
            embeds: [embed]
        });
    }
};