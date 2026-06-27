const {
    SlashCommandBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    study,
    qualifications
} = require("../../economy/study/studyEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("study")
        .setDescription("Study to earn qualifications")
        .addStringOption(opt =>
            opt.setName("qualification")
                .setDescription("What you want to study")
                .setRequired(true)
                .addChoices(
                    ...Object.keys(qualifications).map(q => ({
                        name: qualifications[q].name,
                        value: q
                    }))
                )
        ),

    async execute(interaction) {

        const qual = interaction.options.getString("qualification");

        const user = await EconomyUser.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        const result = await study(user, qual);

        if (!result.ok) {
            return interaction.reply({
                content: `❌ ${result.reason}`,
                ephemeral: false
            });
        }

        return interaction.reply({
            content: `📘 You successfully earned **${result.name}**`
        });
    }
};