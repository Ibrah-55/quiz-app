import { orderModel } from "../models/orders.model.js";
import { genObjectId } from "../utils/genId.mongodb.js";

export const checkPaymentStatus = async (req, res) => {
  try {
    const { Order_ID } = req.params;

    
      const receiptOrder = await orderModel.findOne({ Order_ID});

      if (receiptOrder) {
        if (receiptOrder) {
          res.json({ success: true, message: 'Payment Completed Successfully' });
        } else {
          res.json({ success: false, message: 'Payment Failed' });
        }
      } else {
        res.json({ success: false, message: 'Payment Not Found' });
      }
    
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.json({ success: false, message: 'Error checking payment status' });
  }
};