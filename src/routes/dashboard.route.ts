import express from "express";
import dashboardController from "../controllers/dashboard.controllers";
import adminMiddleware from "../middlewares/admin.middleware";
const router = express.Router();

router.use(adminMiddleware);

router.get("/stats", dashboardController.getDashboardStats);

router.get("/orders", dashboardController.getOrderStats);

export default router;
