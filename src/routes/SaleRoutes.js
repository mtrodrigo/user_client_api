import express from "express";
import SalesController from "../controller/SalesController.js";
import verifyUserToken from "../helpers/verifyUserToken.js";

const router = express.Router();

router.post("/createsale",verifyUserToken,  SalesController.createSale);

export default router;
