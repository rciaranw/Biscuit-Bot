const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../utils/config");

const {
    createSuggestion,
    setSuggestionMessage
} = require("../../services/suggestionService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Submit a suggestion for the server")
        .addStringOption(option =>
            option
                .setName("suggestion")
                .setDescription("Your suggestion")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const suggestionText = interaction.options.getString("suggestion");

        // Create suggestion in DB
        const suggestion = await createSuggestion({
            guildId: interaction.guild.id,
            userId: interaction.user.id,
            suggestion: suggestionText
        });

        const embed = new EmbedBuilder()
            .setTitle(`Suggestion #${suggestion.suggestionId}`)
            .setColor(0xf1c40f)
            .addFields(
                {
                    name: "Status",
                    value: "Pending",
                    inline: true
                },
                {
                    name: "Suggested By",
                    value: `<@${interaction.user.id}>`,
                    inline: true
                },
                {
                    name: "Suggestion",
                    value: suggestionText
                }
            )
            .setTimestamp();

        const channel = interaction.guild.channels.cache.get(
            config.channels.suggestions
        );

        if (!channel) {
            return interaction.editReply({
                content: "Suggestions channel not found."
            });
        }

        const msg = await channel.send({
            embeds: [embed]
        });

        // Add reactions for voting
        await msg.react("👍");
        await msg.react("👎");

        // Store message reference
        await setSuggestionMessage(
            suggestion.suggestionId,
            msg.id,
            channel.id
        );

        await interaction.editReply({
            content: `Suggestion submitted as #${suggestion.suggestionId}`
        });
    }
};