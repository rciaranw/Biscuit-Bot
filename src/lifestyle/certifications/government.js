const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_BACKGROUND_CHECK: {

        id: "CERT_BACKGROUND_CHECK",

        name: "Background Check",

        category: CERT.GOVERNMENT,

        description: "Standard criminal background check.",

        cost: 100,

        requirements: {

            certifications: [],

            qualifications: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0,

            maxConvictions: 5,

            allowActiveCases: true

        },

        metadata: {}

    },

    CERT_BASIC_DBS: {

        id: "CERT_BASIC_DBS",

        name: "Basic DBS Check",

        category: CERT.GOVERNMENT,

        description: "Basic criminal record certificate.",

        cost: 150,

        requirements: {

            certifications: [
                "CERT_BACKGROUND_CHECK"
            ],

            qualifications: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0,

            maxConvictions: 2,

            allowActiveCases: false

        },

        metadata: {}

    },

    CERT_ENHANCED_DBS: {

        id: "CERT_ENHANCED_DBS",

        name: "Enhanced DBS Check",

        category: CERT.GOVERNMENT,

        description: "Enhanced criminal record disclosure.",

        cost: 300,

        requirements: {

            certifications: [
                "CERT_BASIC_DBS"
            ],

            qualifications: [],

            minimumCreditScore: 600,

            minimumNetWorth: 0,

            maxConvictions: 0,

            allowActiveCases: false

        },

        metadata: {}

    },

    CERT_SECURITY_CLEARANCE: {

        id: "CERT_SECURITY_CLEARANCE",

        name: "Government Security Clearance",

        category: CERT.GOVERNMENT,

        description: "Security clearance for sensitive positions.",

        cost: 1000,

        requirements: {

            certifications: [
                "CERT_ENHANCED_DBS"
            ],

            qualifications: [],

            minimumCreditScore: 700,

            minimumNetWorth: 10000,

            maxConvictions: 0,

            allowActiveCases: false

        },

        metadata: {}

    }

};