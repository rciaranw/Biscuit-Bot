const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_CLASS2_MEDICAL: {

        id: "CERT_CLASS2_MEDICAL",

        name: "CAA Class 2 Medical",

        category: CERT.AVIATION,

        description: "Private pilot medical certificate.",

        cost: 500,

        requirements: {

            certifications: [],

            qualifications: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    },

    CERT_CLASS1_MEDICAL: {

        id: "CERT_CLASS1_MEDICAL",

        name: "CAA Class 1 Medical",

        category: CERT.AVIATION,

        description: "Commercial pilot medical certificate.",

        cost: 1200,

        requirements: {

            certifications: [
                "CERT_CLASS2_MEDICAL"
            ],

            qualifications: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    },

    CERT_ATPL_THEORY_PASS: {

        id: "CERT_ATPL_THEORY_PASS",

        name: "ATPL Theory Pass",

        category: CERT.AVIATION,

        description: "Airline Transport Pilot theoretical examinations.",

        cost: 8000,

        requirements: {

            certifications: [
                "CERT_CLASS1_MEDICAL"
            ],

            qualifications: [
                "QUAL_COMMERCIAL_PILOT_LICENCE"
            ],

            minimumCreditScore: 750,

            minimumNetWorth: 30000

        },

        metadata: {}

    }

};