const {
    getCreditTier,
    removeCredit,
    addCredit
} = require("../credit/creditEngine");

const {
    logTransaction
} = require("../ledger/ledgerEngine");

/**
 * Maximum loan by credit score
 */
function getMaxLoanAmount(user) {

    const score = user.creditScore ?? 650;

    if (score >= 850) return 25000;
    if (score >= 800) return 15000;
    if (score >= 750) return 10000;
    if (score >= 700) return 7500;
    if (score >= 650) return 5000;
    if (score >= 600) return 2500;
    if (score >= 500) return 1000;

    return 0;
}

/**
 * Interest rate by score
 */
function getInterestRate(user) {

    const score = user.creditScore ?? 650;

    if (score >= 850) return 0.04;
    if (score >= 800) return 0.05;
    if (score >= 750) return 0.07;
    if (score >= 700) return 0.09;
    if (score >= 650) return 0.12;
    if (score >= 600) return 0.16;

    return 0.22;
}

async function takeLoan(user, amount) {

    if (!user.loans) {
        user.loans = [];
    }

    const max = getMaxLoanAmount(user);

    if (max <= 0) {
        return {
            ok: false,
            reason: "Your credit score is too low to qualify for a loan."
        };
    }

    if (amount > max) {
        return {
            ok: false,
            reason: `Maximum loan available is ${max.toLocaleString()} Twinkies.`
        };
    }

    const rate = getInterestRate(user);

    const loan = {
        id: Date.now().toString(),
        principal: amount,
        remaining: amount,
        interestRate: rate,
        repayment: Math.ceil((amount * (1 + rate)) / 30),
        createdAt: new Date(),
        nextPayment: new Date(Date.now() + (24 * 60 * 60 * 1000)),
        status: "ACTIVE",
        repayments: []
    };

    user.loans.push(loan);

    user.bank += amount;

    if (!user.stats) user.stats = {};

    user.stats.totalBorrowed = (user.stats.totalBorrowed || 0) + amount;

    logTransaction(user, {
        type: "LOAN_CREATED",
        amount,
        balanceAfter: user.bank,
        source: "BANK_OF_BISCUIT",
        meta: {
            loanId: loan.id,
            interestRate: rate
        }
    });

    return {
        ok: true,
        loan
    };
}

function repayLoan(user, loanId, amount) {

    const loan = (user.loans || []).find(
        l => l.id === loanId && l.status === "ACTIVE"
    );

    if (!loan) {
        return {
            ok: false,
            reason: "Loan not found."
        };
    }

    if (user.bank < amount) {
        return {
            ok: false,
            reason: "Insufficient bank balance."
        };
    }

    user.bank -= amount;

    loan.remaining -= amount;

    loan.repayments.push({
        amount,
        paidAt: new Date()
    });

    logTransaction(user, {
        type: "LOAN_REPAYMENT",
        amount: -amount,
        balanceAfter: user.bank,
        source: "BANK_OF_BISCUIT",
        meta: {
            loanId
        }
    });

    if (loan.remaining <= 0) {

        loan.remaining = 0;
        loan.status = "PAID";

        addCredit(user, 10, "Loan fully repaid");

        return {
            ok: true,
            completed: true
        };
    }

    return {
        ok: true,
        completed: false
    };
}

function defaultLoan(user, loanId) {

    const loan = (user.loans || []).find(
        l => l.id === loanId && l.status === "ACTIVE"
    );

    if (!loan) return;

    loan.status = "DEFAULTED";

    removeCredit(user, 25, "Loan default");
}

function getActiveLoans(user) {

    return (user.loans || []).filter(
        l => l.status === "ACTIVE"
    );
}

module.exports = {
    getMaxLoanAmount,
    getInterestRate,
    takeLoan,
    repayLoan,
    defaultLoan,
    getActiveLoans
};