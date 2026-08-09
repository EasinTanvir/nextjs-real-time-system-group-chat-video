const nodemailer = require("nodemailer");
const { SMTP_USER, SMTP_PASS } = require("../config/env");
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOptions = {
    from: SMTP_USER,
    to,
    subject,
    text: text || "",
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log(`Email sent to ${to}: ${info.messageId}`);

  return {
    success: true,
    messageId: info.messageId,
  };
};

module.exports = {
  emailSendHandler: async (email) => {
    const verifyUrl = `${FRONTEND_ORIGIN}/`;

    return sendEmail({
      to: email,
      subject: "Verify your email - GetProLit",
      html: `
        <h3>Welcome to GetProLit 🎉</h3>

        <p>Please verify your email by clicking the link below:</p>

        <a href="${verifyUrl}"
           style="
             background-color:#4a90e2;
             color:#fff;
             padding:10px 15px;
             text-decoration:none;
             border-radius:5px;
           ">
          Verify Email
        </a>

        <p>This link will expire in 3 minutes.</p>
      `,
    });
  },

  verifyEmailSendHandler: async (email, otp) => {
    return sendEmail({
      to: email,
      subject: "Your login verification code",
      html: `
        <h2>Your OTP: ${otp}</h2>
        <p>Valid for 2 minutes</p>
      `,
    });
  },
};
