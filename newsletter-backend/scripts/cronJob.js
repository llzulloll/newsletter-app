const cron = require("node-cron");
const User = require("../models/User");
const { fetchNews } = require("../services/newsService");
const { summarizeText } = require("../services/aiService");
const { sendNewsletter } = require("../services/emailService");

cron.schedule("0 9 * * *", async () => { // Runs daily at 9 AM
    console.log("⏳ Running daily email job...");
    const users = await User.find({ frequency: "daily" });

    for (const user of users) {
        let newsSummaries = [];
        for (const category of user.categories) {
            const articles = await fetchNews(category);
            for (const article of articles) {
                const summary = await summarizeText(article.content || article.description);
                newsSummaries.push({ title: article.title, summary, url: article.url });
            }
        }
        await sendNewsletter(user.email, newsSummaries);
    }
});