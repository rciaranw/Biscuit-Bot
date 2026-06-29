const CERT = require("../../constants/certificationCategories");

module.exports = {

    CERT_SAFEGUARDING: {
        id: "CERT_SAFEGUARDING",
        name: "Safeguarding Certificate",
        category: CERT.EDUCATION,
        description: "Child and vulnerable adult safeguarding.",
        cost: 300,
        requirements: {
            certifications: [
                "CERT_ENHANCED_DBS"
            ],
            qualifications: [],
            minimumCreditScore: 0,
            minimumNetWorth: 0
        },
        metadata: {}
    },

    CERT_QUALIFIED_TEACHER_STATUS: {
        id: "CERT_QUALIFIED_TEACHER_STATUS",
        name: "Qualified Teacher Status (QTS)",
        category: CERT.EDUCATION,
        description: "Professional teaching licence.",
        cost: 5000,
        requirements: {
            certifications: [
                "CERT_SAFEGUARDING"
            ],
            qualifications: [
                "QUAL_TEACHING_DEGREE"
            ],
            minimumCreditScore: 650,
            minimumNetWorth: 2000
        },
        metadata: {}
    },

    CERT_HEADTEACHER_ACCREDITATION: {
        id: "CERT_HEADTEACHER_ACCREDITATION",
        name: "Headteacher Accreditation",
        category: CERT.EDUCATION,
        description: "Leadership accreditation for school heads.",
        cost: 10000,
        requirements: {
            certifications: [
                "CERT_QUALIFIED_TEACHER_STATUS"
            ],
            qualifications: [],
            minimumCreditScore: 700,
            minimumNetWorth: 10000
        },
        metadata: {}
    }

};