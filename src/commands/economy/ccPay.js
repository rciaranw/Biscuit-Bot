const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    payCreditCard
} = require("../../economy/creditCard/creditCardEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ccpay")
        .setDescription("Pay off your credit card balance")
        .addIntegerOption(opt =>
            opt.setName("amount")
                .setDescription("Amount to pay")
                .setRequired(true)
        ),

    async execute(interaction) {

        const amount = interaction.options.getInteger("amount");

        const user = await EconomyUser.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        const result = payCreditCard(user, amount);

        if (!result.ok) {
            return interaction.reply({
                content: `❌ ${result.reason}`,
                ephemeral: false
            });
        }

        await user.save();

        const embed = new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle("💳 Payment Successful")
            .setDescription(`You paid **${amount} Twinkies** toward your credit card`)
            .addFields(
                {
                    name: "Remaining Balance",
                    value: `${result.remaining}`,
                    inline: true
                }
            )
            .setFooter({
                text: "Debt slightly reduced. Emotional damage remains."
            });

        return interaction.reply({ embeds: [embed] });
    }
};