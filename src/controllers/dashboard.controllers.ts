import { Request, Response } from "express";
import User from "../models/user.model";
import Order from "../models/order.model";
import Product from "../models/product.model";
import Category from "../models/category.model";

// Lấy tổng quan thống kê cho dashboard
const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalOrders, totalProducts, totalCategories] =
      await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Product.countDocuments(),
        Category.countDocuments(),
      ]);

    // Thống kê doanh thu
    const revenue = await Order.aggregate([
      { $match: { paymentStatus: "paid", orderStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    // Thống kê đơn hàng theo trạng thái
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    // Thống kê đơn hàng theo phương thức thanh toán
    const ordersByPaymentMethod = await Order.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
    ]);

    // Lấy 5 sản phẩm mới nhất
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name price images");

    // Trả về kết quả
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalCategories,
        revenue: revenue.length > 0 ? revenue[0].total : 0,
        ordersByStatus,
        ordersByPaymentMethod,
        latestProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Lấy thống kê đơn hàng theo thời gian (ngày, tuần, tháng)
const getOrderStats = async (req: Request, res: Response) => {
  try {
    const { period } = req.query; // 'daily', 'weekly', 'monthly'
    let dateFormat;
    let groupBy;

    switch (period) {
      case "weekly":
        dateFormat = {
          $dateToString: { format: "%Y-Week %U", date: "$createdAt" },
        };
        groupBy = { year_week: dateFormat };
        break;
      case "monthly":
        dateFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        groupBy = { year_month: dateFormat };
        break;
      default: // daily
        dateFormat = {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        };
        groupBy = { date: dateFormat };
    }

    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: orderStats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export default {
  getDashboardStats,
  getOrderStats,
};
