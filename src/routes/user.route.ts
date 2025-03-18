import express, { RequestHandler } from "express";
import userController from "../controllers/user.controllers";
import otpController from "../controllers/otp.controllers";
import authMiddleware from "../middlewares/auth.middleware";
import otpMiddleware from "../middlewares/otp.middleware";
const userRoute = express.Router();

// OTP routes
userRoute.post("/send-otp", otpController.sendOTP as RequestHandler);
userRoute.post("/verify-otp", otpController.verifyOTP as RequestHandler);
userRoute.post("/resend-otp", otpController.resendOTP as RequestHandler);

// Auth routes
userRoute.post("/register", userController.registerAccount as RequestHandler);
userRoute.post("/login", userController.loginAccount as RequestHandler);
userRoute.post(
  "/changepassword",
  authMiddleware as RequestHandler,
  userController.changePassword as RequestHandler
);
userRoute.post(
  "/uploadinfo",
  authMiddleware as RequestHandler,
  userController.uploadInfo as RequestHandler
);

export default userRoute;
