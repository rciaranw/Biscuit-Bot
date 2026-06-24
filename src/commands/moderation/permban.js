const { SlashCommandBuilder } = require("discord.js");
const config = require("../../config/config.json");

const { createCase } = require("../../services/caseService");
const { safeDm } = require("../../utils/safeDm");
const { logCase } = require("../../utils/logCase");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("permban")
        .setDescription("Permanently ban a user")
        .addUserOption(option =>
            option.setName("user").setDescription("User to ban").setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason").setDescription("Reason for ban").setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const headMod = config.roles.headModerator;
        const ciaran = config.roles.ciaran;
        const adminId = config.adminId;

        const member = interaction.member;
        const targetUser = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        const hasPermission =
            member.roles.cache.has(headMod) ||
            member.roles.cache.has(ciaran) ||
            interaction.user.id === adminId;

        if (!hasPermission) {
            return interaction.editReply({ content: "No permission." });
        }

        if (targetUser.id === interaction.user.id) {
            return interaction.editReply({ content: "You can’t ban yourself." });
        }

        if (targetUser.id === adminId) {
            return interaction.editReply({ content: "You can’t ban the admin." });
        }

        await targetMember?.ban({ reason }).catch(() => null);

        const caseData = await createCase({
            userId: targetUser.id,
            moderatorId: interaction.user.id,
            type: "permban",
            reason,
            duration: null,
            expiresAt: null
        });

        await safeDm(targetUser, {
            content:
                `You have been permanently banned from **${interaction.guild.name}**\n` +
                `Reason: ${reason}\nCase #${caseData.caseId}`
        });

        await logCase(interaction.client, caseData);

        return interaction.editReply({
            content: `Case #${caseData.caseId} | Permanently banned ${targetUser.tag}`
        });
    }
};