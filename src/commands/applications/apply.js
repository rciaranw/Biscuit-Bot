const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("apply")
        .setDescription("Apply for a server position"),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("Applications")
            .setColor(0x3498db)
            .setDescription(
                "Select the role you want to apply for.\n\n" +

                "**Staff**\n" +
                "Join the moderation team and help manage the community.\n\n" +

                "**Community Helper**\n" +
                "Support members and assist staff without being part of the moderation team."
            )
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("apply_staff")
                    .setLabel("Staff Application")
                    .setStyle(ButtonStyle.Danger),

                new ButtonBuilder()
                    .setCustomId("apply_helper")
                    .setLabel("Community Helper Application")
                    .setStyle(ButtonStyle.Primary)
            );

        return interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
};