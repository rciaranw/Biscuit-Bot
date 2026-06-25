const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder
} = require("discord.js");

const config = require("../config/config.json");

const Application = require("../database/models/Application");
const ApplicationBlacklist = require("../database/models/ApplicationBlacklist");
const ApplicationSettings = require("../database/models/ApplicationSettings");
const Punishment = require("../database/models/Punishment");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        // =====================================================
        // SLASH COMMANDS
        // =====================================================
        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.error(err);

                const reply = {
                    content: "Command execution failed.",
                    ephemeral: true
                };

                if (interaction.replied || interaction.deferred) {
                    return interaction.followUp(reply);
                } else {
                    return interaction.reply(reply);
                }
            }

            return;
        }

        // =====================================================
        // BUTTONS (APPLICATION ENTRY)
        // =====================================================
        if (interaction.isButton()) {

            const settings = (await ApplicationSettings.findOne({ guildId: interaction.guild.id })) ||
                await ApplicationSettings.create({ guildId: interaction.guild.id });

            const blacklist = await ApplicationBlacklist.findOne({
                userId: interaction.user.id
            });

            // ---------------- STAFF APPLY ----------------
            if (interaction.customId === "apply_staff") {

                if (blacklist) {
                    return interaction.reply({
                        content: "You are blacklisted from applying.",
                        ephemeral: true
                    });
                }

                if (!settings.staffApplicationsOpen) {
                    return interaction.reply({
                        content: "Staff applications are currently closed.",
                        ephemeral: true
                    });
                }

                const modal = new ModalBuilder()
                    .setCustomId("modal_staff_application")
                    .setTitle("Staff Application");

                const q1 = new TextInputBuilder()
                    .setCustomId("q1")
                    .setLabel("Question 1")
                    .setPlaceholder("Why do you want to join the Staff Team?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const q2 = new TextInputBuilder()
                    .setCustomId("q2")
                    .setLabel("Question 2")
                    .setPlaceholder("Do you have any moderation experience? If yes, please specify.")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const q3 = new TextInputBuilder()
                    .setCustomId("q3")
                    .setLabel("Question 3")
                    .setPlaceholder("Are you able to stay active within the community?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const s1 = new TextInputBuilder()
                    .setCustomId("s1")
                    .setLabel("Question 4")
                    .setPlaceholder("If a member repeatedly spams in the server, what would you do, any why?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const s2 = new TextInputBuilder()
                    .setCustomId("s2")
                    .setLabel("Question 5")
                    .setPlaceholder("A member has been homophobic, what actions would you take?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(q1),
                    new ActionRowBuilder().addComponents(q2),
                    new ActionRowBuilder().addComponents(q3),
                    new ActionRowBuilder().addComponents(s1),
                    new ActionRowBuilder().addComponents(s2)
                );

                return interaction.showModal(modal);
            }

            // ---------------- HELPER APPLY ----------------
            if (interaction.customId === "apply_helper") {

                if (blacklist) {
                    return interaction.reply({
                        content: "You are blacklisted from applying.",
                        ephemeral: true
                    });
                }

                if (!settings.helperApplicationsOpen) {
                    return interaction.reply({
                        content: "Community Helper applications are currently closed.",
                        ephemeral: true
                    });
                }

                const modal = new ModalBuilder()
                    .setCustomId("modal_helper_application")
                    .setTitle("Community Helper Application");

                const q1 = new TextInputBuilder()
                    .setCustomId("q1")
                    .setLabel("Question 1")
                    .setPlaceholder("Why do you want to become a Community Helper?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const q2 = new TextInputBuilder()
                    .setCustomId("q2")
                    .setLabel("Question 2")
                    .setPlaceholder("What do you think the responsibilities of this role are?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const q3 = new TextInputBuilder()
                    .setCustomId("q3")
                    .setLabel("Question 3")
                    .setPlaceholder("How active can you be within the community?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const q4 = new TextInputBuilder()
                    .setCustomId("q4")
                    .setLabel("Question 4")
                    .setPlaceholder("Community Helpers are not Staff. You are only there to help them. Do you understand this?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(q1),
                    new ActionRowBuilder().addComponents(q2),
                    new ActionRowBuilder().addComponents(q3),
                    new ActionRowBuilder().addComponents(q4)
                );

                return interaction.showModal(modal);
            }

            // ---------------- ACCEPT / DENY ----------------
            if (interaction.customId.startsWith("app_accept_") ||
                interaction.customId.startsWith("app_deny_")) {

                const member = interaction.member;

                const allowed =
                    member.roles.cache.has(config.roles.headModerator) ||
                    member.roles.cache.has(config.roles.ciaran) ||
                    interaction.user.id === config.adminId;

                if (!allowed) {
                    return interaction.reply({
                        content: "No permission.",
                        ephemeral: true
                    });
                }

                const appId = interaction.customId.split("_").slice(2).join("_");
                const application = await Application.findById(appId);

                if (!application) {
                    return interaction.reply({
                        content: "Application not found.",
                        ephemeral: true
                    });
                }

                const guildMember = await interaction.guild.members.fetch(application.userId).catch(() => null);

                // ---------------- ACCEPT ----------------
                if (interaction.customId.startsWith("app_accept_")) {

                    if (guildMember) {
                        if (application.type === "staff") {
                            await guildMember.roles.add(config.roles.staff);
                            await guildMember.roles.add(config.roles.moderator);
                        }

                        if (application.type === "helper") {
                            await guildMember.roles.add(config.roles.communityHelper);
                        }
                    }

                    application.status = "accepted";
                    application.reviewedBy = interaction.user.id;
                    application.reviewedAt = new Date();
                    await application.save();

                    return interaction.update({
                        content: "Application accepted.",
                        components: [],
                        embeds: interaction.message.embeds
                    });
                }

                // ---------------- DENY (MODAL) ----------------
                const modal = new ModalBuilder()
                    .setCustomId(`deny_reason_${appId}`)
                    .setTitle("Deny Application");

                const reason = new TextInputBuilder()
                    .setCustomId("reason")
                    .setLabel("Reason")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(reason)
                );

                return interaction.showModal(modal);
            }
        }

        // =====================================================
        // MODALS (APPLICATION SUBMISSION + DENY REASON)
        // =====================================================
        if (interaction.isModalSubmit()) {

            // ---------------- STAFF SUBMIT ----------------
            if (interaction.customId === "modal_staff_application" ||
                interaction.customId === "modal_helper_application") {

                const type =
                    interaction.customId === "modal_staff_application"
                        ? "staff"
                        : "helper";

                const answers = {};
                interaction.fields.fields.forEach((f) => {
                    answers[f.customId] = f.value;
                });

                const blacklist = await ApplicationBlacklist.findOne({
                    userId: interaction.user.id
                });

                if (blacklist) {
                    return interaction.reply({
                        content: "You are blacklisted from applying.",
                        ephemeral: true
                    });
                }

                const settings = await ApplicationSettings.findOne({
                    guildId: interaction.guild.id
                });

                if (type === "staff" && !settings.staffApplicationsOpen) {
                    return interaction.reply({
                        content: "Staff applications are closed.",
                        ephemeral: true
                    });
                }

                if (type === "helper" && !settings.helperApplicationsOpen) {
                    return interaction.reply({
                        content: "Helper applications are closed.",
                        ephemeral: true
                    });
                }

                const punishmentCount = await Punishment.countDocuments({
                    userId: interaction.user.id
                });

                const application = await Application.create({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                    type,
                    answers
                });

                // Build embed dynamically based on type
                let embed;
                if (type === "staff") {
                    embed = new EmbedBuilder()
                        .setTitle("Staff Application")
                        .setColor(0xe67e22)
                        .addFields(
                            { name: "User", value: interaction.user.tag },
                            { name: "Why would you like to join the Moderation Team?", value: answers.q1, inline: false },
                            { name: "Do you have any Moderation experience? If yes, provide some examples.", value: answers.q2, inline: false },
                            { name: "Moderators are required to stay active...", value: answers.q3, inline: false },
                            { name: "Scenario 1: A user is breaking a major rule publicly...", value: answers.s1, inline: false },
                            { name: "Scenario 2: Two members are having a heated argument...", value: answers.s2, inline: false },
                            { name: "Punishments", value: String(punishmentCount), inline: true }
                        );
                } else if (type === "helper") {
                    embed = new EmbedBuilder()
                        .setTitle("Community Helper Application")
                        .setColor(0x3498db)
                        .addFields(
                            { name: "User", value: interaction.user.tag },
                            { name: "Why would you like to become a Community Helper?", value: answers.q1, inline: false },
                            { name: "What do you think the responsibilities of a Community Helper are?", value: answers.q2, inline: false },
                            { name: "How active are you within the community?", value: answers.q3, inline: false },
                            { name: "A Community Helper is NOT a moderator...", value: answers.q4, inline: false },
                            { name: "Punishments", value: String(punishmentCount), inline: true }
                        );
                }

                // Send to the staff applications channel
                const channel = await interaction.guild.channels.fetch(config.channels.staffApplications);
                if (!channel || typeof channel.send !== 'function') {
                    return interaction.reply({
                        content: "Applications channel is missing or not accessible.",
                        ephemeral: true
                    });
                }

                await channel.send({
                    embeds: [embed],
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 3,
                                    label: "Accept",
                                    custom_id: `app_accept_${application._id}`
                                },
                                {
                                    type: 2,
                                    style: 4,
                                    label: "Deny",
                                    custom_id: `app_deny_${application._id}`
                                }
                            ]
                        }
                    ]
                });

                return interaction.reply({
                    content: "Application submitted.",
                    ephemeral: true
                });
            }

            // ---------------- DENY REASON ----------------
            if (interaction.customId.startsWith("deny_reason_")) {

                const appId = interaction.customId.replace("deny_reason_", "");
                const reason = interaction.fields.getTextInputValue("reason");

                const application = await Application.findById(appId);
                if (!application) return;

                const user = await interaction.client.users.fetch(application.userId).catch(() => null);

                if (user) {
                    user.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Application Denied")
                                .setColor(0xe74c3c)
                                .setDescription(`Reason: ${reason}`)
                        ]
                    }).catch(() => {});
                }

                application.status = "denied";
                application.reviewedBy = interaction.user.id;
                application.reviewedAt = new Date();
                application.reviewReason = reason;

                await application.save();

                return interaction.reply({
                    content: "Application denied.",
                    ephemeral: true
                });
            }
        }
    }
};