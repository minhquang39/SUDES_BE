import express, { RequestHandler } from "express";
import userController from "../controllers/user.controllers";
import otpController from "../controllers/otp.controllers";
import authMiddleware from "../middlewares/auth.middleware";
import addressController from "../controllers/address.controllers";
import upload from "../middlewares/multer.middleware";
import cartController from "../controllers/cart.controllers";
import orderControllers from "../controllers/order.controllers";
import reviewController from "../controllers/review.controllers";

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

// cart rooute
userRoute.get("/cart", authMiddleware, cartController.getCart);
userRoute.post("/cart", authMiddleware, cartController.addToCart);
userRoute.put("/cart", authMiddleware, cartController.updateCart);
userRoute.delete("/cart", authMiddleware, cartController.deleteProductCart);
userRoute.post("/cart/merge", authMiddleware, cartController.mergeCart);

// Order route
userRoute.post("/order", authMiddleware, orderControllers.createOrder);
userRoute.get("/order", authMiddleware, orderControllers.getOrder);
userRoute.get("/order/:id", authMiddleware, orderControllers.getOrderById);
userRoute.put("/order/:id", authMiddleware, orderControllers.updateOrder);
// Cập nhật trạng thái thanh toán
userRoute.put(
  "/order/:id/payment",
  authMiddleware,
  orderControllers.updatePaymentStatus
);

userRoute.post(
  "/payment/paypal",
  authMiddleware,
  orderControllers.createPaypalPayment
);
userRoute.post(
  "/payment/paypal/create-order",
  authMiddleware,
  orderControllers.createOrderAfterPayment
);

// Recent watched products
userRoute.post(
  "/recently-viewed",
  authMiddleware,
  userController.addRecentlyViewedProduct
);
userRoute.get(
  "/recently-viewed",
  authMiddleware,
  userController.getRecentlyViewedProducts
);

// reviewable products
userRoute.get(
  "/reviewable-products",
  authMiddleware,
  reviewController.getReviewableProducts
);
userRoute.post(
  "/review-product",
  authMiddleware,
  reviewController.postReviewProduct
);

userRoute.get(
  "/review-product",
  authMiddleware,
  reviewController.getReviewProductByUser
);

userRoute.get(
  "/product/:productId/reviews",
  reviewController.getReviewByProduct
);
export default userRoute;
