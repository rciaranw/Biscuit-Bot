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
            }
        },

        loan: {
            active: {
                type: Boolean,
                default: false
            },
            amount: {
                type: Number,
                default: 0
            },
            remaining: {
                type: Number,
                default: 0
            },
            interestRate: {
                type: Number,
                default: 0
            }
        },

        job: {
            active: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: null
            },
            salary: {
                type: Number,
                default: 0
            },
            workStreak: {
                type: Number,
                default: 0
            },
            lastWorkedAt: {
                type: Date,
                default: null
            }
        },

        inventory: {
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
            totalGambled: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("EconomyUser", economyUserSchema);