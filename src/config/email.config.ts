const nodemailer = require("nodemailer");
import dotenv from "dotenv";
dotenv.config();

// Cấu hình SendGrid
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // should be set to true in production
  },
});

export default transporter;
