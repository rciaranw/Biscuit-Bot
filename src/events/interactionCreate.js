console.log("INTERACTION CREATE FILE LOADED.");
//console.log("COMMAND MAP SIZE:", client.commands?.size);

const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    PermissionOverwrites
} = require("discord.js");

const config = require("../utils/config");

const Application = require("../database/models/Application");
const ApplicationBlacklist = require("../database/models/ApplicationBlacklist");
const ApplicationSettings = require("../database/models/ApplicationSettings");
const Punishment = require("../database/models/Punishment");

const { closeTicket } = require("../utils/closeTicket");

const {
    createTicket,
    getOpenTicketForUser,
    formatTicketId
} = require("../services/ticketService")

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

        try {

            // =========================
            // DEBUG (KEEP THIS)
            // =========================
            console.log("INTERACTION:", interaction.type, interaction.commandName || interaction.customId);

            // =========================
            // SLASH COMMANDS
            // =========================
            if (interaction.isChatInputCommand()) {

                const command = client.commands.get(interaction.commandName);

                if (!command) {
                    console.log("Command not found:", interaction.commandName);
                    return interaction.reply({
                        content: "Command not found.",
                        ephemeral: true
                    });
                }

                return await command.execute(interaction, client);
            }

            // =========================
            // SELECT MENU (TICKETS)
            // =========================
            if (interaction.isStringSelectMenu()) {

                if (interaction.customId !== "ticket_create") return;

                const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

                const modal = new ModalBuilder()
                    .setCustomId(`ticket_modal_${interaction.values[0]}`)
                    .setTitle("Open Ticket");

                const reason = new TextInputBuilder()
                    .setCustomId("reason")
                    .setLabel("Why are you opening this ticket?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(reason)
                );

                return interaction.showModal(modal);
            }

            // =========================
            // MODALS (TICKETS)
            // =========================
            if (interaction.isModalSubmit()) {

                try {
                    console.log("MODAL RECEIVED:", interaction.customId);

                    if (!interaction.customId.startsWith("ticket_modal_")) return;

                    const type = interaction.customId.replace("ticket_modal_", "");
                    const reason = interaction.fields.getTextInputValue("reason");

                    console.log("TICKET TYPE:", type);
                    console.log("REASON:", reason);

                    const existing = await getOpenTicketForUser(interaction.user.id);

                    if (existing) {
                        return interaction.reply({
                            content: "You already have an open ticket.",
                            ephemeral: true
                        });
                    }

                    await interaction.deferReply({ ephemeral: true });

                    const ticket = await createTicket({
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                        type,
                        reason,
                        channelId: null
                    });

                    console.log("TICKET CREATED IN DB:", ticket.ticketId);

                    const formattedId = formatTicketId(ticket.ticketId);

                    const supportCategory = config.channels.supportCategory;

                    console.log("SUPPORT CATEGORY:", supportCategory);

                    const helperRole = config.roles.communityHelper;
                    const staffRole = config.roles.staff;

                    const channel = await interaction.guild.channels.create({
                        name: `ticket-${formattedId}`,
                        parent: supportCategory,

                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: ["ViewChannel"]
                            },
                            {
                                id: interaction.user.id,
                                allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                            },
                            {
                                id: helperRole,
                                allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                            },
                            {
                                id: staffRole,
                                allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                            }
                        ]
                    });

                    console.log("CHANNEL CREATED:", channel.id);
                    console.log("ABOUT TO SEND MESSAGE...");

                    ticket.channelId = channel.id;
                    await ticket.save();

                    await interaction.editReply({
                        content: `Ticket created: ${channel}`
                    });

                    const embed = new EmbedBuilder()
                        .setColor(0x3498db)
                        .setTitle(`Support Ticket: ${type}`)
                        .setDescription("The Staff Team and Community Helpers have been notified of your ticket. Please wait for someone to help you. Please do not ping members of the team.\n\nIf you have any additional information for them, please provide it now.")
                        .addFields(
                            {
                                name: "Ticket ID",
                                value: `#${formattedId}`,
                                inline: true
                            },
                            {
                                name: "Opened By",
                                value: `<@${interaction.user.id}>`,
                                inline: true
                            },
                            {
                                name: "Reason",
                                value: reason
                            }
                        );

                    const buttons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`ticket_refer_${formattedId}`)
                            .setLabel("Refer to Staff")
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId(`ticket_close_${formattedId}`)
                            .setLabel("Close Ticket")
                            .setStyle(ButtonStyle.Danger)
                    );

                    const msg = await channel.send({
                        content: `<@${interaction.user.id}> <@&${helperRole}>`,
                        embeds: [embed],
                        components: [buttons]
                    });

                    console.log("MESSAGE SENT:", msg.id);

                    return;

                } catch (err) {
                    console.error("MODAL ERROR:", err);

                    if (interaction.deferred || interaction.replied) {
                        return interaction.editReply({
                            content: "Ticket creation failed."
                        });
                    }
                    return interaction.reply({
                        content: "Ticket creation failed.,",
                        ephemeral: true
                    });
                }
            }
            // =========================
            // BUTTONS
            // =========================
            if (interaction.isButton()) {

                const Ticket = require("../database/models/Ticket");
                const config = require("../utils/config");
                const { closeTicket } = require("../utils/closeTicket");

                const ticket = await Ticket.findOne({
                    channelId: interaction.channel.id
                });

                if (!ticket) {
                    return interaction.reply({
                        content: "Ticket not found.",
                        ephemeral: true
                    });
                }

                // =========================
                // REFER
                // =========================
                if (interaction.customId.startsWith("ticket_refer_")) {

                    if (ticket.referred) {
                        return interaction.reply({
                            content: "Already referred.",
                            ephemeral: true
                        });
                    }

                    ticket.referred = true;
                    await ticket.save();

                    await interaction.channel.send({
                        content: `<@&${config.roles.staff}> This ticket has been referred to the Staff Team. Please wait for one of them to respond.`
                    });

                    return interaction.reply({
                        content: "Ticket referred.",
                        ephemeral: true
                    });
                }

                // =========================
                // CANCEL
                // =========================
                if (interaction.customId.startsWith("ticket_close_cancel_")) {

                    return interaction.update({
                        content: "Ticket close cancelled.",
                        components: []
                    });
                }

                // =========================
                // CONFIRM
                // =========================
                if (interaction.customId.startsWith("ticket_close_confirm_")) {

                    await interaction.update({
                        content: "Closing ticket...",
                        components: []
                    });

                    return closeTicket(interaction);
                }

                // =========================
                // CLOSE BUTTON
                // =========================
                if (interaction.customId.startsWith("ticket_close_")) {

                    return interaction.reply({
                        content: "Are you sure you want to close this ticket?",
                        ephemeral: true,
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`ticket_close_confirm_${ticket.ticketId}`)
                                    .setLabel("Yes, close it")
                                    .setStyle(ButtonStyle.Danger),

                                new ButtonBuilder()
                                    .setCustomId(`ticket_close_cancel_${ticket.ticketId}`)
                                    .setLabel("Cancel")
                                    .setStyle(ButtonStyle.Secondary)
                            )
                        ]
                    });
                }
            }

        } catch (err) {
            console.error("INTERACTION ERROR:", err);

            if (interaction.replied || interaction.deferred) return;

            return interaction.reply({
                content: "Something went wrong.",
                ephemeral: true
            });
        }
    }
};