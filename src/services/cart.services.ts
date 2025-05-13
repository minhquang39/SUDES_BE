import Product from "../models/product.model";
import Cart from "../models/cart.model";
import User from "../models/user.model";
import mongoose from "mongoose";
export default {
  getCartService: async (userId: string | mongoose.Types.ObjectId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        throw new Error("Cart not found");
      }
      return cart;
    } catch (error: any) {
      throw error; // Nên ném lại lỗi để controller xử lý
    }
  },

  addToCartService: async (
    userId: string | mongoose.Types.ObjectId,
    data: any
  ) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
        await cart.save();
      }

      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() === data.productId && item.SKU === data.SKU
      );

      if (existingItem) {
        existingItem.quantity += data.quantity;
      } else {
        cart.items.push({
          productId: data.productId,
          SKU: data.SKU,
          quantity: data.quantity,
          price: data.price,
          name: data.name,
          image: data.image,
        });
      }
      await cart.save(); // Lưu lại cart sau khi cập nhật
      return cart; // Trả về cart đã cập nhật
    } catch (error: any) {
      throw error; // Nên ném lại lỗi để controller xử lý
    }
  },

  updateCartService: async (
    userId: string | mongoose.Types.ObjectId,
    data: any
  ) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        throw new Error("Cart not found");
      }

      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() === data.productId && item.SKU === data.SKU
      );
      if (!existingItem) {
        throw new Error("Item not found in cart");
      }
      existingItem.quantity = data.quantity;
      await cart.save(); // Lưu lại cart sau khi cập nhật
      return cart; // Trả về cart đã cập nhật
    } catch (error) {
      throw error;
    }
  },

  deleteProductCartService: async (
    userId: string | mongoose.Types.ObjectId,
    data: any
  ) => {
    console.log("data", data);
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        throw new Error("Cart not found");
      }

      const productId = data.productId;
      const SKU = data.SKU;
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.SKU === SKU
      );
      if (existingItemIndex === -1) {
        throw new Error("Item not found in cart");
      }
      cart.items.splice(existingItemIndex, 1);
      await cart.save(); // Lưu lại cart sau khi cập nhật
    } catch (error) {
      throw error;
    }
  },

  mergeCartService: async (
    userId: string | mongoose.Types.ObjectId,
    data: any
  ) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
        await cart.save();
      }
      cart.items = [];
      for (const item of data) {
        cart.items.push({
          productId: item.productId,
          SKU: item.SKU,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image,
        });
      }
      await cart.save(); // Lưu lại cart sau khi cập nhật
      return cart;
    } catch (error: any) {
      throw error;
    }
  },
};
