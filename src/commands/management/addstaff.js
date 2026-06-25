const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const config = require("../../config/config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addstaff")
        .setDescription("Manually promote a user to staff")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to promote")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const member = interaction.member;
        const targetUser = interaction.options.getUser("user");

        // -----------------------------
        // Permission check
        // -----------------------------
        const hasPermission =
            member.roles.cache.has(config.roles.headModerator) ||
            interaction.user.id === config.adminId;

        if (!hasPermission) {
            return interaction.editReply({
                content: "You don’t have permission to use this command."
            });
        }

        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!targetMember) {
            return interaction.editReply({
                content: "User not found in this server."
            });
        }

        // -----------------------------
        // Already staff check
        // -----------------------------
        if (targetMember.roles.cache.has(config.roles.staff)) {
            return interaction.editReply({
                content: "User is already staff."
            });
        }

        // -----------------------------
        // Add roles
        // -----------------------------
        await targetMember.roles.add(config.roles.staff).catch(() => {});
        await targetMember.roles.add(config.roles.moderator).catch(() => {});

        // -----------------------------
        // DM user
        // -----------------------------
        await targetUser.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Staff Promotion")
                    .setColor(0x2ecc71)
                    .setDescription(
                        `You have been promoted to **Staff** in **${interaction.guild.name}**.`
                    )
            ]
        }).catch(() => {});

        // -----------------------------
        // Log embed
        // -----------------------------
        const logChannel = interaction.guild.channels.cache.get(config.channels.staffLogs);

        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle("Staff Added")
                .setColor(0x2ecc71)
                .addFields(
                    { name: "User", value: `${targetUser.tag}`, inline: true },
                    { name: "User ID", value: targetUser.id, inline: true },
                    { name: "Added By", value: interaction.user.tag, inline: true }
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] }).catch(() => {});
        }

        return interaction.editReply({
            content: `${targetUser.tag} has been added to staff.`
        });
    }
};