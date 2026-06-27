const { SlashCommandBuilder } = require("discord.js");
const { getUser, addWallet } = require("../../services/economyService");

const SIX_HOURS = 6 * 60 * 60 * 1000;

const jobs = [
    "You argued with a customer about whether Twinkies are a currency. You won. Somehow.",
    "You worked as a Tesco self-checkout assistant and judged everyone silently.",
    "You helped an old man find the milk aisle. He tipped you emotionally.",
    "You cleaned a pub table so aggressively it got promoted to 'reflective surface'.",
    "You delivered food and ate only 12% of it. A personal best.",
    "You stood in for a missing shop mannequin. Very convincing.",
    "You ran a 5-minute consultation on someone's life choices. They left more confused.",
    "You worked at a café and accidentally invented a new coffee by panic.",
    "You helped stack shelves and immediately unstacked them emotionally.",
    "You did admin work for 6 hours and produced 2 emails and a breakdown.",
    "You worked security and told someone ‘don’t do that’ very firmly.",
    "You mopped a floor so well it developed trust issues.",
    "You tried your best. HR will be in touch (they won’t).",
    "You carried boxes labelled ‘light’ that were absolutely not light.",
    "You babysat a printer. It still misbehaved.",
    "You worked in a pub and learned that humanity is 40% lager.",
    "You became the unofficial IT support for a shop and fixed nothing.",
    "You explained Wi-Fi to someone who didn’t want to understand.",
    "You helped a tourist. You are now emotionally exhausted.",
    "You restocked crisps and felt powerful for 4 seconds.",
    "You worked retail and lost a small part of your soul at till 3.",
    "You wrote a to-do list and immediately ignored it.",
    "You answered phones professionally until your will to live expired.",
    "You assembled furniture and achieved extra screws somehow.",
    "You worked at a bar and survived pure chaos energy.",
    "You convinced someone their expired coupon still worked. Respect.",
    "You did warehouse work and now understand pain.",
    "You trained a new employee. They quit halfway through.",
    "You cleaned glassware and questioned your existence.",
    "You worked a shift and mostly thought about leaving."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work to earn Twinkies (6 hour cooldown)."),

    async execute(interaction) {

        const userId = interaction.user.id;

        const user = await getUser(userId);

        const now = Date.now();

        if (user.lastWork && now - user.lastWork < SIX_HOURS) {

            const remaining = SIX_HOURS - (now - user.lastWork);
            const minutes = Math.ceil(remaining / 60000);

            return interaction.reply({
                content: `🕒 You're too tired to work. Come back in **${minutes} minutes**.`,
                ephemeral: false
            });
        }

        const payout = Math.floor(Math.random() * 91) + 10;
        const job = jobs[Math.floor(Math.random() * jobs.length)];

        user.lastWork = now;
        await user.save();

        await addWallet(userId, payout);

        return interaction.reply({
            content: `💼 ${job}\n\nYou earned **${payout} Twinkies**.`
        });
    }
};