const mongoose = require("mongoose");

const shopItemSchema = new mongoose.Schema({

    itemId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        default: -1 // -1 = infinite
    },

    usable: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("ShopItem", shopItemSchema);