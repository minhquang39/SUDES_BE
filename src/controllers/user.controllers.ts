import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import userServices from "../services/user.services";

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
  } catch (error) {
    console.error("Change password error:", error);
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to change password",
    });
  }
};

const uploadInfo = async (req: Request, res: Response) => {
  console.log(req.body, req.query);
  res.send("Upload info processed");
};

export default { registerAccount, loginAccount, changePassword, uploadInfo };
