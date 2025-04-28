import express from "express"
import ProductController from "../controller/ProductController.js"
import multer from "multer"
import verifyTokenAdmin from "../helpers/verifyTokenAdmin.js"

const router = express.Router()
const upload = multer()

router.post("/create", upload.single("image"), ProductController.create)

export default router