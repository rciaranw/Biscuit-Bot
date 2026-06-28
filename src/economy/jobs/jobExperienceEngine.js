const { jobRegistry, getJob } = require("./jobRegistry");

/**
 * XP required per level (scales per job tier later)
 */
function xpForNextLevel(level) {
    return 100 + (level * 75);
}

/**
 * Add work XP to a user job
 */
function addJobXP(user, amount = 25) {

    if (!user.job || user.job.title === "unemployed") return null;

    if (!user.job.experience) user.job.experience = 0;
    if (!user.job.level) user.job.level = 1;

    user.job.experience += amount;

    const required = xpForNextLevel(user.job.level);

    let promoted = false;

    while (user.job.experience >= required) {

        user.job.experience -= required;
        user.job.level += 1;

        promoted = true;
    }

    return {
        promoted,
        newLevel: user.job.level
    };
}

/**
 * Salary multiplier based on level
 */
function getSalaryMultiplier(user) {

    if (!user.job) return 1;

    const level = user.job.level || 1;

    // smooth scaling (not exponential madness)
    return 1 + (level * 0.12);
}

/**
 * Performance modifier (future use)
 */
function getPerformanceMultiplier(user) {

    const perf = user.job?.performance || 0;

    if (perf <= 0) return 1;

    return 1 + (perf * 0.03);
}

/**
 * Total salary multiplier
 */
function getTotalMultiplier(user) {
    return getSalaryMultiplier(user) * getPerformanceMultiplier(user);
}

/**
 * Apply promotion effects
 */
function handlePromotion(user) {

    const job = getJob(user.job.title);

    if (!job) return null;

    const level = user.job.level || 1;

    const promotionEvery = 3; // temporary rule (we can refine later)

    if (level % promotionEvery !== 0) {
        return {
            promoted: false
        };
    }

    user.job.salaryMultiplier = getTotalMultiplier(user);

    return {
        promoted: true,
        level
    };
}

module.exports = {
    addJobXP,
    getSalaryMultiplier,
    getPerformanceMultiplier,
    getTotalMultiplier,
    handlePromotion,
    xpForNextLevel
};