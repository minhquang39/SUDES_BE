import { Request, Response } from "express";
import Policy from "../models/policy.model";
import policyService from "../services/policy.services";
const createPolicy = async (req: Request, res: Response) => {
  try {
    const result = await policyService.createPolicyService(req.body);
    res.status(200).json({
      success: true,
      data: result,
      message: "Create policy successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const getPolicies = async (req: Request, res: Response) => {
  try {
    const result = await policyService.getPoliciesService();
    res.status(200).json({
      success: true,
      data: result,
      message: "Get policies successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const deletePolicy = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await policyService.deletePolicyService(id);
    res.status(200).json({
      success: true,
      message: "Policy deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const updatePolicy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await policyService.updatePolicyService(id, data);
    res.status(200).json({
      success: true,
      message: "Policy updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const getPolicyById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const policy = await policyService.getPolicyByIdService(id);
    res.status(200).json({
      success: true,
      message: "Get policy successfully",
      data: policy,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

export default {
  createPolicy,
  getPolicies,
  deletePolicy,
  updatePolicy,
  getPolicyById,
};
