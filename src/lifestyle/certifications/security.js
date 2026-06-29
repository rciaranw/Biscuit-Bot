const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_SIA_DOOR_SUPERVISOR: {

        id: "CERT_SIA_DOOR_SUPERVISOR",

        name: "SIA Door Supervisor Licence",

        category: CERT.SECURITY,

        description: "Licensed door supervisor.",

        cost: 1200,

        requirements: {

            certifications: [
                "CERT_ENHANCED_DBS"
            ],

            qualifications: [],

            minimumCreditScore: 600,

            minimumNetWorth: 500

        },

        metadata: {}

    },

    CERT_CCTV_OPERATOR: {

        id: "CERT_CCTV_OPERATOR",

        name: "CCTV Operator Licence",

        category: CERT.SECURITY,

        description: "Licensed CCTV operator.",

        cost: 700,

        requirements: {

            certifications: [
                "CERT_BACKGROUND_CHECK"
            ],

            qualifications: [],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    },

    CERT_CLOSE_PROTECTION: {

        id: "CERT_CLOSE_PROTECTION",

        name: "Close Protection Licence",

        category: CERT.SECURITY,

        description: "Executive protection qualification.",

        cost: 3500,

        requirements: {

            certifications: [
                "CERT_SIA_DOOR_SUPERVISOR",
                "CERT_SECURITY_CLEARANCE"
            ],

            qualifications: [],

            minimumCreditScore: 700,

            minimumNetWorth: 5000

        },

        metadata: {}

    }

};