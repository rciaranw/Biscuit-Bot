const { SlashCommandBuilder } = require("discord.js");
const { deposit, getUser } = require("../../services/economyService");
const parseAmount = require("../../utils/parseAmount");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Deposit Twinkies into your bank.")
        .addStringOption(option =>
            option
                .setName("amount")
                .setDescription("Amount or 'all'")
                .setRequired(true)
        ),

    async execute(interaction) {

        const input = interaction.options.getString("amount");
        const user = await getUser(interaction.user.id);

        const amount = parseAmount(input, user.wallet);

        if (!amount) {
            return interaction.reply({
                content: "Invalid amount or insufficient funds.",
                ephemeral: false
            });
        }

        try {

            await deposit(interaction.user.id, amount);

            return interaction.reply({
                content: `🏦 Deposited **${amount.toLocaleString()} Twinkies** into your bank.`
            });

        } catch (err) {

            return interaction.reply({
                content: err.message,
                ephemeral: false
            });

        }
    }
};