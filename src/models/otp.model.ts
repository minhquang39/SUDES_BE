const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 1000 * 60 * 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("otp", otpSchema);
