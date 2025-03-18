import { Request, Response, NextFunction } from "express";
import OTP from "../models/otp.model";
import { ErrorCode } from "../utils/errorCodes";

const otpMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        code: ErrorCode.OTP_REQUIRED,
        message: "Email and OTP are required",
      });
    }

    // Tìm OTP trong database
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

    // Xóa OTP đã sử dụng
    await OTP.deleteOne({ _id: otpRecord._id });

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: ErrorCode.SERVER_ERROR,
      message: "Error verifying OTP",
    });
  }
};

export default otpMiddleware;
