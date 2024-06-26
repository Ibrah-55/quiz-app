import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TestDashboard from "./pages/TestDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TestPreview from "./pages/TestPreview";
import TestResult from "./pages/TestResult";
import Quiz from "./Quiz/Quiz";
import ErrorPage from "./pages/ErrorPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Private from "./pages/Private";
import PrivateRoute from "./pages/PrivateRoute";
import AdminLogin from "./Admin/AdminLogin";
import AdminSignup from "./Admin/AdminSignup";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminPrivate from "./Admin/AdminPrivate";
import Home from "./pages/Home";
import PaymentsPage from "./pages/paymenstPage";
const App = () => {
  const CompanyName = "Think Twice";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />

        <Route element={<PrivateRoute/>}>
          <Route
            path="/test-dashboard"
            element={<TestDashboard TestName={CompanyName} />}
          />
          <Route
            path="/:testName"
            element={<TestPreview TestName={CompanyName} />}
          />
          <Route
            path={
              "/:testName/total-questions-/:totalQuestions/marks-per-question-/:marksPerQuestion/negative-marking-/:negativeMarking/time-available-/:timeAvailable"
            }
            element={<Quiz TestName={CompanyName} />}
          />
          <Route
            path="/:testName/result"
            element={<TestResult TestName={CompanyName} />}
          />
          
        </Route>
        <Route element={<Private />}>
        <Route
            path="/checkout"
            element={<PaymentsPage />}
          />
        </Route>
       

        <Route element={<AdminPrivate />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
