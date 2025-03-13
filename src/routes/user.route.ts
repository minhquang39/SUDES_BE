import express, { Request, Response } from "express";
import userController from "../controllers/user.controllers";
const userRoute = express.Router();

userRoute.post("/register", userController.registerAccount);
userRoute.post("/login", userController.loginAccount);

export default userRoute;
