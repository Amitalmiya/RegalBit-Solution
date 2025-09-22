import React, { useState } from "react";
import { Link } from "react-router-dom";
import { genrateOtpExpiry } from "../utils/OtpGenrator";

const PhoneRegistration = () => {
  const [indPhone, setIndPhone] = useState("");

  const [error, setError] = useState("");

  const [otpData, setOtpData] = useState(null);

  const [enteredOtp, setEnteredOtp] = useState("");

  const [isVerified, setIsVerified] = useState(false);

  const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/;

  const handleChange = (e) => {
    setIndPhone(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!indianPhoneRegex.test(indPhone)) {
      setError("Enter a valid Phone number with +91");
      return;
    }
    setError("")

    const {otp, expireTime} = genrateOtpExpiry(60);
    setOtpData({otp, expireTime});

    console.log(`Genrated OTP`, otp);
    alert("OTP sent to your Phone number!");
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if(!otpData) return;

    if(Date.now()> otpData.expireTime){
      alert(`OTP expired. Please try again.`)
      return;
    }
    if (enteredOtp === otpData.otp) {
      setIsVerified(true);
      alert("Phone verified successfully. Logged in!");
    } else {
      alert("Invalid OTP. try again.");
    }
  }
  return (
    <div className="flex item-center justify-center w-full min-h bg-full bg-gray-100 py-20">
      <div className="p-8 rounded-[11px] shadow-md w-full max-w-md border border-white">
        <h2 className="text-2xl text-center font-bold underline">
          Login with Phone Number
        </h2>
        {!otpData ? (

        <form action="" className="py-10" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="" className="italic">
              Phone No (+91 IND) :
            </label>
            <input
              type="tel"
              placeholder="+919825142563"
              className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
              maxLength={13}
              value={indPhone}
              onChange={handleChange}
              required
            />
            {error && <p className="text-red-500 italic mt-1">{error}</p>}
          </div>
            <button
              type="submit"
              className="italic border rounded-[5px] w-full bg-blue-500 py-2 cursor-pointer hover:bg-blue-300 "
            >
              Sign up with OTP
            </button>
             <div className="mb-3 text-center space-y-2">
            <Link
              to="/email"
              className="italic text-sm block text-blue-800 w-full py-1 cursor:pointer underline hover:text-red-500"
            >
              Login with Email
            </Link>
            <Link
              to="/"
              className="underline text-sm text-blue-800 italic block w-full py-1 cursor:pointer hover:text-red-500"
            >
              Register Yourself
            </Link>
          </div>
        </form>
        ): !isVerified ? (
          <form className="py-10" onSubmit={handleOtpVerify}>
            <div className="mb-3">
              <label className="italic">Enter OTP :</label>
              <input 
              type="text"
              placeholder="Enter 6-digit OTP"
              className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
              value={enteredOtp}
              onChange={(e)=> setEnteredOtp(e.target.value)}
              required
              />
            </div>
            <button type="submit"
              className="italic border rounded-[5px] w-full bg-green-500 py-2 cursor-pointer hover:bg-green-300"
            >Verify Otp</button>
          </form>
        ) : (
          <div className="text-center py-10">
            <p className="text-green-600 font-bold italic">Phone Number Verified! You are logged in.</p>
          </div>
        )}
       
      </div>
    </div>
  );
};

export default PhoneRegistration;
