const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    qualifications
} = require("../../economy/study/studyEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("qualifications")
        .setDescription("View your qualifications and study options"),

    async execute(interaction) {

        const user = await EconomyUser.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        const userQuals = user.qualifications || [];

        const embed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle("📘 Qualifications Overview");

        // =========================
        // USER QUALIFICATIONS
        // =========================
        const owned = Object.entries(qualifications)
            .filter(([id]) => userQuals.includes(id))
            .map(([id, q]) => `✅ **${q.name}** (\`${id}\`)`)
            .join("\n");

        embed.addFields({
            name: "📚 Your Qualifications",
            value: owned || "None yet. Use /study to start learning.",
            inline: false
        });

        // =========================
        // MISSING QUALIFICATIONS
        // =========================
        const missing = Object.entries(qualifications)
            .filter(([id]) => !userQuals.includes(id))
            .slice(0, 15)
            .map(([id, q]) => `📖 **${q.name}** (\`${id}\`)`)
            .join("\n");

        embed.addFields({
            name: "🔓 Available to Study",
            value: missing || "You have everything available!",
            inline: false
        });

        embed.setFooter({
            text: "Use /study qualification:<id> to unlock new career paths"
        });

        return interaction.reply({
            embeds: [embed]
        });
    }
};