const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser")

const {
    jobRegistry,
    canTakeJob,
    getJob
} = require("../../economy/jobs/jobRegistry");

const {
    applyForJob
} = require("../../economy/jobs/jobAccessLayer");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("jobs")
        .setDescription("View available jobs or apply for one")
        .addStringOption(opt =>
            opt.setName("apply")
                .setDescription("Apply for a job by ID")
                .setRequired(false)
        ),

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

        const applyJobId = interaction.options.getString("apply");

        // =========================
        // APPLY MODE
        // =========================
        if (applyJobId) {

            const result = await applyForJob(user.userId, applyJobId);

            if (!result.ok) {
                return interaction.reply({
                    content: `❌ ${result.reason || "Unable to apply for job"}`,
                    ephemeral: false
                });
            }

            return interaction.reply({
                content: `✅ You are now working as **${result.job.name}**`
            });
        }

        // =========================
        // VIEW MODE
        // =========================

        const available = [];
        const locked = [];

        for (const [id, job] of Object.entries(jobRegistry)) {

            if (canTakeJob(user, id)) {
                available.push({ id, job });
            } else {
                locked.push({ id, job });
            }
        }

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle("💼 Job Market")
            .setDescription("Browse available careers and apply using `/jobs apply:<jobId>`");

        // AVAILABLE JOBS
        const availableText = available
            .slice(0, 10)
            .map(j => `**${j.job.name}** (\`${j.id}\`) - ${j.job.basePay} Twinkies`)
            .join("\n");

        embed.addFields({
            name: "✅ Available Jobs",
            value: availableText || "None available",
            inline: false
        });

        // LOCKED JOBS (show reason)
        const lockedText = locked
            .slice(0, 10)
            .map(j => {

                const req = j.job.requirements || {};
                let reasons = [];

                if ((req.creditScore || 0) > (user.creditScore || 0)) {
                    reasons.push(`Credit ${req.creditScore}+`);
                }

                if (req.qualifications?.length) {
                    reasons.push(`Qualifications required`);
                }

                if (req.assets?.length) {
                    reasons.push(`Assets required`);
                }

                return `🔒 **${j.job.name}** (\`${j.id}\`) - ${reasons.join(", ")}`;
            })
            .join("\n");

        embed.addFields({
            name: "🔒 Locked Jobs",
            value: lockedText || "None locked",
            inline: false
        });

        embed.setFooter({
            text: "Use /job to apply instantly"
        });

        return interaction.reply({
            embeds: [embed]
        });
    }
};