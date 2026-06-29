/**
 * ============================================
 * Biscuit Bot Lifestyle System
 * Requirement Engine
 * ============================================
 *
 * Every registry in the project should use the
 * same requirement structure.
 *
 * Returns:
 * {
 *     success: Boolean,
 *     failed: [],
 *     passed: []
 * }
 */

function checkRequirements(citizen, requirements = {}) {

    const failed = [];
    const passed = [];

    /*
    |--------------------------------------------------------------------------
    | Qualifications
    |--------------------------------------------------------------------------
    */

    if (requirements.qualifications?.length) {

        const owned = citizen.education?.qualifications || [];

        for (const qualification of requirements.qualifications) {

            if (!owned.includes(qualification)) {
                failed.push({
                    type: "qualification",
                    value: qualification
                });
            } else {
                passed.push({
                    type: "qualification",
                    value: qualification
                });
            }

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Certifications
    |--------------------------------------------------------------------------
    */

    if (requirements.certifications?.length) {

        const owned = citizen.education?.certifications || [];

        for (const certification of requirements.certifications) {

            if (!owned.includes(certification)) {
                failed.push({
                    type: "certification",
                    value: certification
                });
            } else {
                passed.push({
                    type: "certification",
                    value: certification
                });
            }

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Assets
    |--------------------------------------------------------------------------
    */

    if (requirements.assets?.length) {

        const assets = citizen.assets?.owned || [];

        for (const asset of requirements.assets) {

            const exists = assets.some(a => a.id === asset);

            if (!exists) {

                failed.push({
                    type: "asset",
                    value: asset
                });

            } else {

                passed.push({
                    type: "asset",
                    value: asset
                });

            }

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Credit Score
    |--------------------------------------------------------------------------
    */

    if (requirements.minimumCreditScore != null) {

        const score = citizen.financial.credit.score;

        if (score < requirements.minimumCreditScore) {

            failed.push({
                type: "creditScore",
                value: requirements.minimumCreditScore
            });

        } else {

            passed.push({
                type: "creditScore",
                value: score
            });

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Net Worth
    |--------------------------------------------------------------------------
    */

    if (requirements.minimumNetWorth != null) {

        const worth = citizen.financial.netWorth;

        if (worth < requirements.minimumNetWorth) {

            failed.push({
                type: "netWorth",
                value: requirements.minimumNetWorth
            });

        } else {

            passed.push({
                type: "netWorth",
                value: worth
            });

        }

    }

    /*
    |--------------------------------------------------------------------------
    | XP
    |--------------------------------------------------------------------------
    */

    if (requirements.minimumXP) {

        const xp = citizen.career.xp || {};

        for (const category of Object.keys(requirements.minimumXP)) {

            const requiredXP = requirements.minimumXP[category];

            const citizenXP = xp.get
                ? (xp.get(category) || 0)
                : (xp[category] || 0);

            if (citizenXP < requiredXP) {

                failed.push({
                    type: "xp",
                    category,
                    value: requiredXP
                });

            } else {

                passed.push({
                    type: "xp",
                    category,
                    value: citizenXP
                });

            }

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Criminal Record
    |--------------------------------------------------------------------------
    */

    if (requirements.criminalRecord) {

        const crime = citizen.crime;

        if (
            requirements.criminalRecord.maxConvictions != null &&
            crime.convictions >
            requirements.criminalRecord.maxConvictions
        ) {

            failed.push({
                type: "convictions"
            });

        }

        if (
            requirements.criminalRecord.allowActiveCases === false &&
            crime.activeCases > 0
        ) {

            failed.push({
                type: "activeCases"
            });

        }

    }

    return {

        success: failed.length === 0,

        failed,

        passed

    };

}

module.exports = {
    checkRequirements
};