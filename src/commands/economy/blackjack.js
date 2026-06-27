const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const BlackjackGame = require("../../database/models/BlackjackGame");
const {
    createGame,
    getGame
} = require("../../services/blackjackService");

const { getUser, addWallet, removeWallet } = require("../../services/economyService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("Play blackjack")
        .addIntegerOption(option =>
            option
                .setName("bet")
                .setDescription("Amount to bet")
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {

        const bet = interaction.options.getInteger("bet");
        const userId = interaction.user.id;

        const user = await getUser(userId);

        if (user.wallet < bet) {
            return interaction.reply({
                content: "Not enough Twinkies.",
                ephemeral: true
            });
        }

        await removeWallet(userId, bet);

        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("🃏 Blackjack Loading...")
                    .setColor(0x2ecc71)
            ],
            fetchReply: true
        });

        const game = await createGame({
            userId,
            channelId: interaction.channel.id,
            messageId: msg.id,
            bet
        });

        const embed = new EmbedBuilder()
            .setTitle("🃏 Blackjack")
            .setColor(0x2ecc71)
            .addFields(
                {
                    name: "Your Hand",
                    value: game.playerHand.join(", "),
                    inline: false
                },
                {
                    name: "Dealer Shows",
                    value: `${game.dealerHand[0]}, ❓`,
                    inline: false
                },
                {
                    name: "Bet",
                    value: `${bet} Twinkies`,
                    inline: true
                }
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`bj_hit_${userId}`)
                .setLabel("Hit")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId(`bj_stand_${userId}`)
                .setLabel("Stand")
                .setStyle(ButtonStyle.Danger)
        );

        await msg.edit({
            embeds: [embed],
            components: [row]
        });
    }
};