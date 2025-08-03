import mongoose from "mongoose";
import dotenv from "dotenv";

// Đảm bảo dotenv được load
dotenv.config();

// Lấy toàn bộ thông tin kết nối từ biến môi trường
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CLUSTER = process.env.DB_CLUSTER;
const DB_NAME = process.env.DB_NAME;

// Xây dựng URI từ các biến môi trường
const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

const connectDB = async (): Promise<void> => {
  try {
    if (!DB_USERNAME || !DB_PASSWORD || !DB_CLUSTER) {
      throw new Error("Missing database connection environment variables");
    }

    await mongoose.connect(uri, {
      maxPoolSize: 20, // Số connection tối đa trong pool
      minPoolSize: 5, // Connection tối thiểu
      serverSelectionTimeoutMS: 5000, // Timeout kết nối DB
      socketTimeoutMS: 45000, // Timeout socket
    });
    console.log("Connected to MongoDB database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Thoát ứng dụng nếu không thể kết nối DB
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

export default connectDB;
