import { Router } from "express";
import { Request, Response } from "express";
import upload from "../middlewares/multer.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
import adminControllers from "../controllers/admin.controllers";
import policyControllers from "../controllers/policy.controllers";
import categoryControllers from "../controllers/category.controllers";
const adminRoute = Router();

// Admin
adminRoute.post("/login", adminControllers.loginAdmin);

// Policy
adminRoute.post("/policy", adminMiddleware, policyControllers.createPolicy);
adminRoute.get("/policy", policyControllers.getPolicies);
adminRoute.get("/policy/:id", policyControllers.getPolicyById);
adminRoute.put("/policy/:id", adminMiddleware, policyControllers.updatePolicy);
adminRoute.delete(
  "/policy/:id",
  adminMiddleware,
  policyControllers.deletePolicy
);

// Admin category
adminRoute.post(
  "/category/parent",
  adminMiddleware,
  upload.single("coverImage"),
  categoryControllers.createParentCategory
);

adminRoute.get("/category/parent", categoryControllers.getParentCategory);

adminRoute.get(
  "/category/parent/:id",
  categoryControllers.getParentCategoryById
);

adminRoute.put(
  "/category/parent/:id",
  adminMiddleware,
  upload.single("coverImage"),
  categoryControllers.updatedParentCategory
);

adminRoute.delete(
  "/category/parent/:id",
  adminMiddleware,
  categoryControllers.deleteParentCategory
);

adminRoute.post(
  "/category/child",
  adminMiddleware,
  categoryControllers.createChildCategory
);
export default adminRoute;
