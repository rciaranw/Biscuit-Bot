const BlackjackGame = require("../database/models/BlackjackGame");
const {
    drawCard,
    calculateHand,
    dealerPlay
} = require("../utils/blackjackUtils");

// =========================
// CREATE GAME
// =========================
async function createGame({
    userId,
    channelId,
    messageId,
    bet
}) {

    await BlackjackGame.deleteOne({ userId });

    const playerHand = [
        drawCard(),
        drawCard()
    ];

    const dealerHand = [
        drawCard(),
        drawCard()
    ];

    return BlackjackGame.create({
        userId,
        channelId,
        messageId,
        bet,
        playerHand,
        dealerHand,
        finished: false
    });
}

// =========================
// GET GAME
// =========================
async function getGame(userId) {
    return BlackjackGame.findOne({
        userId,
        finished: false
    });
}

// =========================
// HIT
// =========================
async function hit(game) {

    const card = drawCard();
    game.playerHand.push(card);

    await game.save();

    return calculateHand(game.playerHand);
}

// =========================
// STAND
// =========================
async function stand(game) {

    dealerPlay(game.dealerHand, drawCard);

    const player = calculateHand(game.playerHand);
    const dealer = calculateHand(game.dealerHand);

    let result = "draw";

    if (player > 21) {
        result = "lose";
    } else if (dealer > 21) {
        result = "win";
    } else if (player > dealer) {
        result = "win";
    } else if (dealer > player) {
        result = "lose";
    }

    game.finished = true;
    await game.save();

    return {
        result,
        player,
        dealer
    };
}

module.exports = {
    createGame,
    getGame,
    hit,
    stand,
    calculateHand
};