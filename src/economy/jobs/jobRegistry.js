const jobs = {
    unemployed: {
        name: "Unemployed",
        pay: 0,
        requirements: [],
        description: "No job. Just vibes.",
        category: "none"
    },

    cashier: {
        name: "Cashier",
        pay: 60,
        requirements: [],
        description: "Basic retail work. Minimal stress.",
        category: "service"
    },

    bartender: {
        name: "Bartender",
        pay: 90,
        requirements: [],
        description: "Serving drinks and pretending to listen.",
        category: "hospitality"
    },

    chef: {
        name: "Chef",
        pay: 140,
        requirements: ["culinary_1"],
        description: "Fast paced kitchen work.",
        category: "hospitality"
    },

    nurse: {
        name: "Nurse",
        pay: 220,
        requirements: ["medical_1"],
        description: "Basic healthcare support role.",
        category: "medical"
    },

    doctor: {
        name: "Doctor",
        pay: 500,
        requirements: ["medical_2"],
        description: "High responsibility medical professional.",
        category: "medical"
    },

    paramedic: {
        name: "Paramedic",
        pay: 260,
        requirements: ["medical_1"],
        description: "Emergency response medical staff.",
        category: "medical"
    },

    police_constable: {
        name: "Police Constable",
        pay: 300,
        requirements: ["law_1"],
        description: "Basic law enforcement officer.",
        category: "law"
    },

    detective: {
        name: "Detective",
        pay: 450,
        requirements: ["law_2"],
        description: "Investigative law enforcement role.",
        category: "law"
    },

    lawyer: {
        name: "Lawyer",
        pay: 480,
        requirements: ["law_2"],
        description: "Legal representation and court work.",
        category: "law"
    },

    pilot: {
        name: "Pilot",
        pay: 520,
        requirements: ["aviation_2"],
        description: "Commercial aircraft pilot.",
        category: "transport"
    },

    engineer: {
        name: "Engineer",
        pay: 380,
        requirements: ["engineering_1"],
        description: "Technical systems and infrastructure work.",
        category: "technical"
    },

    it_specialist: {
        name: "IT Specialist",
        pay: 350,
        requirements: ["tech_1"],
        description: "Tech support and systems maintenance.",
        category: "technical"
    },

    banker: {
        name: "Banker",
        pay: 600,
        requirements: ["finance_2"],
        description: "Bank of Biscuit financial operations.",
        category: "finance"
    }
};

/**
 * Get a job by ID (case-safe)
 */
function getJob(id) {

    if (!id) return null;

    const key = Object.keys(jobs).find(
        j => j.toLowerCase() === id.toLowerCase()
    );

    return key ? jobs[key] : null;
}

/**
 * Return all jobs except unemployed
 */
function getAllJobs() {
    return Object.entries(jobs)
        .filter(([id]) => id !== "unemployed")
        .map(([id, job]) => ({
            id,
            ...job
        }));
}

/**
 * Check if user meets requirements
 */
function canTakeJob(user, jobId) {

    const job = getJob(jobId);

    if (!job) return { ok: false, reason: "Job does not exist." };

    const quals = user.qualifications || [];

    for (const req of job.requirements) {
        if (!quals.includes(req)) {
            return {
                ok: false,
                reason: `Missing requirement: ${req}`
            };
        }
    }

    return { ok: true };
}

module.exports = {
    jobs,
    getJob,
    getAllJobs,
    canTakeJob
};