const { SlashCommandBuilder } = require("discord.js");
const config = require("../../utils/config");

const { createCase } = require("../../services/caseService");
const { safeDm } = require("../../utils/safeDm");
const { logCase } = require("../../utils/logCase");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to warn")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for warning")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const staffRoleId = config.roles.staff;
        const adminId = config.adminId;

        const member = interaction.member;
        const targetUser = interaction.options.getUser("user");
        const targetMember = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason");

        // Staff-only access
        if (!member.roles.cache.has(staffRoleId)) {
            await interaction.editReply({
                content: "You do not have permission to use this command."
            });
            return;
        }

        // Self-warn protection
        if (targetUser.id === interaction.user.id) {
            await interaction.editReply({
                content: "You cannot warn yourself."
            });
            return;
        }

        // Admin protection
        if (targetUser.id === adminId) {
            await interaction.editReply({
                content: "You cannot warn the admin."
            });
            return;
        }

        // Staff protection
        if (targetMember?.roles?.cache.has(staffRoleId)) {
            await interaction.editReply({
                content: "You cannot warn staff members."
            });
            return;
        }

        // Create case
        const caseData = await createCase({
            guildId: interaction.guild.id,
            userId: targetUser.id,
            type: "warn",
            reason,
            moderatorId: interaction.user.id
        });

        // DM user (don't let DM failures break the command)
        await safeDm(targetUser, {
            content:
                `You were warned in **${interaction.guild.name}**\n` +
                `Reason: ${reason}\n` +
                `Case #${caseData.caseId}`
        });

        // Log to moderation channel
        await logCase(interaction.client, caseData);

        // Confirm to moderator
        await interaction.editReply({
            content: `✅ Case #${caseData.caseId} created for ${targetUser.tag}`
        });
    }
};