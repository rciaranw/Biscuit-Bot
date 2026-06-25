const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ms = require("ms");

const config = require("../../config/config.json");

const Punishment = require("../../database/models/Punishment");
const { createCase } = require("../../services/caseService");
const { logCase } = require("../../utils/logCase");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tempban")
        .setDescription("Temporarily ban a user")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to ban")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("duration")
                .setDescription("Duration (e.g. 10m, 2h, 3d)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for ban")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const member = interaction.member;
        const targetUser = interaction.options.getUser("user");
        const durationInput = interaction.options.getString("duration");
        const reason = interaction.options.getString("reason");

        // -----------------------------
        // Permission check
        // -----------------------------
        const hasPermission =
            member.roles.cache.has(config.roles.staff) ||
            member.roles.cache.has(config.roles.headModerator) ||
            interaction.user.id === config.adminId;

        if (!hasPermission) {
            return interaction.editReply({
                content: "You don’t have permission to use this command."
            });
        }

        // -----------------------------
        // Parse duration
        // -----------------------------
        const durationMs = ms(durationInput);

        if (!durationMs) {
            return interaction.editReply({
                content: "Invalid duration format. Example: 10m, 2h, 3d"
            });
        }

        // -----------------------------
        // 30 day limit
        // -----------------------------
        const maxDuration = 30 * 24 * 60 * 60 * 1000;

        if (durationMs > maxDuration) {
            return interaction.editReply({
                content: "Tempban limit is 30 days."
            });
        }

        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!targetMember) {
            return interaction.editReply({
                content: "User not found in this server."
            });
        }

        // -----------------------------
        // Ban user
        // -----------------------------
        await targetMember.ban({
            reason: `${reason} | Tempban by ${interaction.user.tag} for ${durationInput}`
        });

        // -----------------------------
        // Create case
        // -----------------------------
        const caseData = await createCase({
            guildId: interaction.guild.id,
            userId: targetUser.id,
            type: "tempban",
            reason,
            moderatorId: interaction.user.id
        });

        // -----------------------------
        // Save expiry record
        // -----------------------------
        await Punishment.findOneAndUpdate(
            { caseId: caseData.caseId },
            {
                expiresAt: new Date(Date.now() + durationMs),
                duration: durationInput,
                active: true
            }
        );

        // -----------------------------
        // Log to mod channel
        // -----------------------------
        await logCase(interaction.client, caseData);

        // -----------------------------
        // Response
        // -----------------------------
        const embed = new EmbedBuilder()
            .setTitle("Tempban Issued")
            .setColor(0xe74c3c)
            .addFields(
                { name: "User", value: targetUser.tag, inline: true },
                { name: "Duration", value: durationInput, inline: true },
                { name: "Reason", value: reason, inline: false },
                { name: "Case", value: `#${caseData.caseId}`, inline: true }
            );

        return interaction.editReply({
            embeds: [embed]
        });
    }
};