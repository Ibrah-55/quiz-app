import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendErrorMessage, sendSuccessMessage } from "../utils/notifier";
import axios from "axios";
import { setUserData } from "../store/features/loginSlice.js";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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

    // Validate password length
    if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (validateForm()) {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/user-login`,
          formData
        );
        if (res.data.success) {
          const userData = res.data.userData;
          dispatch(
            setUserData({
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              mobileNumber: userData.mobileNumber,
              registeredAt: userData.regd,
              token: userData.token,
            })
          );
          navigate("/test-dashboard");
        } else {
          sendErrorMessage(res.data.error);
        }
      } else {
        throw new Error("Invalid details entered");
      }
    } catch (success) {
      navigate("/test-dashboard");
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

          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
            <form className="flex flex-col gap-3 p-2" onSubmit={handleSubmit}>
              <div
              className="flex flex-row items-center justify-center lg:justify-start">
              <p className=" text-3xl">Master Every Question, Ace Every Test.
 </p>

            </div>

              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
                <p className="mx-4 mb-0 text-center font-semibold ">Sign In</p>
              </div>

              <div
                className="relative mb-6 group mt-10"
                data-twe-input-wrapper-init
              >
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  className="mt-5 peer block min-h-[auto] w-full rounded border-0  px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear
   motion-reduce:transition-none dark:autofill:shadow-autofill "
                  placeholder="Enter your email address"
                />
                <div className="text-red-500">{errors.email}</div>

                <label
                  htmlFor="email"
                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-lg transition-all duration-200 ease-out -translate-y-[1.15rem] scale-[0.8] "
                >
                  Email id: <span className="text-red-500">*</span>{" "}
                </label>
              </div>

              <div className="relative mb-6 group" data-twe-input-wrapper-init>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                 // pattern="^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$"
                  title="Password contains at least 8 characters with at least one special character (!@#$%^&*)"
                  className="mt-5 peer block min-h-[auto] w-full rounded border-0 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear  
    motion-reduce:transition-none dark:autofill:shadow-autofill "
                  placeholder="Enter your password"
                />
                <div className="text-red-500">{errors.password}</div>

                <label
                  htmlFor="password"
                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-lg transition-all duration-200 ease-out -translate-y-[1.15rem] scale-[0.8] text-primary"
                >
                  Password: <span className="text-red-500">*</span>{" "}
                </label>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {loading ? <span>Logging in...</span> : <span>Login</span>}
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
                <div className="flex items-center">
                  <input
                    id="link-checkbox"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="link-checkbox"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-900"
                  >
                    Remember me?
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label
                  for="link-checkbox"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-700"
                >
                  Don't have an Account?{" "}
                  <a
                    href="/signup"
                    className="text-blue-600 dark:text-blue-800 hover:underline"
                  >
                    Register
                  </a>
                  .
                </label>
              </div>

              <div className="text-center lg:text-left"></div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
