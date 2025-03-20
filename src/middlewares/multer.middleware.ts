import multer from "multer";
import cloudinary from "../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request, Response } from "express";
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: "user/avatar",
      format: "jpeg",
      public_id: req.user?.email,
    };
  },
});
const upload = multer({ storage });

export default upload;
