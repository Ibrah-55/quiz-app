import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { sendErrorMessage, sendSuccessMessage } from "../utils/notifier.js";
import Loading from "../Components/Loading.jsx";

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.login);
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        // Make API call to initiate payment and get Order_ID
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/stkPush`;
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

        // Pass Order_ID to fetchPayment function
        fetchPayment(result.Order_ID);
      } catch (error) {
        console.error("Error initiating or confirming Lipa Na M-Pesa payment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPayment = async (Order_ID) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/checkPayment/${Order_ID}`
        );

        if (!response.data.success) {
          console.error("Order ID is undefined or null");
          navigate("/checkout");
          sendErrorMessage("Payment Not Found");
          return;
        }

        console.log("Payment status response:", response.data);

        if (response.data.success) {
          sendSuccessMessage("Payment status: Success");
          setIsPaymentConfirmed(true);
        } else {
          console.error(
            `Error checking payment status: ${response.data.message}`
          );
          sendErrorMessage("Payment Not Found");
          navigate("/checkout");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        sendErrorMessage("Payment Not Found");
        navigate("/checkout");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      initiatePayment();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <div><Loading /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isPaymentConfirmed) {
    return <Navigate to="/checkout" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
