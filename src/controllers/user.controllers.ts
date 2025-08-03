import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import userServices from "../services/user.services";
import { ErrorCode } from "../utils/errorCodes";

const registerAccount = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      code: error.code,
      message: error.message,
    });
  }
};

const loginAccount = async (req: Request, res: Response) => {
  try {
    const result = await userServices.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      code: error.code,
      message: error.message,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const result = await userServices.changePassword(req.body);
    res.status(200).json({
      success: true,
      message: result.message || "Password changed successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to change password",
      code: error.code || ErrorCode.SERVER_ERROR,
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const result = await userServices.resetPassword(req.body);
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};
const forgotPassword = async (req: Request, res: Response) => {
  try {
    const result = await userServices.forgotPassword(req.body);
    res.status(200).json({
      success: true,
      message: "Request OTP successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to forgot password",
    });
  }
};

const changeInfo = async (req: Request, res: Response) => {
  try {
    const email = req.user?.email;
    const { firstName, lastName, phone } = req.body;
    const result = await userServices.changeInfo({
      email,
      firstName,
      lastName,
      phone,
    });
    res.status(200).json({
      success: true,
      message: "Change info successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to change info",
    });
  }
};

const updateAvatar = async (req: Request, res: Response) => {
  try {
    const avatar = req.file;
    const email = req.user?.email;
    const result = await userServices.updateAvatar({ email, avatar });
    res.status(200).json({
      success: true,
      message: "Update avatar successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update avatar",
    });
  }
};

const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        code: ErrorCode.USER_NOT_FOUND,
        message: "User not found",
      });
    }

    return res.status(200).json({
      code: ErrorCode.SUCCESS,
      message: "Get user info successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get user info error:", error);
    return res.status(500).json({
      code: ErrorCode.SERVER_ERROR,
      message: "Internal server error",
    });
  }
};

const addRecentlyViewedProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const result = await userServices.addRecentlyViewedProduct(
      userId,
      req.body.productIds
    );
    res.status(200).json({
      success: true,
      message: "Product added to recently viewed successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add recently viewed product",
    });
  }
};

const getRecentlyViewedProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const result = await userServices.getRecentlyViewedProducts(userId);
    res.status(200).json({
      success: true,
      message: "Get recently viewed products successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get recently viewed products",
    });
  }
};

export default {
  registerAccount,
  loginAccount,
  changePassword,
  forgotPassword,
  changeInfo,
  getUserInfo,
  resetPassword,
  updateAvatar,
  addRecentlyViewedProduct,
  getRecentlyViewedProducts,
};
