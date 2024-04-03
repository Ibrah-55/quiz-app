import express from "express";
import {
  initiateSTKPush,
  stkPushCallback,
  confirmPayment,
} from "../controllers/lipanampesa.controller.js";
import { checkPaymentStatus } from "../controllers/payment.contoller.js";
import { accessToken } from "../middlewares/generateAccessToken.middleware.js";
const router = express.Router();
router.route("/stkPush").post(accessToken, initiateSTKPush);
router.route("/stkPushCallback/:Order_ID").post(stkPushCallback);
router.route("/checkPayment/:Order_ID").get(checkPaymentStatus);
router
  .route("/confirmPayment/:CheckoutRequestID")
  .post(accessToken, confirmPayment);

export default router;
