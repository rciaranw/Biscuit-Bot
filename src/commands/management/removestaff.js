const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const config = require("../../config/config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removestaff")
        .setDescription("Remove a user from staff")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to remove")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for removal")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const member = interaction.member;
        const targetUser = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

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
        // Not staff check
        // -----------------------------
        if (!targetMember.roles.cache.has(config.roles.staff)) {
            return interaction.editReply({
                content: "User is not currently staff."
            });
        }

        // -----------------------------
        // Remove roles
        // -----------------------------
        await targetMember.roles.remove(config.roles.staff).catch(() => {});
        await targetMember.roles.remove(config.roles.moderator).catch(() => {});

        // -----------------------------
        // DM user
        // -----------------------------
        await targetUser.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Staff Removal")
                    .setColor(0xe74c3c)
                    .setDescription(
                        `You have been removed from Staff in **${interaction.guild.name}**.`
                    )
                    .addFields(
                        { name: "Reason", value: reason }
                    )
            ]
        }).catch(() => {});

        // -----------------------------
        // Log embed
        // -----------------------------
        const logChannel = interaction.guild.channels.cache.get(config.channels.staffLogs);

        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle("Staff Removed")
                .setColor(0xe74c3c)
                .addFields(
                    { name: "User", value: `${targetUser.tag}`, inline: true },
                    { name: "User ID", value: targetUser.id, inline: true },
                    { name: "Reason", value: reason, inline: false },
                    { name: "Removed By", value: interaction.user.tag, inline: true }
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] }).catch(() => {});
        }

        return interaction.editReply({
            content: `${targetUser.tag} has been removed from staff.`
        });
    }
};