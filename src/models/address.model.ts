import mongoose from "mongoose";

interface IAddress {
  userId: { type: mongoose.Types.ObjectId; ref: "User" };
  full_name: string;
  phone: string;
  email: string;
  address_line: string;
  province: string;
  district: string;
  ward: string;
  is_default: boolean;
}

const AddressSchema: mongoose.Schema<IAddress> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    address_line: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: String,
      required: true,
      trim: true,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Address", AddressSchema);
