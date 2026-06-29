const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_BASIC_LIFE_SUPPORT: {

        id: "CERT_BASIC_LIFE_SUPPORT",

        name: "Basic Life Support",

        category: CERT.MEDICAL,

        description: "Adult CPR and emergency life support.",

        cost: 300,

        requirements: {

            certifications: [
                "CERT_FIRST_AID"
            ],

            qualifications: [
                "QUAL_FIRST_AID_LEVEL_1"
            ],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    },

    CERT_MEDICATION_ADMINISTRATION: {

        id: "CERT_MEDICATION_ADMINISTRATION",

        name: "Medication Administration",

        category: CERT.MEDICAL,

        description: "Safe administration of medication.",

        cost: 600,

        requirements: {

            certifications: [
                "CERT_BASIC_LIFE_SUPPORT"
            ],

            qualifications: [
                "QUAL_HEALTH_AND_SOCIAL_CARE_DIPLOMA"
            ],

            minimumCreditScore: 0,

            minimumNetWorth: 0

        },

        metadata: {}

    },

    CERT_INFECTION_CONTROL: {

        id: "CERT_INFECTION_CONTROL",

        name: "Infection Prevention & Control",

        category: CERT.MEDICAL,

        description: "Clinical infection prevention training.",

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

    }

};