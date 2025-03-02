import Image from "next/image";
import { useState } from "react";
import Head from "next/head";

export default function LandingPage() {
    const [email, setEmail] = useState("");
    const [categories, setCategories] = useState([]);
    const [frequency, setFrequency] = useState("daily");
    const [message, setMessage] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false); // ✅ New state for confirmation

    const allCategories = ["Business", "Tech", "Sports", "Entertainment", "Science", "General", "Health", "Food", "Travel", "Politics"];

    const handleCategoryChange = (category) => {
        const lowerCaseCategory = category.toLowerCase();
        setCategories(prev =>
            prev.includes(lowerCaseCategory)
                ? prev.filter(c => c !== lowerCaseCategory)
                : [...prev, lowerCaseCategory]
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
            setMessage("");
            setShowConfirmation(true); // ✅ Show confirmation message
            setTimeout(() => setShowConfirmation(false), 3000); // Hide after 3s
            setEmail("");
            setCategories([]);
            setFrequency("daily");
        } else {
            setMessage(`❌ Error: ${data.error}`);
        }
    };

    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Poppins:wght@300;600&family=Raleway:wght@400;700&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
            </Head>

            <div style={styles.container}>
                <div style={styles.header}>
                    <Image src="/logo.png" alt="NuBrief Logo" width={50} height={50} />
                    <h1 style={styles.title}>NuBrief</h1>
                </div>

                <p style={styles.subtitle}>Stay ahead with personalized news delivered straight to your inbox.</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>📩 Your Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        placeholder="Enter your email"
                    />

                    <label style={styles.label}>📑 Select News Categories</label>
                    <div style={styles.checkboxContainer}>
                        {allCategories.map((category) => (
                            <label key={category} style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    value={category}
                                    checked={categories.includes(category.toLowerCase())}
                                    onChange={() => handleCategoryChange(category)}
                                    style={styles.checkbox}
                                />
                                {category}
                            </label>
                        ))}
                    </div>

                    <label style={styles.label}>⏰ Choose Frequency</label>
                    <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={styles.input}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>

                    <button type="submit" style={styles.button}>Subscribe Now</button>
                </form>

                {message && <p style={{ ...styles.message, color: message.includes("✅") ? "#28a745" : "#dc3545" }}>{message}</p>}

                {/* ✅ Subscription Confirmation (Appears for 3s) */}
                {showConfirmation && (
                    <div style={styles.confirmationMessage}>
                        ✅ You’ve successfully subscribed to NuBrief!
                    </div>
                )}

                <div style={styles.footer}>
                    <a href="/unsubscribe" style={styles.unsubscribeLink}>❌ Unsubscribe</a>
                </div>
            </div>
        </>
    );
}

// 🎨 **Final Aesthetic Styles**
const styles = {
    container: {
        margin: "0",
        padding: "0",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #1e3c72, #2a5298, #005aa7)",
        fontFamily: "'Poppins', sans-serif",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "15px",
    },
    title: {
        fontSize: "36px",
        fontWeight: "bold",
        color: "#ffffff",
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: "1px",
    },
    subtitle: {
        fontSize: "18px",
        color: "#ddd",
        marginBottom: "20px",
        textAlign: "center",
        maxWidth: "450px",
    },
    form: {
        width: "100%",
        maxWidth: "450px",
        padding: "30px",
        borderRadius: "15px",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(20px)",
        textAlign: "left",
    },
    label: {
        fontWeight: "bold",
        display: "block",
        marginBottom: "5px",
        color: "#ffffff",
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        textAlign: "center",
    },
    checkboxContainer: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        marginBottom: "15px",
    },
    checkboxLabel: {
        fontSize: "14px",
        background: "rgba(255, 255, 255, 0.2)",
        padding: "8px",
        borderRadius: "8px",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "0.3s ease-in-out",
    },
    checkbox: {
        width: "16px",
        height: "16px",
    },
    button: {
        width: "100%",
        padding: "14px",
        backgroundColor: "#ff6b6b",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "0.3s ease-in-out",
    },
    confirmationMessage: {
        position: "fixed",
        top: "15px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#28a745",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        animation: "fadeOut 3s ease-in-out",
    },
    footer: {
        marginTop: "20px",
    },
    unsubscribeLink: {
        color: "#ffb400",
        fontWeight: "bold",
        textDecoration: "none",
    },
};