const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Subscribe a user
router.post("/subscribe", async (req, res) => {
    try {
        const { email, categories, frequency } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, categories, frequency });
            await user.save();
        } else {
            user.categories = categories;
            user.frequency = frequency;
            await user.save();
        }

        res.json({ message: "✅ Subscription updated successfully" });
    } catch (error) {
        console.error("❌ Error saving user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Unsubscribe a user (delete from database)
router.post("/unsubscribe", async (req, res) => {
    try {
        const { email } = req.body;
        await User.deleteOne({ email });
        res.json({ message: "✅ Successfully unsubscribed" });
    } catch (error) {
        console.error("❌ Error unsubscribing:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;