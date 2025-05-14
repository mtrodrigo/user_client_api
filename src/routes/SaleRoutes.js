import express from "express";
import SalesController from "../controller/SalesController.js";
import verifyUserToken from "../helpers/verifyUserToken.js";
import verifyTokenAdmin from "../helpers/verifyTokenAdmin.js";

const router = express.Router();

router.post("/createsale", verifyUserToken, SalesController.createSale);
router.patch(
  "/updateAttended/:id",
  verifyTokenAdmin,
  SalesController.updateAttended
);
router.get("/", verifyTokenAdmin, SalesController.getSales);
router.get("/getsale/:id", verifyTokenAdmin, SalesController.getSalesById);
router.get("/mysales/", verifyUserToken, SalesController.getSaleByUserId);

export default router;
