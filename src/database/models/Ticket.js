const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: Number,
        required: true,
        unique: true
    },

    guildId: {
        type: String,
        required: true
    },

    channelId: {
        type: String,
        default: null
    },

    userId: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["report", "support", "role"],
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Open"
    },

    referred: {
        type: Boolean,
        default: false
    },

    openedAt: {
        type: Date,
        default: Date.now
    },

    closedAt: {
        type: Date,
        default: null
    },

    closedBy: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model("Ticket", ticketSchema);