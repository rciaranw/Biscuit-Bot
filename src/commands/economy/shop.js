const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const EconomyUser = require("../../database/models/EconomyUser");

const {
    logTransaction
} = require("../../economy/ledger/ledgerEngine");

const {
    removeCredit
} = require("../../economy/credit/creditEngine");

/**
 * STATIC SHOP ITEMS (can later move to registry)
 */
const shopItems = [
    {
        id: "phone",
        name: "Smartphone",
        price: 500,
        type: "asset",
        creditImpact: 5
    },
    {
        id: "car",
        name: "Car",
        price: 2500,
        type: "asset",
        creditImpact: 10
    },
    {
        id: "house",
        name: "House",
        price: 15000,
        type: "asset",
        creditImpact: 25
    },
    {
        id: "credit_card",
        name: "Credit Card",
        price: 0,
        type: "financial",
        creditImpact: 10
    },
    {
        id: "insurance",
        name: "Insurance Plan",
        price: 200,
        type: "financial",
        creditImpact: 5
    }
];

function getItem(id) {
    return shopItems.find(i => i.id === id);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("View or buy shop items")
        .addStringOption(opt =>
            opt.setName("buy")
                .setDescription("Item ID to purchase")
                .setRequired(false)
        ),

    async execute(interaction) {

        const itemId = interaction.options.getString("buy");

        const user = await EconomyUser.findOne({
            userId: interaction.user.id
        });

        if (!user) {
            return interaction.reply({
                content: "No economy profile found.",
                ephemeral: false
            });
        }

        // =========================
        // VIEW SHOP
        // =========================
        if (!itemId) {

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle("🛒 Bank of Biscuit Shop")
                .setDescription(
                    shopItems.map(i =>
                        `**${i.name}**  
ID: \`${i.id}\`  
Price: ${i.price} Twinkies`
                    ).join("\n\n")
                )
                .setFooter({
                    text: "Use /shop buy:<itemId> to purchase"
                });

            return interaction.reply({
                embeds: [embed]
            });
        }

        // =========================
        // BUY ITEM
        // =========================
        const item = getItem(itemId);

        if (!item) {
            return interaction.reply({
                content: "❌ Item not found.",
                ephemeral: false
            });
        }

        if ((user.wallet || 0) < item.price) {
            return interaction.reply({
                content: "❌ Insufficient funds.",
                ephemeral: false
            });
        }

        // =========================
        // DEDUCT MONEY
        // =========================
        user.wallet -= item.price;

        // =========================
        // ADD ASSET
        // =========================
        if (!user.assets) user.assets = [];
        if (item.type === "asset") {
            user.assets.push(item.id);
        }

        // =========================
        // CREDIT IMPACT
        // =========================
        if (item.creditImpact > 0) {
            removeCredit(user, item.creditImpact, `Purchased ${item.name}`);
        }

        // =========================
        // LEDGER ENTRY
        // =========================
        logTransaction(user, {
            type: "SHOP_PURCHASE",
            amount: -item.price,
            balanceAfter: user.wallet,
            source: "SHOP",
            meta: {
                item: item.name,
                itemId: item.id
            }
        });

        await user.save();

        // =========================
        // RESPONSE
        // =========================
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0xe67e22)
                    .setTitle("🛒 Purchase Complete")
                    .setDescription(`You bought **${item.name}**`)
                    .addFields(
                        {
                            name: "Price",
                            value: `${item.price} Twinkies`,
                            inline: true
                        },
                        {
                            name: "Credit Impact",
                            value: `${item.creditImpact}`,
                            inline: true
                        }
                    )
            ]
        });
    }
};