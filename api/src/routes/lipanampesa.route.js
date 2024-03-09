import express from 'express'
import {
    initiateSTKPush,
    stkPushCallback,
    confirmPayment
} from "../controllers/lipanampesa.controller.js";


import {accessToken} from "../middlewares/generateAccessToken.middleware.js";

const router = express.Router()
console.log(router)
router.route('/stkPush').post(accessToken,initiateSTKPush)
router.route('/stkPushCallback/:Order_ID').post(stkPushCallback)
router.route('/confirmPayment/:CheckoutRequestID').post(accessToken,confirmPayment)

export default router;
