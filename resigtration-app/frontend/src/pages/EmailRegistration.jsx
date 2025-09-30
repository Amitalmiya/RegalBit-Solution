import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const EmailRegistration = () => {

  const [email, setEmail] = useState("");

  const [userName, setUserName] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [otpData, setOtpData] = useState(null);

  const [enteredOtp, setEnteredOtp] = useState("");

  const [isVerified, setIsVerified] = useState(false);

  const [disableTime, setDisableTime] = useState(0);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;

  const userNameRegex = /^[A-Za-z_][A-Za-z0-9_]{2,19}$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!userNameRegex.test(userName)) {
      setError("Enter a valid Username");
    }
    if (!passwordRegex.test(password)) {
      setError("Enter a valid Password");
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
        {
          userName,
          email,
          password,
          otp: enteredOtp,
        }
      );
      alert(res.data.message);
      setIsVerified(true);
      navigate("/users");
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
      if (error.response?.data?.error?.includes("Try again in")) {
        const match = error.response.data.error.match(/(\d+)/);
        if (match) {
          setDisableTime(parseInt(match[1]) * 60);
          const timer = setInterval(() => {
            setDisableTime((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
    }
  };

  return (
    <div className="flex item-center justify-center w-full min-h bg-full bg-gray-100 py-20">
      <div className="p-8 rounded-[11px] shadow-md w-full max-w-md border border-white">
        <h2 className="text-2xl text-center font-bold underline">
          Login with Email Address
        </h2>

        {!otpData ? (
          <form action="" className="py-10" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="italic">Username :</label>
              <input
                type="text"
                placeholder="Enter your Username"
                className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="" className="italic">
                Email Address :
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
                value={email}
                onChange={handleChange}
                required
              />
              <div className="mb-3">
                <label className="italic">Password :</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 italicmt-1">{error}</p>}
            </div>
            <button
              type="submit"
              className="italic border rounded-[5px] w-full bg-blue-500 py-2 cursor-pointer hover:bg-blue-200 "
            >
              Sign up with OTP
            </button>
            <div className="mb-3 text-center space-y-2">
              <Link
                to="/phone"
                className="mt-3 italic text-sm block text-blue-800 w-full py-1 cursor:pointer underline hover:text-red-500"
              >
                Login with (+91 IND)Phone Number
              </Link>
              <Link
                to="/"
                className="underline text-sm text-blue-800 italic block w-full py-1 cursor:pointer hover:text-red-500"
              >
                Register Yourself
              </Link>
            </div>
          </form>
        ) : !isVerified ? (
          <form className="py-10" onSubmit={handleOtpVerify}>
            <div className="mb-3">
              <label className="italic">Enter OTP :</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              className="italic border rounded-[5px] w-full bg-green-500 py-2 cursor-pointer hover:bg-green-300"
              disabled={disableTime > 0}
            >
              {disableTime > 0
                ? `Try again in ${Math.ceil(disableTime / 60)} min`
                : "Verify OTP"}
            </button>
          </form>
        ) : (
          <div className="text-center py-10">
            <p className="text-green-600 font-bold italic">
              Email Verified! You are logged in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailRegistration;
