const mongoose = require("mongoose");

const blackjackGameSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true
    },

    channelId: {
        type: String,
        required: true
    },

    messageId: {
        type: String,
        required: true
    },

    bet: {
        type: Number,
        required: true
    },

    playerHand: {
        type: [
            {
                value: Number,
                display: String
            }
        ],
        default: []
    },

    dealerHand: {
        type: [
            {
                value: Number,
                display: String
            }
        ],
    },

    finished: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("BlackjackGame", blackjackGameSchema);