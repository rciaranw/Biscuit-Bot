const Counter = require("../database/models/Counter");

async function getNextCaseId() {

    const counter = await Counter.findOneAndUpdate(
        { name: "punishment_case" },
        { $inc: { value: 1 } },
        {
            new: true,
            upsert: true
        }
    );

    return counter.value;
}

module.exports = {
    getNextCaseId
};