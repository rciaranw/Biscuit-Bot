const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
}, {
    _id: false
});

const economyUserSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true
    },

    wallet: {
        type: Number,
        default: 0,
        min: 0
    },

    bank: {
        type: Number,
        default: 0,
        min: 0
    },

    inventory: {
        type: [inventoryItemSchema],
        default: []
    },

    lastWork: Date,
    lastDaily: Date,
    lastWeekly: Date,
    lastMonthly: Date,

    stats: {
        earned: { type: Number, default: 0 },
        spent: { type: Number, default: 0 },
        robbed: { type: Number, default: 0 },
        stolen: { type: Number, default: 0 },

        coinflip: {
            won: { type: Number, default: 0 },
            lost: { type: Number, default: 0 }
        },

        blackjack: {
            won: { type: Number, default: 0 },
            lost: { type: Number, default: 0 }
        },

        slots: {
            won: { type: Number, default: 0 },
            lost: { type: Number, default: 0 }
        }
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("EconomyUser", economyUserSchema);