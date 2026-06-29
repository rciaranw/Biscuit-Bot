const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_GOOD_LABORATORY_PRACTICE: {
        id: "CERT_GOOD_LABORATORY_PRACTICE",
        name: "Good Laboratory Practice (GLP)",
        category: CERT.SCIENCE,
        description: "International laboratory quality standards.",
        cost: 2000,
        requirements: {
            certifications: [],
            qualifications: [
                "QUAL_LAB_TECHNICIAN_DIPLOMA"
            ],
            minimumCreditScore: 600,
            minimumNetWorth: 1000
        },
        metadata: {}
    },

    CERT_GOOD_CLINICAL_PRACTICE: {
        id: "CERT_GOOD_CLINICAL_PRACTICE",
        name: "Good Clinical Practice (GCP)",
        category: CERT.SCIENCE,
        description: "Clinical trials certification.",
        cost: 3500,
        requirements: {
            certifications: [
                "CERT_GOOD_LABORATORY_PRACTICE"
            ],
            qualifications: [
                "QUAL_RESEARCH_SCIENCE_DEGREE"
            ],
            minimumCreditScore: 650,
            minimumNetWorth: 3000
        },
        metadata: {}
    },

    CERT_RESEARCH_ETHICS: {
        id: "CERT_RESEARCH_ETHICS",
        name: "Research Ethics Approval",
        category: CERT.SCIENCE,
        description: "Research ethics certification.",
        cost: 1500,
        requirements: {
            certifications: [
                "CERT_GOOD_CLINICAL_PRACTICE"
            ],
            qualifications: [
                "QUAL_RESEARCH_SCIENCE_DEGREE"
            ],
            minimumCreditScore: 700,
            minimumNetWorth: 5000
        },
        metadata: {}
    }

};