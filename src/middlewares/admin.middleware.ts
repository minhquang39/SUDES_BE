import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
      return; // Thêm return để ngăn thực thi code tiếp theo
    }

    const token = authHeader.split(" ")[1];

    // Xác thực token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    ) as { userId: string; email: string; role: string };
    if (decoded.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Forbidden: User is not an admin",
      });
      return;
    }
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
    return; // Thêm return để đả
  }
};
export default adminMiddleware;
