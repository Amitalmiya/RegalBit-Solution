import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { genrateOtpExpiry } from "../utils/OtpGenrator";

const EmailRegistration = () => {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [otpData, setOtpData] = useState(null);

  const [enteredOtp, setEnteredOtp] = useState("");

  const [isVerified, setIsVerified] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;

  const navigate = useNavigate()

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");

    const { otp, expireTime } = genrateOtpExpiry(60);
    setOtpData({ otp, expireTime });

    console.log(`Genrated OTP`, otp);
    alert("OTP send to your email address!");
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (!otpData) return;

    if (Date.now() > otpData.expireTime) {
      alert(`OTP expired. please try again.`);
      return;
    }
    if (enteredOtp === otpData.otp) {
      setIsVerified(true);
      alert("Email verified successfully.");
      navigate('/users')
    } else {
      alert("Invalid OTP. try again.");
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
                required
              />
            </div>
            <button
              type="submit"
              className="italic border rounded-[5px] w-full bg-green-500 py-2 cursor-pointer hover:bg-green-300"
            >
              Verify Otp
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
