import express, { Request, Response } from "express";
import addressController from "../controllers/address.controllers";
import authMiddleware from "../middlewares/auth.middleware";
const addressRoute = express.Router();

// post create address
addressRoute.post("/", authMiddleware, addressController.createAddress);
addressRoute.delete("/:id", authMiddleware, addressController.deleteAddress);
addressRoute.put("/:id", authMiddleware, addressController.updateAddress);
export default addressRoute;
