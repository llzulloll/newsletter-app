require("dotenv").config();
const { sendNewsEmail } = require("./emailService");

const testEmail = async () => {
    const testArticles = [
        {
            title: "Breaking News: AI Takes Over!",
            description: "AI is advancing at an incredible rate...",
            snippet: "Researchers report that AI models are surpassing human capabilities...",
            url: "https://example.com/article-1",
            imageUrl: "https://example.com/image-1.jpg",
        },
        {
            title: "Stock Market Today",
            description: "Markets are reacting to recent economic policies...",
            snippet: "The S&P 500 saw a significant rise...",
            url: "https://example.com/article-2",
            imageUrl: "https://example.com/image-2.jpg",
        },
    ];

    try {
        await sendNewsEmail("llzulloll@gmail.com", testArticles);
        console.log("✅ Test email sent successfully!");
    } catch (error) {
        console.error("❌ Error sending test email:", error);
    }
};

testEmail();