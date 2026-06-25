const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../utils/config");

const {
    getSuggestion,
    updateSuggestionStatus
} = require("../../services/suggestionService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("managesuggestion")
        .setDescription("Manage a server suggestion (Admin only)")
        .addSubcommand(sub =>
            sub
                .setName("setstatus")
                .setDescription("Update the status of a suggestion")
                .addIntegerOption(option =>
                    option
                        .setName("id")
                        .setDescription("Suggestion ID")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("status")
                        .setDescription("New status")
                        .setRequired(true)
                        .addChoices(
                            { name: "Accepted", value: "Accepted" },
                            { name: "In Progress", value: "In Progress" },
                            { name: "Implemented", value: "Implemented" },
                            { name: "Denied", value: "Denied" },
                            { name: "Deleted", value: "Deleted" }
                        )
                )
                .addStringOption(option =>
                    option
                        .setName("reason")
                        .setDescription("Optional reason")
                        .setRequired(false)
                )
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const member = interaction.member;

        // Admin-only lock
        if (interaction.user.id !== config.adminId) {
            return interaction.editReply({
                content: "You do not have permission to use this command."
            });
        }

        const suggestionId = interaction.options.getInteger("id");
        const status = interaction.options.getString("status");
        const reason = interaction.options.getString("reason");

        const suggestion = await getSuggestion(suggestionId);

        if (!suggestion) {
            return interaction.editReply({
                content: `Suggestion #${suggestionId} not found.`
            });
        }

        const channel = await interaction.guild.channels.fetch(suggestion.channelId);
        const message = await channel.messages.fetch(suggestion.messageId).catch(() => null);

        if (!message) {
            return interaction.editReply({
                content: "Could not find original suggestion message."
            });
        }

        // Status messages
        let statusText = "";
        let color = 0x95a5a6;

        switch (status) {
            case "Accepted":
                statusText = "This suggestion has been approved. It will be implemented in future updates.";
                color = 0x2ecc71;
                break;

            case "In Progress":
                statusText = "This suggestion has been approved and is currently being worked on.";
                color = 0xf1c40f;
                break;

            case "Implemented":
                statusText = "This suggestion has been implemented to the server.";
                color = 0x3498db;
                break;

            case "Denied":
                statusText = "This suggestion has not been approved and will not be implemented.";
                color = 0xe74c3c;
                break;

            case "Deleted":
                statusText = "This suggestion has been deleted/removed from consideration.";
                color = 0x7f8c8d;
                break;
        }

        const updatedEmbed = new EmbedBuilder()
            .setTitle(`Suggestion #${suggestion.suggestionId}`)
            .setColor(color)
            .addFields(
                {
                    name: "Status",
                    value: status,
                    inline: true
                },
                {
                    name: "Suggested By",
                    value: `<@${suggestion.userId}>`,
                    inline: true
                },
                {
                    name: "Suggestion",
                    value: suggestion.suggestion
                },
                {
                    name: "Staff Response",
                    value: statusText
                }
            )
            .setTimestamp();

        if (reason) {
            updatedEmbed.addFields({
                name: "Reason",
                value: reason
            });
        }

        // Update DB
        await updateSuggestionStatus(
            suggestionId,
            status,
            interaction.user.id,
            reason || null
        );

        // Edit message
        await message.edit({
            embeds: [updatedEmbed]
        });

        // Try DM user
        const user = await interaction.client.users.fetch(suggestion.userId).catch(() => null);

        if (user) {
            user.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Suggestion Update")
                        .setColor(color)
                        .addFields(
                            {
                                name: "Status",
                                value: status
                            },
                            {
                                name: "Suggestion",
                                value: suggestion.suggestion
                            }
                        )
                        .setTimestamp()
                ]
            }).catch(() => {});
        }

        return interaction.editReply({
            content: `Suggestion #${suggestionId} updated to **${status}**`
        });
    }
};