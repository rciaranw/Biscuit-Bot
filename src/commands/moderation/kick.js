const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config/config.json");

const { createCase } = require("../../services/caseService");
const { safeDm } = require("../../utils/safeDm");
const { logCase } = require("../../utils/logCase");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user from the server")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to kick")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for kick")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const staffRoleId = config.roles.staff;
        const adminId = config.adminId;

        const member = interaction.member;
        const targetUser = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        // -----------------------------
        // Permission check
        // -----------------------------
        const hasPermission =
            member.roles.cache.has(staffRoleId) ||
            interaction.user.id === adminId;

        if (!hasPermission) {
            return interaction.editReply({
                content: "You don’t have permission to use this command."
            });
        }

        // -----------------------------
        // Self kick protection
        // -----------------------------
        if (targetUser.id === interaction.user.id) {
            return interaction.editReply({
                content: "You can’t kick yourself."
            });
        }

        // -----------------------------
        // Admin protection
        // -----------------------------
        if (targetUser.id === adminId) {
            return interaction.editReply({
                content: "You can’t kick the admin."
            });
        }

        if (!targetMember) {
            return interaction.editReply({
                content: "User is not in this server."
            });
        }

        // -----------------------------
        // Kick action
        // -----------------------------
        await targetMember.kick(reason).catch(() => null);

        // -----------------------------
        // Create case
        // -----------------------------
        const caseData = await createCase({
            userId: targetUser.id,
            moderatorId: interaction.user.id,
            type: "kick",
            reason,
            duration: null,
            expiresAt: null
        });

        // -----------------------------
        // DM user (best effort)
        // -----------------------------
        await safeDm(targetUser, {
            content:
                `You were kicked from **${interaction.guild.name}**\n` +
                `Reason: ${reason}\n` +
                `Case #${caseData.caseId}`
        });

        // -----------------------------
        // Log case
        // -----------------------------
        await logCase(interaction.client, caseData);

        // -----------------------------
        // Reply to moderator
        // -----------------------------
        return interaction.editReply({
            content: `User ${targetUser.tag} has been kicked. Case #${caseData.caseId}`
        });
    }
};