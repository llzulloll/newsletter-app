const axios = require("axios");

async function summarizeText(text) {
    try {
        const response = await axios.post(
            "https://gemini-api-endpoint",
            { text },
            { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
        );
        return response.data.summary;
    } catch (error) {
        console.error("❌ Error summarizing text:", error);
        return "Summary not available.";
    }
}

module.exports = { summarizeText };