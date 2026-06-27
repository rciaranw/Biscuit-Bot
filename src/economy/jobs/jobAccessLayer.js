const EconomyUser = require("../../database/models/EconomyUser");

// IMPORTANT: this assumes your existing jobEngine already exists
const {
    jobTemplates,
    canTakeJob,
    assignJob
} = require("./jobEngine");

/**
 * Get available jobs for user (safe wrapper)
 */
async function getAvailableJobs(userId) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) return [];

    return jobTemplates.filter(job => canTakeJob(user, job));
}

/**
 * Apply for a job (auto-accept system)
 */
async function applyForJob(userId, jobId) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) return { ok: false };

    const job = jobTemplates.find(j => j.id === jobId);

    if (!job) return { ok: false, reason: "Job not found" };

    if (!canTakeJob(user, job)) {
        return {
            ok: false,
            reason: "Requirements not met"
        };
    }

    return await assignJob(userId, jobId);
}

module.exports = {
    getAvailableJobs,
    applyForJob
};