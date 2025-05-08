import express from "express";
import ProductController from "../controller/ProductController.js";
import multer, { memoryStorage } from "multer";
import verifyTokenAdmin from "../helpers/verifyTokenAdmin.js";

const router = express.Router();

const upload = multer({ storage: memoryStorage() });

router.post(
  "/create",
  verifyTokenAdmin,
  upload.none(),
  ProductController.create
);

router.get("/", ProductController.getAll);

router.get("/:id", ProductController.getProductsById);

router.patch(
  "/:id",
  verifyTokenAdmin,
  upload.single("image"),
  ProductController.updateProductById
);

router.delete(
  "/delete/:id",
  verifyTokenAdmin,
  ProductController.removeProductById
);

export default router;
