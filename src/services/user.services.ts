import dotenv from "dotenv";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken"; // Xóa dòng này
import User from "../models/user.model";

// Sử dụng require thay vì import

const jwt = require("jsonwebtoken");

// Đảm bảo dotenv được load
dotenv.config();

const createUser = async (data: any) => {
  const { email, first_name, last_name, password } = data;
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw "User already exists";
  }
  if (!email || !first_name || !last_name || !password) {
    throw "All fields are required";
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      first_name,
      last_name,
      password: hashPassword,
    });
    return await user.save();
  } catch (error) {
    throw error;
  }
};

const loginUser = async (data: any) => {
  const { email, password } = data;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User info is incorrect");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("User info is incorrect");
  } else {
    // Cập nhật last_active
    user.last_active = new Date();
    await user.save();

    // Sử dụng hardcoded secret nếu biến môi trường không tồn tại
    // Chỉ định rõ kiểu dữ liệu là string
    const secret: string = process.env.JWT_SECRET || "fallback_secret";

    // Sử dụng hardcoded expires nếu biến môi trường không tồn tại
    const expires: string = process.env.JWT_EXPIRES || "1d";
    const payload: any = { userId: user._id.toString(), email: user.email };

    try {
      // Chỉ định rõ kiểu dữ liệu cho các tham số
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
      throw new Error("Failed to generate token");
    }
  }
};

export default { createUser, loginUser };
