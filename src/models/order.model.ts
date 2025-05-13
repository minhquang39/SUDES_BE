import mongoose from "mongoose";

interface IOrderItem {
  product: mongoose.Schema.Types.ObjectId;
  SKU: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface IOrder {
  user: mongoose.Schema.Types.ObjectId;
  items: IOrderItem[]; // Thêm trường items theo schema
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    province: string;
    district: string;
    ward: string;
  };
  orderStatus: "pending" | "shipping" | "completed" | "cancelled";
  paymentMethod: "cod" | "paypal";
  paymentStatus: "pending" | "paid" | "failed";
  totalPrice: number;
  shippingFee: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderItemSchema = new mongoose.Schema<IOrderItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    SKU: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, enum: ["cod", "paypal"] },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "shipping", "completed", "cancelled"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
  },
  { timestamps: true }
);

// Tạo và export model
const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
