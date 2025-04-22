import express, { RequestHandler } from "express";
import userController from "../controllers/user.controllers";
import otpController from "../controllers/otp.controllers";
import authMiddleware from "../middlewares/auth.middleware";
import addressController from "../controllers/address.controllers";
import upload from "../middlewares/multer.middleware";

const userRoute = express.Router();

// OTP routes
userRoute.post("/send-otp", otpController.sendOTP as RequestHandler);
userRoute.post("/verify-otp", otpController.verifyOTP as RequestHandler);
userRoute.post("/resend-otp", otpController.resendOTP as RequestHandler);

// Auth routes
userRoute.post("/register", userController.registerAccount as RequestHandler);
userRoute.post("/login", userController.loginAccount as RequestHandler);
userRoute.post(
  "/change-password",
  authMiddleware as RequestHandler,
  userController.changePassword as RequestHandler
);
userRoute.put(
  "/update-info",
  authMiddleware as RequestHandler,
  userController.changeInfo as RequestHandler
);
userRoute.put(
  "/update-avatar",
  authMiddleware as RequestHandler,
  upload.single("avatar"),
  userController.updateAvatar as RequestHandler
);

// Get user info (protected route)
userRoute.get(
  "/me",
  authMiddleware as RequestHandler,
  userController.getUserInfo as RequestHandler
);

userRoute.post(
  "/forgot-password",
  userController.forgotPassword as RequestHandler
);

userRoute.post(
  "/reset-password",
  userController.resetPassword as RequestHandler
);

// Address Route
userRoute.get("/address", authMiddleware, addressController.getAddress);
userRoute.post("/address", authMiddleware, addressController.createAddress);
userRoute.delete(
  "/address/:id",
  authMiddleware,
  addressController.deleteAddress
);
userRoute.put("/address/:id", authMiddleware, addressController.updateAddress);

export default userRoute;
