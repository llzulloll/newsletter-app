const mongoose = require("mongoose");
const cron = require("node-cron");
const User = require("../models/User");
const { fetchTopStoriesByCategory } = require("../services/newsService");
const { summarizeText } = require("../services/aiService");
const { sendNewsletter } = require("../services/emailService");
const { processNewsletter } = require("../scripts/cronJob");

jest.mock("mongoose", () => ({
    connect: jest.fn(() => Promise.resolve()),
    connection: { readyState: 1 },
}));

jest.mock("../models/User", () => ({
    find: jest.fn(),
}));

jest.mock("../services/newsService", () => ({
    fetchTopStoriesByCategory: jest.fn(() => Promise.resolve([
        {
            title: "Sample News Title",
            url: "https://example.com/news",
            image_url: "https://example.com/image.jpg",
        },
    ])),
}));

jest.mock("../services/aiService", () => ({
    summarizeText: jest.fn(() => Promise.resolve({
        candidates: [{ content: { parts: [{ text: "Summarized news content." }] } }],
    })),
}));

jest.mock("../services/emailService", () => ({
    sendNewsletter: jest.fn(() => Promise.resolve()),
}));

describe("CronJobManager", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should process users and send newsletters correctly", async () => {
        User.find.mockResolvedValue([{ email: "test@example.com", categories: ["business"] }]);

        await processNewsletter("daily");

        expect(User.find).toHaveBeenCalledWith({ frequency: "daily" });
        expect(fetchTopStoriesByCategory).toHaveBeenCalledWith("business");
        expect(summarizeText).toHaveBeenCalled();
        expect(sendNewsletter).toHaveBeenCalledWith("test@example.com", expect.any(Array));
    });

    test("should log warning when no users are found", async () => {
        User.find.mockResolvedValue([]);

        console.log = jest.fn();
        await processNewsletter("weekly");

        expect(console.log).toHaveBeenCalledWith("⚠️ No weekly users to send newsletters to.");
    });

    test("should handle errors gracefully", async () => {
        User.find.mockRejectedValue(new Error("Database error"));

        console.error = jest.fn();
        await processNewsletter("daily");

        expect(console.error).toHaveBeenCalledWith("❌ Error running daily newsletter job:", "Database error");
    });
});