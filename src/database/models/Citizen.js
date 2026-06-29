const mongoose = require("mongoose");

const CitizenSchema = new mongoose.Schema({

    /*
    |--------------------------------------------------------------------------
    | Identity
    |--------------------------------------------------------------------------
    */

    discordId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    username: {
        type: String,
        default: ""
    },

    displayName: {
        type: String,
        default: ""
    },

    /*
    |--------------------------------------------------------------------------
    | Financial
    |--------------------------------------------------------------------------
    */

    financial: {

        wallet: {
            type: Number,
            default: 0
        },

        bank: {
            type: Number,
            default: 0
        },

        netWorth: {
            type: Number,
            default: 0
        },

        credit: {

            score: {
                type: Number,
                default: 200
            },

            history: {
                type: Array,
                default: []
            },

            openAccounts: {
                type: Number,
                default: 0
            },

            missedPayments: {
                type: Number,
                default: 0
            },

            onTimePayments: {
                type: Number,
                default: 0
            }

        },

        debts: {

            loans: {
                type: Array,
                default: []
            },

            mortgages: {
                type: Array,
                default: []
            },

            creditCards: {
                type: Array,
                default: []
            },

            overdrafts: {
                type: Array,
                default: []
            }

        }

    },

    /*
    |--------------------------------------------------------------------------
    | Career
    |--------------------------------------------------------------------------
    */

    career: {

        current: {
            type: String,
            default: "CAREER_UNEMPLOYED"
        },

        level: {
            type: Number,
            default: 1
        },

        salary: {
            type: Number,
            default: 0
        },

        xp: {
            type: Map,
            of: Number,
            default: {}
        },

        history: {
            type: Array,
            default: []
        }

    },

    /*
    |--------------------------------------------------------------------------
    | Education
    |--------------------------------------------------------------------------
    */

    education: {

        qualifications: {
            type: Array,
            default: []
        },

        certifications: {
            type: Array,
            default: []
        }

    },

    /*
    |--------------------------------------------------------------------------
    | Crime
    |--------------------------------------------------------------------------
    */

    crime: {

        warnings: {
            type: Number,
            default: 0
        },

        arrests: {
            type: Number,
            default: 0
        },

        convictions: {
            type: Number,
            default: 0
        },

        activeCases: {
            type: Number,
            default: 0
        },

        prisonSentences: {
            type: Number,
            default: 0
        },

        communityServiceHours: {
            type: Number,
            default: 0
        },

        criminalScore: {
            type: Number,
            default: 0
        }

    },

    /*
    |--------------------------------------------------------------------------
    | Assets
    |--------------------------------------------------------------------------
    */

    assets: {

        owned: {
            type: Array,
            default: []
        }

    },

    /*
    |--------------------------------------------------------------------------
    | Health
    |--------------------------------------------------------------------------
    */

    health: {

        energy: {
            type: Number,
            default: 100
        },

        stress: {
            type: Number,
            default: 0
        },

        happiness: {
            type: Number,
            default: 100
        },

        fitness: {
            type: Number,
            default: 50
        }

    },

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    relationships: {

        status: {
            type: String,
            default: "SINGLE"
        },

        partner: {
            type: String,
            default: null
        }

    },

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    statistics: {

        lifetimeEarned: {
            type: Number,
            default: 0
        },

        lifetimeSpent: {
            type: Number,
            default: 0
        },

        lifetimeTaxPaid: {
            type: Number,
            default: 0
        },

        totalHoursWorked: {
            type: Number,
            default: 0
        },

        totalStudyHours: {
            type: Number,
            default: 0
        }

    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Citizen", CitizenSchema);