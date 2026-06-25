const mongoose = require("mongoose");

const applicationSettingsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },

    staffApplicationsOpen: {
        type: Boolean,
        default: true
    },

    helperApplicationsOpen: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model(
    "ApplicationSettings",
    applicationSettingsSchema
);