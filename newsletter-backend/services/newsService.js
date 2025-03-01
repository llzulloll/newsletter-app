const axios = require("axios");

const categories = ["business", "tech", "sports", "entertainment", "science", "general", "health", "food", "travel", "politics"]; // Categories to fetch top stories for

async function fetchTopStoriesByCategory() {
    try {
        const results = {};

        for (const category of categories) {
            const url = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.NEWS_API_KEY}&language=en&categories=${category}&limit=3`;

            const response = await axios.get(url);

            if (response.status !== 200) {
                console.warn(`⚠️ TheNewsAPI Warning: ${response.data.message}`);
                results[category] = [];
                continue;
            }

            results[category] = response.data.data || []; // Store top 3 articles for each category
        }

        return results; // Return an object with categories as keys
    } catch (error) {
        console.error(`❌ Error fetching top stories:`, error.message);
        return {};
    }
}

module.exports = { fetchTopStoriesByCategory };