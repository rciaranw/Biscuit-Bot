const mongoose = require("mongoose");

const economyUserSchema = new mongoose.Schema(
{
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    wallet: {
        type: Number,
        default: 0
    },

    bank: {
        type: Number,
        default: 0
    },

    creditScore: {
        type: Number,
        default: 650,
        min: 200,
        max: 900
    },

    reputation: {
        type: Number,
        default: 50
    },

    job: {
        active: {
            type: Boolean,
            default: false
        },

        title: {
            type: String,
            default: "unemployed"
        },

        salary: {
            type: Number,
            default: 0
        },

        level: {
            type: Number,
            default: 1
        },

        experience: {
            type: Number,
            default: 0
        },

        workStreak: {
            type: Number,
            default: 0
        },

        baseMultiplier: {
            type: Number,
            default: 1
        },

        lastWorkedAt: {
            type: Date,
            default: null
        }
    },

    study: {
        lastStudied: {
            type: Date,
            default: null
        }
    },

    qualifications: {
        type: [String],
        default: []
    },

    assets: {
        type: [String],
        default: []
    },

    inventory: {
        type: [String],
        default: []
    },

    overdraft: {
        enabled: {
            type: Boolean,
            default: false
        },

        limit: {
            type: Number,
            default: 0
        },

        balance: {
            type: Number,
            default: 0
        },

        interestRate: {
            type: Number,
            default: 0.39
        }
    },

    loans: {
        type: [{
            amount: Number,
            remaining: Number,
            interestRate: Number,
            repayment: Number,
            status: String,
            createdAt: Date,
            nextPayment: Date
        }],
        default: []
    },

    creditCard: {
        active: {
            type: Boolean,
            default: false
        },

        limit: {
            type: Number,
            default: 0
        },

        balance: {
            type: Number,
            default: 0
        },

        interestRate: {
            type: Number,
            default: 0
        },

        createdAt: {
            type: Date,
            default: null
        },

        history: {
            type: Array,
            default: []
        }
    },

    ledger: {
        type: Array,
        default: []
    },

    stats: {

        totalEarned: {
            type: Number,
            default: 0
        },

        totalSpent: {
            type: Number,
            default: 0
        },

        totalTaxPaid: {
            type: Number,
            default: 0
        },

        totalLoanInterest: {
            type: Number,
            default: 0
        },

        totalBorrowed: {
            type: Number,
            default: 0
        }
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("EconomyUser", economyUserSchema);