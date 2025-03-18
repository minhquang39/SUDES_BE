import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database";
import userRoute from "./routes/user.route";
import bodyParser = require("body-parser");

// Đảm bảo dotenv được nạp trước khi sử dụng biến môi trường
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Cấu hình CORS dựa trên môi trường
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://sudes-1yo2.vercel.app", // New production URL
      ]
    : [
        "http://localhost:5173", // Vite dev server
        "http://localhost:3000", // React dev server
      ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép requests không có origin (như mobile apps hoặc curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
  })
);

app.use("/account", userRoute);

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
