const { SlashCommandBuilder } = require("discord.js");
const config = require("../../config/config.json");

const { createCase } = require("../../services/caseService");
const { parseDuration } = require("../../utils/durationsParser");
const { safeDm } = require("../../utils/safeDm");
const { logCase } = require("../../utils/logCase");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tempmute")
        .setDescription("Temporarily mute a user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to mute")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("duration")
                .setDescription("Mute duration (e.g. 10m, 2h, 1d)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for mute")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const staffRoleId = config.roles.staff;
        const adminId = config.adminId;
        const mutedRoleId = config.roles.muted;

        const member = interaction.member;
        const targetUser = interaction.options.getUser("user");
        const targetMember = await interaction.guild.members.fetch(targetUser.id);
        const durationInput = interaction.options.getString("duration");
        const reason = interaction.options.getString("reason");

        // -----------------------------
        // Permission check
        // -----------------------------
        if (!member.roles.cache.has(staffRoleId)) {
            return interaction.editReply({
                content: "You don’t have permission to use this command."
            });
        }

        // -----------------------------
        // Self protection
        // -----------------------------
        if (targetUser.id === interaction.user.id) {
            return interaction.editReply({
                content: "You can’t mute yourself."
            });
        }

        // -----------------------------
        // Admin protection
        // -----------------------------
        if (targetUser.id === adminId) {
            return interaction.editReply({
                content: "You can’t mute the admin."
            });
        }

        // -----------------------------
        // Staff protection
        // -----------------------------
        if (targetMember.roles.cache.has(staffRoleId)) {
            return interaction.editReply({
                content: "You can’t mute staff members."
            });
        }

        // -----------------------------
        // Parse duration
        // -----------------------------
        const durationMs = parseDuration(durationInput);

        if (!durationMs) {
            return interaction.editReply({
                content: "Invalid duration. Use formats like 10m, 1h, 1d."
            });
        }

        // -----------------------------
        // Staff limit (24h cap)
        // -----------------------------
        const isAdmin = interaction.user.id === adminId;

        if (!isAdmin && durationMs > 86400000) {
            return interaction.editReply({
                content: "Staff can only mute up to 24 hours."
            });
        }

        // Discord timeout max (28 days)
        if (durationMs > 2419200000) {
            return interaction.editReply({
                content: "Maximum mute duration is 28 days."
            });
        }

        const expiresAt = new Date(Date.now() + durationMs);

        // -----------------------------
        // Apply timeout
        // -----------------------------
        await targetMember.timeout(durationMs, reason);

        // -----------------------------
        // Add muted role
        // -----------------------------
        await targetMember.roles.add(mutedRoleId).catch(() => null);

        // -----------------------------
        // Create case
        // -----------------------------
        const caseData = await createCase({
            userId: targetUser.id,
            moderatorId: interaction.user.id,
            type: "tempmute",
            reason,
            duration: durationInput,
            expiresAt
        });

        // -----------------------------
        // DM user (safe)
        // -----------------------------
        await safeDm(targetUser, {
            content:
                `You were temporarily muted in **${interaction.guild.name}**\n` +
                `Duration: ${durationInput}\n` +
                `Reason: ${reason}\n` +
                `Case #${caseData.caseId}`
        });

        // -----------------------------
        // Log case
        // -----------------------------
        await logCase(interaction.client, caseData);

        // -----------------------------
        // Reply
        // -----------------------------
        await interaction.editReply({
            content: `Case #${caseData.caseId} | ${targetUser.tag} has been muted for ${durationInput}`
        });
    }
};