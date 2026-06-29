const QUAL = require("../../../constants/qualificationCategories");

module.exports = {

    QUAL_CONSTRUCTION_INTRO: {
        id: "QUAL_CONSTRUCTION_INTRO",
        name: "Construction Introduction",
        category: QUAL.CONSTRUCTION,
        description: "Basic site safety and construction awareness.",
        study: { hours: 4, cost: 200, xpReward: 40 },
        requirements: { qualifications: [], certifications: [], assets: [], minimumCreditScore: 0, minimumNetWorth: 0, xp: [] },
        rewards: { unlocksCareers: ["CAREER_LABOURER"] },
        metadata: {}
    },

    QUAL_CITB_SAFETY_TRAINING: {
        id: "QUAL_CITB_SAFETY_TRAINING",
        name: "CITB Safety Training",
        category: QUAL.CONSTRUCTION,
        description: "Mandatory safety certification for construction sites.",
        study: { hours: 10, cost: 500, xpReward: 100 },
        requirements: {
            qualifications: ["QUAL_CONSTRUCTION_INTRO"],
            certifications: [],
            assets: [],
            minimumCreditScore: 0,
            minimumNetWorth: 0,
            xp: []
        },
        rewards: { unlocksCareers: ["CAREER_SITE_WORKER", "CAREER_TRAINED_LABOURER"] },
        metadata: {}
    },

    QUAL_CONSTRUCTION_SUPERVISION_DIPLOMA: {
        id: "QUAL_CONSTRUCTION_SUPERVISION_DIPLOMA",
        name: "Construction Supervision Diploma",
        category: QUAL.CONSTRUCTION,
        description: "Training for site supervisor roles.",
        study: { hours: 40, cost: 2500, xpReward: 400 },
        requirements: {
            qualifications: ["QUAL_CITB_SAFETY_TRAINING"],
            certifications: [],
            assets: [],
            minimumCreditScore: 600,
            minimumNetWorth: 1000,
            xp: [{ category: "CONSTRUCTION", amount: 2000 }]
        },
        rewards: { unlocksCareers: ["CAREER_SITE_SUPERVISOR"] },
        metadata: {}
    }

};