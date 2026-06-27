const { SlashCommandBuilder } = require("discord.js");
const { withdraw, getUser } = require("../../services/economyService");
const parseAmount = require("../../utils/parseAmount");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Withdraw Twinkies from your bank.")
        .addStringOption(option =>
            option
                .setName("amount")
                .setDescription("Amount or 'all'")
                .setRequired(true)
        ),

    async execute(interaction) {

        const input = interaction.options.getString("amount");
        const user = await getUser(interaction.user.id);

        const amount = parseAmount(input, user.bank);

        if (!amount) {
            return interaction.reply({
                content: "Invalid amount or insufficient funds.",
                ephemeral: false
            });
        }

        try {

            await withdraw(interaction.user.id, amount);

            return interaction.reply({
                content: `👛 Withdrew **${amount.toLocaleString()} Twinkies** from your bank.`
            });

        } catch (err) {

            return interaction.reply({
                content: err.message,
                ephemeral: false
            });

        }
    }
};