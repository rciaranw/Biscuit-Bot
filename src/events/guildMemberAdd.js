const config = require("../config/config.json");
const MemberProfile = require("../database/models/MemberProfile");

const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {
        try {
            const newArrivalRole = member.guild.roles.cache.get(config.roles.newArrival);
            const logChannel = member.guild.channels.cache.get(config.channels.memberLogs);

            // -----------------------------
            // Store join in DB
            // -----------------------------
            await MemberProfile.findOneAndUpdate(
                { userId: member.id, guildId: member.guild.id },
                { joinedAt: new Date(), promoted: false },
                { upsert: true }
            );

            // -----------------------------
            // Give New Arrival role
            // -----------------------------
            if (newArrivalRole) {
                await member.roles.add(newArrivalRole, "Member joined");
            }

            // -----------------------------
            // Log embed
            // -----------------------------
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle("Member Joined")
                    .setColor(0x2ecc71)
                    .setDescription(`${member.user.tag} joined the server`)
                    .addFields(
                        { name: "User ID", value: member.id, inline: true },
                        { name: "Account Created", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
                    )
                    .setTimestamp();

                logChannel.send({ embeds: [embed] }).catch(() => {});
            }

            // -----------------------------
            // Safe DM welcome
            // -----------------------------
            const dmEmbed = new EmbedBuilder()
                .setTitle(`Welcome to ${member.guild.name}`)
                .setColor(0x3498db)
                .setDescription(
                    "You’ve joined the server.\n\n" +
                    "Take a look around and enjoy your stay."
                )
                .setFooter({ text: "If you can see this, your DMs are open (barely)" });

            await member.send({ embeds: [dmEmbed] }).catch(() => {
                // silently ignore closed DMs
            });

        } catch (err) {
            console.error("guildMemberAdd error:", err);
        }
    }
};