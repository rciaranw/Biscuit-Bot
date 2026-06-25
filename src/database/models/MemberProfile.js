const mongoose = require("mongoose");

const memberProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
    promoted: { type: Boolean, default: false }
});

module.exports = mongoose.model("MemberProfile", memberProfileSchema);