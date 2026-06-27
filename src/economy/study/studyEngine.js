const EconomyUser = require("../../database/models/EconomyUser");

/**
 * Qualification definitions aligned with jobRegistry requirements
 */
const qualifications = {

    // =========================
    // DRIVING / TRANSPORT
    // =========================
    driving_basic: {
        name: "Basic Driving License",
        description: "Allows access to delivery and transport jobs."
    },

    aviation_license: {
        name: "Commercial Aviation License",
        description: "Required for pilot roles."
    },

    // =========================
    // TRADE QUALIFICATIONS
    // =========================
    trade_electric: {
        name: "Electrical Certification",
        description: "Qualified electrician training."
    },

    trade_plumbing: {
        name: "Plumbing Certification",
        description: "Qualified plumber training."
    },

    trade_mechanics: {
        name: "Mechanical Engineering Certification",
        description: "Vehicle repair qualification."
    },

    // =========================
    // LAW / PUBLIC SERVICE
    // =========================
    law_basic: {
        name: "Law Enforcement Basics",
        description: "Required for police roles."
    },

    law_degree: {
        name: "Law Degree",
        description: "Required for lawyer positions."
    },

    emergency_response: {
        name: "Emergency Response Training",
        description: "Required for firefighter roles."
    },

    // =========================
    // MEDICAL PATH
    // =========================
    med_basic: {
        name: "Basic Medical Training",
        description: "Entry requirement for medical careers."
    },

    med_surgery: {
        name: "Surgical Qualification",
        description: "Required for surgeon roles."
    },

    // =========================
    // TECH / ENGINEERING
    // =========================
    tech_engineering: {
        name: "Engineering Degree",
        description: "Required for engineering roles."
    },

    // =========================
    // FINANCE / BUSINESS
    // =========================
    finance_degree: {
        name: "Finance Degree",
        description: "Required for investment banking."
    },

    business_mastery: {
        name: "Business Mastery Certification",
        description: "Required for executive / CEO roles."
    }
};

/**
 * STUDY FUNCTION
 * Adds qualification to user if not already owned
 */
async function study(user, qualificationId) {

    if (!qualifications[qualificationId]) {
        return {
            ok: false,
            reason: "Invalid qualification"
        };
    }

    if (!user.qualifications) {
        user.qualifications = [];
    }

    if (user.qualifications.includes(qualificationId)) {
        return {
            ok: false,
            reason: "You already have this qualification"
        };
    }

    user.qualifications.push(qualificationId);

    await user.save();

    return {
        ok: true,
        name: qualifications[qualificationId].name
    };
}

/**
 * Get all qualifications
 */
function getAllQualifications() {
    return qualifications;
}

/**
 * Check if user has qualification
 */
function hasQualification(user, qualificationId) {
    return (user.qualifications || []).includes(qualificationId);
}

module.exports = {
    study,
    qualifications,
    getAllQualifications,
    hasQualification
};