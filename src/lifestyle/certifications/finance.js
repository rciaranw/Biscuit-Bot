const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_MORTGAGE_ADVISER: {

        id: "CERT_MORTGAGE_ADVISER",

        name: "Mortgage Adviser Certification",

        category: CERT.FINANCE,

        description: "Authorised to advise clients on mortgage products.",

        cost: 3500,

        requirements: {

            certifications: [],

            qualifications: [
                "QUAL_ACCOUNTING_DIPLOMA"
            ],

            minimumCreditScore: 650,

            minimumNetWorth: 5000

        },

        metadata: {}

    },

    CERT_FINANCIAL_ADVISER: {

        id: "CERT_FINANCIAL_ADVISER",

        name: "Financial Adviser Certification",

        category: CERT.FINANCE,

        description: "Professional financial advice accreditation.",

        cost: 6000,

        requirements: {

            certifications: [
                "CERT_MORTGAGE_ADVISER"
            ],

            qualifications: [
                "QUAL_INVESTMENT_ANALYST"
            ],

            minimumCreditScore: 700,

            minimumNetWorth: 10000

        },

        metadata: {}

    },

    CERT_AUDITOR: {

        id: "CERT_AUDITOR",

        name: "Certified Auditor",

        category: CERT.FINANCE,

        description: "Professional financial auditing certification.",

        cost: 8000,

        requirements: {

            certifications: [
                "CERT_FINANCIAL_ADVISER"
            ],

            qualifications: [
                "QUAL_ACCOUNTING_DIPLOMA"
            ],

            minimumCreditScore: 720,

            minimumNetWorth: 15000

        },

        metadata: {}

    }

};