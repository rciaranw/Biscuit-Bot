const QUAL = require("../../../constants/qualificationCategories");

module.exports = {

    QUAL_FLIGHT_THEORY_BASICS: {
        id: "QUAL_FLIGHT_THEORY_BASICS",
        name: "Flight Theory Basics",
        category: QUAL.AVIATION,
        description: "Introduction to aviation principles and flight mechanics.",
        study: { hours: 8, cost: 500, xpReward: 80 },
        requirements: { qualifications: [], certifications: [], assets: [], minimumCreditScore: 0, minimumNetWorth: 0, xp: [] },
        rewards: { unlocksCareers: ["CAREER_FLIGHT_STUDENT"] },
        metadata: {}
    },

    QUAL_PRIVATE_PILOT_LICENCE: {
        id: "QUAL_PRIVATE_PILOT_LICENCE",
        name: "Private Pilot Licence (PPL)",
        category: QUAL.AVIATION,
        description: "Basic qualification to operate small aircraft.",
        study: { hours: 80, cost: 15000, xpReward: 1200 },
        requirements: {
            qualifications: ["QUAL_FLIGHT_THEORY_BASICS"],
            certifications: ["CERT_BACKGROUND_CHECK"],
            assets: [],
            minimumCreditScore: 700,
            minimumNetWorth: 15000,
            xp: []
        },
        rewards: { unlocksCareers: ["CAREER_PRIVATE_PILOT"] },
        metadata: {}
    },

    QUAL_COMMERCIAL_PILOT_LICENCE: {
        id: "QUAL_COMMERCIAL_PILOT_LICENCE",
        name: "Commercial Pilot Licence (CPL)",
        category: QUAL.AVIATION,
        description: "Professional airline pilot qualification.",
        study: { hours: 200, cost: 60000, xpReward: 5000 },
        requirements: {
            qualifications: ["QUAL_PRIVATE_PILOT_LICENCE"],
            certifications: ["CERT_SECURITY_CLEARANCE"],
            assets: [],
            minimumCreditScore: 750,
            minimumNetWorth: 50000,
            xp: [{ category: "AVIATION", amount: 20000 }]
        },
        rewards: { unlocksCareers: ["CAREER_AIRLINE_PILOT"] },
        metadata: {}
    }

};