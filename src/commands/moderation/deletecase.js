const { SlashCommandBuilder } = require("discord.js");
const config = require("../../config/config.json");

const Punishment = require("../../database/models/Punishment");
const { logCase } = require("../../utils/logCase");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletecase")
        .setDescription("Permanently delete a case (admin only)")
        .addIntegerOption(option =>
            option.setName("caseid")
                .setDescription("Case ID to delete")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const member = interaction.member;

        if (interaction.user.id !== config.adminId) {
            return interaction.editReply({
                content: "Only the admin can delete cases."
            });
        }

        const caseId = interaction.options.getInteger("caseid");

        const caseData = await Punishment.findOne({ caseId });

        if (!caseData) {
            return interaction.editReply({
                content: `Case #${caseId} not found.`
            });
        }

        await Punishment.deleteOne({ caseId });

        return interaction.editReply({
            content: `Case #${caseId} has been permanently deleted.`
        });
    }
};