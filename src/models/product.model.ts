import mongoose from "mongoose";

interface IProduct {
  name: string;
  slug: string;
  images: string[];
  shortDescription: string;
  description: string;
  category?: mongoose.Schema.Types.ObjectId[];
  variants?: IVariant[];
  status?: "active" | "inactive";
  rating?: number;
  reviews?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IVariant {
  sku: string;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const variantSchema = new mongoose.Schema<IVariant>(
  {
    sku: {
      type: String,
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      default: [],
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
