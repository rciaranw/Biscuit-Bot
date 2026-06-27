const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { getUser, addWallet, removeWallet } = require("../../services/economyService");

const sessions = new Map();

// =========================
// CARD SYSTEM
// =========================
function drawCard() {
    const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
    return cards[Math.floor(Math.random() * cards.length)];
}

function calculate(hand) {
    let total = hand.reduce((a, b) => a + b, 0);
    let aces = hand.filter(x => x === 11).length;

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

// =========================
// GAME EMBED
// =========================
function buildEmbed(session, revealDealer = false) {

    const playerTotal = calculate(session.playerHand);
    const dealerTotal = calculate(session.dealerHand);

    return new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("🃏 Blackjack")
        .addFields(
            {
                name: "Your Hand",
                value: `${session.playerHand.join(", ")} (**${playerTotal}**)`,
                inline: false
            },
            {
                name: "Dealer Hand",
                value: revealDealer
                    ? `${session.dealerHand.join(", ")} (**${dealerTotal}**)`
                    : `${session.dealerHand[0]}, ?`,
                inline: false
            },
            {
                name: "Bet",
                value: `${session.bet} Twinkies`,
                inline: true
            }
        );
}

// =========================
// BUTTON ROW
// =========================
function buildButtons(disabled = false) {

    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("bj_hit")
            .setLabel("Hit")
            .setStyle(ButtonStyle.Success)
            .setDisabled(disabled),

        new ButtonBuilder()
            .setCustomId("bj_stand")
            .setLabel("Stand")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(disabled)
    );
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("Play blackjack against the dealer")
        .addIntegerOption(option =>
            option
                .setName("bet")
                .setDescription("Amount to bet")
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {

        const userId = interaction.user.id;
        const bet = interaction.options.getInteger("bet");

        const user = await getUser(userId);

        if (user.wallet < bet) {
            return interaction.reply({
                content: "You don’t have enough Twinkies in your wallet.",
                ephemeral: true
            });
        }

        await removeWallet(userId, bet);

        const session = {
            userId,
            bet,
            playerHand: [drawCard(), drawCard()],
            dealerHand: [drawCard(), drawCard()],
            active: true
        };

        sessions.set(userId, session);

        const msg = await interaction.reply({
            embeds: [buildEmbed(session)],
            components: [buildButtons()],
            fetchReply: true
        });

        // =========================
        // BUTTON COLLECTOR
        // =========================
        const collector = msg.createMessageComponentCollector({
            time: 60000
        });

        collector.on("collect", async (i) => {

            if (i.user.id !== userId) {
                return i.reply({
                    content: "This is not your game.",
                    ephemeral: true
                });
            }

            const session = sessions.get(userId);
            if (!session || !session.active) return;

            // =========================
            // HIT
            // =========================
            if (i.customId === "bj_hit") {

                session.playerHand.push(drawCard());

                const playerTotal = calculate(session.playerHand);

                if (playerTotal > 21) {

                    session.active = false;
                    sessions.delete(userId);

                    const finalUser = await getUser(userId);
                    finalUser.stats.blackjack.lost += 1;
                    await finalUser.save();

                    await i.update({
                        embeds: [buildEmbed(session, true)],
                        components: [buildButtons(true)]
                    });

                    return interaction.followUp({
                        content: "💥 You busted. You lose.",
                        ephemeral: false
                    });
                }

                return i.update({
                    embeds: [buildEmbed(session)],
                    components: [buildButtons()]
                });
            }

            // =========================
            // STAND
            // =========================
            if (i.customId === "bj_stand") {

                let dealerTotal = calculate(session.dealerHand);

                while (dealerTotal < 17) {
                    session.dealerHand.push(drawCard());
                    dealerTotal = calculate(session.dealerHand);
                }

                const playerTotal = calculate(session.playerHand);

                let result;

                if (dealerTotal > 21 || playerTotal > dealerTotal) {
                    result = "win";
                } else if (playerTotal === dealerTotal) {
                    result = "draw";
                } else {
                    result = "lose";
                }

                const finalUser = await getUser(userId);

                if (result === "win") {
                    await addWallet(userId, session.bet * 2);
                    finalUser.stats.blackjack.won += 1;
                }

                if (result === "lose") {
                    finalUser.stats.blackjack.lost += 1;
                }

                await finalUser.save();

                session.active = false;
                sessions.delete(userId);

                collector.stop();

                await i.update({
                    embeds: [buildEmbed(session, true)],
                    components: [buildButtons(true)]
                });

                return interaction.followUp({
                    content: `🏁 You **${result.toUpperCase()}**!`,
                    ephemeral: false
                });
            }
        });

        collector.on("end", () => {
            sessions.delete(userId);
        });
    }
};