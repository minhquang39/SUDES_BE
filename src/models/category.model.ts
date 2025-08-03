import mongoose from "mongoose";

interface ICategory {
  name: String;
  slug: String;
  parent?: mongoose.Types.ObjectId | null;
  children: mongoose.Types.ObjectId[];
  coverImage: String;
  createAt?: Date;
  updateAt?: Date;
}

const CategorySchema: mongoose.Schema<ICategory> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: [],
      },
    ],
    coverImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
