const {
    SlashCommandBuilder
} = require("discord.js");

const config = require("../../config/config.json");
const ApplicationBlacklist = require("../../database/models/ApplicationBlacklist");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("applications")
        .setDescription("Manage applications")
        .addSubcommand(sub =>
            sub.setName("lock")
                .setDescription("Lock applications")
                .addStringOption(opt =>
                    opt.setName("type")
                        .setDescription("staff or helper")
                        .setRequired(true)
                        .addChoices(
                            { name: "Staff", value: "staff" },
                            { name: "Helper", value: "helper" }
                        )
                )
        )
        .addSubcommand(sub =>
            sub.setName("unlock")
                .setDescription("Unlock applications")
                .addStringOption(opt =>
                    opt.setName("type")
                        .setDescription("staff or helper")
                        .setRequired(true)
                        .addChoices(
                            { name: "Staff", value: "staff" },
                            { name: "Helper", value: "helper" }
                        )
                )
        )
        .addSubcommand(sub =>
            sub.setName("blacklist")
                .setDescription("Blacklist a user from applying")
                .addUserOption(opt =>
                    opt.setName("user")
                        .setDescription("User")
                        .setRequired(true)
                )
                .addStringOption(opt =>
                    opt.setName("reason")
                        .setDescription("Reason")
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName("unblacklist")
                .setDescription("Remove user from application blacklist")
                .addUserOption(opt =>
                    opt.setName("user")
                        .setDescription("User")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {

        const member = interaction.member;

        const hasPermission =
            member.roles.cache.has(config.roles.headModerator) ||
            interaction.user.id === config.adminId;

        if (!hasPermission) {
            return interaction.reply({
                content: "No permission.",
                ephemeral: true
            });
        }

        const sub = interaction.options.getSubcommand();

        // =====================================================
        // LOCK
        // =====================================================
        if (sub === "lock") {

            const type = interaction.options.getString("type");

            config.applicationLocks[type] = true;

            return interaction.reply({
                content: `${type} applications locked.`,
                ephemeral: true
            });
        }

        // =====================================================
        // UNLOCK
        // =====================================================
        if (sub === "unlock") {

            const type = interaction.options.getString("type");

            config.applicationLocks[type] = false;

            return interaction.reply({
                content: `${type} applications unlocked.`,
                ephemeral: true
            });
        }

        // =====================================================
        // BLACKLIST ADD
        // =====================================================
        if (sub === "blacklist") {

            const user = interaction.options.getUser("user");
            const reason = interaction.options.getString("reason");

            await ApplicationBlacklist.create({
                userId: user.id,
                reason,
                addedBy: interaction.user.id
            });

            return interaction.reply({
                content: `${user.tag} blacklisted from applications.`,
                ephemeral: true
            });
        }

        // =====================================================
        // UNBLACKLIST
        // =====================================================
        if (sub === "unblacklist") {

            const user = interaction.options.getUser("user");

            await ApplicationBlacklist.deleteOne({
                userId: user.id
            });

            return interaction.reply({
                content: `${user.tag} removed from blacklist.`,
                ephemeral: true
            });
        }
    }
};