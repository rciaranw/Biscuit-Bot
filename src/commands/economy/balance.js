const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { getUser } = require("../../services/economyService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("View your or another user's Twinkies balance.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to check balance for")
                .setRequired(false)
        ),

    async execute(interaction) {

        const target = interaction.options.getUser("user") || interaction.user;

        const economy = await getUser(target.id);

        const total = economy.wallet + economy.bank;

        let status = "🟡 Average Citizen";

        if (total >= 10000) status = "💎 Twinkie Tycoon";
        else if (total >= 5000) status = "🤑 Wealthy Snack Holder";
        else if (total >= 1000) status = "🙂 Comfortable";
        else if (total >= 100) status = "🥲 Getting By";
        else if (total < 50) status = "🪙 Broke & Confused";

        const embed = new EmbedBuilder()
            .setColor(0xF1C40F)
            .setAuthor({
                name: `${target.username}'s Twinkies`,
                iconURL: target.displayAvatarURL()
            })
            .addFields(
                {
                    name: "👛 Wallet",
                    value: `${economy.wallet.toLocaleString()} Twinkies`,
                    inline: true
                },
                {
                    name: "🏦 Bank",
                    value: `${economy.bank.toLocaleString()} Twinkies`,
                    inline: true
                },
                {
                    name: "💰 Total Net Worth",
                    value: `${total.toLocaleString()} Twinkies`,
                    inline: false
                },
                {
                    name: "📊 Status",
                    value: status,
                    inline: false
                }
            )
            .setFooter({
                text: "Twinkies Economy System"
            });

        return interaction.reply({
            embeds: [embed]
        });
    }
};