import { Request, Response } from "express";
import reviewService from "../services/review.services";
const getReviewableProducts = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const result = await reviewService.getReviewableProductsService(userId);
    res.status(200).json({
      success: true,
      message: "Get reviewable products successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const postReviewProduct = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    // Call the service to handle the review submission
    const result = await reviewService.postReviewProductService(
      userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getReviewProductByUser = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const result = await reviewService.getReviewProductService(userId);
    res.status(200).json({
      success: true,
      message: "Get review products successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getReviewByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const { page = 1, limit = 10 } = req.query;

    const result = await reviewService.getProductReviewsService(
      productId,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export default {
  getReviewableProducts,
  postReviewProduct,
  getReviewProductByUser,
  getReviewByProduct,
};
