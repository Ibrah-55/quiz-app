import { authModel } from "../models/auth.model.js";
import { ValidateEmail } from "../utils/email.validator.js";
import {
  getHashedPassword,
  comparePassword,
} from "../utils/genHashedPassword.js";
import { generateToken } from "../utils/webToken.js";
import { orderModel } from "../models/orders.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

export const userSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNumber, password, userId } = req.body;

    // Validate user input
    if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      email.length === 0 ||
      mobileNumber.length === 0 ||
      password.length === 0 ||
      !ValidateEmail(email) ||
      userId.length === 0
    ) {
      const err = new Error("Invalid details entered");
      throw err;
    }

    // Check if the user already exists
    const existingUser = await authModel.findOne({ email });
    if (existingUser) {
      const err = new Error("User already exists");
      throw err;
    }

    // Save the user to the database
    const hashedPassword = getHashedPassword(password);
    const user = new authModel({
      _id: userId, // Assuming userId is unique and provided during signup
      firstName,
      lastName,
      email,
      mobileNumber,
      password: hashedPassword,
    });
    await user.save();

    res.json({ success: true, message: "Signup successful" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validating details
    if (email.length == 0 || password.length == 0 || !ValidateEmail(email)) {
      const err = new Error("Invalid details");
      throw err;
    }

    // finding user in database
    const user = await authModel.findOne({ email });
    if (!user) {
      const err = new Error("User not found");
      throw err;
    }

  

    // generating token
    const token = generateToken(user._id);

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      regd: user.createdAt,
      token: token,
    };

    res.json({ success: true, message: "Login Successfull", userData });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
