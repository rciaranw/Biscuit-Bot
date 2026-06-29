const QUALIFICATION_CATEGORIES = require("../../../constants/qualificationCategories");

module.exports = {

    QUAL_FOOD_HYGIENE_LEVEL_1: {

        id: "QUAL_FOOD_HYGIENE_LEVEL_1",

        name: "Food Hygiene Level 1",

        category: QUALIFICATION_CATEGORIES.HOSPITALITY,

        description: "Basic food hygiene training for entry-level food service roles.",

        study: {

            hours: 2,

            cost: 100,

            xpReward: 25

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
                "CAREER_KITCHEN_PORTER",
                "CAREER_FAST_FOOD_CREW",
                "CAREER_WAITER"
            ]

        },

        metadata: {}

    },

    QUAL_FOOD_HYGIENE_LEVEL_2: {

        id: "QUAL_FOOD_HYGIENE_LEVEL_2",

        name: "Food Hygiene Level 2",

        category: QUALIFICATION_CATEGORIES.HOSPITALITY,

        description: "Industry standard food safety qualification.",

        study: {

            hours: 4,

            cost: 300,

            xpReward: 50

        },

        requirements: {

            qualifications: [
                "QUAL_FOOD_HYGIENE_LEVEL_1"
            ],

            certifications: [],

            assets: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0,

            xp: []

        },

        rewards: {

            unlocksCareers: [
                "CAREER_CHEF",
                "CAREER_LINE_COOK"
            ]

        },

        metadata: {}

    },

    QUAL_FOOD_HYGIENE_LEVEL_3: {

        id: "QUAL_FOOD_HYGIENE_LEVEL_3",

        name: "Food Hygiene Level 3",

        category: QUALIFICATION_CATEGORIES.HOSPITALITY,

        description: "Advanced food safety and management certification.",

        study: {

            hours: 8,

            cost: 700,

            xpReward: 100

        },

        requirements: {

            qualifications: [
                "QUAL_FOOD_HYGIENE_LEVEL_2"
            ],

            certifications: [],

            assets: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0,

            xp: []

        },

        rewards: {

            unlocksCareers: [
                "CAREER_HEAD_CHEF",
                "CAREER_KITCHEN_MANAGER"
            ]

        },

        metadata: {}

    },

    QUAL_HOSPITALITY_MANAGEMENT_DIPLOMA: {

        id: "QUAL_HOSPITALITY_MANAGEMENT_DIPLOMA",

        name: "Hospitality Management Diploma",

        category: QUALIFICATION_CATEGORIES.HOSPITALITY,

        description: "Professional management qualification for hospitality businesses.",

        study: {

            hours: 40,

            cost: 2500,

            xpReward: 300

        },

        requirements: {

            qualifications: [
                "QUAL_FOOD_HYGIENE_LEVEL_3"
            ],

            certifications: [],

            assets: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0,

            xp: [
                {
                    category: "HOSPITALITY",
                    amount: 1000
                }
            ]

        },

        rewards: {

            unlocksCareers: [
                "CAREER_RESTAURANT_MANAGER",
                "CAREER_HOTEL_MANAGER"
            ]

        },

        metadata: {}

    },

    QUAL_HOSPITALITY_DEGREE: {

        id: "QUAL_HOSPITALITY_DEGREE",

        name: "Hospitality Degree",

        category: QUALIFICATION_CATEGORIES.HOSPITALITY,

        description: "University-level hospitality and tourism qualification.",

        study: {

            hours: 120,

            cost: 18000,

            xpReward: 1000

        },

        requirements: {

            qualifications: [
                "QUAL_HOSPITALITY_MANAGEMENT_DIPLOMA"
            ],

            certifications: [],

            assets: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0,

            xp: [
                {
                    category: "HOSPITALITY",
                    amount: 5000
                }
            ]

        },

        rewards: {

            unlocksCareers: [
                "CAREER_GENERAL_MANAGER",
                "CAREER_OPERATIONS_DIRECTOR"
            ]

        },

        metadata: {}

    }

};