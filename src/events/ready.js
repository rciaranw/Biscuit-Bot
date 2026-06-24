const { ActivityType } = require('discord.js')

module.exports = {
    name: "ready",
    once: true,

    async execute(client) {

        console.log("--------------------------------");
        console.log(`Logged in as ${client.user.tag}`);
        console.log(`Guilds: ${client.guilds.cache.size}`);
        console.log("--------------------------------");


        const statuses = [
            { name: "Scrolling through TikTok", type: ActivityType.Watching },
            { name: "Watching over the server", type: ActivityType.Watching },
            { name: "Playing with a ball", type: ActivityType.Playing}
        ];

        let i = 0;

        setInterval(() => {
            client.user.setPresence({
                activities: [statuses[i]],
                status: "online"
            });

            i = ( + 1) % statuses.length;
        }, 15000);
    }
};