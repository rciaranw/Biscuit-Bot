const QUALIFICATION_CATEGORIES = require("../../../constants/qualificationCategories");
const XP_CATEGORIES = require("../../../constants/xpCategories");

module.exports = {

    QUAL_FIRST_AID_LEVEL_1: {

        id: "QUAL_FIRST_AID_LEVEL_1",

        name: "First Aid Level 1",

        category: QUALIFICATION_CATEGORIES.HEALTHCARE,

        xpCategory: XP_CATEGORIES.HEALTHCARE,

        description: "Basic emergency first aid training for low-risk environments.",

        study: {

            hours: 3,

            cost: 150,

            xpReward: 30

        },

        requirements: {

            qualifications: [],

            certifications: [],

            assets: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0,

            xp: []

        },

        rewards: {

            unlocksCareers: [
                "CAREER_CARE_ASSISTANT",
                "CAREER_SUPPORT_WORKER"
            ]

        },

        metadata: {}

    },

    QUAL_HEALTH_AND_SOCIAL_CARE_DIPLOMA: {

        id: "QUAL_HEALTH_AND_SOCIAL_CARE_DIPLOMA",

        name: "Health and Social Care Diploma",

        category: QUALIFICATION_CATEGORIES.HEALTHCARE,

        xpCategory: XP_CATEGORIES.HEALTHCARE,

        description: "Intermediate qualification for healthcare support roles.",

        study: {

            hours: 25,

            cost: 1200,

            xpReward: 200

        },

        requirements: {

            qualifications: [
                "QUAL_FIRST_AID_LEVEL_1"
            ],

            certifications: [],

            assets: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0,

            xp: [
                {
                    category: XP_CATEGORIES.HEALTHCARE,
                    amount: 500
                }
            ]

        },

        rewards: {

            unlocksCareers: [
                "CAREER_HEALTHCARE_ASSISTANT",
                "CAREER_CARE_WORKER"
            ]

        },

        metadata: {}

    },

    QUAL_NURSING_FOUNDATION_CERTIFICATE: {

        id: "QUAL_NURSING_FOUNDATION_CERTIFICATE",

        name: "Nursing Foundation Certificate",

        category: QUALIFICATION_CATEGORIES.HEALTHCARE,

        xpCategory: XP_CATEGORIES.HEALTHCARE,

        description: "Entry-level nursing qualification for clinical support roles.",

        study: {

            hours: 60,

            cost: 3500,

            xpReward: 500

        },

        requirements: {

            qualifications: [
                "QUAL_HEALTH_AND_SOCIAL_CARE_DIPLOMA"
            ],

            certifications: [],

            assets: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0,

            xp: [
                {
                    category: XP_CATEGORIES.HEALTHCARE,
                    amount: 2000
                }
            ]

        },

        rewards: {

            unlocksCareers: [
                "CAREER_NURSING_ASSISTANT",
                "CAREER_HOSPITAL_SUPPORT_STAFF"
            ]

        },

        metadata: {}

    },

    QUAL_REGISTERED_NURSE_DEGREE: {

        id: "QUAL_REGISTERED_NURSE_DEGREE",

        name: "Registered Nurse Degree",

        category: QUALIFICATION_CATEGORIES.HEALTHCARE,

        xpCategory: XP_CATEGORIES.HEALTHCARE,

        description: "Full professional nursing qualification.",

        study: {

            hours: 200,

            cost: 25000,

            xpReward: 2000

        },

        requirements: {

            qualifications: [
                "QUAL_NURSING_FOUNDATION_CERTIFICATE"
            ],

            certifications: [
                "CERT_BACKGROUND_CHECK"
            ],

            assets: [],

            minimumCreditScore: 650,

            minimumNetWorth: 1000,

            xp: [
                {
                    category: XP_CATEGORIES.HEALTHCARE,
                    amount: 8000
                }
            ]

        },

        rewards: {

            unlocksCareers: [
                "CAREER_REGISTERED_NURSE",
                "CAREER_CLINICAL_STAFF_NURSE"
            ]

        },

        metadata: {}

    }

};