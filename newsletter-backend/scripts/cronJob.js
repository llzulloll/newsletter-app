require("dotenv").config();
const mongoose = require("mongoose");
const cron = require("node-cron");
const User = require("../models/User");
const { fetchTopStoriesByCategory } = require("../services/newsService");
const { summarizeText } = require("../services/aiService");
const { sendNewsletter } = require("../services/emailService");

async function ensureDBConnection() {
    if (!process.env.MONGO_URI) {
        throw new Error("❌ MONGO_URI is missing. Please check your .env file.");
    }

    if (mongoose.connection.readyState === 0) {
        console.log("🔄 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB.");
    }
}

async function processNewsletter(frequency) {
    console.log(`⏳ Running ${frequency} scheduled newsletter job...`);

    try {
        await ensureDBConnection();

        if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_API_KEY.startsWith("SG.")) {
            throw new Error("❌ SENDGRID_API_KEY is invalid or missing.");
        }

        const users = await User.find({ frequency });

        if (!users.length) {
            console.log(`⚠️ No ${frequency} users to send newsletters to.`);
            return;
        }

        for (const user of users) {
            const { email, categories } = user;
            let articles = [];

            for (const category of categories) {
                try {
                    const newsData = await fetchTopStoriesByCategory(category);

                    // Log API response to debug issues
                    console.log(`📰 Fetched news for ${category}:`, newsData);

                    if (!newsData || !Array.isArray(newsData) || newsData.length === 0) {
                        console.warn(`⚠️ No valid articles found for category: ${category}`);
                        continue;
                    }

                    for (const article of newsData) {
                        try {
                            const summaryObj = await summarizeText(article);
                            const summaryText = summaryObj?.candidates?.[0]?.content?.parts?.[0]?.text || "Summary not available.";

                            articles.push({
                                title: article.title,
                                summary: summaryText,
                                url: article.url,
                                image_url: article.image_url || "",
                            });
                        } catch (err) {
                            console.error(`❌ Error summarizing article: ${article.title}`, err);
                        }
                    }
                } catch (err) {
                    console.error(`❌ Error fetching news for category: ${category}`, err);
                }
            }

            if (articles.length > 0) {
                await sendNewsletter(email, articles);
                console.log(`✅ Newsletter sent to ${email}`);
            } else {
                console.log(`⚠️ No articles found for ${email}. Skipping email.`);
            }
        }

        console.log(`✅ ${frequency} newsletter job completed successfully.`);
    } catch (error) {
        console.error(`❌ Error running ${frequency} newsletter job:`, error.message);
    }
}

function startCronJobs() {
    console.log("📅 Scheduling newsletter jobs: Daily at 9 AM & Weekly on Sundays at 9 AM");

    cron.schedule("0 9 * * *", async () => {
        await processNewsletter("daily");
    });

    cron.schedule("0 9 * * 0", async () => {
        await processNewsletter("weekly");
    });
}

module.exports = { startCronJobs, processNewsletter };