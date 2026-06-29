const QUAL = require("../../../constants/qualificationCategories");

module.exports = {

    QUAL_FINANCE_INTRODUCTION: {
        id: "QUAL_FINANCE_INTRODUCTION",
        name: "Introduction to Finance",
        category: QUAL.FINANCE,
        description: "Basic financial systems and money management.",
        study: { hours: 4, cost: 200, xpReward: 40 },
        requirements: { qualifications: [], certifications: [], assets: [], minimumCreditScore: 0, minimumNetWorth: 0, xp: [] },
        rewards: { unlocksCareers: ["CAREER_BANK_CLERK"] },
        metadata: {}
    },

    QUAL_ACCOUNTING_DIPLOMA: {
        id: "QUAL_ACCOUNTING_DIPLOMA",
        name: "Accounting Diploma",
        category: QUAL.FINANCE,
        description: "Core accounting and bookkeeping qualification.",
        study: { hours: 30, cost: 2000, xpReward: 300 },
        requirements: {
            qualifications: ["QUAL_FINANCE_INTRODUCTION"],
            certifications: [],
            assets: [],
            minimumCreditScore: 600,
            minimumNetWorth: 0,
            xp: []
        },
        rewards: { unlocksCareers: ["CAREER_ACCOUNTANT"] },
        metadata: {}
    },

    QUAL_INVESTMENT_ANALYST: {
        id: "QUAL_INVESTMENT_ANALYST",
        name: "Investment Analyst Certification",
        category: QUAL.FINANCE,
        description: "Advanced investment and market analysis.",
        study: { hours: 60, cost: 5000, xpReward: 800 },
        requirements: {
            qualifications: ["QUAL_ACCOUNTING_DIPLOMA"],
            certifications: [],
            assets: [],
            minimumCreditScore: 700,
            minimumNetWorth: 10000,
            xp: [{ category: "FINANCE", amount: 5000 }]
        },
        rewards: { unlocksCareers: ["CAREER_INVESTMENT_ANALYST"] },
        metadata: {}
    }

};