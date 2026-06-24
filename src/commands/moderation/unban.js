const { SlashCommandBuilder } = require("discord.js");
const config = require("../../config/config.json");

const { createCase } = require("../../services/caseService");
const { logCase } = require("../../utils/logCase");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user")
        .addStringOption(option =>
            option.setName("userid").setDescription("User ID").setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason").setDescription("Reason for unban").setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const headMod = config.roles.headModerator;
        const ciaran = config.roles.ciaran;
        const adminId = config.adminId;

        const member = interaction.member;

        const hasPermission =
            member.roles.cache.has(headMod) ||
            member.roles.cache.has(ciaran) ||
            interaction.user.id === adminId;

        if (!hasPermission) {
            return interaction.editReply({ content: "No permission." });
        }

        const userId = interaction.options.getString("userid");
        const reason = interaction.options.getString("reason");

        await interaction.guild.bans.remove(userId).catch(() => null);

        const caseData = await createCase({
            userId,
            moderatorId: interaction.user.id,
            type: "unban",
            reason,
            duration: null,
            expiresAt: null
        });

        await logCase(interaction.client, caseData);

        return interaction.editReply({
            content: `User ${userId} has been unbanned. Case #${caseData.caseId}`
        });
    }
};