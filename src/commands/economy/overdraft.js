const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");
const {
    getArrangedLimit
} = require("../../economy/banking/overdraftEngine");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("overdraft")
        .setDescription("View your overdraft status"),

    async execute(interaction) {

        const user = await EconomyUser.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        const arranged = user.overdraft?.arrangedUsed || 0;
        const unarranged = user.overdraft?.unarrangedUsed || 0;
        const limit = getArrangedLimit(user);

        const embed = new EmbedBuilder()
            .setTitle("💳 Overdraft Status")
            .setColor(0xe67e22)
            .addFields(
                {
                    name: "Arranged Overdraft Used",
                    value: `${arranged} Twinkies`,
                    inline: true
                },
                {
                    name: "Unarranged Overdraft",
                    value: `${unarranged} Twinkies`,
                    inline: true
                },
                {
                    name: "Limit",
                    value: `${limit} Twinkies`,
                    inline: true
                }
            )
            .setFooter({
                text: "Bank of Biscuit Risk Engine"
            });

        return interaction.reply({
            embeds: [embed]
        });
    }
};