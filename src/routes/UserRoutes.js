import express from "express"
import UserController from "../controller/UserController.js"
import verifyTokenAdmin from "../helpers/verifyTokenAdmin.js"

const router = express.Router()

router.post("/register", UserController.register)
router.get("/getall", verifyTokenAdmin, UserController.getAllUsers)

export default router