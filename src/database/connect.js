const mongoose = require("mongoose");
const config = require("../utils/config");

module.exports = async () => {
    try {
        await mongoose.connect(config.mongoUri);

        console.log("✓ Connected to MongoDB");
    } catch (error) {
        console.error("✗ MongoDB connection failed");
        console.error(error);

        process.exit(1);
    }
};