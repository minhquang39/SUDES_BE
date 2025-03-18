import { Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
// import jwt from "jsonwebtoken"; // Xóa dòng này

// Sử dụng require thay vì import
const jwt = require("jsonwebtoken");

// Đảm bảo dotenv được load
dotenv.config();

// Khai báo kiểu dữ liệu cho Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
      return; // Thêm return để ngăn thực thi code tiếp theo
    }

    // Tách token từ chuỗi "Bearer [token]"
    const token = authHeader.split(" ")[1];

    // Xác thực token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    ) as { userId: string; email: string };

    // Thêm thông tin người dùng vào request
    // Cách tiêu chuẩn là thêm vào req.user, không phải req.body.user
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
    return; // Thêm return để đảm bảo hàm kết thúc
  }
};

export default authMiddleware;
