const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    categories: [String], // Example: ["technology", "business", "sports"]
    frequency: { type: String, enum: ["daily", "weekly"], required: true },
});

module.exports = mongoose.model("User", userSchema);