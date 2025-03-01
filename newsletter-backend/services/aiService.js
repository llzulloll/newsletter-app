const axios = require("axios");

async function summarizeText(text) {
    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText",
            {
                prompt: {
                    text: `Summarize this news article in a short, concise paragraph:\n\n${text}`
                }
            },
            {
                headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` }
            }
        );

        return response.data.candidates?.[0]?.output || "Summary not available.";
    } catch (error) {
        console.error("❌ Error summarizing text:", error);
        return "Summary not available.";
    }
}

module.exports = { summarizeText };