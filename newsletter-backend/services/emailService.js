const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendConfirmationEmail(email, categories, frequency) {
    const categoryList = categories.map(cat => `<li>${cat}</li>`).join("");

    const unsubscribeLink = `http://localhost:3000/unsubscribe?email=${encodeURIComponent(email)}`;

    const msg = {
        to: email,
        from: "your-email@example.com", // Replace with your verified SendGrid sender email
        subject: "🎉 Welcome to News Digest - Your Subscription is Active!",
        html: `
            <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; text-align: center;">
                <h1 style="color: #007bff;">📨 Welcome to News Digest!</h1>
                <p style="font-size: 16px; color: #333;">You've successfully subscribed to receive curated news updates.</p>

                <div style="background: #ffffff; padding: 15px; border-radius: 10px; margin-top: 20px; text-align: left;">
                    <h3 style="color: #007bff;">Your Subscription Details:</h3>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>News Categories:</strong></p>
                    <ul style="list-style-type: none; padding: 0; color: #555;">${categoryList}</ul>
                    <p><strong>Delivery Frequency:</strong> ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}</p>
                </div>

                <p style="margin-top: 20px; font-size: 14px; color: #555;">We hope you enjoy staying informed with top stories tailored to your interests! 🚀</p>

                <a href="${unsubscribeLink}" 
                   style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #dc3545; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px;">
                   ❌ Unsubscribe
                </a>

                <p style="margin-top: 10px; font-size: 12px; color: gray;">If you did not sign up for this, you can ignore this email.</p>
            </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log(`✅ Confirmation email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Error sending confirmation email to ${email}:`, error);
    }
}

module.exports = { sendConfirmationEmail };