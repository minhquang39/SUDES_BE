import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database";
import userRoute from "./routes/user.route";
import addressRoute from "./routes/address.route";
import adminRoute from "./routes/admin.route";
import bodyParser from "body-parser";
import passport from "./config/passport";
import session from "express-session";
import { Request, Response } from "express";

const port = process.env.PORT || 3000;
const app = express();

// Cấu hình session
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

    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/?token=${token}`
    );
  }
);

app.use("/account", userRoute);
app.use("/account/address", addressRoute);
app.use("/admin", adminRoute);
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
