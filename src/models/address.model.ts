import mongoose from "mongoose";

interface IAddress {
  user: mongoose.Types.ObjectId;
  full_name: string;
  phone: string;
  address_line: string;
  province: string;
  district: string;
  ward: string;
  is_default: boolean;
  type: "home" | "work" | "other";
}

const AddressSchema: mongoose.Schema<IAddress> = new mongoose.Schema(
  {
    user: {
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
    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Address", AddressSchema);
