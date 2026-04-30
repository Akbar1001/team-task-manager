const mongoose = require("mongoose");

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to Database Successfully");
    } catch (err) {
        console.error("Database Connection Error:", err.message);
        process.exit(1);
    }
}

module.exports = connectToDB;