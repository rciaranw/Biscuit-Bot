const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    jobRegistry,
    canTakeJob
} = require("../../economy/jobs/jobRegistry");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("applyjob")
        .setDescription("Apply for a job")
        .addStringOption(opt =>
            opt.setName("job")
                .setDescription("Choose a job")
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction) {

        const focused = interaction.options.getFocused();

        const choices = Object.entries(jobRegistry)
            .filter(([id, job]) =>
                job.name.toLowerCase().includes(focused.toLowerCase())
            )
            .map(([id, job]) => ({
                name: job.name,
                value: id
            }))
            .slice(0, 25);

        await interaction.respond(choices);
    },

    async execute(interaction) {

        const jobId = interaction.options.getString("job");

        const user = await EconomyUser.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        const job = jobRegistry[jobId];

        if (!job) {
            return interaction.reply({
                content: "❌ That job does not exist.",
                ephemeral: false
            });
        }

        // =========================
        // ALREADY HAS JOB CHECK
        // =========================
        if (user.job && user.job.title && user.job.title !== "unemployed") {
            return interaction.reply({
                content: `❌ You already work as **${user.job.title}**. Quit first before applying elsewhere.`,
                ephemeral: false
            });
        }

        // =========================
        // ELIGIBILITY CHECK
        // =========================
        if (!canTakeJob(user, jobId)) {

            return interaction.reply({
                content: `❌ You do not meet the requirements for **${job.name}**.`,
                ephemeral: false
            });
        }

        // =========================
        // ASSIGN JOB
        // =========================
        user.job = {
            title: jobId,
            level: 1,
            experience: 0,
            salaryMultiplier: 1,
            workStreak: 0,
            totalShifts: 0,
            performance: 0,
            lastWorkedAt: 0,
            promotions: [],
            startedAt: Date.now()
        };

        await user.save();

        // =========================
        // RESPONSE
        // =========================
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle("💼 Job Accepted")
            .setDescription(`You are now employed as **${job.name}**`)
            .addFields(
                {
                    name: "Base Pay",
                    value: `${job.basePay} Twinkies`,
                    inline: true
                },
                {
                    name: "Level",
                    value: "1",
                    inline: true
                },
                {
                    name: "Status",
                    value: "Active Employment",
                    inline: true
                }
            )
            .setFooter({
                text: "Use /work to start earning income"
            });

        return interaction.reply({
            embeds: [embed]
        });
    }
};