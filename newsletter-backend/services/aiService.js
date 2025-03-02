const axios = require("axios");

async function summarizeArticle(article) {
    const { title, description, snippet, url } = article;
    const fullText = `${title}\n\n${description}\n\n${snippet}`;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            { text: `Summarize this news article in a concise yet comprehensive paragraph, keeping the content intact. Make around 200 words:\n\n${fullText}` }
                        ]
                    }
                ]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        // ✅ Extract the text from Gemini’s response
        const summary =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Summary not available.";

        return {
            title,
            summary, // Now correctly formatted
            url
        };
    } catch (error) {
        console.error("❌ Error summarizing article:", error);
        return {
            title,
            summary: "Summary not available.",
            url
        };
    }
}

module.exports = { summarizeArticle };