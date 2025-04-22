import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ErrorCode } from "../utils/errorCodes";
const loginAdminService = async (email: string, password: string) => {
  try {
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      throw { code: ErrorCode.USER_NOT_FOUND, message: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw { code: ErrorCode.INVALID_PASSWORD, message: "Invalid password" };
    }

    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );
    return {
      token,
      user: {
        email: admin.email,
        name: admin.first_name + " " + admin.last_name,
        role: admin.role,
      },
    };
  } catch (error) {
    throw { code: ErrorCode.SERVER_ERROR, message: "Server error" };
  }
};

export default { loginAdminService };
