const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_PROJECT_MANAGEMENT: {

        id: "CERT_PROJECT_MANAGEMENT",

        name: "Project Management Professional",

        category: CERT.BUSINESS,

        description: "Professional project management certification.",

        cost: 5000,

        requirements: {

            certifications: [],

            qualifications: [
                "QUAL_BUSINESS_MANAGEMENT_DIPLOMA"
            ],

            minimumCreditScore: 650,

            minimumNetWorth: 3000

        },

        metadata: {}

    },

    CERT_HR_PRACTITIONER: {

        id: "CERT_HR_PRACTITIONER",

        name: "HR Practitioner",

        category: CERT.BUSINESS,

        description: "Professional HR accreditation.",

        cost: 3500,

        requirements: {

            certifications: [],

            qualifications: [
                "QUAL_BUSINESS_FOUNDATION"
            ],

            minimumCreditScore: 600,

            minimumNetWorth: 2000

        },

        metadata: {}

    },

    CERT_EXECUTIVE_LEADERSHIP: {

        id: "CERT_EXECUTIVE_LEADERSHIP",

        name: "Executive Leadership",

        category: CERT.BUSINESS,

        description: "Senior executive leadership programme.",

        cost: 12000,

        requirements: {

            certifications: [
                "CERT_PROJECT_MANAGEMENT"
            ],

            qualifications: [
                "QUAL_MASTER_OF_BUSINESS_ADMINISTRATION"
            ],

            minimumCreditScore: 750,

            minimumNetWorth: 25000

        },

        metadata: {}

    }

};