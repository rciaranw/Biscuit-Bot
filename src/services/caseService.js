const Counter = require("../database/models/Counter");
const Punishment = require("../database/models/Punishment");

/**
 * Get next sequential case ID
 */
async function getNextCaseId() {
    const counter = await Counter.findOneAndUpdate(
        { name: "punishment_case" },
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
 * Create a moderation case (single source of truth)
 */
async function createCase({
    userId,
    moderatorId,
    type,
    reason = "No reason provided",
    duration = null,
    expiresAt = null,
    guildId = null,
    active = true
}) {
    const caseId = await getNextCaseId();

    return Punishment.create({
        caseId,
        userId,
        moderatorId,
        type,
        reason,
        duration,
        expiresAt,
        guildId,
        active,
        createdAt: new Date()
    });
}

/**
 * Close a case (mark inactive)
 */
async function closeCase(caseId) {
    return Punishment.findOneAndUpdate(
        { caseId },
        { active: false },
        { new: true }
    );
}

/**
 * Get single case
 */
async function getCase(caseId) {
    return Punishment.findOne({ caseId });
}

/**
 * Get user history
 */
async function getUserCases(userId, limit = 10) {
    return Punishment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
}

/**
 * Get all active punishments (used by expiry service)
 */
async function getActivePunishments(type = null) {
    const query = { active: true };
    if (type) query.type = type;

    return Punishment.find(query);
}

module.exports = {
    getNextCaseId,
    createCase,
    closeCase,
    getCase,
    getUserCases,
    getActivePunishments
};