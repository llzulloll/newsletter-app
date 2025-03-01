const axios = require("axios");

async function fetchTopStories() {
    try {
        const url = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.NEWS_API_KEY}&language=en&limit=3`;

        const response = await axios.get(url);

        if (response.status !== 200) {
            throw new Error(`TheNewsAPI Error: ${response.data.message}`);
        }

        return response.data.data; // Return top 3 stories
    } catch (error) {
        console.error(`❌ Error fetching top stories:`, error.message);
        return [];
    }
}

module.exports = { fetchTopStories };