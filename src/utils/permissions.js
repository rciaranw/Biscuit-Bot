const config = require("../utils/config");

function isOwner(member) {
    return member.id === config.adminId;
}

function isCiaran(member) {
    return member.roles.cache.has(
        config.roles.ciaran
    );
}

function isHeadModerator(member) {
    return (
        isOwner(member) ||
        isCiaran(member) ||
        member.roles.cache.has(
            config.roles.headModerator
        )
    );
}

function isModerator(member) {
    return (
        isHeadModerator(member) ||
        member.roles.cache.has(
            config.roles.moderator
        )
    );
}

function isStaff(member) {
    return (
        isModerator(member) ||
        member.roles.cache.has(
            config.roles.staff
        )
    );
}

module.exports = {
    isOwner,
    isCiaran,
    isHeadModerator,
    isModerator,
    isStaff
};