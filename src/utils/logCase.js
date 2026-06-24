// utils/logCase.js
const { EmbedBuilder } = require("discord.js");
const config = require("../utils/config");

async function logCase(client, caseData) {
    const channelId = config.channels.modLogs;
    if (!channelId) return;

    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setTitle(`Case #${caseData.caseId} | ${caseData.type.toUpperCase()}`)
        .addFields(
            { name: "User", value: `<@${caseData.userId}>`, inline: true },
            { name: "Moderator", value: `<@${caseData.moderatorId}>`, inline: true },
            { name: "Reason", value: caseData.reason }
        )
        .setColor(caseData.type === "warn" ? 0xFFA500 : 0xFF0000)
        .setTimestamp(caseData.createdAt);

    await channel.send({ embeds: [embed] });
}

module.exports = { logCase };