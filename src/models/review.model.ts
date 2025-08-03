  import mongoose from "mongoose";

  interface IReview {
    user: mongoose.Schema.Types.ObjectId;
    product: mongoose.Schema.Types.ObjectId;
    SKU: string;
    order: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  const reviewSchema = new mongoose.Schema<IReview>(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      SKU: { type: String, required: true },
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  );

  export default mongoose.model<IReview>("Review", reviewSchema);
