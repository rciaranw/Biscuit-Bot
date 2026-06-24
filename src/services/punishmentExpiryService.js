const config = require("../config/config.json");

const Punishment = require("../database/models/Punishment");
const { createCase, closeCase } = require("./caseService");
const { logCase } = require("../utils/logCase");

/**
 * Starts the background expiry loop
 */
function startPunishmentExpiryService(client) {
    setInterval(async () => {
        await handleExpiredPunishments(client);
    }, 60 * 1000); // every 60 seconds
}

/**
 * Handles all expired punishments
 */
async function handleExpiredPunishments(client) {
    const now = new Date();

    const expired = await Punishment.find({
        active: true,
        expiresAt: { $lte: now }
    });

    for (const punishment of expired) {
        try {
            const guild = await client.guilds.fetch(config.guildId);

            // -------------------------
            // TEMP MUTE EXPIRY
            // -------------------------
            if (punishment.type === "tempmute") {
                const member = await guild.members.fetch(punishment.userId).catch(() => null);

                if (member && config.roles.muted) {
                    await member.roles.remove(config.roles.muted).catch(() => null);
                }

                const caseData = await createCase({
                    userId: punishment.userId,
                    moderatorId: client.user.id,
                    type: "unmute",
                    reason: "Automatic unmute (mute expired)",
                    active: false
                });

                await logCase(client, caseData);
            }

            // -------------------------
            // TEMP BAN EXPIRY
            // -------------------------
            if (punishment.type === "tempban") {
                await guild.bans.remove(punishment.userId).catch(() => null);

                const caseData = await createCase({
                    userId: punishment.userId,
                    moderatorId: client.user.id,
                    type: "unban",
                    reason: "Automatic unban (tempban expired)",
                    active: false
                });

                await logCase(client, caseData);
            }

            // -------------------------
            // CLOSE ORIGINAL CASE
            // -------------------------
            await closeCase(punishment.caseId);

            // mark expired record inactive
            punishment.active = false;
            await punishment.save();

        } catch (err) {
            console.error("Expiry service error:", err);
        }
    }
}

module.exports = {
    startPunishmentExpiryService
};