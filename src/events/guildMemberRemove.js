const config = require("../config/config.json");

const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",

    async execute(member) {
        try {
            const logChannel = member.guild.channels.cache.get(config.channels.memberLogs);

            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setTitle("Member Left")
                .setColor(0xe74c3c)
                .setDescription(`${member.user.tag} left the server`)
                .addFields(
                    { name: "User ID", value: member.id, inline: true }
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] }).catch(() => {});
        } catch (err) {
            console.error("guildMemberRemove error:", err);
        }
    }
};