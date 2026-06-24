const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

// FIXED PATH
const config = require("../src/utils/config");

const commands = [];

const commandsPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);

    const commandFiles = fs
        .readdirSync(folderPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(path.join(folderPath, file));

        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }
}

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
    try {
        console.log("Deploying slash commands...");

        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands }
        );

        console.log("Commands deployed.");
    } catch (err) {
        console.error("Deploy error:", err);
    }
})();