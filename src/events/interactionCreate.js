module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(
            interaction.commandName
        );

        if (!command) return;

        try {

            await command.execute(interaction, client);

        } catch (error) {

            console.error(error);

            const response = {
                content: "An error occurred whilst executing this command.",
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(response);
            } else {
                await interaction.reply(response);
            }
        }
    }
};