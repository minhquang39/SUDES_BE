import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database";
import userRoute from "./routes/user.route";
import adminRoute from "./routes/admin.route";
import dashboardRoute from "./routes/dashboard.route";
import bodyParser from "body-parser";
import passport from "./config/passport";
import session from "express-session";
import { Request, Response } from "express";

const paypal = require("./config/paypal");
const port = process.env.PORT || 3000;
const app = express();

app.use(
  session({
    secret: process.env.JWT_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình CORS đơn giản hơn
app.use(
  cors({
    origin: [
      "https://sudes-1yo2.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Google Auth Routes
app.get(
  "/account/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/account/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    // Create JWT token
    const token = require("jsonwebtoken").sign(
      { userId: (req.user as any)._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    // Chuyển hướng về trang chủ của frontend với token
    const redirectUrl = `${process.env.FRONTEND_URL}?token=${token}`;
    res.redirect(redirectUrl);
  }
);

app.use("/account", userRoute);
app.use("/admin", adminRoute);
app.use("/dashboard", dashboardRoute);

// Thêm route để test PayPal
app.get("/test-paypal", async (req: Request, res: Response) => {
  try {
    console.log("Testing PayPal integration...");
    const result = await paypal.createOrder();
    console.log("PayPal order created successfully:", result);
    res.status(200).json({
      message: "PayPal order created successfully",
      orderId: result.id,
      orderDetails: result,
    });
  } catch (error) {
    console.error("PayPal test error:", error);
    res.status(500).json({
      error: "Failed to create PayPal order",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
