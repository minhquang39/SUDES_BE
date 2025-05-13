import mongoose from "mongoose";
interface IUser {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  avatar: string;
  email_verified: boolean;
  role: string;
  googleId: string;
  phone: string;
  address: [{ type: mongoose.Schema.Types.ObjectId; ref: "Address" }];
}

const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    googleId: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
