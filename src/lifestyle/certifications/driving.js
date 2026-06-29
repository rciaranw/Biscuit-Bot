const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_PROVISIONAL_LICENCE: {

        id: "CERT_PROVISIONAL_LICENCE",

        name: "Provisional Driving Licence",

        category: CERT.DRIVING,

        description: "Allows learner driving.",

        cost: 35,

        requirements: {

            certifications: [],

            qualifications: [
                "QUAL_DRIVING_THEORY"
            ],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    },

    CERT_DRIVING_LICENCE: {

        id: "CERT_DRIVING_LICENCE",

        name: "Full Driving Licence",

        category: CERT.DRIVING,

        description: "Full UK driving licence.",

        cost: 75,

        requirements: {

            certifications: [
                "CERT_PROVISIONAL_LICENCE"
            ],

            qualifications: [
                "QUAL_DRIVING_THEORY"
            ],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    },

    CERT_HGV_LICENCE: {

        id: "CERT_HGV_LICENCE",

        name: "HGV Licence",

        category: CERT.DRIVING,

        description: "Heavy Goods Vehicle licence.",

        cost: 2500,

        requirements: {

            certifications: [
                "CERT_DRIVING_LICENCE"
            ],

            qualifications: [
                "QUAL_HGV_OPERATIONS"
            ],

            minimumCreditScore: 650,

            minimumNetWorth: 2000

        },

        metadata: {}

    },

    CERT_TAXI_BADGE: {

        id: "CERT_TAXI_BADGE",

        name: "Taxi Driver Badge",

        category: CERT.DRIVING,

        description: "Licensed taxi driver permit.",

        cost: 750,

        requirements: {

            certifications: [
                "CERT_DRIVING_LICENCE",
                "CERT_BACKGROUND_CHECK"
            ],

            qualifications: [],

            minimumCreditScore: 600,

            minimumNetWorth: 1000

        },

        metadata: {}

    }

};