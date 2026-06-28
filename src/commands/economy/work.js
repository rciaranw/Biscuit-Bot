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
    logTransaction
} = require("../../economy/ledger/ledgerEngine");

const {
    ensureOverdraft
} = require("../../economy/overdraft/overdraftEngine");

const {
    applyCreditEvent
} = require("../../economy/credit/creditEngine");

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

        // =========================
        // COOLDOWN CHECK
        // =========================
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

        // =========================
        // PAY CALCULATION
        // =========================
        const grossPay = calculateJobPay(user);
        const tax = calculateTax(grossPay, job);
        const netPay = grossPay - tax;

        // =========================
        // JOB PROGRESSION
        // =========================
        if (!user.job.workStreak) user.job.workStreak = 0;

        const timeSinceLast = now - lastWorked;

        if (timeSinceLast <= COOLDOWN) {
            user.job.workStreak += 1;
        } else {
            user.job.workStreak = 1;
        }

        if (user.job.workStreak % 7 === 0) {
            user.job.level = (user.job.level || 1) + 1;

            applyCreditEvent(user, "JOB_PROMOTION");
        }

        user.job.lastWorkedAt = now;

        // =========================
        // MONEY FLOW
        // =========================
        user.wallet = (user.wallet || 0) + netPay;

        ensureOverdraft(user);

        // =========================
        // TAX → BANK OF BISCUIT
        // =========================
        await depositToBank(tax, "TAX", client, {
            reason: `Income tax from ${interaction.user.id} (${job.name})`
        });

        // =========================
        // LEDGER ENTRIES (FULL AUDIT TRAIL)
        // =========================
        logTransaction(user, {
            type: "WORK_GROSS",
            amount: grossPay,
            balanceAfter: user.wallet,
            source: "WORK",
            meta: {
                job: job.name
            }
        });

        logTransaction(user, {
            type: "WORK_TAX",
            amount: -tax,
            balanceAfter: user.wallet,
            source: "TAX",
            meta: {
                job: job.name
            }
        });

        logTransaction(user, {
            type: "WORK_NET",
            amount: netPay,
            balanceAfter: user.wallet,
            source: "WORK",
            meta: {
                job: job.name
            }
        });

        // =========================
        // CREDIT EVENT
        // =========================
        applyCreditEvent(user, "WORK_COMPLETED");

        await user.save();

        // =========================
        // RESPONSE
        // =========================
        const responses = [
            `You worked as a **${job.name}** and survived another shift.`,
            `Another shift complete. The economy continues.`,
            `You showed up, got paid, and left emotionally unchanged.`,
            `Work completed. Dignity slightly reduced, wallet slightly increased.`,
            `A shift as **${job.name}** is now behind you.`
        ];

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle("💼 Work Complete")
            .setDescription(responses[Math.floor(Math.random() * responses.length)])
            .addFields(
                {
                    name: "💰 Gross Pay",
                    value: `${grossPay} Twinkies`,
                    inline: true
                },
                {
                    name: "📉 Tax",
                    value: `${tax} Twinkies`,
                    inline: true
                },
                {
                    name: "💵 Net Pay",
                    value: `${netPay} Twinkies`,
                    inline: true
                },
                {
                    name: "📊 Streak",
                    value: `${user.job.workStreak}`,
                    inline: true
                },
                {
                    name: "💼 Job",
                    value: job.name,
                    inline: true
                }
            )
            .setFooter({
                text: "All transactions recorded in Bank of Biscuit ledger system"
            });

        return interaction.reply({
            embeds: [embed]
        });
    }
};