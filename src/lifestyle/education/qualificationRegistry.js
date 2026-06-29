const hospitality = require("./qualifications/hospitality");
const healthcare = require("./qualifications/healthcare");
const finance = require("./qualifications/finance");
const technology = require("./qualifications/technology");
const education = require("./qualifications/education");
const law = require("./qualifications/law");
const construction = require("./qualifications/construction");
const engineering = require("./qualifications/engineering");
const aviation = require("./qualifications/aviation");
const transport = require("./qualifications/transport");
const science = require("./qualifications/science");
const business = require("./qualifications/business");

const qualifications = {

    ...hospitality,

    ...healthcare,

    ...finance,

    ...technology,

    ...education,

    ...law,

    ...construction,

    ...engineering,

    ...aviation,

    ...transport,

    ...science,

    ...business

};

function getQualification(id) {

    return qualifications[id] || null;

}

function getAllQualifications() {

    return Object.values(qualifications);

}

function getQualificationsByCategory(category) {

    return Object.values(qualifications)
        .filter(q => q.category === category);

}

module.exports = {

    qualifications,

    getQualification,

    getAllQualifications,

    getQualificationsByCategory

};