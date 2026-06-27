const { SlashCommandBuilder } = require("discord.js");

const { getUser, removeWallet, addWallet } = require("../../services/economyService");

const COOLDOWN = 10 * 1000; // 10 seconds (keeps spam low)

const choices = ["heads", "tails"];

function formatCooldown(ms) {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Bet Twinkies on a coinflip")
        .addStringOption(option =>
            option
                .setName("choice")
                .setDescription("Heads or Tails")
                .setRequired(true)
                .addChoices(
                    { name: "Heads", value: "heads" },
                    { name: "Tails", value: "tails" }
                )
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Amount to bet")
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {

        const userId = interaction.user.id;

        const choice = interaction.options.getString("choice");
        const amount = interaction.options.getInteger("amount");

        const user = await getUser(userId);
        const now = Date.now();

        // cooldown (light anti-spam)
        if (user.lastCoinflip && now - user.lastCoinflip < COOLDOWN) {

            const remaining = COOLDOWN - (now - user.lastCoinflip);

            return interaction.reply({
                content: `🕒 Slow down. Try again in **${formatCooldown(remaining)}**`,
                ephemeral: true
            });
        }

        if (user.wallet < amount) {
            return interaction.reply({
                content: "You don't have enough Twinkies in your wallet.",
                ephemeral: true
            });
        }

        const result = choices[Math.floor(Math.random() * choices.length)];
        user.lastCoinflip = now;

        let response;

        if (result === choice) {

            const winnings = amount;

            await addWallet(userId, winnings);

            user.stats.coinflip.won += 1;
            await user.save();

            response = `🪙 It's **${result}** — you won **${winnings} Twinkies**!`;

        } else {

            await removeWallet(userId, amount);

            user.stats.coinflip.lost += 1;
            await user.save();

            response = `🪙 It's **${result}** — you lost **${amount} Twinkies**.`;
        }

        return interaction.reply({
            content: response
        });
    }
};