import { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import userServices from "../services/user.services";

const registerAccount = async (req: Request, res: Response) => {
  let result;
  try {
    result = await userServices.createUser(req.body);
    res.status(201).json({
      success: "true",
      message: "Account created successfully",
    });
  } catch (error) {
    res.status(400).json({ success: "false", message: error });
  }
};

const loginAccount = async (req: Request, res: Response) => {
  let result;
  try {
    result = await userServices.loginUser(req.body);
    res.status(200).json({
      success: "true",
      message: "Login successful",
      token: result.token,
    });
  } catch (error) {
    res.status(400).json({ success: "false", message: error });
  }
};

export default { registerAccount, loginAccount };
