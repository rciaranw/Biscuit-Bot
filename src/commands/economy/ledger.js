const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getLedger
} = require("../../economy/ledger/ledgerEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ledger")
        .setDescription("View your recent financial transactions")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("View another user's ledger")
                .setRequired(false)
        ),

    async execute(interaction) {

        const target = interaction.options.getUser("user") || interaction.user;

        const entries = await getLedger(target.id, 10);

        if (!entries.length) {
            return interaction.reply({
                content: "No ledger entries found.",
                ephemeral: false
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`📜 Ledger - ${target.username}`)
            .setColor(0x95a5a6)
            .setDescription(
                entries.map(e =>
                    `**${e.type}** | ${e.amount} Twinkies\n<t:${Math.floor(e.timestamp / 1000)}:R>`
                ).join("\n\n")
            )
            .setFooter({
                text: "Bank of Biscuit Audit System"
            });

        return interaction.reply({
            embeds: [embed]
        });
    }
};