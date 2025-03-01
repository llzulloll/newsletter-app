export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const response = await fetch("http://localhost:4000/api/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();

        if (response.status === 200) {
            return res.status(200).json({
                message: "You have successfully unsubscribed.",
                resubscribeOptions: {
                    message: "Changed your mind? Click below to resubscribe!",
                    action: "POST",
                    endpoint: "/api/resubscribe",
                    body: { email: req.body.email },
                },
            });
        }

        return res.status(response.status).json(data);
    } catch (error) {
        console.error("Error unsubscribing user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}