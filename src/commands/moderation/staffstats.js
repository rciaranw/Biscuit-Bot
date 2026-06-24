const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config/config.json");

const Punishment = require("../../database/models/Punishment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("staffstats")
        .setDescription("View monthly staff punishment leaderboard"),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const member = interaction.member;

        const hasPermission =
            member.roles.cache.has(config.roles.staff) ||
            member.roles.cache.has(config.roles.headModerator) ||
            interaction.user.id === config.adminId;

        if (!hasPermission) {
            return interaction.editReply({
                content: "You don’t have permission to use this command."
            });
        }

        // -----------------------------
        // Date range (current month)
        // -----------------------------
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const punishments = await Punishment.find({
            createdAt: { $gte: startOfMonth }
        });

        if (!punishments.length) {
            return interaction.editReply({
                content: "No moderation activity this month yet."
            });
        }

        // -----------------------------
        // Group by moderator
        // -----------------------------
        const stats = {};

        for (const p of punishments) {
            if (!p.moderatorId) continue;

            if (!stats[p.moderatorId]) {
                stats[p.moderatorId] = {
                    total: 0,
                    warn: 0,
                    mute: 0,
                    tempmute: 0,
                    kick: 0,
                    ban: 0,
                    tempban: 0
                };
            }

            stats[p.moderatorId].total++;

            if (stats[p.moderatorId][p.type] !== undefined) {
                stats[p.moderatorId][p.type]++;
            }
        }

        // -----------------------------
        // Sort leaderboard
        // -----------------------------
        const sorted = Object.entries(stats)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10);

        // -----------------------------
        // Build output
        // -----------------------------
        const lines = await Promise.all(
            sorted.map(async ([modId, data], index) => {
                let userTag = modId;

                try {
                    const user = await interaction.client.users.fetch(modId);
                    userTag = user.tag;
                } catch {}

                return `**${index + 1}. ${userTag}** — ${data.total} actions`;
            })
        );

        const embed = new EmbedBuilder()
            .setTitle("Staff Leaderboard (This Month)")
            .setColor(0xf1c40f)
            .setDescription(lines.join("\n"))
            .setFooter({ text: "Based on moderation actions logged in MongoDB" });

        return interaction.editReply({
            embeds: [embed]
        });
    }
};