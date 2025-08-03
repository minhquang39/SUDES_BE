import { Router } from "express";
import { Request, Response } from "express";
import upload from "../middlewares/multer.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
import adminControllers from "../controllers/admin.controllers";
import policyControllers from "../controllers/policy.controllers";
import categoryControllers from "../controllers/category.controllers";
import productControllers from "../controllers/product.controllers";
import orderControllers from "../controllers/order.controllers";
const adminRoute = Router();

// Admin
adminRoute.post("/login", adminControllers.loginAdmin);

// user
adminRoute.get("/user", adminMiddleware, adminControllers.getAllUsers);
adminRoute.post("/user", adminMiddleware, adminControllers.createUser);
adminRoute.delete("/user/:id", adminMiddleware, adminControllers.deleteUser);
adminRoute.put("/user/:id", adminMiddleware, adminControllers.updateUser);
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

adminRoute.get("/category/slug/:slug", categoryControllers.getCategoryBySlug);

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

adminRoute.delete(
  "/category/child/:id",
  adminMiddleware,
  categoryControllers.deleteChildCategory
);

adminRoute.post(
  "/category/child",
  adminMiddleware,
  categoryControllers.createChildCategory
);

adminRoute.put(
  "/category/child/:id",
  adminMiddleware,
  categoryControllers.updateChildCategory
);

adminRoute.post(
  "/product",
  adminMiddleware,
  upload.array("images", 5),
  productControllers.createProduct
);

adminRoute.get("/product", productControllers.getProducts);
adminRoute.get("/product/:slug", productControllers.getProductBySlug);
adminRoute.get("/product/id/:id", productControllers.getProductById);
adminRoute.put(
  "/product/:id",
  adminMiddleware,
  upload.array("images", 5),
  productControllers.updateProduct
);
adminRoute.delete(
  "/product/:id",
  adminMiddleware,
  productControllers.deleteProduct
);

// order route
adminRoute.get("/order", adminMiddleware, orderControllers.getAllOrdersUser);
adminRoute.put("/order/:id", adminMiddleware, orderControllers.updateOrderUser);
export default adminRoute;
