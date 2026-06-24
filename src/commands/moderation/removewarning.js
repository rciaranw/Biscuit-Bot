const { SlashCommandBuilder } = require("discord.js");
const config = require("../../config/config.json");

const { getCase, closeCase, createCase } = require("../../services/caseService");
const { logCase } = require("../../utils/logCase");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removewarning")
        .setDescription("Remove a warning (soft delete)")
        .addIntegerOption(option =>
            option.setName("caseid")
                .setDescription("Case ID of the warning")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for removal")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const staffRoleId = config.roles.staff;
        const headModId = config.roles.headModerator;
        const ciaranRoleId = config.roles.ciaran;

        const member = interaction.member;

        const hasPermission =
            member.roles.cache.has(staffRoleId) ||
            member.roles.cache.has(headModId) ||
            member.roles.cache.has(ciaranRoleId) ||
            interaction.user.id === config.adminId;

        if (!hasPermission) {
            return interaction.editReply({
                content: "You don’t have permission to use this command."
            });
        }

        const caseId = interaction.options.getInteger("caseid");
        const reason = interaction.options.getString("reason");

        const caseData = await getCase(caseId);

        if (!caseData) {
            return interaction.editReply({
                content: `Case #${caseId} not found.`
            });
        }

        if (caseData.type !== "warn") {
            return interaction.editReply({
                content: `Case #${caseId} is not a warning.`
            });
        }

        if (!caseData.active) {
            return interaction.editReply({
                content: `Case #${caseId} is already inactive.`
            });
        }

        // -----------------------------
        // Soft close original warning
        // -----------------------------
        await closeCase(caseId);

        // -----------------------------
        // Create audit case for removal
        // -----------------------------
        const removalCase = await createCase({
            userId: caseData.userId,
            moderatorId: interaction.user.id,
            type: "removewarn",
            reason,
            active: false
        });

        await logCase(interaction.client, removalCase);

        return interaction.editReply({
            content: `Warning Case #${caseId} has been removed. (soft delete)`
        });
    }
};