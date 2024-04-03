import { useState } from "react";
import {
  sendErrorMessage,
  sendInfoMessage,
  sendSuccessMessage,
} from "../utils/notifier.js";
import axios from "axios";
import {  useNavigate } from "react-router-dom";

import Loading from "../Components/Loading";
const PaymentsPage = () => {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const isPhoneValid = phone.length === 10; 
  const initiateLipaNaMpesa = async () => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/stkPush`;
    setLoading(true);
  
    try {
      const formattedPhone = `254${phone.substring(1)}`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, phone: formattedPhone }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Lipa Na M-Pesa response:", result);
  
      // Pass Order_ID to checkPaymentStatus function
      setTimeout(async () => {
        await checkPaymentStatus(result.Order_ID);
      }, 20000); // Wait for 15 seconds before checking payment status
    } catch (error) {
      console.error("Error initiating or confirming Lipa Na M-Pesa payment:", error);
    } finally {
      // setLoading(false);
    }
  };
  
  
  const checkPaymentStatus = async (Order_ID) => {

    const apiUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/api/checkPayment/${Order_ID}`;

    setLoading(true);

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response received: ", response);
      console.log("Order Id: ", Order_ID)

      if (!response.data.success) {
        console.error("Order ID is undefined or null");
        sendErrorMessage("Payment Not Found");
        return { status: "error", message: "Invalid Order ID" };
      }

      console.log("Payment status response:", response.data);

      if (response.data.success) {
        sendSuccessMessage("Payment status: Success");
        navigate("/test-dashboard")
        
        return { status: "success", message: "Payment Completed Successfully" };
      } else {
        console.error(
          `Error checking payment status: ${response.data.message}`
        );
        sendErrorMessage("Payment Not Found");
        return { status: "error", message: "Error checking payment status" };
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      sendErrorMessage("Payment Not Found");
      return { status: "error", message: "Error checking payment status" };
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-slate-950">
          <div className="flex items-center justify-between gap-2 flex-col p-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white border-r-2 border-b-2"></div>
            <p className="m-1 p-1 text-slate-500 text-sm">
              Processing your request, check your mobile phone to complete payment
            </p>
          </div>
        </div>
      ) : (
        <html className="h-screen">
          <body className="dark:bg-slate-900 bg-gray-100 flex h-full items-center py-16">
            <main className="w-full max-w-md mx-auto p-6">
              <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="p-4 sm:p-7">
                  <div className="text-center">
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                      Lipa na Mpesa
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <a
                        className="text-green-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        href="#"
                      >
                        powered by Safaricom Mpesa
                      </a>
                    </p>
                  </div>
  
                  <div className="mt-5">
                    <form>
                      <div className="grid gap-y-4">
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm mb-2 dark:text-white"
                          >
                            Phone Number
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              id="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              name="Phone number"
                              maxLength={10}
                              className="py-3 px-4 block w-full
                               border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500
                                disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700
                                 dark:text-gray-400 dark:focus:ring-gray-600"
                              required
                              aria-describedby="phone-error"
                              placeholder="07---"
                            />
  
                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                              <svg
                                className="size-5 text-red-500"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                              </svg>
                            </div>
                          </div>
                          <p
                            className={`text-xs ${isPhoneValid ? "hidden" : "text-red-600"} mt-2`}
                            id="phone-error"
                          >
                            Enter a valid 10-digit Phone Number
                          </p>
                        </div>
                        <div className="block rounded-lg text-center text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white">
                          <div className="border-b-2 border-neutral-100 px-6 py-3 dark:border-white/10">
                            Get access to tests
                          </div>
                          <div className="p-6">
                            <h5 className="mb-2 text-xl font-medium leading-tight ">
                              Master Every Question, Ace Every Test.
                            </h5>
                          </div>
                          <div className="border-t-2 border-neutral-100 px-6 py-3 text-surface/75 dark:border-white/10 dark:text-neutral-300">
                            Amount KSH 1
                          </div>
                        </div>
  
                        <button
                          type="button"
                          onClick={initiateLipaNaMpesa}
                          disabled={loading || !isPhoneValid}
                          className="w-full py-3 px-4 inline-flex justify-center items-center 
                          gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white
                          hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        >
                          {loading ? (
                            <span>Processing your Request...</span>
                          ) : (
                            <span>Proceed to Payment</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </main>
          </body>
        </html>
      )}
    </>
  );
  
};

export default PaymentsPage;
