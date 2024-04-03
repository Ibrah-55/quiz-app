
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    Order_ID : {
        type : String,
    },
    MerchantRequestID: {
        type : String,
    },
    CheckoutRequestID: {
        type : String,
    },
    ResultCode: {
        type : Number,
    },

    ResultDesc: {
        type : String,
    },
    PhoneNumber: {
        type : Number,
    },
    Amount: {
        type : String,
    },
    MpesaReceiptNumber: {
        type : String,
    },
    TransactionDate: {
        type : Date
    }
},
{ timeseries: true, timestamps: true }

);


export const orderModel = new mongoose.model("order", orderSchema);
