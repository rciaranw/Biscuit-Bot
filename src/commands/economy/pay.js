const { SlashCommandBuilder } = require("discord.js");

const { getUser, transferMoney } = require("../../services/economyService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("Send Twinkies to another user")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to pay")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Amount of Twinkies")
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {

        const senderId = interaction.user.id;
        const target = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");

        if (target.id === senderId) {
            return interaction.reply({
                content: "You can't pay yourself. That's just moving numbers for emotional comfort.",
                ephemeral: true
            });
        }

        try {

            await transferMoney(senderId, target.id, amount);

            return interaction.reply({
                content: `💸 You paid **${amount.toLocaleString()} Twinkies** to **${target.username}**`
            });

        } catch (err) {

            return interaction.reply({
                content: err.message,
                ephemeral: true
            });
        }
    }
};