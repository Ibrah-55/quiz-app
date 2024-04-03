import request from "request";
import "dotenv/config";
import { getTimestamp } from "../utils/utils.timestamp.js";
import ngrok from "ngrok";
import { nanoid } from "nanoid";
import { genObjectId } from "../utils/genId.mongodb.js";

import { orderModel } from "../models/orders.model.js";

export const initiateSTKPush = async (req, res) => {
  try {
    const { phone } = req.body;
    const amount = 1;
    const Order_ID = nanoid();
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

    // Define the options for the HTTP request
    const options = {
      url: "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      method: "POST",
      headers: {
        Authorization: "Bearer " + req.safaricom_access_token,
        "Content-Type": "application/json", // Add Content-Type header
      },
      json: {
        Order_ID,
        BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.BUSINESS_SHORT_CODE,
        PhoneNumber: phone,
        CallBackURL: `${callback_url}/api/stkPushCallback/${Order_ID}`,
        AccountReference: "Quiz App",
        TransactionDesc: "Test App Payment",
      },
    };

    // Use the 'request' library to make the HTTP request
    request(options, (error, response, body) => {
      if (error) {
        console.error("Error encountered: ", error);
        res.status(503).send({
          message: "Error with the stk push",
          error: error,
        });
      } else {
        console.log("Response Body: ", body);

        // Send the Order_ID along with the response
        res.status(200).json({ Order_ID });
      }
    });
  } catch (error) {
    console.error("Error while trying to create LipaNaMpesa details", error);
    res.status(503).send({
      message:
        "Something went wrong while trying to create LipaNaMpesa details. Contact admin",
      error: error,
    });
  }
};


export const stkPushCallback = async (req, res) => {
  try {
    const { Order_ID } = req.params;
    console.log("Order ID: ", Order_ID)
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = req.body.Body.stkCallback;
    console.log("stkCallback response", req.body.Body.stkCallback)

      const meta = CallbackMetadata.Item;
      const PhoneNumber = meta
        .find((o) => o.Name === "PhoneNumber")
        ?.Value?.toString();
      const Amount = meta.find((o) => o.Name === "Amount")?.Value?.toString();
      const MpesaReceiptNumber = meta
        .find((o) => o.Name === "MpesaReceiptNumber")
        ?.Value?.toString();
      const TransactionDate = meta
        .find((o) => o.Name === "TransactionDate")
        ?.Value?.toString();

      console.log("-".repeat(20), " OUTPUT IN THE CALLBACK ", "-".repeat(20));
      console.log(`
    Order Id: ${Order_ID},

          MerchantRequestID: ${MerchantRequestID},
          CheckoutRequestID: ${CheckoutRequestID},
          ResultCode: ${ResultCode},
          ResultDesc: ${ResultDesc},
          PhoneNumber: ${PhoneNumber},
          Amount: ${Amount},
          MpesaReceiptNumber: ${MpesaReceiptNumber},
          TransactionDate: ${TransactionDate}
        `);

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

      res.json(true);
  
  } catch (e) {
    console.error(
      "Error while trying to update LipaNaMpesa details from the callback",
      e
    );
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
export const confirmPayment = async (req, res) => {
  try {
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";
    const auth = "Bearer " + req.safaricom_access_token;

    const timestamp = getTimestamp();
    const password = new Buffer.from(
      process.env.BUSINESS_SHORT_CODE + process.env.PASS_KEY + timestamp
    ).toString("base64");

    request(
      {
        url: url,
        method: "POST",
        headers: {
          Authorization: auth,
        },
        json: {
          BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: req.params.CheckoutRequestID,
        },
      },
      function (error, response, body) {
        if (error) {
          console.log(error);
          res.status(503).send({
            message:
              "Something went wrong while trying to create LipaNaMpesa details. Contact admin",
            error: error,
          });
        } else {
          res.status(200).json(body);
        }
      }
    );
  } catch (e) {
    console.error("Error while trying to create LipaNaMpesa details", e);
    res.status(503).send({
      message:
        "Something went wrong while trying to create LipaNaMpesa details. Contact admin",
      error: e,
    });
  }
};

