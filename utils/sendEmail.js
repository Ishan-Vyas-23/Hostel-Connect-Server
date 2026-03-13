const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, text) {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Email sent:", response);
  } catch (err) {
    console.error("Resend error:", err);

    throw new Error("Email sending failed");
  }
}

module.exports = sendEmail;
