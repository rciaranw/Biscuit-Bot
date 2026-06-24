const mongoose = require("mongoose");

const punishmentSchema = new mongoose.Schema({
    caseId: {
        type: Number,
        required: true,
        unique: true
    },

    userId: {
        type: String,
        required: true
    },

    moderatorId: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    reason: {
        type: String,
        default: "No reason provided"
    },

    active: {
        type: Boolean,
        default: true
    },

    duration: String,

    expiresAt: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Punishment", punishmentSchema);