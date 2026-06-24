const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config/config.json");

const Punishment = require("../../database/models/Punishment");
const { createCase } = require("../../services/caseService");
const { logCase } = require("../../utils/logCase");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("editcase")
        .setDescription("Edit an existing case (restricted)")
        .addIntegerOption(option =>
            option.setName("caseid")
                .setDescription("Case ID to edit")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("New reason for the case")
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName("active")
                .setDescription("Set case active/inactive")
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const member = interaction.member;
        const caseId = interaction.options.getInteger("caseid");
        const newReason = interaction.options.getString("reason");
        const newActive = interaction.options.getBoolean("active");

        // -----------------------------
        // Permission gate (strict)
        // -----------------------------
        const hasPermission =
            member.roles.cache.has(config.roles.headModerator) ||
            member.roles.cache.has(config.roles.ciaran) ||
            interaction.user.id === config.adminId;

        if (!hasPermission) {
            return interaction.editReply({
                content: "You don’t have permission to edit cases."
            });
        }

        // -----------------------------
        // Fetch case
        // -----------------------------
        const caseData = await Punishment.findOne({ caseId });

        if (!caseData) {
            return interaction.editReply({
                content: `Case #${caseId} not found.`
            });
        }

        // Prevent nonsense edits
        if (!newReason && newActive === null) {
            return interaction.editReply({
                content: "You must provide a reason or active status to update."
            });
        }

        const oldReason = caseData.reason;
        const oldActive = caseData.active;

        // -----------------------------
        // Apply controlled updates
        // -----------------------------
        const update = {};

        if (newReason) update.reason = newReason;
        if (typeof newActive === "boolean") update.active = newActive;

        const updatedCase = await Punishment.findOneAndUpdate(
            { caseId },
            update,
            { new: true }
        );

        // -----------------------------
        // Audit log case (always created)
        // -----------------------------
        const auditReasonParts = [];

        if (newReason) {
            auditReasonParts.push(`Reason: "${oldReason}" → "${newReason}"`);
        }

        if (typeof newActive === "boolean") {
            auditReasonParts.push(`Active: ${oldActive} → ${newActive}`);
        }

        const auditReason = `Edited Case #${caseId} | ${auditReasonParts.join(" | ")}`;

        const auditCase = await createCase({
            userId: caseData.userId,
            moderatorId: interaction.user.id,
            type: "editcase",
            reason: auditReason,
            active: false
        });

        await logCase(interaction.client, auditCase);

        // -----------------------------
        // Response embed
        // -----------------------------
        const embed = new EmbedBuilder()
            .setTitle(`Case #${caseId} Updated`)
            .setColor(0xf39c12)
            .addFields(
                { name: "Old Reason", value: oldReason, inline: false },
                { name: "New Reason", value: newReason || "Unchanged", inline: false },
                { name: "Old Active", value: String(oldActive), inline: true },
                { name: "New Active", value: String(updatedCase.active), inline: true }
            )
            .setFooter({ text: "Audit log created automatically" });

        return interaction.editReply({
            embeds: [embed]
        });
    }
};