import React, { useState } from "react";
import axios from 'axios'
import { RegexPatterns } from "../utils/RegexPatterns";

const initialForm = {
  phone: "",
  zipCode: "",
  email: "",
  password: "",
  SocialSecurityNo: "",
  dateOfBirth: "",
  userName: "",
  websiteUrl: "",
  creditCardNo: "",
  driverLicense: "",
  timeFormat: "",
  hexaDecimalColorCode: "",
};

const RegistrationForm = () => {

  const [form, setForm] = useState()

const handleFormSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/users", initialForm);
    
    if (res.status === 200 || res.status === 201) {
      alert("Data submitted successfully");
      setForm(initialForm); 
    } else {
      alert("Something went wrong");
    }
  } catch (error) {
    alert(error.response?.data?.message || "Server Error");
  }
};


  return (
    <div className="flex item-center justify-center  w-full bg-gray-100 min-h-screen py-8">
      <div className="p-8 rounded-[11px] shadow-md w-full max-w-md border border-white">
        <h2 className="text-2xl text-center font-bold underline">Registration Form</h2>
        <form action="" className="py-10" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <lable>Phone Number</lable>
            <input type="tel" placeholder="+1-555-123-4567 or (555) 123-4567" className="border  w-full focus:ring-1 focus:ring-black font-sans italic text-center"/>
          </div>
          <div className="mb-4">
            <lable>Zip Code</lable>
            <input type="text" placeholder="12345 or 12345-6789" maxLength={10} className="border w-full focus:ring-1 focus:ring-black italic text-center"/>
          </div>
          <div className="mb-4">
            <lable>Email</lable>
            <input type="email" placeholder="example@gmail.com" className="border w-full focus:ring-1 focus:ring-black italic text-center"/>
          </div>
          <div className="mb-4">
            <lable>Password</lable>
            <input type="password" placeholder="Enter a strong password" minLength={8} className="border w-full focus:ring-1 focus:ring-black italic text-center"/>
          </div>
          <div className="mb-4">
            <lable>Social Security Number</lable>
            <input type="tel" placeholder="123-45-6789" maxLength={11} className="border w-full focus:ring-1 focus:ring-black italic text-center"/>
          </div>
          <div className="mb-4">
            <lable>Date of Birth</lable>
            <input type="text" placeholder="MM-DD-YYYY or MM/DD/YYYY" max={10} className="border w-full focus:ring-1 focus:ring-black italic text-center"/>
          </div>
          <div className="mb-4">
            <lable>User Name</lable>
            <input type="text" placeholder="Enter your username" maxLength={20} className="border w-full focus:ring-1 focus:ring-black italic text-center"/>
          </div>
          <div className="mb-4">
            <lable>Website Url</lable>
            <input type="text" placeholder="https://example.com" className="border w-full focus:ring-1 focus:ring-black italic text-center"/>
          </div>
          <div className="mb-4">
            <lable>Credit card Number</lable>
            <input type="text" placeholder="xxxx-xxxx-xxxx-xxxx" maxLength={19} className="border w-full focus:ring-1 focus:ring-black italic text-center"/>
          </div>
          <div className="mb-4">
            <lable>Driver License</lable>
            <input type="text" placeholder="X1234567" maxLength={12} className="border w-full focus:ring-1 focus:ring-black italic text-center"/>
          </div>
          <div className="mb-4">
            <lable>Time</lable>
            <input type="text" placeholder="HH:MM AM/PM" className="border w-full focus:ring-1 focus:ring-black italic text-center"/>
          </div>
          <div className="mb-4">
            <lable>Hexadecimal Color Code</lable>
            <input type="text" placeholder="#FFF,#FFFFFF, #F2AE2B" className="border w-full focus:ring-1 focus:ring-black italic text-center"/>
          </div>
            <button type="submit" className="border rounded-[5px] w-full bg-blue-500 py-2 cursor-pointer">Register</button>
        </form>
      </div>
    </div>
  )
};

export default RegistrationForm;
