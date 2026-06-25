const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
    suggestionId: {
        type: Number,
        required: true,
        unique: true
    },

    guildId: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true
    },

    suggestion: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    },

    messageId: {
        type: String,
        default: null
    },

    channelId: {
        type: String,
        default: null
    },

    reviewedBy: {
        type: String,
        default: null
    },

    reviewReason: {
        type: String,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model("Suggestion", suggestionSchema);