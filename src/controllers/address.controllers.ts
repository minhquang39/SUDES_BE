import { Request, Response } from "express";
import addressServices from "../services/address.services";
const createAddress = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  try {
    const result = await addressServices.createAddress(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Create address successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Create address failed",
      code: error.code,
    });
  }
};
const deleteAddress = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const addressId = req.params.id;
  try {
    const result = await addressServices.deleteAddress(userId, addressId);
    res.status(200).json({
      success: true,
      message: "Delete address successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Delete address failed",
      code: error.code,
    });
  }
};

const updateAddress = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const addressId = req.params.id;
  try {
    const result = await addressServices.updateAddress(
      userId,
      addressId,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Update address successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Update address failed",
      code: error.code,
    });
  }
};

export default {
  createAddress,
  deleteAddress,
  updateAddress,
};
