function drawCard() {

    const values = [
        2, 3, 4, 5, 6, 7, 8, 9,
        10, 10, 10, 10,
        11
    ];

    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = {
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "A"
    };

    const value = values[Math.floor(Math.random() * values.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];

    return {
        value,
        display: `${ranks[value]}${suit}`
    };
}

function calculateHand(hand) {

    let total = 0;
    let aces = 0;

    for (const card of hand) {
        total += card.value;
        if (card.value === 11) aces++;
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

function dealerPlay(hand, drawFn) {

    while (calculateHand(hand) < 17) {
        hand.push(drawFn());
    }

    return hand;
}

module.exports = {
    drawCard,
    calculateHand,
    dealerPlay
};