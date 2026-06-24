const { SlashCommandBuilder } = require("discord.js");
const config = require("../../config/config.json");

const Punishment = require("../../database/models/Punishment");
const { createCase } = require("../../services/caseService");
const { safeDm } = require("../../utils/safeDm");
const { logCase } = require("../../utils/logCase");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Remove a mute from a user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to unmute")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for unmute")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const headModRoleId = config.roles.headModerator;
        const ciaranRoleId = config.roles.ciaran;
        const mutedRoleId = config.roles.muted;

        const member = interaction.member;

        // -----------------------------
        // Permission check
        // Head Mod OR Ciaran OR Admin
        // -----------------------------
        const hasPermission =
            member.roles.cache.has(headModRoleId) ||
            member.roles.cache.has(ciaranRoleId) ||
            interaction.user.id === config.adminId;

        if (!hasPermission) {
            return interaction.editReply({
                content: "You don’t have permission to use this command."
            });
        }

        const targetUser = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const targetMember = await interaction.guild.members
            .fetch(targetUser.id)
            .catch(() => null);

        if (!targetMember) {
            return interaction.editReply({
                content: "User not found in this server."
            });
        }

        // -----------------------------
        // Check if user is actually muted
        // -----------------------------
        const isTimedOut =
            targetMember.communicationDisabledUntil &&
            targetMember.communicationDisabledUntil > new Date();

        const hasMutedRole =
            targetMember.roles.cache.has(mutedRoleId);

        const isActuallyMuted = isTimedOut || hasMutedRole;

        if (!isActuallyMuted) {
            return interaction.editReply({
                content: "This user is not currently muted."
            });
        }

        // -----------------------------
        // Remove Discord timeout + role
        // -----------------------------
        await targetMember.timeout(null).catch(() => null);
        await targetMember.roles.remove(mutedRoleId).catch(() => null);

        // -----------------------------
        // Close active tempmute case
        // -----------------------------
        const activeMute = await Punishment.findOne({
            userId: targetUser.id,
            type: "tempmute",
            active: true
        });

        let caseData = null;

        if (activeMute) {
            activeMute.active = false;
            await activeMute.save();

            // Create audit case
            caseData = await createCase({
                userId: targetUser.id,
                moderatorId: interaction.user.id,
                type: "unmute",
                reason,
                duration: null,
                expiresAt: null
            });
        }

        // -----------------------------
        // DM user
        // -----------------------------
        await safeDm(targetUser, {
            content:
                `You have been unmuted in **${interaction.guild.name}**\n` +
                `Reason: ${reason}`
        });

        // -----------------------------
        // Log case
        // -----------------------------
        if (caseData) {
            await logCase(interaction.client, caseData);
        }

        // -----------------------------
        // Reply
        // -----------------------------
        return interaction.editReply({
            content: `User ${targetUser.tag} has been unmuted.`
        });
    }
};