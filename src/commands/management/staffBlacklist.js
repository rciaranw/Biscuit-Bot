const { SlashCommandBuilder } = require("discord.js");

const config = require("../../config/config.json");

const ApplicationBlacklist = require("../../database/models/ApplicationBlacklist");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("staffblacklist")
        .setDescription("Manage the application blacklist")

        .addStringOption(option =>
            option
                .setName("action")
                .setDescription("Add or remove")
                .setRequired(true)
                .addChoices(
                    { name: "Add", value: "add" },
                    { name: "Remove", value: "remove" }
                )
        )

        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason (required when adding)")
                .setRequired(false)
        ),

    async execute(interaction) {

        const member = interaction.member;

        const hasPermission =
            member.roles.cache.has(config.roles.headModerator) ||
            member.roles.cache.has(config.roles.ciaran);

        if (!hasPermission) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true
            });
        }

        const action = interaction.options.getString("action");
        const targetUser = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        if (action === "add") {

            if (!reason) {
                return interaction.reply({
                    content: "A reason is required when adding a user to the blacklist.",
                    ephemeral: true
                });
            }

            const existing = await ApplicationBlacklist.findOne({
                userId: targetUser.id
            });

            if (existing) {
                return interaction.reply({
                    content: "That user is already blacklisted.",
                    ephemeral: true
                });
            }

            await ApplicationBlacklist.create({
                userId: targetUser.id,
                reason,
                addedBy: interaction.user.id
            });

            try {
                await targetUser.send(
                    `You have been blacklisted from applying for Staff or Community Helper positions.\n\nReason: ${reason}`
                );
            } catch {}

            return interaction.reply({
                content: `${targetUser.tag} has been added to the application blacklist.`,
                ephemeral: true
            });
        }

        if (action === "remove") {

            const existing = await ApplicationBlacklist.findOne({
                userId: targetUser.id
            });

            if (!existing) {
                return interaction.reply({
                    content: "That user is not blacklisted.",
                    ephemeral: true
                });
            }

            await ApplicationBlacklist.deleteOne({
                userId: targetUser.id
            });

            try {
                await targetUser.send(
                    "You have been removed from the Staff Application blacklist."
                );
            } catch {}

            return interaction.reply({
                content: `${targetUser.tag} has been removed from the application blacklist.`,
                ephemeral: true
            });
        }
    }
};