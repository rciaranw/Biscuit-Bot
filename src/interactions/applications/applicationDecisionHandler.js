const {
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const Application = require("../../database/models/Application");
const config = require("../../config/config.json");

module.exports = {
    name: "applicationDecisionHandler",

    async execute(interaction) {

        // =====================================================
        // ONLY BUTTONS + MODALS
        // =====================================================
        if (!interaction.isButton() && !interaction.isModalSubmit()) return;

        // =====================================================
        // PERMISSION CHECK
        // =====================================================
        const member = interaction.member;

        const hasPermission =
            member.roles.cache.has(config.roles.headModerator) ||
            interaction.user.id === config.adminId;

        // =====================================================
        // ACCEPT BUTTON
        // =====================================================
        if (interaction.isButton() && interaction.customId.startsWith("app_accept_")) {

            if (!hasPermission) {
                return interaction.reply({
                    content: "You don’t have permission to handle applications.",
                    ephemeral: true
                });
            }

            const appId = interaction.customId.replace("app_accept_", "");

            const application = await Application.findById(appId);
            if (!application) {
                return interaction.reply({
                    content: "Application not found.",
                    ephemeral: true
                });
            }

            const guildMember = await interaction.guild.members.fetch(application.userId).catch(() => null);

            // -----------------------------
            // ROLE ASSIGNMENT
            // -----------------------------
            if (guildMember) {
                if (application.type === "staff") {
                    await guildMember.roles.add(config.roles.staff).catch(() => {});
                    await guildMember.roles.add(config.roles.moderator).catch(() => {});
                }

                if (application.type === "helper") {
                    await guildMember.roles.add(config.roles.helper).catch(() => {});
                }
            }

            application.status = "accepted";
            await application.save();

            // -----------------------------
            // DM USER
            // -----------------------------
            const user = await interaction.client.users.fetch(application.userId).catch(() => null);

            if (user) {
                user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Application Accepted")
                            .setColor(0x2ecc71)
                            .setDescription(
                                `Your **${application.type}** application has been accepted.`
                            )
                    ]
                }).catch(() => {});
            }

            // -----------------------------
            // UPDATE MESSAGE
            // -----------------------------
            const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
                .setColor(0x2ecc71)
                .setFooter({ text: "Status: ACCEPTED" });

            await interaction.update({
                embeds: [updatedEmbed],
                components: []
            });

            return;
        }

        // =====================================================
        // DENY BUTTON -> OPEN MODAL
        // =====================================================
        if (interaction.isButton() && interaction.customId.startsWith("app_deny_")) {

            if (!hasPermission) {
                return interaction.reply({
                    content: "You don’t have permission to handle applications.",
                    ephemeral: true
                });
            }

            const appId = interaction.customId.replace("app_deny_", "");

            const modal = new ModalBuilder()
                .setCustomId(`app_deny_modal_${appId}`)
                .setTitle("Deny Application");

            const reason = new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("Reason for denial")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(reason)
            );

            return interaction.showModal(modal);
        }

        // =====================================================
        // DENY SUBMISSION
        // =====================================================
        if (interaction.isModalSubmit() && interaction.customId.startsWith("app_deny_modal_")) {

            if (!hasPermission) {
                return interaction.reply({
                    content: "You don’t have permission to handle applications.",
                    ephemeral: true
                });
            }

            const appId = interaction.customId.replace("app_deny_modal_", "");
            const reason = interaction.fields.getTextInputValue("reason");

            const application = await Application.findById(appId);

            if (!application) {
                return interaction.reply({
                    content: "Application not found.",
                    ephemeral: true
                });
            }

            application.status = "denied";
            await application.save();

            // -----------------------------
            // DM USER
            // -----------------------------
            const user = await interaction.client.users.fetch(application.userId).catch(() => null);

            if (user) {
                user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Application Denied")
                            .setColor(0xe74c3c)
                            .setDescription(`Your **${application.type}** application was denied.`)
                            .addFields(
                                { name: "Reason", value: reason }
                            )
                    ]
                }).catch(() => {});
            }

            // -----------------------------
            // UPDATE MESSAGE
            // -----------------------------
            const updatedEmbed = EmbedBuilder.from(
                interaction.message?.embeds?.[0] || {}
            )
                .setColor(0xe74c3c)
                .setFooter({ text: "Status: DENIED" });

            await interaction.update({
                embeds: [updatedEmbed],
                components: []
            });

            return;
        }
    }
};