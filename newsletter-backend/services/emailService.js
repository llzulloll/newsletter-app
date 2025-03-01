const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendNewsletter(email, summarizedNews) {
    const htmlContent = summarizedNews.map(article =>
        `<h2>${article.title}</h2><p>${article.summary}</p><a href="${article.url}">Read more</a>`
    ).join("<br>");

    const msg = {
        to: email,
        from: "your-email@example.com",
        subject: "📰 Your Daily News Summary",
        html: `<div style="font-family: Arial, sans-serif;">${htmlContent}</div>`,
    };

    try {
        await sgMail.send(msg);
        console.log(`✅ Email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Error sending email to ${email}:`, error);
    }
}

module.exports = { sendNewsletter };