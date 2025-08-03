import { Request, Response } from "express";
import OTP from "../models/otp.model";
import User from "../models/user.model";
import transporter from "../config/email.config";
import { ErrorCode } from "../utils/errorCodes";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: `SUDES<${process.env.SUB_EMAIL_USERNAME}>`,
    to: email,
    subject: "SUDES - Yến Sào Khánh Hoà Cao Cấp",
    html: `
      <h1>Your OTP Code</h1>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        code: ErrorCode.EMAIL_REQUIRED,
        message: "Email is required",
      });
    }

    const otp = generateOTP();

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
    });

    await sendEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      code: ErrorCode.EMAIL_SEND_FAILED,
      message: "Failed to send OTP",
    });
  }
};

const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        code: ErrorCode.EMAIL_REQUIRED,
        message: "Email is required",
      });
    }

    await OTP.deleteMany({ email });

    const otp = generateOTP();

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
    });

    await sendEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      code: ErrorCode.EMAIL_SEND_FAILED,
      message: "Failed to resend OTP",
    });
  }
};

const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        code: ErrorCode.OTP_REQUIRED,
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await OTP.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        code: ErrorCode.OTP_INVALID,
        message: "Invalid or expired OTP",
      });
    }

    await User.findOneAndUpdate({ email }, { email_verified: true });

    await OTP.deleteMany({ email });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      code: ErrorCode.SERVER_ERROR,
      message: "Failed to verify OTP",
    });
  }
};

export default { sendOTP, resendOTP, verifyOTP, generateOTP, sendEmail };
