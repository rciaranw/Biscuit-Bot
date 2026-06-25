const { SlashCommandBuilder } = require("discord.js");

const config = require("../../config/config.json");

const ApplicationSettings = require("../../database/models/ApplicationSettings");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lockapplications")
        .setDescription("Lock Staff or Community Helper applications")
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("Application type")
                .setRequired(true)
                .addChoices(
                    { name: "Staff", value: "staff" },
                    { name: "Community Helper", value: "helper" }
                )
        ),

    async execute(interaction) {

        const member = interaction.member;

        const hasPermission =
            member.roles.cache.has(config.roles.headModerator) ||
            member.roles.cache.has(config.roles.ciaran);

        if (!hasPermission) {
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true
            });
        }

        const type = interaction.options.getString("type");

        let settings = await ApplicationSettings.findOne({
            guildId: interaction.guild.id
        });

        if (!settings) {
            settings = await ApplicationSettings.create({
                guildId: interaction.guild.id
            });
        }

        if (type === "staff") {
            settings.staffApplicationsOpen = false;
        }

        if (type === "helper") {
            settings.helperApplicationsOpen = false;
        }

        await settings.save();

        await interaction.reply({
            content: `${type === "staff" ? "Staff" : "Community Helper"} applications have been locked.`,
            ephemeral: true
        });
    }
};