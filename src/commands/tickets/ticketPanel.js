const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const config = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticketpanel")
        .setDescription("Post the ticket creation panel"),

    async execute(interaction) {
        try {
            console.log("TICKET PANEL RUNNING");

            if (interaction.user.id !== config.adminId) {
                return interaction.reply({
                    content: "No Permission.",
                    ephemeral: true
                });
            }

            const channelId = config.channels.infoPoint;

            const channel = await interaction.guild.channels.fetch(channelId).catch((err) => {
                console.log("CHANNEL FETCH FAILED:", err);
                return null;
            });

            if (!channel) {
                return interaction.reply({
                    content: "Info channel not found.",
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle("Tickets")
                .setColor(0x3498db)
                .setDescription("Select a ticket type below.");

            const menu = new StringSelectMenuBuilder()
                .setCustomId("ticket_create")
                .setPlaceholder("Select ticket type.")
                .addOptions([
                    { label: "Report", value: "report", emoji: "📢" },
                    { label: "Support", value: "support", emoji: "❓" },
                    { label: "Role Issue", value: "role", emoji: "🎭" }
                ]);

            await channel.send({
                embeds: [embed],
                components: [new ActionRowBuilder().addComponents(menu)]
            });

            return interaction.reply({
                content: "Ticket panel sent.",
                ephemeral: true
            });
        } catch (err) {
            console.log("TICKET PANEL ERROR CAUGHT:", err);

            if (interaction.replied || interacrtion.deferred) {
                return interaction.followUp({
                    content: "Error running command.",
                    ephemeral: true
                });
            }
            return interaction.reply({
                content: "Error running command.",
                ephemeral: true
            });
        }
    }
}