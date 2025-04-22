import Product from "../models/product.model";
import slugify from "slugify";
import { ErrorCode } from "../utils/errorCodes";

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

const getProductService = async () => {
  try {
    const product = await Product.find({}).populate("category");
    return product;
  } catch (error: any) {
    throw {
      message: error.message,
      coode: error.code || ErrorCode.SERVER_ERROR,
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
const updateProductService = async (id: string, data: any) => {
  try {
    const product = await Product.findByIdAndUpdate(id, data);
    return product;
  } catch (error: any) {
    throw {
      message: error.message,
      code: error.code || ErrorCode.SERVER_ERROR,
    };
  }
};
export default {
  createProductService,
  getProductService,
  deleteProductService,
  updateProductService,
};
