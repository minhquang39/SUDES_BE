import { Request, Response } from "express";
import orderService from "../services/order.services";
import paypalService from "../services/paypal.services";
import Cart from "../models/cart.model";
import axios from "axios";
import Order from "../models/order.model";

// Tạo đơn hàng (COD)
const createOrder = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    // Tạo đơn hàng
    const result = await orderService.createOrderService(userId, req.body);

    res.status(200).json({
      success: true,
      message: "Create order successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

// Tạo PayPal payment trước, sau đó tạo đơn hàng khi thanh toán thành công
const createPaypalPayment = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const result = await paypalService.createPaypalPayment(userId);
    res.status(200).json({
      success: true,
      message: "PayPal payment created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Create PayPal payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getOrder = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const result = await orderService.getOrderService(userId);
    res.status(200).json({
      success: true,
      message: "Get order successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const getOrderById = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const orderId = req.params.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const result = await orderService.getOrderByIdService(userId, orderId);
    res.status(200).json({
      success: true,
      message: "Get order by id successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const updateOrder = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const orderId = req.params.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const result = await orderService.updateOrderService(
      userId,
      orderId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Update order successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const getAllOrdersUser = async (req: Request, res: Response) => {
  try {
    const result = await orderService.getAllOrdersUserService();
    res.status(200).json({
      success: true,
      message: "Get all orders user successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const updateOrderUser = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  try {
    const result = await orderService.updateOrderUserService(orderId, req.body);
    res.status(200).json({
      success: true,
      message: "Update order user successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

// Cập nhật trạng thái thanh toán
const updatePaymentStatus = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { paymentStatus } = req.body;

  if (
    !paymentStatus ||
    !["pending", "paid", "failed"].includes(paymentStatus)
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid payment status (pending, paid, failed) is required",
    });
  }

  try {
    const result = await orderService.updatePaymentStatusService(
      orderId,
      paymentStatus as "pending" | "paid" | "failed"
    );
    res.status(200).json({
      success: true,
      message: "Update payment status successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

// Tạo đơn hàng sau khi thanh toán PayPal thành công
const createOrderAfterPayment = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { paypalOrderId, shippingAddress } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!paypalOrderId || !shippingAddress) {
    return res.status(400).json({
      success: false,
      message: "PayPal order ID and shipping address are required",
    });
  }

  try {
    const result = await paypalService.createOrderAfterPayment(
      userId,
      paypalOrderId,
      shippingAddress
    );

    res.status(200).json({
      success: true,
      message: "Order created successfully after payment",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

export default {
  createOrder,
  getOrder,
  getOrderById,
  updateOrder,
  getAllOrdersUser,
  updateOrderUser,
  updatePaymentStatus,
  createPaypalPayment,
  createOrderAfterPayment,
};
