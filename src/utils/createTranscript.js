const fs = require("fs");
const path = require("path");

/**
 * Creates a readable transcript from a Discord channel
 */
async function createTranscript(channel) {
    const messages = await channel.messages.fetch({ limit: 100 });

    const sorted = Array.from(messages.values())
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp);

    let transcript = `Transcript for #${channel.name}\n\n`;

    for (const msg of sorted) {
        const time = new Date(msg.createdTimestamp).toLocaleString();

        transcript += `[${time}] ${msg.author.tag} (${msg.author.id})\n`;
        transcript += `${msg.content || "[No Text Content]"}\n\n`;
    }

    const fileName = `${channel.name}.txt`;
    const filePath = path.join(__dirname, "../../transcripts", fileName);

    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.writeFileSync(filePath, transcript);

    return filePath;
}

module.exports = { createTranscript };