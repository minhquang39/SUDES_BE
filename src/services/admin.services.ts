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

const getAllUsersService = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw { code: ErrorCode.SERVER_ERROR, message: "Server error" };
  }
};

const createUserService = async (data: any) => {
  try {
    const email = data.email || null;
    const existingUser = await User.findOne({ email });
    if (email && existingUser) {
      throw {
        code: ErrorCode.USER_ALREADY_EXISTS,
        message: "User already exists",
      };
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      email: data.email,
      role: data.role || "user",
      password: hashedPassword,
      email_verified: true,
    });
    return user;
  } catch (error: any) {
    if (error.code) throw error;
    throw { code: ErrorCode.SERVER_ERROR, message: "Server error" };
  }
};

const deleteUserService = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw { code: ErrorCode.USER_NOT_FOUND, message: "User not found" };
    }
    if (user.role === "admin") {
      throw { code: ErrorCode.Invalid, message: "Cannot delete admin" };
    }
    await User.findByIdAndDelete(userId);
    return user;
  } catch (error: any) {
    if (error.code) throw error;
    throw { code: ErrorCode.SERVER_ERROR, message: "Server error" };
  }
};

const updateUserService = async (userId: string, data: any) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw { code: ErrorCode.USER_NOT_FOUND, message: "User not found" };
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
    });
    return updatedUser;
  } catch (error: any) {
    if (error.code) throw error;
    throw { code: ErrorCode.SERVER_ERROR, message: "Server error" };
  }
};

export default {
  loginAdminService,
  getAllUsersService,
  createUserService,
  deleteUserService,
  updateUserService,
};
