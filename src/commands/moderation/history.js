const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config/config.json");

const Punishment = require("../../database/models/Punishment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("history")
        .setDescription("View a summary of a user's moderation history")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to check")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const staffRoleId = config.roles.staff;
        const helperRoleId = config.roles.communityHelper;

        const member = interaction.member;

        const hasPermission =
            member.roles.cache.has(staffRoleId) ||
            member.roles.cache.has(helperRoleId) ||
            interaction.user.id === config.adminId;

        if (!hasPermission) {
            return interaction.editReply({
                content: "You don’t have permission to use this command."
            });
        }

        const targetUser = interaction.options.getUser("user");

        const cases = await Punishment.find({
            userId: targetUser.id
        });

        if (!cases.length) {
            return interaction.editReply({
                content: "No history found for this user."
            });
        }

        // -----------------------------
        // Count breakdown
        // -----------------------------
        const summary = {
            warn: 0,
            mute: 0,
            tempmute: 0,
            kick: 0,
            ban: 0,
            tempban: 0,
            unban: 0,
            removewarn: 0
        };

        let activePunishments = 0;

        for (const c of cases) {
            if (summary[c.type] !== undefined) {
                summary[c.type]++;
            }

            if (c.active) {
                activePunishments++;
            }
        }

        // -----------------------------
        // Embed
        // -----------------------------
        const embed = new EmbedBuilder()
            .setTitle(`Moderation History | ${targetUser.tag}`)
            .setColor(0x5865f2)
            .addFields(
                { name: "Warnings", value: `${summary.warn}`, inline: true },
                { name: "Mutes", value: `${summary.mute + summary.tempmute}`, inline: true },
                { name: "Kicks", value: `${summary.kick}`, inline: true },
                { name: "Bans", value: `${summary.ban + summary.tempban}`, inline: true },
                { name: "Unbans", value: `${summary.unban}`, inline: true },
                { name: "Removed Warnings", value: `${summary.removewarn}`, inline: true },
                { name: "Active Punishments", value: `${activePunishments}`, inline: true }
            )
            .setFooter({ text: "System summary view" });

        return interaction.editReply({
            embeds: [embed]
        });
    }
};