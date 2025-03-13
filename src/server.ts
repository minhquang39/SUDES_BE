import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import userRoute from "./routes/user.route";

// Đảm bảo dotenv được nạp trước khi sử dụng biến môi trường
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

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
