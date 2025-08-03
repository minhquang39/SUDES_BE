import { Request, Response } from "express";
import productService from "../services/product.services";
import Product from "../models/product.model";
import { ErrorCode } from "../utils/errorCodes";

const createProduct = async (req: Request, res: Response) => {
  // Get uploaded files from Cloudinary
  const files = req.files as Express.Multer.File[];
  const imageUrls = files ? files.map((file: any) => file.path) : [];
  console.log(imageUrls);

  const { name, description, shortDescription, category, variants } = req.body;

  // Simple validation for required fields
  if (!name || !description || !shortDescription || !category) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ thông tin sản phẩm",
      code: ErrorCode.MISSING_FIELDS,
    });
  }

  // Simple variants validation
  let variantsData = [];
  if (variants) {
    try {
      variantsData = JSON.parse(variants);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Thông tin biến thể không hợp lệ",
        code: ErrorCode.IS_REQUIRED,
      });
    }
  }

  try {
    const result = await productService.createProductService({
      ...req.body,
      variants: variantsData,
      images: imageUrls, // Changed from image to images to match model
    });
    res.status(200).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Lỗi hệ thống",
      code: error.code,
    });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const { page, limit, search } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const searchString = search ? (search as string) : "";
    const result = await productService.getProductService(
      pageNumber,
      limitNumber,
      searchString
    );
    res.status(200).json({
      success: true,
      message: "Get all product success",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internam server error",
      code: error.code,
    });
  }
};

const getProductBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const result = await productService.getProductBySlugService(slug);
    res.status(200).json({
      success: true,
      message: "Get product by slug successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await productService.getProductByIdService(id);
    res.status(200).json({
      success: true,
      message: "Get product by id successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  const imageUrls = files ? files.map((file: any) => file.path) : [];
  try {
    const result = await productService.updateProductService(
      id,
      imageUrls,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Update product successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await productService.deleteProductService(id);
    res.status(200).json({
      success: true,
      message: "Delete product successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

export default {
  createProduct,
  getProducts,
  getProductBySlug,
  getProductById,
  updateProduct,
  deleteProduct,
};
