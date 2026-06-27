const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    getJob
} = require("../../economy/jobs/jobRegistry");

const {
    calculateJobPay,
    calculateTax
} = require("../../economy/jobs/jobEngine");

const {
    depositToBank
} = require("../../economy/bankOfBiscuit");

const {
    logMoney
} = require("../../utils/moneyLogger");

const COOLDOWN = 6 * 60 * 60 * 1000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work your job to earn Twinkies"),

    async execute(interaction, client) {

        const user = await EconomyUser.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        if (!user.job || user.job.title === "unemployed") {
            return interaction.reply({
                content: "❌ You need a job before you can work. Use /applyjob.",
                ephemeral: false
            });
        }

        const job = getJob(user.job.title);

        const now = Date.now();
        const lastWorked = user.job.lastWorkedAt || 0;

        if (now - lastWorked < COOLDOWN) {

            const remaining = COOLDOWN - (now - lastWorked);
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining / (1000 * 60)) % 60);

            return interaction.reply({
                content: `⏳ You're too tired. Come back in **${hours}h ${minutes}m**`,
                ephemeral: false
            });
        }

        const grossPay = calculateJobPay(user);
        const tax = calculateTax(grossPay, job);
        const netPay = grossPay - tax;

        // streak system
        if (!user.job.workStreak) user.job.workStreak = 0;

        if (lastWorked && now - lastWorked <= COOLDOWN) {
            user.job.workStreak += 1;
        } else {
            user.job.workStreak = 1;
        }

        // level progression
        if (user.job.workStreak % 7 === 0) {
            user.job.level = (user.job.level || 1) + 1;
        }

        user.job.lastWorkedAt = now;

        user.wallet = (user.wallet || 0) + netPay;

        await user.save();

        await depositToBank(tax, "TAX", client, {
            reason: `Income tax from ${interaction.user.id} (${job.name})`
        });

        await logMoney(client, {
            userId: interaction.user.id,
            type: "WORK_INCOME",
            amount: netPay,
            walletAfter: user.wallet,
            reason: `Worked as ${job.name}`
        });

        const responses = [
            `You worked a shift as **${job.name}** and survived it.`,
            `Another shift down as a **${job.name}**.`,
            `You did the job. Barely.`,
            `Your shift as a **${job.name}** ended without incident.`,
            `You got paid for showing up as a **${job.name}**.`,
            `A chaotic but profitable shift.`,
            `You completed your work as a **${job.name}**.`,
            `You earned your Twinkies the hard way.`,
            `Your boss didn't fire you today.`,
            `You clocked out as a **${job.name}**. Freedom achieved.`
        ];

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle("💼 Work Complete")
            .setDescription(responses[Math.floor(Math.random() * responses.length)])
            .addFields(
                { name: "Gross Pay", value: `${grossPay}`, inline: true },
                { name: "Tax", value: `${tax}`, inline: true },
                { name: "Net Pay", value: `${netPay}`, inline: true },
                { name: "Streak", value: `${user.job.workStreak}`, inline: true },
                { name: "Job", value: job.name, inline: true }
            )
            .setFooter({ text: "Bank of Biscuit collects tax revenue automatically" });

        return interaction.reply({ embeds: [embed] });
    }
};