const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_CSCS_CARD: {
        id: "CERT_CSCS_CARD",
        name: "CSCS Labourer Card",
        category: CERT.CONSTRUCTION,
        description: "Construction Skills Certification Scheme card.",
        cost: 250,
        requirements: {
            certifications: [],
            qualifications: [
                "QUAL_CITB_SAFETY_TRAINING"
            ],
            minimumCreditScore: 0,
            minimumNetWorth: 0
        },
        metadata: {}
    },

    CERT_SITE_MANAGER_SAFETY: {
        id: "CERT_SITE_MANAGER_SAFETY",
        name: "Site Manager Safety Training",
        category: CERT.CONSTRUCTION,
        description: "Health & Safety qualification for site managers.",
        cost: 2500,
        requirements: {
            certifications: [
                "CERT_CSCS_CARD"
            ],
            qualifications: [
                "QUAL_CONSTRUCTION_SUPERVISION_DIPLOMA"
            ],
            minimumCreditScore: 600,
            minimumNetWorth: 1000
        },
        metadata: {}
    },

    CERT_CRANE_OPERATOR: {
        id: "CERT_CRANE_OPERATOR",
        name: "Crane Operator Licence",
        category: CERT.CONSTRUCTION,
        description: "Certified crane operator.",
        cost: 4000,
        requirements: {
            certifications: [
                "CERT_CSCS_CARD"
            ],
            qualifications: [],
            minimumCreditScore: 650,
            minimumNetWorth: 3000
        },
        metadata: {}
    }

};