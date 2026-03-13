const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, text) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent to:", to);
  } catch (err) {
    console.error("SendGrid error:", err.response?.body || err.message);
  }
}

module.exports = sendEmail;
