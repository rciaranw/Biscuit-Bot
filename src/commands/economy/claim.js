const { SlashCommandBuilder } = require("discord.js");

const { getUser, addWallet } = require("../../services/economyService");

const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;
const WEEKLY_COOLDOWN = 7 * DAILY_COOLDOWN;
const MONTHLY_COOLDOWN = 30 * DAILY_COOLDOWN;

const MONTHLY_ALLOWED_ROLES = [
    "Super Fan",
    "Friends",
    "Favourites",
    "Ciaran"
];

// =========================
// FORMAT COOLDOWN
// =========================
function formatCooldown(ms) {

    const totalSeconds = Math.ceil(ms / 1000);

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    let parts = [];

    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.join(" ") || "less than 1m";
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("claim")
        .setDescription("Claim your Twinkies rewards")
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("What reward to claim")
                .setRequired(true)
                .addChoices(
                    { name: "Daily", value: "daily" },
                    { name: "Weekly", value: "weekly" },
                    { name: "Monthly", value: "monthly" }
                )
        ),

    async execute(interaction) {

        const type = interaction.options.getString("type");
        const userId = interaction.user.id;

        const user = await getUser(userId);
        const now = Date.now();

        // =========================
        // DAILY
        // =========================
        if (type === "daily") {

            if (user.lastDaily && now - user.lastDaily < DAILY_COOLDOWN) {

                const remaining = DAILY_COOLDOWN - (now - user.lastDaily);

                return interaction.reply({
                    content: `🕒 You already claimed daily. Come back in **${formatCooldown(remaining)}**.`,
                    ephemeral: false
                });
            }

            user.lastDaily = now;
            await user.save();

            await addWallet(userId, 100);

            return interaction.reply({
                content: "🎁 You claimed your **Daily Twinkies (100)**!"
            });
        }

        // =========================
        // WEEKLY
        // =========================
        if (type === "weekly") {

            if (user.lastWeekly && now - user.lastWeekly < WEEKLY_COOLDOWN) {

                const remaining = WEEKLY_COOLDOWN - (now - user.lastWeekly);

                return interaction.reply({
                    content: `🕒 You already claimed weekly. Come back in **${formatCooldown(remaining)}**.`,
                    ephemeral: false
                });
            }

            user.lastWeekly = now;
            await user.save();

            await addWallet(userId, 500);

            return interaction.reply({
                content: "📦 You claimed your **Weekly Twinkies (500)**!"
            });
        }

        // =========================
        // MONTHLY
        // =========================
        if (type === "monthly") {

            const hasRole = interaction.member.roles.cache.some(role =>
                MONTHLY_ALLOWED_ROLES.includes(role.name)
            );

            if (!hasRole) {
                return interaction.reply({
                    content: "❌ You are not eligible for the monthly reward.",
                    ephemeral: true
                });
            }

            if (user.lastMonthly && now - user.lastMonthly < MONTHLY_COOLDOWN) {

                const remaining = MONTHLY_COOLDOWN - (now - user.lastMonthly);

                return interaction.reply({
                    content: `🕒 You already claimed monthly. Come back in **${formatCooldown(remaining)}**.`,
                    ephemeral: false
                });
            }

            user.lastMonthly = now;
            await user.save();

            await addWallet(userId, 1000);

            return interaction.reply({
                content: "👑 You claimed your **Monthly Twinkies (1000)**!"
            });
        }
    }
};