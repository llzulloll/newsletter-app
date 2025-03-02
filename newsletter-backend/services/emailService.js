const sgMail = require("@sendgrid/mail");
const { fetchTopStoriesByCategory } = require("./newsService");
const { summarizeArticle } = require("./aiService");
const User = require("../models/User"); // Fetch users from MongoDB

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendNewsletter(email) {
    try {
        // 1️⃣ Fetch user from MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            console.error(`❌ No user found for email: ${email}`);
            throw new Error("User not found.");
        }

        // 2️⃣ Ensure user has valid categories subscribed
        const userCategories = user.categories || [];
        if (userCategories.length === 0) {
            console.log(`⚠️ User ${email} has no selected categories.`);
            return;
        }

        // 3️⃣ Fetch latest news articles
        const articlesByCategory = await fetchTopStoriesByCategory();

        // 4️⃣ Filter articles based on user preferences
        const filteredArticles = {};
        userCategories.forEach(category => {
            if (articlesByCategory[category]) {
                filteredArticles[category] = articlesByCategory[category];
            }
        });

        if (Object.keys(filteredArticles).length === 0) {
            console.log(`⚠️ No matching articles found for ${email}'s preferences.`);
            return;
        }

        // 5️⃣ Build the email content
        let newsletter = `
            <h1 style="font-size:24px; color:#333;">🗞️ Your Personalized News Digest</h1>
            <p style="font-size:16px; color:#555;">Here are today's top stories from your chosen categories:</p>
        `;

        for (const [category, articles] of Object.entries(filteredArticles)) {
            newsletter += `<h2 style="font-size:20px; color:#007bff;">${category.toUpperCase()}</h2>`;

            for (const [index, article] of articles.entries()) {
                // ✅ Fix: Extract summary TEXT from `summarizeArticle`
                const summaryObj = await summarizeArticle(article);
                const summary = summaryObj.summary || "Summary not available."; // Extract text

                // ✅ Fix: Use the correct `image_url` key from API response
                const imageUrl = article.image_url && article.image_url.startsWith("http")
                    ? article.image_url
                    : "https://via.placeholder.com/600x300?text=No+Image+Available"; // Fallback image

                console.log(`🔹 Image URL for article: ${imageUrl}`);

                newsletter += `
                    <div style="margin-bottom: 20px;">
                        <h3 style="font-size:18px; color:#333;">${index + 1}. ${article.title}</h3>
                        <img src="${imageUrl}" alt="News Image" style="width:100%; max-width:600px; border-radius:5px; display:block; margin: 10px auto;">
                        <p style="font-size:16px; color:#555;">${summary}</p>
                        <a href="${article.url}" style="font-size:14px; color:#007bff;">Read more</a>
                        <hr style="border:1px solid #ddd; margin:20px 0;">
                    </div>
                `;
            }
        }

        newsletter += `
            <p style="font-size:14px; color:#888;">
                Thank you for subscribing! If you wish to change your preferences or unsubscribe, 
                <a href="http://localhost:4000/preferences" style="color:#d9534f;">click here</a>.
            </p>
        `;

        // 6️⃣ Send the email
        const msg = {
            to: email,
            from: "1nishant2002@gmail.com",
            subject: "🗞️ Your Personalized News Digest",
            html: newsletter,
        };

        await sgMail.send(msg);
        console.log(`✅ Newsletter sent to ${email}`);
    } catch (error) {
        console.error(`❌ Error sending newsletter to ${email}:`, error);
        throw new Error("Failed to send newsletter.");
    }
}

module.exports = { sendNewsletter };