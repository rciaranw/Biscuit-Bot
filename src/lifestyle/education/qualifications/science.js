const QUAL = require("../../../constants/qualificationCategories");

module.exports = {

    QUAL_SCIENCE_FOUNDATION: {
        id: "QUAL_SCIENCE_FOUNDATION",
        name: "Science Foundation",
        category: QUAL.SCIENCE,
        description: "General scientific principles.",
        study: { hours: 8, cost: 500, xpReward: 80 },
        requirements: {
            qualifications: [],
            certifications: [],
            assets: [],
            minimumCreditScore: 0,
            minimumNetWorth: 0,
            xp: []
        },
        rewards: {
            unlocksCareers: []
        },
        metadata: {}
    },

    QUAL_LAB_TECHNICIAN_DIPLOMA: {
        id: "QUAL_LAB_TECHNICIAN_DIPLOMA",
        name: "Laboratory Technician Diploma",
        category: QUAL.SCIENCE,
        description: "Laboratory procedures and scientific testing.",
        study: { hours: 50, cost: 4000, xpReward: 700 },
        requirements: {
            qualifications: ["QUAL_SCIENCE_FOUNDATION"],
            certifications: [],
            assets: [],
            minimumCreditScore: 650,
            minimumNetWorth: 1000,
            xp: [
                {
                    category: "SCIENCE",
                    amount: 3000
                }
            ]
        },
        rewards: {
            unlocksCareers: [
                "CAREER_LAB_TECHNICIAN"
            ]
        },
        metadata: {}
    },

    QUAL_RESEARCH_SCIENCE_DEGREE: {
        id: "QUAL_RESEARCH_SCIENCE_DEGREE",
        name: "Research Science Degree",
        category: QUAL.SCIENCE,
        description: "Advanced scientific research qualification.",
        study: { hours: 180, cost: 22000, xpReward: 2200 },
        requirements: {
            qualifications: ["QUAL_LAB_TECHNICIAN_DIPLOMA"],
            certifications: [],
            assets: [],
            minimumCreditScore: 700,
            minimumNetWorth: 10000,
            xp: [
                {
                    category: "SCIENCE",
                    amount: 10000
                }
            ]
        },
        rewards: {
            unlocksCareers: [
                "CAREER_RESEARCH_SCIENTIST"
            ]
        },
        metadata: {}
    }

};