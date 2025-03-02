const sgMail = require("@sendgrid/mail");
const { fetchTopStoriesByCategory } = require("./newsService");
const { summarizeArticle } = require("./aiService");
const User = require("../models/User");

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

        // 5️⃣ Build the email content with NuBrief branding
        let newsletter = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                
                <!-- NuBrief Logo & Branding -->
                <div style="text-align: center; padding-bottom: 15px;">
                </div>

                <hr style="border: 1px solid #ddd; margin: 20px 0;">
        `;

        for (const [category, articles] of Object.entries(filteredArticles)) {
            newsletter += `
                <h2 style="font-size: 20px; color: #007bff; text-transform: capitalize;">${category}</h2>
            `;

            for (const [index, article] of articles.entries()) {
                // ✅ Extract summary TEXT from `summarizeArticle`
                const summaryObj = await summarizeArticle(article);
                const summary = summaryObj.summary || "Summary not available."; // Extract text

                // ✅ Use the correct `image_url` key from API response
                const imageUrl = article.image_url && article.image_url.startsWith("http")
                    ? article.image_url
                    : "https://via.placeholder.com/600x300?text=No+Image+Available"; // Fallback image

                newsletter += `
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <h3 style="font-size: 18px; color: #333; margin: 10px 0;">${index + 1}. ${article.title}</h3>
                        <img src="${imageUrl}" alt="News Image" style="width:100%; max-width:600px; border-radius:5px; display:block; margin: 10px auto;">
                        <p style="font-size: 16px; color: #555;">${summary}</p>
                        <a href="${article.url}" 
                           style="display: inline-block; text-decoration: none; background: #007bff; color: white; padding: 8px 15px; border-radius: 5px; font-size: 14px; margin-top: 10px;">
                            Read More
                        </a>
                    </div>
                `;
            }
        }

        newsletter += `
            <hr style="border: 1px solid #ddd; margin: 20px 0;">
            <p style="text-align: center; font-size: 14px; color: #888;">
                Thank you for subscribing to <strong>NuBrief</strong>! 🎉 Stay informed with the latest news.
            </p>

            <!-- Manage Preferences & Unsubscribe -->
            <div style="text-align: center; margin-top: 20px;">
                <a href="http://localhost:3000/unsubscribe" 
                   style="text-decoration: none; background: #d9534f; color: white; padding: 10px 20px; border-radius: 5px; font-size: 14px;">
                    Manage Preferences
                </a>
                <p style="margin-top: 10px; font-size: 12px; color: #aaa;">If you no longer wish to receive these emails, you can <a href="http://localhost:3000/unsubscribe" style="color: #d9534f;">unsubscribe here</a>.</p>
            </div>
        </div>
        `;

        // 6️⃣ Send the email
        const msg = {
            to: email,
            from: "news@nubrief.co",
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