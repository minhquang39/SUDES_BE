import axios from "axios";
import { AxiosError } from "axios";
import dotenv from "dotenv";
import Order from "../models/order.model";
import { ErrorCode } from "../utils/errorCodes";
import Cart from "../models/cart.model";
import orderServices from "./order.services";

// Đảm bảo dotenv được cấu hình
dotenv.config();

const paypalConfig = require("../config/paypal");

const createPaypalPayment = async (userId: string) => {
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Tính tổng tiền
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const shippingFee = 40000;
    const finalTotal = totalPrice + shippingFee;


    const exchangeRate = 24000; 
    const amountUSD = (finalTotal / exchangeRate).toFixed(2);
    // Gọi API PayPal
    const paypalConfig = require("../config/paypal");
    const accessToken = await paypalConfig.generateAccessToken();
    const paypalUrl =
      process.env.PAYPAL_URL || "https://api-m.sandbox.paypal.com";

    const response = await axios.post(
      `${paypalUrl}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            description: `Payment for SUDES Store Order`,
            amount: {
              currency_code: "USD",
              value: amountUSD,
            },
          },
        ],
        application_context: {
          brand_name: "SUDES Store",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING",
          return_url: `${process.env.FRONTEND_URL}/thank-you`,
          cancel_url: `${process.env.FRONTEND_URL}/checkout`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("PayPal order response:", response.data);
    return {
      paypalOrderId: response.data.id,
      approvalLink: response.data.links.find(
        (link: any) => link.rel === "approve"
      )?.href,
      totalAmount: finalTotal,
      amountUSD: amountUSD,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create PayPal payment",
      code: ErrorCode.SERVER_ERROR,
    };
  }
};

const capturePaypalPayment = async (paypalOrderId: string, orderId: string) => {
  try {
    // Tìm order trong database
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Gọi API PayPal để capture payment
    const accessToken = await paypalConfig.generateAccessToken();
    const paypalUrl =
      process.env.PAYPAL_URL || "https://api-m.sandbox.paypal.com";

    const response = await axios.post(
      `${paypalUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Cập nhật trạng thái thanh toán
    if (response.data.status === "COMPLETED") {
      await Order.findByIdAndUpdate(
        orderId,
        {
          $set: {
            paymentStatus: "paid",
          },
        },
        { new: true }
      );

      console.log(
        `Payment completed for order ${orderId}, PayPal order ID: ${paypalOrderId}`
      );
    }

    return {
      success: true,
      status: response.data.status,
      orderId: order._id,
      paypalDetails: response.data,
    };
  } catch (error: any) {
    const axiosError = error as AxiosError;
    console.error(
      "PayPal capture payment error:",
      axiosError.response?.data || axiosError.message
    );
    throw {
      message: error.message || "Failed to capture PayPal payment",
      code: error.code || 5000, // SERVER_ERROR
    };
  }
};

const createOrderAfterPayment = async (
  userId: string,
  paypalOrderId: string,
  shippingAddress: any
) => {
  try {
    const orderData = {
      ...shippingAddress,
      paymentMethod: "paypal",
    };

    const order = await orderServices.createOrderService(userId, orderData);
    const paypalPayment = await capturePaypalPayment(
      paypalOrderId,
      order._id.toString()
    );

    return {
      order,
    };
  } catch (error: any) {
    throw {
      message: error.message || "Failed to create order after payment",
      code: error.code || 5000, // SERVER_ERROR
    };
  }
};

export default {
  createPaypalPayment,
  capturePaypalPayment,
  createOrderAfterPayment,
};
