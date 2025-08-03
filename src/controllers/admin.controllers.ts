import { Request, Response } from "express";
import adminServices from "../services/admin.services";

const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await adminServices.loginAdminService(email, password);
    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.code,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllUsersService();
    res.status(200).json({
      success: true,
      message: "Get all users successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.code,
    });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.createUserService(req.body);
    res.status(200).json({
      success: true,
      message: "Create user successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.code,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await adminServices.deleteUserService(id);
    res.status(200).json({
      success: true,
      message: "Delete user successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.code,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await adminServices.updateUserService(id, req.body);
    res.status(200).json({
      success: true,
      message: "Update user successfully",
      data: result,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, error: error.code });
  }
};
export default { loginAdmin, getAllUsers, createUser, deleteUser, updateUser };
