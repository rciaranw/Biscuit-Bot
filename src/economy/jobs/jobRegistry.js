const jobRegistry = {

    // =========================
    // ENTRY LEVEL JOBS
    // =========================
    unemployed: {
        name: "Unemployed",
        basePay: 0,
        description: "No job currently held.",
        requirements: {
            qualifications: [],
            creditScore: 0
        }
    },

    fastfood_worker: {
        name: "Fast Food Worker",
        basePay: 120,
        description: "Entry-level food service role.",
        requirements: {
            qualifications: [],
            creditScore: 0
        }
    },

    retail_assistant: {
        name: "Retail Assistant",
        basePay: 140,
        description: "Customer-facing retail role.",
        requirements: {
            qualifications: [],
            creditScore: 10
        }
    },

    delivery_driver: {
        name: "Delivery Driver",
        basePay: 180,
        description: "Deliver goods across the city.",
        requirements: {
            qualifications: ["driving_basic"],
            assets: ["vehicle"],
            creditScore: 20
        }
    },

    warehouse_worker: {
        name: "Warehouse Worker",
        basePay: 160,
        description: "Manual labour logistics job.",
        requirements: {
            qualifications: [],
            creditScore: 5
        }
    },

    // =========================
    // SKILLED TRADES
    // =========================
    electrician: {
        name: "Electrician",
        basePay: 320,
        description: "Qualified electrical technician.",
        requirements: {
            qualifications: ["trade_electric"],
            creditScore: 35
        }
    },

    plumber: {
        name: "Plumber",
        basePay: 300,
        description: "Water system specialist.",
        requirements: {
            qualifications: ["trade_plumbing"],
            creditScore: 35
        }
    },

    mechanic: {
        name: "Mechanic",
        basePay: 340,
        description: "Vehicle repair specialist.",
        requirements: {
            qualifications: ["trade_mechanics"],
            assets: ["vehicle"],
            creditScore: 40
        }
    },

    // =========================
    // PUBLIC SERVICE
    // =========================
    police_officer: {
        name: "Police Officer",
        basePay: 420,
        description: "Law enforcement role.",
        requirements: {
            qualifications: ["law_basic"],
            creditScore: 50
        }
    },

    paramedic: {
        name: "Paramedic",
        basePay: 450,
        description: "Emergency medical response.",
        requirements: {
            qualifications: ["med_basic"],
            creditScore: 55
        }
    },

    firefighter: {
        name: "Firefighter",
        basePay: 400,
        description: "Fire and rescue services.",
        requirements: {
            qualifications: ["emergency_response"],
            creditScore: 50
        }
    },

    // =========================
    // PROFESSIONAL CAREERS
    // =========================
    junior_doctor: {
        name: "Junior Doctor",
        basePay: 650,
        description: "Entry medical professional.",
        requirements: {
            qualifications: ["med_basic"],
            creditScore: 65
        }
    },

    lawyer: {
        name: "Lawyer",
        basePay: 700,
        description: "Legal advisory and representation.",
        requirements: {
            qualifications: ["law_degree"],
            creditScore: 70
        }
    },

    engineer: {
        name: "Engineer",
        basePay: 600,
        description: "Technical engineering role.",
        requirements: {
            qualifications: ["tech_engineering"],
            creditScore: 60
        }
    },

    // =========================
    // HIGH INCOME CAREERS
    // =========================
    surgeon: {
        name: "Surgeon",
        basePay: 1200,
        description: "Advanced medical specialist.",
        requirements: {
            qualifications: ["med_surgery"],
            creditScore: 80
        }
    },

    pilot: {
        name: "Pilot",
        basePay: 1000,
        description: "Commercial aviation pilot.",
        requirements: {
            qualifications: ["aviation_license"],
            assets: ["license"],
            creditScore: 75
        }
    },

    investment_banker: {
        name: "Investment Banker",
        basePay: 1500,
        description: "High finance role.",
        requirements: {
            qualifications: ["finance_degree"],
            creditScore: 85
        }
    },

    // =========================
    // ELITE / LATE GAME
    // =========================
    ceo: {
        name: "CEO",
        basePay: 2500,
        description: "Corporate executive role.",
        requirements: {
            qualifications: ["business_mastery"],
            creditScore: 90,
            assets: ["company"]
        }
    }
};

/**
 * Get job by ID
 */
function getJob(jobId) {
    return jobRegistry[jobId] || jobRegistry.unemployed;
}

/**
 * Get all jobs
 */
function getAllJobs() {
    return Object.entries(jobRegistry).map(([id, job]) => ({
        id,
        ...job
    }));
}

/**
 * Check eligibility
 */
function canTakeJob(user, jobId) {

    const job = getJob(jobId);

    const credit = user.creditScore || 0;
    const quals = user.qualifications || [];
    const assets = user.assets || [];

    if (credit < (job.requirements.creditScore || 0)) {
        return false;
    }

    for (const q of (job.requirements.qualifications || [])) {
        if (!quals.includes(q)) return false;
    }

    for (const a of (job.requirements.assets || [])) {
        if (!assets.includes(a)) return false;
    }

    return true;
}

module.exports = {
    jobRegistry,
    getJob,
    getAllJobs,
    canTakeJob
};