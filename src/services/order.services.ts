import Order from "../models/order.model";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import { ErrorCode } from "../utils/errorCodes";

const createOrderService = async (userId: string, data: any) => {
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error("Cart not found");
    }
    const orderItems = cart.items.map((item: any) => {
      return {
        product: item.productId,
        SKU: item.SKU,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      };
    });

    const totalPrice = orderItems.reduce((total: number, item: any) => {
      return total + item.price * item.quantity;
    }, 0);

    const shippingFee = 40000;
    for (const item of orderItems) {
      const productId = item.product;
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      const variant = product.variants?.find((v) => v.sku === item.SKU);

      if (!variant) {
        throw new Error(`Variant with SKU ${item.SKU} not found`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(
          `Not enough stock for variant ${variant.name}. In stock: ${variant.stock}`
        );
      }
      await Product.findOneAndUpdate(
        {
          _id: productId,
          "variants.sku": item.SKU,
        },
        {
          $inc: {
            "variants.$.stock": -item.quantity,
          },
        },
        { new: true }
      );
    }

    const paymentMethod = data.paymentMethod || "cod";

    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress: {
        fullName: data.fullName,
        phone: data.phone,
        addressLine: data.addressLine,
        province: data.province,
        district: data.district,
        ward: data.ward,
      },
      paymentMethod: paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      totalPrice: totalPrice + shippingFee,
      shippingFee,
    });

    cart.items = [];
    await cart.save();
    return await order.save();
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};

const getOrderService = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("User not found");
    }
    const order = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return order;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};

const getOrderByIdService = async (userId: string, orderId: string) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};

const updateOrderService = async (
  userId: string,
  orderId: string,
  data: any
) => {
  try {
    if (!userId) {
      throw new Error("User not found");
    }
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.orderStatus === "shipping") {
      throw new Error("Order is already shipped");
    }
    if (order.orderStatus === "completed") {
      throw new Error("Order is already completed");
    }
    if (data.orderStatus === "cancelled") {
      for (const item of order.items) {
        const productId = item.product; // đảm bảo đúng kiểu
        const product = await Product.findById(productId);
        if (!product) {
          throw new Error("Product not found");
        }
        const variant = product.variants?.find((v) => v.sku === item.SKU);

        if (!variant) {
          throw new Error(`Variant with SKU ${item.SKU} not found`);
        }

        await Product.findOneAndUpdate(
          {
            _id: productId,
            "variants.sku": item.SKU,
          },
          {
            $inc: {
              "variants.$.stock": +item.quantity,
            },
          },
          { new: true }
        );
      }
    }
    order.orderStatus = data.orderStatus;
    await order.save();
    return order;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};

const getAllOrdersUserService = async () => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return orders;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};

const updateOrderUserService = async (orderId: string, data: any) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.orderStatus = data.status;
    if (order.orderStatus === "completed") {
      order.paymentStatus = "paid";
    }
    await order.save();
    return order;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};

// Cập nhật trạng thái thanh toán
const updatePaymentStatusService = async (
  orderId: string,
  paymentStatus: "pending" | "paid" | "failed"
) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.paymentStatus = paymentStatus;
    await order.save();
    return order;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};

export default {
  createOrderService,
  getOrderService,
  getOrderByIdService,
  updateOrderService,
  getAllOrdersUserService,
  updateOrderUserService,
  updatePaymentStatusService,
};
