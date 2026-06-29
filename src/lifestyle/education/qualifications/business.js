const QUAL = require("../../../constants/qualificationCategories");

module.exports = {

    QUAL_BUSINESS_FOUNDATION: {
        id: "QUAL_BUSINESS_FOUNDATION",
        name: "Business Foundation",
        category: QUAL.BUSINESS,
        description: "Introduction to business operations and management.",
        study: { hours: 6, cost: 300, xpReward: 60 },
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

    QUAL_BUSINESS_MANAGEMENT_DIPLOMA: {
        id: "QUAL_BUSINESS_MANAGEMENT_DIPLOMA",
        name: "Business Management Diploma",
        category: QUAL.BUSINESS,
        description: "Management, leadership and commercial operations.",
        study: { hours: 45, cost: 3500, xpReward: 600 },
        requirements: {
            qualifications: ["QUAL_BUSINESS_FOUNDATION"],
            certifications: [],
            assets: [],
            minimumCreditScore: 600,
            minimumNetWorth: 2500,
            xp: [
                {
                    category: "BUSINESS",
                    amount: 3000
                }
            ]
        },
        rewards: {
            unlocksCareers: [
                "CAREER_ASSISTANT_MANAGER",
                "CAREER_BUSINESS_MANAGER"
            ]
        },
        metadata: {}
    },

    QUAL_MASTER_OF_BUSINESS_ADMINISTRATION: {
        id: "QUAL_MASTER_OF_BUSINESS_ADMINISTRATION",
        name: "Master of Business Administration (MBA)",
        category: QUAL.BUSINESS,
        description: "Elite postgraduate business qualification.",
        study: { hours: 200, cost: 30000, xpReward: 3000 },
        requirements: {
            qualifications: ["QUAL_BUSINESS_MANAGEMENT_DIPLOMA"],
            certifications: [],
            assets: [],
            minimumCreditScore: 750,
            minimumNetWorth: 25000,
            xp: [
                {
                    category: "BUSINESS",
                    amount: 15000
                }
            ]
        },
        rewards: {
            unlocksCareers: [
                "CAREER_COMPANY_DIRECTOR",
                "CAREER_CHIEF_EXECUTIVE"
            ]
        },
        metadata: {}
    }

};