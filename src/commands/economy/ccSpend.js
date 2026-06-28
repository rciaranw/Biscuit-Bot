const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    useCreditCard
} = require("../../economy/creditCard/creditCardEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ccspend")
        .setDescription("Spend using your credit card")
        .addIntegerOption(opt =>
            opt.setName("amount")
                .setDescription("Amount to spend")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("item")
                .setDescription("What you're buying")
                .setRequired(true)
        ),

    async execute(interaction) {

        const amount = interaction.options.getInteger("amount");
        const item = interaction.options.getString("item");

        const user = await EconomyUser.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        const result = useCreditCard(user, amount, { item });

        if (!result.ok) {
            return interaction.reply({
                content: `❌ ${result.reason}`,
                ephemeral: false
            });
        }

        await user.save();

        const embed = new EmbedBuilder()
            .setColor(0xe67e22)
            .setTitle("💳 Purchase on Credit")
            .setDescription(`You purchased **${item}** using credit`)
            .addFields(
                {
                    name: "Amount",
                    value: `${amount}`,
                    inline: true
                },
                {
                    name: "Card Balance",
                    value: `${result.balance}`,
                    inline: true
                }
            )
            .setFooter({
                text: "Buy now. Regret later. Bank of Biscuit"
            });

        return interaction.reply({ embeds: [embed] });
    }
};