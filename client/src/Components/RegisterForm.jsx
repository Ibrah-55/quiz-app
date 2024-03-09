import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  sendSuccessMessage,
  sendInfoMessage,
  sendErrorMessage,
} from "../utils/notifier.js";
import { initializeRazorpay } from "../RazorpayPayment/Razorpay.initializepayment.js";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    paymentError: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate each field
    Object.keys(formData).forEach((key) => {
      if (formData[key].trim() === "") {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
        isValid = false;
      } else {
        newErrors[key] = "";
      }
    });

    //validate mobile number
    if (
      formData.mobileNumber.length !== 10 ||
      formData.mobileNumber.length !== 12
    ) {
      newErrors.password = "Mobile number should be of 10 digit";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    // Validate password length
    if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    // Validate password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePayment = async () => {
    try {
      const isInitialized = await initializeRazorpay();
      if (!isInitialized) {
        const error = new Error("Falied to initialize the RazorPay");
        throw error;
      }

      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/payment-gateway/create-order/quiz-app`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
        }
      );

      const userId = res.data.orderResponse.userId;

      let options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        name: "Scholarship",
        currency: res.data.orderResponse.currency,
        amount: res.data.orderResponse.amount,
        order_id: res.data.orderResponse.id,
        description: "This is scholarship app payment",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMIC3apFP9-9hghtlDJWO_pR5DZpoq3aO4Bw&usqp=CAU",
        handler: async (response) => {
          await registerUser(response, userId);
        },
        prefill: {
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          contact: formData.mobileNumber,
        },
        notes: {
          note: "payment using Razorpay gateway",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();

      paymentObject.on("payment.failed", (error) => {
        console.error(error);
        sendErrorMessage("Payment failed");
      });
    } catch (error) {
      sendErrorMessage("Failed to get the pop up for payment");
    }
    return false;
  };

  const registerUser = async (checkout_result, userId) => {
    try {
      // registering the user
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        orderId: checkout_result.razorpay_order_id,
        paymentId: checkout_result.razorpay_payment_id,
        paymentSignature: checkout_result.razorpay_signature,
        userId: userId,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/user-signup`,
        data
      );

      if (res.data.error) {
        sendSuccessMessage(res.data.message);
        sendInfoMessage("Now you can login");
        navigate("/login");
      } else {
        sendErrorMessage(res.data.error);
      }
    } catch (success) {
      sendErrorMessage("Failed to register user");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
      navigate("/login");
    } else {
      sendInfoMessage("Error Registering user");
    }

    setLoading(false);
  };

  return (
    <>
      <section>
        <div className="flex h-screen flex-wrap items-center justify-center lg:justify-between">
          <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample image"
            />
          </div>

          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-8/12 xl:w-5/12">
            {/* <div
              className="flex flex-row items-center justify-center lg:justify-start">
              <p className="mb-0 me-4 text-lg">Enr </p>

            </div> */}

            <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
              <p className="mx-4 mb-0 text-center font-semibold ">
                Create an account
              </p>
            </div>
            <form className="flex flex-col gap-2 p-1.5" onSubmit={handleSubmit}>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium "
                  >
                    First Name: <span className="text-red-500">*</span>{" "}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="First name"
                  />
                  <div className="text-red-500">{errors.firstName}</div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium "
                  >
                    Last Name: <span className="text-red-500">*</span>{" "}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="off"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Last name"
                    required
                  />
                  <div className="text-red-500">{errors.lastName}</div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium "
                  >
                    Email Address: <span className="text-red-500">*</span>{" "}
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="on"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Email"
                    required
                  />

                  <div className="text-red-500">{errors.email}</div>
                </div>
                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="block mb-2 text-sm font-medium "
                  >
                    Mobile Number: <span className="text-red-500">*</span>{" "}
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    autoComplete="on"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="+254---"
                    required
                  />
                  <div className="text-red-500">{errors.mobileNumber}</div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium "
                  >
                    Password: <span className="text-red-500">*</span>{" "}
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="off"
                    pattern="^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="•••••••••"
                    required
                    title="Please use at least 8 characters with at least one special character (!@#$%^&*)"

                  />
                  <div className="text-red-500">{errors.password}</div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium "
                  >
                    Confirm Password: <span className="text-red-500">*</span>{" "}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="off"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="•••••••••"
                    required
                  />
                  <div className="text-red-500">{errors.confirmPassword}</div>
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <label for="remember" className="ms-2 text-sm font-medium">
                  I agree with the{" "}
                  <a
                    href="#"
                    className="text-blue-800 hover:underline dark:text-blue-600"
                  >
                    terms and conditions
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {loading ? (
                  <span>Loading ...</span>
                ) : (
                  <spa>Register your account</spa>
                )}
              </button>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="link-checkbox"
                  className="ms-2 mb-4 text-sm font-medium text-gray-900 dark:text-gray-700"
                >
                  Have an Account?{" "}
                  <a
                    href="/login"
                    className="text-blue-600 dark:text-blue-800 hover:underline"
                  >
                    Login
                  </a>
                  .
                </label>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
