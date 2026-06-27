const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("View richest Twinkies users"),

    async execute(interaction) {

        const topUsers = await EconomyUser.find()
            .sort({ wallet: -1 })
            .limit(10);

        const lines = await Promise.all(topUsers.map(async (u, i) => {

            const user = await interaction.client.users.fetch(u.userId).catch(() => null);

            const name = user ? user.username : "Unknown User";
            const total = u.wallet + u.bank;

            return `**${i + 1}. ${name}** — ${total.toLocaleString()} Twinkies`;
        }));

        const embed = new EmbedBuilder()
            .setTitle("🏆 Twinkies Leaderboard")
            .setColor(0xFFD700)
            .setDescription(lines.join("\n"))
            .setFooter({ text: "Top 10 richest users" });

        return interaction.reply({
            embeds: [embed]
        });
    }
};