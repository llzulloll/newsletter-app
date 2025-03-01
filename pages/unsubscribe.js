import { useState } from "react";

export default function UnsubscribePage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUnsubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Validate email format before sending request
        if (!validateEmail(email)) {
            setMessage("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/unsubscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            // Attempt to parse response
            let data;
            try {
                data = await response.json();
            } catch (error) {
                setMessage("Invalid response from server. Please try again later.");
                return;
            }

            if (response.ok) {
                setMessage("You have been unsubscribed successfully.");
            } else if (response.status === 404) {
                setMessage("Email not found. Did you mean to subscribe instead?");
            } else if (response.status === 400) {
                setMessage("Invalid request. Please check your input and try again.");
            } else {
                setMessage(data.error || "An error occurred. Please try again.");
            }
        } catch (error) {
            setMessage("Failed to connect to the server. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <div style={styles.container}>
            <h1>Unsubscribe</h1>
            <p>Enter your email to unsubscribe from our newsletter.</p>
            <form onSubmit={handleUnsubscribe} style={styles.form}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Processing..." : "Unsubscribe"}
                </button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        width: "100%",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px",
        fontSize: "16px",
        backgroundColor: "#d9534f",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    message: {
        marginTop: "15px",
        fontSize: "14px",
        color: "red",
    },
};