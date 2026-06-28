const EconomyUser = require("../../database/models/EconomyUser");

const {
    removeCredit
} = require("../credit/creditEngine");

/**
 * Runs every X interval (you will hook this into a scheduler)
 */
async function processLoans(client) {

    const users = await EconomyUser.find({
        "loans.0": { $exists: true }
    });

    const now = Date.now();

    for (const user of users) {

        let changed = false;

        for (const loan of user.loans || []) {

            if (loan.status !== "ACTIVE") continue;

            const ageDays = (now - loan.createdAt) / (1000 * 60 * 60 * 24);

            // =========================
            // INTEREST ACCRUAL
            // =========================
            const dailyRate = loan.interestRate / 30;

            const interest = Math.floor(loan.remaining * dailyRate * ageDays);

            if (interest > 0) {
                loan.remaining += interest;
                changed = true;
            }

            // =========================
            // OVERDUE CHECKS
            // =========================
            if (ageDays > 7 && loan.remaining > 0) {

                loan.status = "OVERDUE";

                removeCredit(user, 10, "Loan overdue");

                changed = true;
            }

            // =========================
            // DEFAULT ESCALATION
            // =========================
            if (ageDays > 14 && loan.remaining > 0) {

                loan.status = "DEFAULTED";

                removeCredit(user, 25, "Loan default");

                changed = true;
            }
        }

        if (changed) {
            await user.save();
        }
    }
}

module.exports = {
    processLoans
};