const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true
    },

    items: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ShopItem"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]

});

module.exports = mongoose.model("Inventory", inventorySchema);