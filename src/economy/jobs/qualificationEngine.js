const EconomyUser = require("../../database/models/EconomyUser");

/**
 * Add qualification to a user
 */
async function addQualification(userId, qualificationId) {

    const user = await EconomyUser.findOne({ userId });

    if (!user) return null;

    if (!user.qualifications) user.qualifications = [];

    if (!user.qualifications.includes(qualificationId)) {
        user.qualifications.push(qualificationId);
    }

    await user.save();

    return user.qualifications;
}

/**
 * Check if user has qualification
 */
function hasQualification(user, qualificationId) {
    return (user.qualifications || []).includes(qualificationId);
}

/**
 * List user qualifications
 */
function getQualifications(user) {
    return user.qualifications || [];
}

module.exports = {
    addQualification,
    hasQualification,
    getQualifications
};