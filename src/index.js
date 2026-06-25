const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");

const commandHandler = require("./handlers/commandHandler");
const eventHandler = require("./handlers/eventHandler");
const connectDatabase = require("./database/connect");
const { startPunishmentExpiryService } = require("./services/punishmentExpiryService");
const { startMemberPromotionService } = require("./services/memberPromotionService");

const config = require("./config/config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User
    ]
});

client.commands = new Collection();

(async () => {
    await connectDatabase(config.mongoUri);

    await commandHandler(client);
    await eventHandler(client);

    await client.login(config.token);

    startPunishmentExpiryService(client);
    startMemberPromotionService(client);
})();