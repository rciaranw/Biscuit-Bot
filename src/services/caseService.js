const Counter = require("../database/models/Counter");
const Punishment = require("../database/models/Punishment");

async function getNextCaseId() {
    const counter = await Counter.findOneAndUpdate(
        { name: "punishment_case" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    return counter.value;
}

async function createCase({ guildId, userId, type, reason, moderatorId }) {
    const caseId = await getNextCaseId();

    const newCase = await Punishment.create({
        caseId,
        guildId,
        userId,
        type,
        reason,
        moderatorId,
        createdAt: new Date()
    });

    return newCase;
}

module.exports = {
    getNextCaseId,
    createCase
};