const axios = require("axios");

async function fetchNews(category) {
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${process.env.NEWS_API_KEY}`;
    const response = await axios.get(url);
    return response.data.articles.slice(0, 5); // Get top 5 articles
}

module.exports = { fetchNews };