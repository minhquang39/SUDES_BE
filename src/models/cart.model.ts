import mongoose from "mongoose";

interface ICartItem {
  productId: { type: mongoose.Types.ObjectId; ref: "Product" };
  SKU: string;
  quantity: number;
  price: number;
  oldPrice?: number;
  name?: string;
  image?: string;
}

const CartItemSchema: mongoose.Schema<ICartItem> = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  SKU: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
  },
  name: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
});

interface ICart {
  userId: { type: mongoose.Types.ObjectId; ref: "User" };
  items: ICartItem[];
}

const CartSchema: mongoose.Schema<ICart> = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [CartItemSchema],
});

export default mongoose.model<ICart>("Cart", CartSchema);
