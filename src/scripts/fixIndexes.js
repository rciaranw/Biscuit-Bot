const mongoose = require("mongoose");
const config = require("../utils/config");

async function run() {

    await mongoose.connect(config.mongoUri);

    console.log("CONNECTED TO MONGO DB.");

    const db = mongoose.connection.db;

    await db.collection("shopitems").dropIndexes();
    console.log("Dropped shopitems indexes.");

    await db.collection("inventories").dropIndexes();
    console.log("Droped inventories indexes.");

    await mongoose.disconnect();
    console.log("Done. Restart bot now.");
}

run().catch(console.error);