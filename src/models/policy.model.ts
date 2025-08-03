import mongoose from "mongoose";

interface IPolicy {
  title: string;
  content: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const PolicySchema: mongoose.Schema<IPolicy> = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Policy = mongoose.model<IPolicy>("Policy", PolicySchema);

export default Policy;
