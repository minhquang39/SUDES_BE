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
