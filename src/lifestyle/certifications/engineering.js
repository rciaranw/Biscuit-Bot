const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_WELDING: {
        id: "CERT_WELDING",
        name: "Certified Welder",
        category: CERT.ENGINEERING,
        description: "Professional welding certification.",
        cost: 1800,
        requirements: {
            certifications: [],
            qualifications: ["QUAL_ENGINEERING_FUNDAMENTALS"],
            minimumCreditScore: 0,
            minimumNetWorth: 0
        },
        metadata: {}
    },

    CERT_ELECTRICAL_COMPETENCY: {
        id: "CERT_ELECTRICAL_COMPETENCY",
        name: "Electrical Competency Certificate",
        category: CERT.ENGINEERING,
        description: "Safe electrical installation certification.",
        cost: 3500,
        requirements: {
            certifications: [],
            qualifications: ["QUAL_MECHANICAL_ENGINEERING_DIPLOMA"],
            minimumCreditScore: 650,
            minimumNetWorth: 2000
        },
        metadata: {}
    },

    CERT_CHARTERED_ENGINEER: {
        id: "CERT_CHARTERED_ENGINEER",
        name: "Chartered Engineer",
        category: CERT.ENGINEERING,
        description: "Professional engineering accreditation.",
        cost: 12000,
        requirements: {
            certifications: [
                "CERT_ELECTRICAL_COMPETENCY"
            ],
            qualifications: [
                "QUAL_CIVIL_ENGINEERING_DEGREE"
            ],
            minimumCreditScore: 700,
            minimumNetWorth: 15000
        },
        metadata: {}
    }

};