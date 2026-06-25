const cron = require("node-cron");
const MemberProfile = require("../database/models/MemberProfile");
const config = require("../config/config.json");

module.exports.startMemberPromotionService = (client) => {

    cron.schedule("0 * * * *", async () => {
        try {
            const guild = client.guilds.cache.first();
            if (!guild) return;

            const newArrival = guild.roles.cache.get(config.roles.newArrival);
            const pubRegular = guild.roles.cache.get(config.roles.pubRegular);

            if (!newArrival || !pubRegular) return;

            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            const usersToPromote = await MemberProfile.find({
                promoted: false,
                joinedAt: { $lte: sevenDaysAgo }
            });

            for (const record of usersToPromote) {
                const member = await guild.members.fetch(record.userId).catch(() => null);
                if (!member) continue;

                await member.roles.remove(newArrival).catch(() => {});
                await member.roles.add(pubRegular).catch(() => {});

                record.promoted = true;
                await record.save();
            }

        } catch (err) {
            console.error("Member promotion service error:", err);
        }
    });
};