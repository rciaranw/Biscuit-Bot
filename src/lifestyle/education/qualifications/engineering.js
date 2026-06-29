const QUAL = require("../../../constants/qualificationCategories");

module.exports = {

    QUAL_ENGINEERING_FUNDAMENTALS: {
        id: "QUAL_ENGINEERING_FUNDAMENTALS",
        name: "Engineering Fundamentals",
        category: QUAL.ENGINEERING,
        description: "Basic mechanical and electrical engineering principles.",
        study: { hours: 6, cost: 300, xpReward: 60 },
        requirements: { qualifications: [], certifications: [], assets: [], minimumCreditScore: 0, minimumNetWorth: 0, xp: [] },
        rewards: { unlocksCareers: ["CAREER_ENGINEERING_ASSISTANT"] },
        metadata: {}
    },

    QUAL_MECHANICAL_ENGINEERING_DIPLOMA: {
        id: "QUAL_MECHANICAL_ENGINEERING_DIPLOMA",
        name: "Mechanical Engineering Diploma",
        category: QUAL.ENGINEERING,
        description: "Core mechanical systems and design principles.",
        study: { hours: 60, cost: 4000, xpReward: 600 },
        requirements: {
            qualifications: ["QUAL_ENGINEERING_FUNDAMENTALS"],
            certifications: [],
            assets: [],
            minimumCreditScore: 650,
            minimumNetWorth: 2000,
            xp: []
        },
        rewards: { unlocksCareers: ["CAREER_MECHANICAL_ENGINEER"] },
        metadata: {}
    },

    QUAL_CIVIL_ENGINEERING_DEGREE: {
        id: "QUAL_CIVIL_ENGINEERING_DEGREE",
        name: "Civil Engineering Degree",
        category: QUAL.ENGINEERING,
        description: "Advanced civil infrastructure and structural engineering.",
        study: { hours: 180, cost: 20000, xpReward: 2000 },
        requirements: {
            qualifications: ["QUAL_MECHANICAL_ENGINEERING_DIPLOMA"],
            certifications: [],
            assets: [],
            minimumCreditScore: 700,
            minimumNetWorth: 10000,
            xp: [{ category: "ENGINEERING", amount: 8000 }]
        },
        rewards: { unlocksCareers: ["CAREER_CIVIL_ENGINEER"] },
        metadata: {}
    }

};