import { Request, Response, NextFunction } from "express";

import dotenv from "dotenv";

const jwt = require("jsonwebtoken");

dotenv.config();

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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    ) as { userId: string; email: string };

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
    return; 
  }
};

export default authMiddleware;
