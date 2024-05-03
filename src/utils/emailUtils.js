const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "bulk.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

module.exports = {
  sendVerificationEmail: async (email, verificationToken) => {
    const mailOptions = {
      from: "mailtrap@demomailtrap.com",
      to: email,
      subject: "Verification Email",
      text: `Please use the following verification token to verify your email: ${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);
    return verificationToken;
  },
};
