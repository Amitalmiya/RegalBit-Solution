import React, { useState, useEffect } from "react";
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
  
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  

  const navigate = useNavigate();

  const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/;
  
  const userNameRegex = /^[A-Za-z_][A-Za-z0-9_]{2,19}$/;
  
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    let timer;
    if (disableTime > 0) {
      timer = setInterval(() => {
        setDisableTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [disableTime]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!indianPhoneRegex.test(phone)) return setError("Enter a valid Indian phone number");
    if (!userNameRegex.test(userName)) return setError("Enter a valid username");
    if (!passwordRegex.test(password)) return setError("Enter a valid password");

    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup/requestphone-otp", {
        userName,
        password,
        phone,
      });

      console.log("OTP sent:", res.data.otp);
      alert("OTP sent to your phone number!");
      setOtpSent(true);
      setAttemptsLeft(3);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!enteredOtp) return setError("Please enter the OTP");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup/verifyphone-otp", {
        userName,
        phone,
        password,
        otp: enteredOtp,
      });

      console.log("Login with Phone Response", res.data);
      localStorage.setItem("token", res.data.token);
      setIsVerified(true);
      navigate(`/profile/${res.data.token}`);
      alert("Registration Successful! Redirecting to profile...");
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMessage = err.response?.data?.error || "OTP verification failed";
      alert(errorMessage);

      if (errorMessage.includes("Try again in")) {
        const match = errorMessage.match(/(\d+)/);
        if (match) {
          setDisableTime(parseInt(match[1], 10) * 60);
        }
      }

      // Track attempts
      setAttemptsLeft((prev) => {
        const newAttempts = prev - 1;
        if (newAttempts <= 0) {
          setError("You have used all attempts. Please try again later.");
        } else {
          setError(`Wrong OTP. ${newAttempts} attempts left.`);
        }
        return newAttempts;
      });
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 py-20">
      <div className="p-8 rounded-[11px] shadow-md w-full max-w-md border border-white bg-white">
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
                className="border w-full text-center italic focus:ring-1 focus:ring-black"
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
                className="border w-full text-center italic focus:ring-1 focus:ring-black"
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
                className="border w-full text-center italic focus:ring-1 focus:ring-black"
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
              className="italic mb-5 border rounded-[5px] w-full bg-blue-500 py-2 text-white cursor-pointer hover:bg-blue-600"
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
              <label className="italic">Enter OTP:</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="border w-full text-center italic focus:ring-1 focus:ring-black"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            {disableTime > 0 ? (
              <p className="text-center text-red-600 italic mb-2">
                Please wait {formatTime(disableTime)} before retrying.
              </p>
            ) : (
              <p className="text-center italic text-gray-700 mb-2">
                Attempts left: {attemptsLeft}
              </p>
            )}

            <button
              type="submit"
              disabled={disableTime > 0 || attemptsLeft <= 0}
              className={`italic border rounded-[5px] w-full py-2 text-white ${
                disableTime > 0 || attemptsLeft <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {disableTime > 0
                ? `Wait (${formatTime(disableTime)})`
                : "Verify OTP"}
            </button>

            {error && <p className="text-red-500 text-center italic mt-3">{error}</p>}
          </form>
        ) : (
          <div className="text-center py-10">
            <p className="text-green-600 font-bold italic">
              ✅ Phone Number Verified! You are logged in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneRegistration;
