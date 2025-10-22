import React, { useState } from "react";
import axios from "axios";
import { RegexPatterns } from "../utils/RegexPatterns";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const initialForm = {
  phone: "",
  zipCode: "",
  email: "",
  password: "",
  socialSecurityNo: "",
  dateOfBirth: "",
  userName: "",
  websiteUrl: "",
  creditCardNo: "",
  driverLicense: "",
  timeFormat: "",
  hexaDecimalColorCode: "",
  gender: "",
  bloodGroup: "",
};

const fields = [
  {
    name: "phone",
    label: "Phone Number :",
    type: "tel",
    placeholder: "+1-555-123-4567 or (555) 123-4567",
  },
  {
    name: "zipCode",
    label: "Zip Code :",
    type: "text",
    placeholder: "12345 or 12345-6789",
    maxLength: 10,
  },
  {
    name: "email",
    label: "Email :",
    type: "email",
    placeholder: "example@gmail.com",
  },
  {
    name: "password",
    label: "Password :",
    type: "password",
    placeholder: "Enter a strong password",
    minLength: 8,
  },
  {
    name: "socialSecurityNo",
    label: "Social Security Number :",
    type: "tel",
    placeholder: "123-45-6789",
    maxLength: 11,
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth :",
    type: "text",
    placeholder: "MM-DD-YYYY or MM/DD/YYYY",
    maxLength: 10,
  },
  {
    name: "userName",
    label: "Username :",
    type: "text",
    placeholder: "Enter your name",
    maxLength: 20,
  },
  {
    name: "websiteUrl",
    label: "Website Url :",
    type: "text",
    placeholder: "https://example.com",
  },
  {
    name: "creditCardNo",
    label: "Credit Card Number :",
    type: "text",
    placeholder: "xxxx-xxxx-xxxx-xxxx",
    maxLength: 19,
  },
  {
    name: "driverLicense",
    label: "Driver License :",
    type: "text",
    placeholder: "X12X456",
    maxLength: 12,
  },
  {
    name: "timeFormat",
    label: "Time :",
    type: "text",
    placeholder: "HH:MM AM/PM",
    maxLength: 9,
  },
  {
    name: "hexaDecimalColorCode",
    label: "Hexadecimal Color Code :",
    type: "text",
    placeholder: "#FFF, #FFFFFF, #F5A52S",
  },
  {
    name: "gender",
    label: "Gender :",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  {
    name: "bloodGroup",
    label: "Blood Group :",
    type: "select",
    options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
  },
];

const RegistrationForm = () => {
  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});

  const [step, setStep] = useState(0);

  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!RegexPatterns.phone.test(form.phone)) {
      newErrors.phone = "Invalid Phone Number";
    }
    if (!RegexPatterns.zipCode.test(form.zipCode)) {
      newErrors.zipCode = "Invalid Zip Code";
    }
    if (!RegexPatterns.email.test(form.email)) {
      newErrors.email = "Invalid Email";
    }
    if (!RegexPatterns.password.test(form.password)) {
      newErrors.password = "Invalid Password";
    }
    if (!RegexPatterns.socialSecurityNo.test(form.socialSecurityNo)) {
      newErrors.socialSecurityNo = "Invalid Social Security No";
    }
    if (!RegexPatterns.dateOfBirth.test(form.dateOfBirth)) {
      newErrors.dateOfBirth = "Invalid Date of Bith";
    }
    if (!RegexPatterns.userName.test(form.userName)) {
      newErrors.userName = "Invalid Username";
    }
    if (!RegexPatterns.websiteUrl.test(form.websiteUrl)) {
      newErrors.websiteUrl = "Invalid WebsiteURL";
    }
    if (!RegexPatterns.creditCardNo.test(form.creditCardNo)) {
      newErrors.creditCardNo = "Invalid Credit Card Number";
    }
    if (!RegexPatterns.driverLicense.test(form.driverLicense)) {
      newErrors.driverLicense = "Invalid Driver License";
    }
    if (!RegexPatterns.timeFormat.test(form.timeFormat)) {
      newErrors.timeFormat = "Invalid Time Format";
    }
    if (!RegexPatterns.hexaDecimalColorCode.test(form.hexaDecimalColorCode)) {
      newErrors.hexaDecimalColorCode = "Invalid Hexadecimal Color Code";
    }
    if (!form.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!form.bloodGroup) {
      newErrors.bloodGroup = "Blood Group is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      alert(newErrors[firstErrorKey]);
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/users", form);

      console.log("Registration Response:", res.data);

      if (res.status === 200 || res.status === 201) {
        alert("Data submitted successfully");
        setForm(initialForm);

        const token = res.data.token || res.data.user?.id;
        if (!token) {
          console.error("User ID not found in response!");
          return;
        }
        localStorage.setItem("token", token);

        navigate(`/profile/${token}`);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert(error.response?.data?.message || "Server Error");
    }
  };

  const fieldsPerStep = 4;
  const totalSteps = Math.ceil(fields.length / fieldsPerStep);
  const currentFields = fields.slice(
    step * fieldsPerStep,
    (step + 1) * fieldsPerStep
  );

   return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex flex-1">
        <div className="flex-1 bg-indigo-100 hidden lg:flex justify-center items-center">
          <div
            className="m-12 xl:m-16 w-full h-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://img.freepik.com/free-vector/freelance-remote-workers-flat-composition-with-domestic-scenery-woman-working-home-with-laptop_1284-59822.jpg?semt=ais_incoming&w=740&q=80')" }}
          />
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-8">
          <img src="https://media.licdn.com/dms/image/v2/C510BAQFoBzmJKOzY_A/company-logo_200_200/company-logo_200_200/0/1630619835821/regalbit_solutions_logo?e=2147483647&v=beta&t=N4zeufGLJGf7cpGoaFn2Mn1mR9Gd1HYn-nZqkpaXaa8" alt="Logo" className="w-28 mx-auto mb-4" />
          <h1 className="text-2xl xl:text-3xl font-extrabold mb-6 text-center">Register a new account</h1>

          <div className="flex justify-center mb-6 space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${index === step ? "bg-blue-500 text-white" : index < step ? "bg-green-400 text-white" : "bg-gray-300 text-gray-600"}`}>
                {index + 1}
              </div>
            ))}
          </div>
            
          <form onSubmit={handleFormSubmit} className="mx-auto max-w-xs">
            {currentFields.map((field) => (
              <div className="mb-4 relative" key={field.name}>
                <label className="block mb-1">{field.label}</label>

                {field.type === "select" ? (
                  <select name={field.name} value={form[field.name]} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-sm focus:outline-none focus:bg-white">
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <>
                    <input
                      name={field.name}
                      type={field.name === "password" ? (showPassword ? "text" : "password") : field.type}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-sm focus:outline-none focus:bg-white"
                    />
                    {field.name === "password" && (
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 cursor-pointer text-gray-600 hover:text-gray-900"
                      >
                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                      </span>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-5">
              {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Back</button>}
              {step < totalSteps - 1 ? (
                <button type="button" onClick={() => setStep(step + 1)} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 ml-auto">Next</button>
              ) : (
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto">Register</button>
              )}
            </div>

            <div className="mt-4 flex flex-col space-y-2 text-center">
              <Link to="/login" className="text-blue-500 hover:underline">Already have an account?</Link>
              <Link to="/email" className="text-blue-500 hover:underline">Create an account with Phone</Link>
              <Link to="/phone" className="text-blue-500 hover:underline">Create an account with Email</Link>
            </div>
          </form>

          <p className="mt-6 text-xs text-gray-600 text-center">
            By registering, I agree to the{" "}
            <Link to="#" className="border-b border-gray-500 border-dotted">Terms of Service</Link> and{" "}
            <Link to="#" className="border-b border-gray-500 border-dotted">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
