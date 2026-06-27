const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { getAllJobs } = require("../../economy/jobs/jobRegistry");
const { applyForJob } = require("../../economy/jobs/jobApplicationEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("applyjob")
        .setDescription("Apply for a job")
        .addStringOption(opt =>
            opt.setName("job")
                .setDescription("Job you want to apply for")
                .setRequired(true)
                .addChoices(
                    ...getAllJobs().map(j => ({
                        name: j.name,
                        value: j.id
                    }))
                )
        ),

    async execute(interaction) {

        const jobId = interaction.options.getString("job");

        const result = await applyForJob(interaction.user.id, jobId);

        if (!result.ok) {
            return interaction.reply({
                content: `❌ ${result.reason}`,
                ephemeral: false
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("📄 Job Application Submitted")
            .setColor("Blue")
            .setDescription(`You have applied for **${result.job}**`)
            .setFooter({ text: "Bank of Biscuit Employment System" })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};