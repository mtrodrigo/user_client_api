import express from "express"
import UserController from "../controller/UserController.js"
import verifyTokenAdmin from "../helpers/verifyTokenAdmin.js"

const router = express.Router()

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.get("/getall", verifyTokenAdmin, UserController.getAllUsers)
router.get("/:id", verifyTokenAdmin, UserController.getUserById)
router.patch("/:id", verifyTokenAdmin, UserController.updateUser)
router.delete("/:id", verifyTokenAdmin, UserController.removeUserById)

export default router