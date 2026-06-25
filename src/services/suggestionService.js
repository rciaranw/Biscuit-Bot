const Suggestion = require("../database/models/Suggestion");
const Counter = require("../database/models/Counter");

/**
 * Get next sequential suggestion ID
 */
async function getNextSuggestionId() {
    const counter = await Counter.findOneAndUpdate(
        { name: "suggestion" },
        { $inc: { value: 1 } },
        {
            new: true,
            upsert: true,
            returnDocument: "after"
        }
    );

    return counter.value;
}

/**
 * Create a new suggestion
 */
async function createSuggestion({ guildId, userId, suggestion }) {
    const suggestionId = await getNextSuggestionId();

    return Suggestion.create({
        suggestionId,
        guildId,
        userId,
        suggestion,
        status: "Pending",
        createdAt: new Date()
    });
}

/**
 * Get a suggestion by ID
 */
async function getSuggestion(suggestionId) {
    return Suggestion.findOne({ suggestionId });
}

/**
 * Update suggestion status
 */
async function updateSuggestionStatus(suggestionId, status, reviewedBy, reviewReason = null) {
    return Suggestion.findOneAndUpdate(
        { suggestionId },
        {
            status,
            reviewedBy,
            reviewReason,
            updatedAt: new Date()
        },
        { new: true }
    );
}

/**
 * Store message/channel after posting embed
 */
async function setSuggestionMessage(suggestionId, messageId, channelId) {
    return Suggestion.findOneAndUpdate(
        { suggestionId },
        { messageId, channelId, updatedAt: new Date() },
        { new: true }
    );
}

/**
 * Get latest suggestions (optional for future list command)
 */
async function getLatestSuggestions(limit = 10) {
    return Suggestion.find()
        .sort({ createdAt: -1 })
        .limit(limit);
}

module.exports = {
    getNextSuggestionId,
    createSuggestion,
    getSuggestion,
    updateSuggestionStatus,
    setSuggestionMessage,
    getLatestSuggestions
};