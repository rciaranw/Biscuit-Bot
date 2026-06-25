const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    guildId: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["staff", "helper"],
        required: true
    },

    answers: {
        type: Object,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "denied"],
        default: "pending"
    },

    reviewedBy: {
        type: String,
        default: null
    },

    reviewReason: {
        type: String,
        default: null
    },

    reviewedAt: {
        type: Date,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Application", applicationSchema);