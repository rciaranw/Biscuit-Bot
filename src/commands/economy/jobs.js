const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    jobRegistry,
    canTakeJob
} = require("../../economy/jobs/jobRegistry");

const {
    qualifications
} = require("../../economy/study/studyEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("jobs")
        .setDescription("View available careers and requirements"),

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

        const userJob = user.job?.title || "unemployed";
        const userQuals = user.qualifications || [];

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle("💼 Career Centre")
            .setDescription("Browse available careers, requirements, and progression paths. Use `/applyjob` to apply.");

        const availableJobs = [];
        const lockedJobs = [];

        for (const [id, job] of Object.entries(jobRegistry)) {

            const eligible = canTakeJob(user, id);

            const req = job.requirements || {};

            // build requirement text
            let reqText = [];

            if (req.creditScore) {
                reqText.push(`Credit Score ${req.creditScore}+`);
            }

            if (req.qualifications?.length) {
                const missing = req.qualifications.filter(q => !userQuals.includes(q));

                if (missing.length > 0) {
                    reqText.push(`Missing Qualifications`);
                }
            }

            if (req.assets?.length) {
                reqText.push(`Assets Required`);
            }

            const line = {
                name: job.name,
                pay: job.basePay,
                requirements: reqText.length ? reqText.join(", ") : "None",
                eligible
            };

            if (eligible) availableJobs.push(line);
            else lockedJobs.push(line);
        }

        // =========================
        // CURRENT JOB
        // =========================
        const currentJob = jobRegistry[userJob];

        embed.addFields({
            name: "📌 Current Job",
            value: currentJob
                ? `**${currentJob.name}**\nLevel: ${user.job?.level || 1} | XP: ${user.job?.experience || 0}`
                : "Unemployed",
            inline: false
        });

        // =========================
        // AVAILABLE JOBS
        // =========================
        const availableText = availableJobs
            .slice(0, 10)
            .map(j =>
                `✅ **${j.name}**\n💰 ${j.pay} Twinkies\n📌 Requirements: ${j.requirements}`
            )
            .join("\n\n");

        embed.addFields({
            name: "🟢 Available Careers",
            value: availableText || "No jobs available",
            inline: false
        });

        // =========================
        // LOCKED JOBS
        // =========================
        const lockedText = lockedJobs
            .slice(0, 10)
            .map(j =>
                `🔒 **${j.name}**\n💰 ${j.pay} Twinkies\n📌 Requirements: ${j.requirements}`
            )
            .join("\n\n");

        embed.addFields({
            name: "🔒 Locked Careers",
            value: lockedText || "None locked",
            inline: false
        });

        // =========================
        // GUIDANCE
        // =========================
        embed.addFields({
            name: "📘 How to progress",
            value:
                "• Use `/study` to unlock qualifications\n" +
                "• Improve credit score via financial behaviour\n" +
                "• Apply using `/applyjob`\n" +
                "• Work using `/work` to gain XP and promotions",
            inline: false
        });

        embed.setFooter({
            text: "Career progression system active"
        });

        return interaction.reply({
            embeds: [embed]
        });
    }
};