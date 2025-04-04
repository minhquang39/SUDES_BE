import multer from "multer";
import cloudinary from "../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: "sudes",
      format: "webp",
      public_id: `${req.user?.email || "user"}_${Date.now()}`,
    };
  },
});
const upload = multer({ storage });

export default upload;
