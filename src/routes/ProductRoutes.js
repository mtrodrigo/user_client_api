import express from "express";
import ProductController from "../controller/ProductController.js";
import multer from "multer";
import verifyTokenAdmin from "../helpers/verifyTokenAdmin.js";

const router = express.Router();
const upload = multer();

router.post(
  "/create",
  verifyTokenAdmin,
  upload.single("image"),
  ProductController.create
);

router.get("/", ProductController.getAll);

router.get("/:id", ProductController.getProductsById)

router.patch("/update/:id", ProductController.updateProductById)

router.delete(
  "/delete/:id",
  verifyTokenAdmin,
  ProductController.removeProductById
);

export default router;
