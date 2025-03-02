const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { sendConfirmationEmail, sendNewsletter } = require("../services/emailService");

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

        // Send newsletter immediately after signup
        try {
            await sendNewsletter(email);
            console.log(`✅ Welcome newsletter sent to ${email}`);
        } catch (newsletterError) {
            console.error("❌ Error sending welcome newsletter:", newsletterError);
        }

        res.json({ message: "✅ Subscription updated successfully. A welcome newsletter has been sent!" });
    } catch (error) {
        console.error("❌ Error subscribing user:", error);
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

router.post("/sendNewsletter", async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Email not found. Please subscribe first." });
        }

        // Send newsletter email
        await sendNewsletter(email);
        res.json({ message: `✅ Newsletter sent to ${email}` });
    } catch (error) {
        console.error("❌ Error sending newsletter:", error);
        res.status(500).json({ error: "Failed to send newsletter." });
    }
});


const { fetchTopStoriesByCategory } = require("../services/newsService");

router.get("/top-stories", async (req, res) => {
    try {
        const articlesByCategory = await fetchTopStoriesByCategory();
        res.json({ articlesByCategory });
    } catch (error) {
        console.error("❌ Error fetching top stories by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


const { summarizeText } = require("../services/aiService");

router.post("/summarize", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Text is required" });

        const summary = await summarizeText(text);
        res.json({ summary });
    } catch (error) {
        console.error("❌ Error summarizing text:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;