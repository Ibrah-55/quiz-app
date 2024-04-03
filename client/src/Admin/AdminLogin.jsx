import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  sendErrorMessage,
  sendInfoMessage,
  sendSuccessMessage,
  sendWarningMessage,
} from "../utils/notifier.js";
import { useDispatch } from "react-redux";
import { resetAdminData, setAdminData } from "../store/features/adminSlice.js";
import { useState } from "react";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(resetAdminData());

    if (username.length > 0 && password.length > 0) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/login`,
          {
            username,
            password,
          }
        );

        if (res.data.success) {
          sendSuccessMessage("Successfully Logged in!");
          dispatch(setAdminData({ username: username, token: res.data.token }));
          navigate("/admin-dashboard");
        } else {
          sendInfoMessage(res.data.error);
        }
      } catch (error) {
        sendErrorMessage("Error occurred while submitting");
      }
    } else {
      sendWarningMessage("Username and password are required");
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
              <div className="flex flex-row items-center justify-center lg:justify-start">
                <p className=" text-3xl">
                  Master Every Question, Ace Every Test.
                </p>
              </div>

              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
                <p className="mx-4 mb-0 text-center font-semibold "> Admin <i className="fa fa-sign-in" aria-hidden="true"> Signin</i></p>
              </div>

              <div
                className="relative mb-6 group mt-10"
                data-twe-input-wrapper-init
              >
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  required
                  className="mt-5 peer block min-h-[auto] w-full rounded border-0  px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear
   motion-reduce:transition-none dark:autofill:shadow-autofill "
                  placeholder="Enter your email address"
                />
                {/* <div className="text-red-500">{errors.email}</div> */}

                <label
                  htmlFor="username"
                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-lg transition-all duration-200 ease-out -translate-y-[1.15rem] scale-[0.8] "
                >
                  Username: <span className="text-red-500">*</span>{" "}
                </label>
              </div>

              <div className="relative mb-6 group" data-twe-input-wrapper-init>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  required
                  // pattern="^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$"
                  title="Password contains at least 8 characters with at least one special character (!@#$%^&*)"
                  className="mt-5 peer block min-h-[auto] w-full rounded border-0 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear  
    motion-reduce:transition-none dark:autofill:shadow-autofill "
                  placeholder="Enter your password"
                />
                {/* <div className="text-red-500">{errors.password}</div> */}

                <label
                  htmlFor="password"
                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-lg transition-all duration-200 ease-out -translate-y-[1.15rem] scale-[0.8] text-primary"
                >
                  Password: <span className="text-red-500">*</span>{" "}
                </label>
                
              </div>
              <div className="flex items-center">
                  <input
                    id="link-checkbox"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="link-checkbox"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-900"
                  >
                    Remember me?
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
                
              </div>
              
              <div className="flex items-center justify-between">
                <label
                  htmlFor="link-checkbox"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-700"
                >
                  User Account?{" "}
                  <a
                    href="/login"
                    className="text-blue-600 dark:text-blue-800 hover:underline"
                  >
                    Login
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

export default AdminLogin;
