const mongoose = require("mongoose");

const applicationBlacklistSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },

    reason: {
        type: String,
        required: true
    },

    addedBy: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(
    "ApplicationBlacklist",
    applicationBlacklistSchema
);