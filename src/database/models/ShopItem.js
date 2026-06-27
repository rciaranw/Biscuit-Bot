const mongoose = require("mongoose");

const shopItemSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        default: "No description provided."
    },

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        default: -1
    },

    status: {
        type: String,
        enum: ["available", "disabled"],
        default: "available"
    },

    usable: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("ShopItem", shopItemSchema);