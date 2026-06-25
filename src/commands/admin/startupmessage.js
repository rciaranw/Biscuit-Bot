const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("startupmessage")
        .setDescription("Send startup embeds to a selected channel type")
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("Where to send the startup message")
                .setRequired(true)
                .addChoices(
                    { name: "Rules", value: "rules" },
                    { name: "Info", value: "info" },
                    { name: "Suggestions", value: "suggestions" }
                )
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.user.id !== config.adminId) {
            return interaction.editReply({
                content: "You do not have permission to use this command."
            });
        }

        const type = interaction.options.getString("type");

        let channelId;

        // =========================
        // RULES (single embed)
        // =========================
        if (type === "rules") {
            channelId = config.channels.rules;

            const embed = new EmbedBuilder()
                .setTitle("Server Rules")
                .setColor(0x2ecc71)
                .setDescription(
                    "**1. Respect everyone**\n" +
                    "**2. No spam**\n" +
                    "**3. No NSFW content**\n" +
                    "**4. Follow staff instructions**\n" +
                    "**5. No advertising**\n" +
                    "**6. Use channels correctly**"
                )
                .setFooter({ text: "Breaking rules may result in moderation action." })
                .setTimestamp();

            const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);

            if (!channel) {
                return interaction.editReply({ content: "Rules channel not found." });
            }

            await channel.send({ embeds: [embed] });

            return interaction.editReply({
                content: "Rules message sent."
            });
        }

        // =========================
        // INFO (FOUR EMBEDS)
        // =========================
        if (type === "info") {
            channelId = config.channels.infoPoint;

            const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);

            if (!channel) {
                return interaction.editReply({
                    content: "Info channel not found."
                });
            }

            const embed1 = new EmbedBuilder()
                .setTitle("Welcome")
                .setColor(0x3498db)
                .setDescription(
                    "Welcome to the server.\n\n" +
                    "This is a community space focused on interaction, events, and general chat."
                );

            const embed2 = new EmbedBuilder()
                .setTitle("Rules Summary")
                .setColor(0xe67e22)
                .setDescription(
                    "• Be respectful\n" +
                    "• No spam or trolling\n" +
                    "• No NSFW content\n" +
                    "• Follow staff instructions\n" +
                    "• No advertising"
                );

            const embed3 = new EmbedBuilder()
                .setTitle("Staff Team")
                .setColor(0x9b59b6)
                .setDescription(
                    "• Head Moderator: Oversees moderation\n" +
                    "• Moderators: Handle rule enforcement\n" +
                    "• Community Helpers: Assist members"
                );

            const embed4 = new EmbedBuilder()
                .setTitle("Getting Started")
                .setColor(0x1abc9c)
                .setDescription(
                    "• Read the rules\n" +
                    "• Use `/suggest` for ideas\n" +
                    "• Introduce yourself\n" +
                    "• Join conversations and events\n" +
                    "• Want to join the staff team? Use `/apply` and fill in the application form.\n" +
                    "• Have you joined from my TikTok account and you are a member of the Fan Club or Super Fan Club? Create a ticket below to get a special role!\n"
                );

            await channel.send({ embeds: [embed1] });
            await channel.send({ embeds: [embed2] });
            await channel.send({ embeds: [embed3] });
            await channel.send({ embeds: [embed4] });

            return interaction.editReply({
                content: "Info messages sent (4 embeds)."
            });
        }

        // =========================
        // SUGGESTIONS
        // =========================
        if (type === "suggestions") {
            channelId = config.channels.suggestions;

            const embed = new EmbedBuilder()
                .setTitle("Suggestions")
                .setColor(0xf1c40f)
                .setDescription(
                    "Use `/suggest` to submit ideas.\n\n" +
                    "All suggestions are reviewed by staff and may be accepted, denied, or implemented."
                )
                .setTimestamp();

            const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);

            if (!channel) {
                return interaction.editReply({
                    content: "Suggestions channel not found."
                });
            }

            await channel.send({ embeds: [embed] });

            return interaction.editReply({
                content: "Suggestions message sent."
            });
        }
    }
};