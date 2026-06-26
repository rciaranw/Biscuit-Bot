const config = require("../utils/config");
const Ticket = require("../database/models/Ticket");

const {
    EmbedBuilder
} = require("discord.js");

const { createTranscript } = require("./createTranscript");

async function closeTicket(interaction) {

    const channel = interaction.channel;

    const ticket = await Ticket.findOne({ channelId: channel.id });

    if (!ticket) {
        return interaction.reply({
            content: "Ticket not found in database.",
            ephemeral: true
        });
    }

    const transcriptPath = await createTranscript(channel);

    const logChannel = await interaction.guild.channels
        .fetch(config.channels.ticketsLog)
        .catch(() => null);

    const embed = new EmbedBuilder()
        .setTitle("Ticket Closed")
        .setColor(0xe74c3c)
        .addFields(
            { name: "Ticket ID", value: `#${ticket.ticketId}` },
            { name: "Opened By", value: `<@${ticket.userId}>` },
            { name: "Closed By", value: `<@${interaction.user.id}>` },
            { name: "Type", value: ticket.type }
        )
        .setTimestamp();

    if (logChannel) {
        await logChannel.send({
            embeds: [embed],
            files: [transcriptPath]
        });
    }

    const user = await interaction.client.users.fetch(ticket.userId).catch(() => null);

    if (user) {
        user.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Ticket Closed")
                    .setColor(0xe74c3c)
                    .setDescription(`Your ticket #${ticket.ticketId} has been closed.`)
            ]
        }).catch(() => {});
    }

    await Ticket.deleteOne({ _id: ticket._id });

    await channel.delete().catch(() => {});
}

module.exports = { closeTicket };