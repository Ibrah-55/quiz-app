import request from "request";
import "dotenv/config";
import { getTimestamp } from "../utils/utils.timestamp.js";
import ngrok from "ngrok";
import { nanoid } from "nanoid";
import { genObjectId } from "../utils/genId.mongodb.js";

import { orderModel } from "../models/orders.model.js";

export const initiateSTKPush = async (req, res) => {
    try {
      const { amount, phone } = req.body;
      const Order_ID = nanoid();
      console.log("Order Id: ", Order_ID);
      console.log("Request Body", req.body);
  
      const timestamp = getTimestamp();
  
      // shortcode + passkey + timestamp
      const password = new Buffer.from(
        process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp
      ).toString("base64");
  
      // create callback url
      const callback_url = await ngrok.connect(process.env.PORT);
      const api = ngrok.getApi();
      await api.listTunnels();
  
      console.log("callback ", callback_url);
  
      // Move the request function inside the ngrok.connect callback
      request(
        {
          url: "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
          method: "POST",
          headers: {
            Authorization: "Bearer " + req.safaricom_access_token,
          },
          json: {
            Order_ID, // Pass Order_ID in the request payload
            BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phone,
            PartyB: process.env.BUSINESS_SHORT_CODE,
            PhoneNumber: phone,
            CallBackURL: `${callback_url}/api/stkPushCallback/${Order_ID}`,
            AccountReference: "Think Twice App",
            TransactionDesc: "Online Payment",
          },
        },
        function (e, response, body) {
          if (e) {
            console.error(e);
            res.status(503).send({
              message: "Error with the stk push",
              error: e,
            });
          } else {
            res.status(200).json(body);
          }
        }
      );
    } catch (e) {
      console.error("Error while trying to create LipaNaMpesa details", e);
      res.status(503).send({
        message: "Something went wrong while trying to create LipaNaMpesa details. Contact admin",
        error: e,
      });
    }
  };
  

  export const stkPushCallback = async (req, res) => {
    try {
      // Order ID is extracted from the request parameters
      const { Order_ID } = req.params;
      const {
        MerchantRequestID,
        CheckoutRequestID,
        ResponseCode,
        ResultDesc,
        ResponseDescription,
        ResultCode,
      } = req.body;
      // Extract details directly from the response body
      const { Body } = req.body;
      console.log("Body: ", req.body)
  
      // Check if stkCallback is present in the response body
      if (Body && Body.stkCallback) {
        const {
          MerchantRequestID,
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata,
        } = Body.stkCallback;
  
        // Get meta data from CallbackMetadata
        const meta = CallbackMetadata && CallbackMetadata.Item;
  
        // Check if meta is an array
        if (Array.isArray(meta)) {
          const PhoneNumber = meta.find((o) => o.Name === "PhoneNumber")?.Value?.toString();
          const Amount = meta.find((o) => o.Name === "Amount")?.Value?.toString();
          const MpesaReceiptNumber = meta.find((o) => o.Name === "MpesaReceiptNumber")?.Value?.toString();
          const TransactionDate = meta.find((o) => o.Name === "TransactionDate")?.Value?.toString();
  
          // Log the received details
          console.log("-".repeat(20), " OUTPUT IN THE CALLBACK ", "-".repeat(20));
          console.log(`
            Order_ID: ${Order_ID},
            MerchantRequestID: ${MerchantRequestID},
            CheckoutRequestID: ${CheckoutRequestID},
            ResultCode: ${ResultCode},
            ResultDesc: ${ResultDesc},
            PhoneNumber: ${PhoneNumber},
            Amount: ${Amount},
            MpesaReceiptNumber: ${MpesaReceiptNumber},
            TransactionDate: ${TransactionDate}
          `);
  
          // Save the transaction details to the database
          const onlinePayment = new orderModel({
            Order_ID,
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            PhoneNumber,
            Amount,
            MpesaReceiptNumber,
            TransactionDate,
          });
  
          await onlinePayment.save();
  
          // Respond with success
          res.json(true);
        } else {
          // Handle invalid meta structure
          console.error("Invalid meta structure in CallbackMetadata.Item");
          res.status(400).json({ error: "Invalid request payload" });
        }
      } else {
        // Handle missing stkCallback
        console.error("stkCallback is undefined or not present.");
        res.status(400).json({ error: "Invalid request payload" });
      }
    } catch (e) {
      console.error("Error while trying to update LipaNaMpesa details from the callback", e);
      res.status(503).send({
        message: "Something went wrong with the callback",
        error: e.message,
      });
    }
  };
  

// @desc Check from safaricom servers the status of a transaction
// @method GET
// @route /confirmPayment/:CheckoutRequestID
// @access public
 export const confirmPayment = async(req, res) => {
    try{


        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
        const auth = "Bearer " + req.safaricom_access_token

        const timestamp = getTimestamp()
        const password = new Buffer.from(process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp).toString('base64')


        request(
            {
                url: url,
                method: "POST",
                headers: {
                    "Authorization": auth
                },
                json: {
                    "BusinessShortCode":process.env.BUSINESS_SHORT_CODE,
                    "Password": password,
                    "Timestamp": timestamp,
                    "CheckoutRequestID": req.params.CheckoutRequestID,

                }
            },
            function (error, response, body) {
                if (error) {
                    console.log(error)
                    res.status(503).send({
                        message:"Something went wrong while trying to create LipaNaMpesa details. Contact admin",
                        error : error
                    })
                } else {
                    res.status(200).json(body)
                }
            }
        )
    }catch (e) {
        console.error("Error while trying to create LipaNaMpesa details",e)
        res.status(503).send({
            message:"Something went wrong while trying to create LipaNaMpesa details. Contact admin",
            error : e
        })
    }
}
