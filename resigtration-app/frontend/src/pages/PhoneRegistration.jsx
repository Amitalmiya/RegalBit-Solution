import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const PhoneRegistration = () => {
  const [userName, setUserName] = useState("");

  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [enteredOtp, setEnteredOtp] = useState("");

  const [isVerified, setIsVerified] = useState(false);

  const [disableTime, setDisableTime] = useState(0);

  const navigate = useNavigate();
  const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/;

  const userNameRegex = /^[A-Za-z_][A-Za-z0-9_]{2,19}$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!indianPhoneRegex.test(phone)) {
      setError("Enter a valid Indian phone number");
      return;
    }

    if (!userNameRegex.test(userName)) {
      setError("Enter a valid username");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("Enter a valid password");
      return;
    }
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup/requestphone-otp",
        {
          userName,
          password,
          phone,
        }
      );

      console.log("OTP sent:", res.data.otp);
      alert("OTP sent to your phone number!");
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!enteredOtp) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup/verifyphone-otp",
        {
          userName,
          phone,
          password,
          otp: enteredOtp,
        }
      );

      alert(res.data.message);
      setIsVerified(true);
      navigate("/users");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "OTP verification failed");
      
      if (err.response?.data?.error?.includes("Try again in")) {
        const match = err.response.data.error.match(/(\d+)/);
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
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 py-20">
      <div className="p-8 rounded-[11px] shadow-md w-full max-w-md border border-white">
        <h2 className="text-2xl text-center font-bold underline">
          Login / Signup with Phone Number
        </h2>

        {!otpSent ? (
          <form onSubmit={handleRequestOtp} className="py-10">
            <div className="mb-1">
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
            <div className="mb-3">
              <label className="italic">Phone No (+91 IND):</label>
              <input
                type="tel"
                placeholder="9825142563"
                className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
                maxLength={13}
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setPhone(value.slice(0, 10));
                }}
                required
              />

              {error && <p className="text-red-500 italic mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              className="italic mb-5 border rounded-[5px] w-full bg-blue-500 py-2 cursor-pointer hover:bg-blue-300"
            >
              Send OTP
            </button>

            <div className="mb-3 text-center space-y-2">
              <Link
                to="/email"
                className="italic text-sm block text-blue-800 underline hover:text-red-500"
              >
                Login with Email
              </Link>
              <Link
                to="/"
                className="underline text-sm text-blue-800 italic block hover:text-red-500"
              >
                Register Yourself
              </Link>
            </div>
          </form>
        ) : !isVerified ? (
          <form onSubmit={handleVerifyOtp} className="py-10">
            <div className="mb-3">
              <label className="italic">Enter OTP : </label>
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
              Phone Number Verified! You are logged in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneRegistration;
