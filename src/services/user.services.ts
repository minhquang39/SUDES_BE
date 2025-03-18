import dotenv from "dotenv";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken"; // Xóa dòng này
import User from "../models/user.model";
import { ErrorCode } from "../utils/errorCodes";

// Sử dụng require thay vì import

const jwt = require("jsonwebtoken");

// Đảm bảo dotenv được load
dotenv.config();

const createUser = async (data: any) => {
  const { email, first_name, last_name, phone, password } = data;

  if (!email || !first_name || !phone || !last_name || !password) {
    throw {
      code: ErrorCode.MISSING_FIELDS,
      message: "All fields are required",
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw { code: ErrorCode.INVALID_EMAIL, message: "Invalid email format" };
  }

  // Validate password strength
  if (password.length < 8) {
    throw {
      code: ErrorCode.INVALID_PASSWORD,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw {
      code: ErrorCode.INVALID_PASSWORD,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    };
  }

  // Validate phone number format (basic validation)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    throw {
      code: ErrorCode.INVALID_PHONE,
      message: "Invalid phone number format",
    };
  }

  const userExist = await User.findOne({ email });
  if (userExist && userExist.email_verified) {
    throw { code: ErrorCode.USER_EXISTS, message: "User already exists" };
  }

  if (userExist && !userExist.email_verified) {
    throw {
      code: ErrorCode.USER_NOT_VERIFIED,
      message: "User is not verified",
    };
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      first_name,
      last_name,
      password: hashPassword,
      email_verified: false,
    });
    return await user.save();
  } catch (error) {
    throw { code: ErrorCode.SERVER_ERROR, message: "Failed to create user" };
  }
};

const loginUser = async (data: any) => {
  const { email, password } = data;
  const user = await User.findOne({ email });

  if (!user) {
    throw { code: ErrorCode.USER_NOT_FOUND, message: "User not found" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw {
      code: ErrorCode.INVALID_PASSWORD,
      message: "Password is incorrect",
    };
  }
  if (!user.email_verified) {
    throw {
      code: ErrorCode.USER_NOT_VERIFIED,
      message: "Please verify your email first",
    };
  }

  // Cập nhật last_active
  user.last_active = new Date();
  await user.save();

  const secret: string = process.env.JWT_SECRET || "fallback_secret";
  const expires = parseInt(process.env.JWT_EXPIRE || "3600", 10);
  const payload: any = { userId: user._id.toString(), email: user.email };

  try {
    const token = jwt.sign(payload, secret, { expiresIn: expires });

    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  } catch (error) {
    console.error("JWT Sign Error:", error);
    throw {
      code: ErrorCode.TOKEN_GENERATION_FAILED,
      message: "Failed to generate token",
    };
  }
};

const changePassword = async (data: any) => {
  const { email, oldPassword, newPassword } = data;

  // Tìm user theo email
  const user = await User.findOne({ email });
  if (!user) {
    throw { code: ErrorCode.USER_NOT_FOUND, message: "User not found" };
  }

  // Xác thực mật khẩu cũ
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw {
      code: ErrorCode.INVALID_PASSWORD,
      message: "Current password is incorrect",
    };
  }

  // Kiểm tra mật khẩu mới
  if (!newPassword || newPassword.length < 8) {
    throw {
      code: ErrorCode.INVALID_PASSWORD,
      message: "New password must be at least 8 characters",
    };
  }

  // Kiểm tra mật khẩu mới không giống mật khẩu cũ
  if (oldPassword === newPassword) {
    throw {
      code: ErrorCode.INVALID_PASSWORD,
      message: "New password must be different from the current password",
    };
  }

  try {
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    throw {
      code: ErrorCode.SERVER_ERROR,
      message: "Failed to change password",
    };
  }
};

export default { createUser, loginUser, changePassword };
