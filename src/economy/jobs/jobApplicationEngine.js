const EconomyUser = require("../../database/models/EconomyUser");
const { getJob } = require("./jobRegistry");

/**
 * Check if user meets job requirements
 */
function canApply(user, job) {

    const req = job.requirements;

    // credit score check
    if ((user.creditScore || 0) < req.creditScore) {
        return {
            ok: false,
            reason: `Credit score too low (${user.creditScore}/${req.creditScore})`
        };
    }

    // qualification check
    const missingQuals = (req.qualifications || [])
        .filter(q => !user.qualifications?.includes(q));

    if (missingQuals.length > 0) {
        return {
            ok: false,
            reason: `Missing qualifications: ${missingQuals.join(", ")}`
        };
    }

    // asset check (future shop system hook)
    const missingAssets = (req.assets || [])
        .filter(a => !user.assets?.includes(a));

    if (missingAssets.length > 0) {
        return {
            ok: false,
            reason: `Missing assets: ${missingAssets.join(", ")}`
        };
    }

    return { ok: true };
}

/**
 * Apply AND auto-accept job if eligible
 */
async function applyForJob(userId, jobId) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) {
        return { ok: false, reason: "User not found" };
    }

    const job = getJob(jobId);

    if (!job) {
        return { ok: false, reason: "Job does not exist" };
    }

    if (!user.applications) user.applications = [];

    // prevent duplicate applications
    const existing = user.applications.find(
        a => a.jobId === jobId && a.status === "active"
    );

    if (existing) {
        return {
            ok: false,
            reason: "You already hold this job"
        };
    }

    const check = canApply(user, job);

    if (!check.ok) {
        return check;
    }

    // auto accept instantly
    user.job = {
        title: job.id,
        workStreak: 0,
        lastWorkedAt: null,
        level: 0
    };

    user.applications.push({
        jobId,
        status: "active",
        appliedAt: Date.now(),
        acceptedAt: Date.now()
    });

    await user.save();

    return {
        ok: true,
        job: job.name
    };
}

/**
 * Change job manually (future admin use)
 */
async function forceJob(userId, jobId) {

    const user = await EconomyUser.findOne({ userId });
    const job = getJob(jobId);

    if (!user || !job) {
        return { ok: false, reason: "Invalid user or job" };
    }

    user.job = {
        title: job.id,
        workStreak: 0,
        lastWorkedAt: null,
        level: 0
    };

    await user.save();

    return { ok: true, job: job.name };
}

module.exports = {
    applyForJob,
    forceJob,
    canApply
};