const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config/config.json");

const Punishment = require("../../database/models/Punishment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("case")
        .setDescription("View a specific case in detail")
        .addIntegerOption(option =>
            option.setName("id")
                .setDescription("Case ID")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const member = interaction.member;

        const hasPermission =
            member.roles.cache.has(config.roles.staff) ||
            member.roles.cache.has(config.roles.headModerator) ||
            interaction.user.id === config.adminId;

        if (!hasPermission) {
            return interaction.editReply({
                content: "You don’t have permission to view cases."
            });
        }

        const caseId = interaction.options.getInteger("id");

        const caseData = await Punishment.findOne({ caseId });

        if (!caseData) {
            return interaction.editReply({
                content: `Case #${caseId} not found.`
            });
        }

        // -----------------------------
        // Format timestamps
        // -----------------------------
        const created = `<t:${Math.floor(caseData.createdAt.getTime() / 1000)}:F>`;

        const expires = caseData.expiresAt
            ? `<t:${Math.floor(caseData.expiresAt.getTime() / 1000)}:F>`
            : "N/A";

        const status = caseData.active ? "ACTIVE" : "INACTIVE";

        // -----------------------------
        // Embed
        // -----------------------------
        const embed = new EmbedBuilder()
            .setTitle(`Case #${caseData.caseId}`)
            .setColor(caseData.active ? 0x2ecc71 : 0xe74c3c)
            .addFields(
                { name: "Type", value: caseData.type.toUpperCase(), inline: true },
                { name: "Status", value: status, inline: true },
                { name: "User ID", value: caseData.userId, inline: true },

                { name: "Moderator ID", value: caseData.moderatorId, inline: true },
                { name: "Created", value: created, inline: true },
                { name: "Expires", value: expires, inline: true },

                { name: "Reason", value: caseData.reason || "No reason provided" }
            )
            .setFooter({ text: "Moderation case viewer" });

        return interaction.editReply({
            embeds: [embed]
        });
    }
};