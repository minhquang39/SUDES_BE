import { Request, Response } from "express";
import categoryService from "../services/category.services";

const createChildCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.createChildCategoryService(req.body);
    res.status(200).json({
      success: true,
      message: "Create child category successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const createParentCategory = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const coverImage = req.file;
    const result = await categoryService.createParentCategoryService({
      name,
      coverImage,
    });
    res.status(200).json({
      success: true,
      data: result,
      message: "Create parent category successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const getParentCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.getParentCategoryService();
    res.status(200).json({
      success: true,
      message: "Get parent category successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const updatedParentCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const coverImage = req.file;
    const name = req.body.name;
    const result = await categoryService.updateParentCategoryService(
      id,
      coverImage,
      name
    );
    res.status(200).json({
      success: true,
      message: "Update parent category successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const getParentCategoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await categoryService.getParentCategoryByIdService(id);
    res.status(200).json({
      success: true,
      message: "Get parent category by id successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const result = await categoryService.getCategoryBySlug(slug);
    res.status(200).json({
      success: true,
      message: "Get parent category by id successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const deleteParentCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await categoryService.deleteParentCategoryService(id);
    res.status(200).json({
      success: true,
      message: "Delete parent category successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const deleteChildCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await categoryService.deleteChildCategoryService(id);
    res.status(200).json({
      success: true,
      message: "Delete child category successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Internal server error",
      code: error.code,
    });
  }
};

const updateChildCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const result = await categoryService.updateChildCategoryService(id, name);
    res.status(200).json({
      success: true,
      message: "Update child category successfully",
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
  createParentCategory,
  createChildCategory,
  getParentCategory,
  updatedParentCategory,
  getParentCategoryById,
  deleteParentCategory,
  deleteChildCategory,
  updateChildCategory,
  getCategoryBySlug,
};
