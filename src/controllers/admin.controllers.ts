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

export default { loginAdmin };
