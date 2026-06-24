const fs = require("fs");
const path = require("path");

module.exports = async (client) => {

    const commandsPath = path.join(__dirname, "..", "commands");

    const categories = fs.readdirSync(commandsPath);

    for (const category of categories) {

        const categoryPath = path.join(commandsPath, category);

        const commandFiles = fs
            .readdirSync(categoryPath)
            .filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {

            const command = require(path.join(categoryPath, file));

            client.commands.set(command.data.name, command);

            console.log(`Loaded command: ${command.data.name}`);
        }
    }
};