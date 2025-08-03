import Product from "../models/product.model";
import slugify from "slugify";
import { ErrorCode } from "../utils/errorCodes";
import Category from "../models/category.model";

const createProductService = async (data: any) => {
  try {
    const slug = slugify(data.name, { lower: true });
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      throw {
        message: "Product already exists",
        code: ErrorCode.SERVER_ERROR,
      };
    }

    const product = await Product.create({
      ...data,
      slug,
    });
    return product;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};

const getProductService = async (page = 1, limit = 10, query = "") => {
  try {
    const search = query ? { name: { $regex: query, $options: "i" } } : {};
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(search);
    const product = await Product.find(search)
      .skip(skip)
      .limit(limit)
      .populate("category");
    return {
      product,
      pagination: {
        page,
        limit,
        totalPage: Math.ceil(total / limit),
        total,
      },
    };
  } catch (error: any) {
    throw {
      message: error.message,
      coode: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};

const getProductBySlugService = async (slug: string) => {
  try {
    const product = await Product.findOne({ slug }).populate("category");
    return product;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};

const getProductByIdService = async (id: string) => {
  try {
    const product = await Product.findById(id);

    return product;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};

const deleteProductService = async (id: string) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    return product;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};
const updateProductService = async (id: string, images: any, data: any) => {
  try {
    // Xử lý variants nếu là chuỗi
    if (typeof data.variants === "string") {
      try {
        data.variants = JSON.parse(data.variants);
      } catch (parseError) {
        console.error("Error parsing variants JSON:", parseError);
        // Có thể set giá trị mặc định nếu parse thất bại
        data.variants = [];
      }
    }

    const name = data.name;
    const slug = slugify(name, { lower: true });

    // 1. Kiểm tra sản phẩm tồn tại
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // 2. Kiểm tra slug trùng lặp (chỉ khi slug thay đổi)
    if (existingProduct.slug !== slug) {
      const slugExists = await Product.findOne({
        slug,
        _id: { $ne: id },
      });

      if (slugExists) {
        throw new Error(
          "Tên sản phẩm tạo ra slug đã tồn tại, vui lòng chọn tên khác"
        );
      }
    }

    // Tạo object chứa dữ liệu cập nhật
    const updateData = { ...data, slug };

    if (images && images.length > 0) {
      updateData.images = images;
    }

    // Thực hiện cập nhật sản phẩm
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Thêm runValidators để đảm bảo schema validation
    );

    return product;
  } catch (error) {
    console.error("Update product error:", error);
    throw error;
  }
};
export default {
  createProductService,
  getProductService,
  deleteProductService,
  updateProductService,
  getProductByIdService,
  getProductBySlugService,
};
