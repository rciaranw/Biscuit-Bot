const { getJob } = require("./jobRegistry");

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Check if user qualifies for a job
 */
function qualifiesForJob(user, jobId) {

    const job = getJob(jobId);
    const req = job.requirements;

    // credit score check
    if ((user.creditScore || 0) < req.creditScore) {
        return {
            ok: false,
            reason: "Credit score too low"
        };
    }

    // asset check
    for (const asset of req.assets) {
        if (!user.inventory?.includes(asset)) {
            return {
                ok: false,
                reason: `Missing asset: ${asset}`
            };
        }
    }

    // qualification check
    for (const q of req.qualifications) {
        if (!user.qualifications?.includes(q)) {
            return {
                ok: false,
                reason: `Missing qualification: ${q}`
            };
        }
    }

    return { ok: true };
}

/**
 * Calculate work payout
 */
function calculateJobPay(user) {

    const job = getJob(user.job?.title || "unemployed");

    let base = randomBetween(job.basePay[0], job.basePay[1]);

    // streak bonus
    if (user.job?.workStreak >= 7) {
        base *= 1.15;
    }

    // promotion multiplier
    if (user.job?.level) {
        base *= 1 + (user.job.level * 0.10);
    }

    return Math.floor(base);
}

/**
 * Tax calculation (sent to Bank of Biscuit)
 */
function calculateTax(amount, job) {
    return Math.floor(amount * (job.taxRate || 0.05));
}

module.exports = {
    qualifiesForJob,
    calculateJobPay,
    calculateTax
};