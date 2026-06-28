console.log("INTERACTION CREATE FILE LOADED.");

const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../utils/config");

const { closeTicket } = require("../utils/closeTicket");
const {
    createTicket,
    getOpenTicketForUser,
    formatTicketId
} = require("../services/ticketService");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        try {

            console.log("INTERACTION:", interaction.type, interaction.customId || interaction.commandName);

            // =========================
            // AUTOCOMPLETE
            // =========================
            if (interaction.isAutocomplete()) {

                const command = client.commands.get(interaction.commandName);

                if (!command?.autocomplete) {
                    return;
                }

                try {
                    return await command.autocomplete(interaction);
                } catch (err) {
                    console.error(`Autocomplete error (${interaction.commandName}):`, err);
                    return;
                }
            }

            // =========================
            // SLASH COMMANDS
            // =========================
            if (interaction.isChatInputCommand()) {

                const command = client.commands.get(interaction.commandName);

                if (!command) {
                    return interaction.reply({
                        content: "Command not found.",
                        ephemeral: true
                    });
                }

                return command.execute(interaction, client);
            }

            // =========================
            // SELECT MENU (TICKETS)
            // =========================
            if (interaction.isStringSelectMenu()) {

                if (interaction.customId !== "ticket_create") return;

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

                if (!interaction.customId.startsWith("ticket_modal_")) return;

                const type = interaction.customId.replace("ticket_modal_", "");
                const reason = interaction.fields.getTextInputValue("reason");

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
                    reason
                });

                const formattedId = formatTicketId(ticket.ticketId);

                const channel = await interaction.guild.channels.create({
                    name: `ticket-${formattedId}`,
                    parent: config.channels.supportCategory,

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
                            id: config.roles.communityHelper,
                            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                        },
                        {
                            id: config.roles.staff,
                            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
                        }
                    ]
                });

                ticket.channelId = channel.id;
                await ticket.save();

                const embed = new EmbedBuilder()
                    .setTitle(`Ticket: ${type}`)
                    .setDescription(reason)
                    .setColor(0x3498db);

                const buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ticket_refer_${formattedId}`)
                        .setLabel("Refer")
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId(`ticket_close_${formattedId}`)
                        .setLabel("Close")
                        .setStyle(ButtonStyle.Danger)
                );

                await channel.send({
                    content: `<@${interaction.user.id}> <@&${config.roles.communityHelper}>`,
                    embeds: [embed],
                    components: [buttons]
                });

                return interaction.editReply({
                    content: `Ticket created: ${channel}`
                });
            }

            // =========================
            // BUTTONS (GLOBAL ROUTER)
            // =========================
            if (interaction.isButton()) {

                const id = interaction.customId;

                // =========================
                // TICKETS ONLY
                // =========================
                if (id.startsWith("ticket_")) {

                    const Ticket = require("../database/models/Ticket");

                    const ticket = await Ticket.findOne({
                        channelId: interaction.channel.id
                    });

                    if (!ticket) {
                        return interaction.reply({
                            content: "Ticket not found.",
                            ephemeral: true
                        });
                    }

                    // REFER
                    if (id.startsWith("ticket_refer_")) {

                        if (ticket.referred) {
                            return interaction.reply({
                                content: "Already referred.",
                                ephemeral: true
                            });
                        }

                        ticket.referred = true;
                        await ticket.save();

                        await interaction.channel.send({
                            content: `<@&${config.roles.staff}> Ticket referred.`
                        });

                        return interaction.reply({
                            content: "Referred.",
                            ephemeral: true
                        });
                    }

                    // CLOSE
                    if (id.startsWith("ticket_close_")) {

                        return interaction.reply({
                            content: "Are you sure?",
                            ephemeral: true,
                            components: [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`ticket_close_confirm_${ticket.ticketId}`)
                                        .setLabel("Yes")
                                        .setStyle(ButtonStyle.Danger),

                                    new ButtonBuilder()
                                        .setCustomId(`ticket_close_cancel_${ticket.ticketId}`)
                                        .setLabel("No")
                                        .setStyle(ButtonStyle.Secondary)
                                )
                            ]
                        });
                    }

                    if (id.startsWith("ticket_close_confirm_")) {

                        await interaction.update({
                            content: "Closing...",
                            components: []
                        });

                        return closeTicket(interaction);
                    }

                    if (id.startsWith("ticket_close_cancel_")) {

                        return interaction.update({
                            content: "Cancelled.",
                            components: []
                        });
                    }

                    return;
                }
            }

        } catch (err) {
            console.error("INTERACTION ERROR:", err);

            if (!interaction.replied) {
                return interaction.reply({
                    content: "Something went wrong.",
                    ephemeral: true
                });
            }
        }
    }
};