import { sendNewsletter } from "../../newsletter-backend/services/emailService";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        await sendNewsletter(email);
        return res.status(200).json({ message: `Newsletter sent to ${email}` });
    } catch (error) {
        console.error("Error sending newsletter:", error);
        return res.status(500).json({ error: "Failed to send newsletter." });
    }
}