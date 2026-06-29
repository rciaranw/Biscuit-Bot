const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_NETWORK_PLUS: {

        id: "CERT_NETWORK_PLUS",

        name: "CompTIA Network+",

        category: CERT.TECHNOLOGY,

        description: "Networking fundamentals certification.",

        cost: 1800,

        requirements: {

            certifications: [],

            qualifications: [
                "QUAL_IT_FUNDAMENTALS"
            ],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    },

    CERT_SECURITY_PLUS: {

        id: "CERT_SECURITY_PLUS",

        name: "CompTIA Security+",

        category: CERT.TECHNOLOGY,

        description: "Cyber security certification.",

        cost: 2500,

        requirements: {

            certifications: [
                "CERT_NETWORK_PLUS"
            ],

            qualifications: [
                "QUAL_SOFTWARE_DEVELOPMENT_DIPLOMA"
            ],

            minimumCreditScore: 650,

            minimumNetWorth: 1000

        },

        metadata: {}

    },

    CERT_CLOUD_ENGINEER: {

        id: "CERT_CLOUD_ENGINEER",

        name: "Cloud Engineer Certification",

        category: CERT.TECHNOLOGY,

        description: "Cloud infrastructure and deployment certification.",

        cost: 5000,

        requirements: {

            certifications: [
                "CERT_SECURITY_PLUS"
            ],

            qualifications: [
                "QUAL_SOFTWARE_DEVELOPMENT_DIPLOMA"
            ],

            minimumCreditScore: 700,

            minimumNetWorth: 5000

        },

        metadata: {}

    }

};