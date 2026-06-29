const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_FIRE_SAFETY: {

        id: "CERT_FIRE_SAFETY",

        name: "Fire Safety Certificate",

        category: CERT.SAFETY,

        description: "Basic workplace fire safety.",

        cost: 125,

        requirements: {

            certifications: [],

            qualifications: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    },

    CERT_MANUAL_HANDLING: {

        id: "CERT_MANUAL_HANDLING",

        name: "Manual Handling",

        category: CERT.SAFETY,

        description: "Safe lifting and manual handling.",

        cost: 100,

        requirements: {

            certifications: [],

            qualifications: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    },

    CERT_FIRST_AID: {

        id: "CERT_FIRST_AID",

        name: "Certified First Aider",

        category: CERT.SAFETY,

        description: "Approved workplace first aider.",

        cost: 250,

        requirements: {

            certifications: [],

            qualifications: [
                "QUAL_FIRST_AID_LEVEL_1"
            ],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    },

    CERT_FOOD_ALLERGEN_AWARENESS: {

        id: "CERT_FOOD_ALLERGEN_AWARENESS",

        name: "Food Allergen Awareness",

        category: CERT.SAFETY,

        description: "Food allergen legislation training.",

        cost: 120,

        requirements: {

            certifications: [],

            qualifications: [
                "QUAL_FOOD_HYGIENE_LEVEL_1"
            ],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    }

};