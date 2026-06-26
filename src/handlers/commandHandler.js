const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

module.exports = async (client) => {

    //Reinitialise safely here
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, "..", "commands");

    if (!fs.existsSync(commandsPath)) {
        console.log("Commands folder not found!");
        return;
    }

    const categories = fs.readdirSync(commandsPath);

    for (const category of categories) {

        const categoryPath = path.join(commandsPath, category);

        if (!fs.lstatSync(categoryPath).isDirectory()) continue;

        const commandFiles = fs
            .readdirSync(categoryPath)
            .filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {

            const filePath = path.join(categoryPath, file);

            const command = require(filePath);

            if (!command?.data?.name || !command?.execute) {
                console.log(`Skipping invalid command: ${file}`);
                continue;
            }

            client.commands.set(command.data.name, command);

            console.log(`Loaded command: ${command.data.name}`);
        }
    }

    console.log(`Total commands loaded: ${client.commands.size}`);
}