import { useState } from "react";
import { useRouter } from "next/router";

export default function LandingPage() {
    const [email, setEmail] = useState("");
    const [categories, setCategories] = useState([]);
    const [frequency, setFrequency] = useState("daily");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const allCategories = ["business", "tech", "sports", "entertainment", "science", "general", "health", "food", "travel", "politics"];
    ;

    const handleCategoryChange = (category) => {
        setCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || categories.length === 0) {
            setMessage("❌ Please enter an email and select at least one category.");
            return;
        }

        const response = await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, categories, frequency }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage("✅ Successfully subscribed!");
            setEmail("");
            setCategories([]);
            setFrequency("daily");
        } else {
            setMessage(`❌ Error: ${data.error}`);
        }
    };

    return (
        <div style={styles.container}>
            <h1>📨 Welcome to News Digest!</h1>
            <p>Stay updated with curated news delivered straight to your inbox.</p>

            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>Email:</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <label style={styles.label}>News Categories:</label>
                <div style={styles.checkboxContainer}>
                    {allCategories.map((category) => (
                        <label key={category} style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                value={category}
                                checked={categories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            {" "}{category}
                        </label>
                    ))}
                </div>

                <label style={styles.label}>News Frequency:</label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={styles.input}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select>

                <button type="submit" style={styles.button}>Subscribe</button>
            </form>

            {message && <p style={{ marginTop: "10px", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}

            <div style={{ marginTop: "20px" }}>
                <a href="/unsubscribe" style={styles.unsubscribeLink}>❌ Unsubscribe</a>
            </div>
        </div>
    );
}

// Inline styles
const styles = {
    container: {
        maxWidth: "500px",
        margin: "50px auto",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    },
    form: {
        textAlign: "left",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
    },
    label: {
        fontWeight: "bold",
        display: "block",
        marginBottom: "5px",
    },
    input: {
        width: "100%",
        padding: "8px",
        marginBottom: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
    },
    checkboxContainer: {
        display: "flex",
        flexWrap: "wrap",
        marginBottom: "10px",
    },
    checkboxLabel: {
        marginRight: "10px",
        fontSize: "14px",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    unsubscribeLink: {
        color: "#dc3545",
        fontWeight: "bold",
        textDecoration: "none",
    }
};