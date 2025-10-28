import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EmailRegistration = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [otpData, setOtpData] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [disableTime, setDisableTime] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [strengthLevel, setStrengthLevel] = useState("");

  const inputs = useRef([]);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;
  const userNameRegex = /^[A-Za-z_][A-Za-z0-9_]{2,19}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const navigate = useNavigate();

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
    setEnteredOtp(
      (prev) => prev.slice(0, index) + value + prev.slice(index + 1)
    );
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    if (!userNameRegex.test(userName)) {
      setError("Enter a valid Username");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError(
        "Password must have 8+ characters, including uppercase, lowercase, number, and special character."
      );
      return;
    }

    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup/requestemail-otp",
        { userName, email, password }
      );

      console.log("OTP sent:", res.data.otp);
      alert("OTP sent to your Email Address");
      setOtpData(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup/verifyemail-otp",
        { email, userName, password, otp: enteredOtp }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsVerified(true);

      const userId = res.data.user?.id;
      navigate(`/profile/${userId}`);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "OTP verification failed";
      alert(errorMsg);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength === 0) return setStrengthLevel("");
    if (strength === 1) return setStrengthLevel("Easy");
    if (strength === 2) return setStrengthLevel("Medium");
    if (strength === 3) return setStrengthLevel("Average");
    if (strength === 4) return setStrengthLevel("Strong");
  };

  if (otpData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white dark:bg-gray-700 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden grid md:grid-cols-1 transform transition-transform duration-300 hover:scale-105 mx-auto">
          <div className="p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 400 300"
              className="mx-auto mb-6 w-48 h-48 animate-pulse"
            >
              <circle cx="200" cy="200" r="150" fill="#3B82F6" />
              <circle cx="200" cy="200" r="120" fill="#FFFFFF" />
              <circle cx="200" cy="200" r="90" fill="#3B82F6" />
              <circle cx="200" cy="200" r="60" fill="#FFFFFF" />
              <text
                x="200"
                y="200"
                textAnchor="middle"
                fill="#2563EB"
                fontSize="40"
                fontWeight="bold"
                dy=".3em"
              >
                OTP
              </text>
            </svg>

            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
              Verify OTP
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Enter the 6-digit code sent to your email
            </p>

            <form onSubmit={handleOtpVerify}>
              <div className="flex justify-center space-x-4 mb-6">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputs.current[i] = el)}
                    onChange={(e) => handleInput(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-12 h-16 text-center text-2xl border-2 border-blue-500 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      dark:bg-gray-600 dark:text-white dark:border-blue-400
                      transition-transform duration-300 hover:scale-110"
                  />
                ))}
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Didn’t receive code?{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline dark:text-blue-400 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-500"
                  onClick={handleSubmit}
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600
                transition-transform duration-300 hover:scale-105
                dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-8">
          <div>
            <img
              src="https://media.licdn.com/dms/image/v2/C510BAQFoBzmJKOzY_A/company-logo_200_200/company-logo_200_200/0/1630619835821/regalbit_solutions_logo?e=2147483647&v=beta&t=N4zeufGLJGf7cpGoaFn2Mn1mR9Gd1HYn-nZqkpaXaa8"
              className="w-32 mx-auto"
              alt="Logo"
            />
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold mt-3 mb-3">
              Create account using Email
            </h1>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="w-full flex-1 mt-2">
              <div className="flex flex-col items-center">
                <button
                  className="w-full mb-3 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow"
                  onClick={() => navigate("/login")}
                >
                  <div className="bg-white p-1 rounded-full">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 21H9a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                      <polyline points="17 21 17 13 11 13 11 21" />
                      <polyline points="12 3 12 8 17 8" />
                    </svg>
                  </div>
                  <span className="ml-4">Register Yourself</span>
                </button>

                <button
                  className="w-full mb-3 max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow"
                  onClick={() => navigate("/phone")}
                >
                  <div className="bg-white p-1 rounded-full">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 16.92V21a2 2 0 01-2.18 2A19.8 19.8 0 013 5.18 2 2 0 015 3h4.09a1 1 0 011 .75l1.12 4.49a1 1 0 01-.27.95l-2.2 2.2a16 16 0 006.41 6.41l2.2-2.2a1 1 0 01.95-.27l4.49 1.12a1 1 0 01.75 1z" />
                    </svg>
                  </div>
                  <span className="ml-4">Sign Up with Phone Number</span>
                </button>

                <button
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow"
                  onClick={() => navigate("/login")}
                >
                  <div className="bg-white p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-gray-800"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                    </svg>
                  </div>
                  <span className="ml-4">Already have an account?</span>
                </button>
              </div>

              <div className="my-5 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or continue with your username
                </div>
              </div>

              <div className="mx-auto max-w-xs">
                <form onSubmit={handleSubmit}>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <input
                    className="w-full px-8 py-4 mt-5 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="relative mt-5">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPassword(value);
                        checkPasswordStrength(value);
                      }}
                    />
                    <div
                      className="absolute right-3 top-4 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>

                    <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          strengthLevel === "Easy"
                            ? "bg-red-500 w-1/4"
                            : strengthLevel === "Medium"
                            ? "bg-orange-500 w-2/4"
                            : strengthLevel === "Average"
                            ? "bg-yellow-400 w-3/4"
                            : strengthLevel === "Strong"
                            ? "bg-green-500 w-full"
                            : "w-0"
                        }`}
                      ></div>
                    </div>

                    {strengthLevel && (
                      <p
                        className={`text-sm mt-1 font-semibold ${
                          strengthLevel === "Easy"
                            ? "text-red-500"
                            : strengthLevel === "Medium"
                            ? "text-orange-500"
                            : strengthLevel === "Average"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {strengthLevel} Password
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none cursor-pointer"
                  >
                    <svg
                      className="w-6 h-6 ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">Send OTP</span>
                  </button>
                </form>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  By email address, I agree to the{" "}
                  <Link
                    to="#"
                    className="border-b border-gray-500 border-dotted"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="#"
                    className="border-b border-gray-500 border-dotted"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://cdn-jdbmd.nitrocdn.com/yEMHtyTSADNOgebFqynalakIQNihDGqu/assets/images/optimized/rev-80fa023/www.officernd.com/wp-content/uploads/2023/10/word-image-27328-2.png')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default EmailRegistration;
