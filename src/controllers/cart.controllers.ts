import { Request, Response } from "express";
import cartService from "../services/cart.services";
const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const result = await cartService.getCartService(userId);
    res.status(200).json({
      success: true,
      message: "Get cart successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const result = await cartService.addToCartService(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Add to cart successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const updateCart = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const result = await cartService.updateCartService(userId, req.body);
    res.status(200).json({
      success: true,
      message: "update to cart successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const deleteProductCart = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const result = await cartService.deleteProductCartService(userId, req.body);
    res.status(200).json({
      success: true,
      message: "delete product in cart successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const mergeCart = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const result = await cartService.mergeCartService(userId, req.body);
    res.status(200).json({
      success: true,
      message: "merge product in cart successfully",
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
  getCart,
  addToCart,
  updateCart,
  deleteProductCart,
  mergeCart,
};
