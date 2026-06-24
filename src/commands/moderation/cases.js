const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../../config/config.json");
const Punishment = require("../../database/models/Punishment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cases")
        .setDescription("View a user's case history with pagination")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to view cases for")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const member = interaction.member;

        const hasPermission =
            member.roles.cache.has(config.roles.staff) ||
            member.roles.cache.has(config.roles.headModerator) ||
            interaction.user.id === config.adminId;

        if (!hasPermission) {
            return interaction.editReply({
                content: "You don’t have permission to use this command."
            });
        }

        const targetUser = interaction.options.getUser("user");

        const cases = await Punishment.find({ userId: targetUser.id })
            .sort({ createdAt: -1 });

        if (!cases.length) {
            return interaction.editReply({
                content: "No cases found for this user."
            });
        }

        const pageSize = 5;
        let page = 0;

        const generateEmbed = (pageIndex) => {
            const start = pageIndex * pageSize;
            const end = start + pageSize;

            const pageCases = cases.slice(start, end);

            const description = pageCases.map(c => {
                return `**#${c.caseId}** | ${c.type.toUpperCase()} | ${c.active ? "ACTIVE" : "INACTIVE"}\n` +
                       `Reason: ${c.reason}\n` +
                       `Date: <t:${Math.floor(c.createdAt.getTime() / 1000)}:R>`;
            }).join("\n\n");

            return new EmbedBuilder()
                .setTitle(`Cases for ${targetUser.tag}`)
                .setColor(0x3498db)
                .setDescription(description)
                .setFooter({
                    text: `Page ${pageIndex + 1} of ${Math.ceil(cases.length / pageSize)}`
                });
        };

        const getButtons = (pageIndex) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("cases_prev")
                    .setLabel("Previous")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(pageIndex === 0),

                new ButtonBuilder()
                    .setCustomId("cases_next")
                    .setLabel("Next")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(pageIndex >= Math.ceil(cases.length / pageSize) - 1)
            );
        };

        const message = await interaction.editReply({
            embeds: [generateEmbed(page)],
            components: [getButtons(page)]
        });

        const collector = message.createMessageComponentCollector({
            time: 120000
        });

        collector.on("collect", async (btnInteraction) => {
            if (btnInteraction.user.id !== interaction.user.id) {
                return btnInteraction.reply({
                    content: "This pagination session isn’t yours.",
                    ephemeral: true
                });
            }

            if (btnInteraction.customId === "cases_prev") {
                page = Math.max(page - 1, 0);
            }

            if (btnInteraction.customId === "cases_next") {
                page = Math.min(page + 1, Math.ceil(cases.length / pageSize) - 1);
            }

            await btnInteraction.update({
                embeds: [generateEmbed(page)],
                components: [getButtons(page)]
            });
        });

        collector.on("end", async () => {
            try {
                await interaction.editReply({
                    components: []
                });
            } catch {}
        });
    }
};