import express from "express";
import ProductController from "../controller/ProductController.js";
import multer from "multer";
import verifyTokenAdmin from "../helpers/verifyTokenAdmin.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/create",
  verifyTokenAdmin,
  upload.single("image"),
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
