const { ActivityType } = require("discord.js");
const { startEconomyScheduler } = require("../economy/scheduler/economyScheduler");

module.exports = {
    name: "ready",
    once: true,

    async execute(client) {

        console.log("--------------------------------");
        console.log(`Logged in as ${client.user.tag}`);
        console.log(`Guilds: ${client.guilds.cache.size}`);
        console.log("--------------------------------");

        // =======================================
        // START ECONOMY SYSTEM
        // =======================================
        startEconomyScheduler(client);

        console.log("--------------------------------");
        console.log("Bank of Biscuit Economy Systems Online.");
        console.log("--------------------------------");

        const statuses = [
            {
                name: "Scrolling through TikTok",
                type: ActivityType.Watching
            },
            {
                name: "Watching over the server",
                type: ActivityType.Watching
            },
            {
                name: "Playing with a ball",
                type: ActivityType.Playing
            }
        ];

        let i = 0;

        client.user.setPresence({
            activities: [statuses[0]],
            status: "online"
        });

        setInterval(() => {

            i = (i + 1) % statuses.length;

            client.user.setPresence({
                activities: [statuses[i]],
                status: "online"
            });

        }, 15000);

    }
};