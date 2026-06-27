const EconomyUser = require("../../database/models/EconomyUser");
const { getJob } = require("./jobRegistry");

/**
 * Assign a job to a user
 */
async function assignJob(userId, jobId) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) throw new Error("User not found");

    const job = getJob(jobId);

    user.job = {
        title: job.id,
        workStreak: 0,
        lastWorkedAt: null,
        level: 0
    };

    await user.save();

    return user.job;
}

/**
 * Promote user in job
 */
async function promoteUser(userId) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) throw new Error("User not found");

    user.job.level = (user.job.level || 0) + 1;

    await user.save();

    return user.job.level;
}

module.exports = {
    assignJob,
    promoteUser
};