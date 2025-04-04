import { ErrorCode } from "../utils/errorCodes";
import Category from "../models/category.model";
import slugify from "slugify";

const createParentCategoryService = async (data: any) => {
  try {
    const { name, coverImage } = data;
    const slug = slugify(name, { lower: true });

    const existCategory = await Category.findOne({ slug });
    if (existCategory) {
      throw {
        message: "Category has exist",
        code: ErrorCode.CATEGORY_ALREADY_EXISTS,
      };
    }

    const parentCategory = await Category.create({
      name,
      slug,
      coverImage: coverImage?.path,
    });
    return parentCategory;
  } catch (error: any) {
    throw {
      message: error.message,
      code: ErrorCode.SERVER_ERROR,
    };
  }
};

const createChildCategoryService = async (data: any) => {
  try {
    const { name, parentId } = data;
    const parentCategory = await Category.findById({ _id: parentId });
    if (!parentCategory) {
      throw {
        message: "Parent category not found",
        code: ErrorCode.CATEGORY_NOT_FOUND,
      };
    }
    const slug = slugify(name, { lower: true });
    const childCategory = await Category.create({
      name,
      slug,
      parent: parentId,
    });

    parentCategory.children.push(childCategory._id);
    await parentCategory.save();
    return childCategory;
  } catch (error: any) {
    throw {
      message: error.message,
      code: ErrorCode.SERVER_ERROR,
    };
  }
};

const getParentCategoryService = async () => {
  try {
    const parentCategories = await Category.find({ parent: null })
      .select("-__v -createdAt -updatedAt -parent")
      .sort({ createdAt: 1 })
      .populate("children");
    return parentCategories;
  } catch (error) {
    throw {
      code: ErrorCode.SERVER_ERROR,
      message: "Failed to get parent categories",
    };
  }
};

const updateParentCategoryService = async (
  id: string,
  coverImage: any,
  name: string
) => {
  try {
    if (!id) {
      throw {
        message: "Category id is required",
        code: ErrorCode.IS_REQUIRED,
      };
    }
    const category = await Category.findById({ _id: id });
    const slug = slugify(name, { lower: true });
    const imagePath = coverImage ? coverImage.path : category?.coverImage;

    if (!category) {
      throw {
        message: "Category not found",
        code: ErrorCode.CATEGORY_NOT_FOUND,
      };
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: id },
      { slug, name, coverImage: imagePath },
      { new: true }
    );
    return updatedCategory;
  } catch (error: any) {
    throw {
      message: error.message,
      code: ErrorCode.SERVER_ERROR,
    };
  }
};

const getParentCategoryByIdService = async (id: string) => {
  try {
    const category = await Category.findById({ _id: id }).select(
      "-__v -createdAt -updatedAt -parent"
    );
    if (!category) {
      throw {
        message: "Category not found",
        code: ErrorCode.CATEGORY_NOT_FOUND,
      };
    }
    return category;
  } catch (error: any) {
    throw {
      message: error.message,
      code: ErrorCode.SERVER_ERROR,
    };
  }
};

const deleteParentCategoryService = async (id: string) => {
  try {
    const category = await Category.findByIdAndDelete({ _id: id });
    if (!category) {
      throw {
        message: "Category not found",
        code: ErrorCode.CATEGORY_NOT_FOUND,
      };
    }
    return category;
  } catch (error: any) {
    throw {
      message: error.message,
      code: ErrorCode.SERVER_ERROR,
    };
  }
};

export default {
  createParentCategoryService,
  createChildCategoryService,
  getParentCategoryService,
  updateParentCategoryService,
  getParentCategoryByIdService,
  deleteParentCategoryService,
};
