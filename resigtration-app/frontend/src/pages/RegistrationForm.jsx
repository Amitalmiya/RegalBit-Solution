import React, { useState } from "react";
import axios from "axios";
import { RegexPatterns } from "../utils/RegexPatterns";
import { Link, useNavigate } from "react-router-dom";

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
    option: ["Male", "Female", "Other"],
  },
  {
    name: "bloodGroup",
    label: "Blood Group :",
    type: "select",
    option: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
  },
];

const RegistrationForm = () => {
  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});

  const [step, setStep] = useState(0);

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
  const totalSteps = Math.ceil(fields.length / fieldsPerStep)
  const currentFields = fields.slice(step * fieldsPerStep, (step + 1) * fieldsPerStep)

  return (
    <div className="flex item-center justify-center w-full min-h bg-full bg-gray-100 py-20">
      <div className="p-8 rounded-[11px] shadow-md w-full max-w-md border border-white">
        <div className="flex justify-between mb-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
            key={index}
            className={`w-8 h-8 flex item-center justify-center rounded-full text-sm items-center italic ${
              index === step
              ? "bg-blue-500 text-white" 
              : index < step
              ? "bg-green-400 text-white"
              : "bg-gray-300 text-gray-600"
            }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <h2 className="text-2xl text-center font-bold underline">
          Registration Form
        </h2>
        <p className="text-center text-gray-500 mb-8 italic">
          Step {step + 1} of {totalSteps}
        </p>

        <form className="py-10" onSubmit={handleFormSubmit}>
          {currentFields.map(
            ({
              name,
              label,
              type,
              placeholder,
              maxLength,
              minLength,
              option = [],
            }) => (
              <div className="mb-4" key={name}>
                <label className="italic">{label}</label>

                {type === "select" ? (
                  <select
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
                    required
                  >
                    <option value="">Select {label.replace(":", "")}</option>
                    {option.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
                    value={form[name]}
                    onChange={handleChange}
                    required
                    maxLength={maxLength}
                    minLength={minLength}
                  />
                )}
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1 italic">
                    {errors[name]}
                  </p>
                )}
              </div>
            )
          )}

          <div className="flex justify-between mt-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="italic text-white border rounded-[5px] bg-gray-800 px-4 py-2 hover:bg-gray-400"
              >
                Back
              </button>
            )}

            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                className="italic text-white mb-3 border rounded-[5px] bg-blue-500 px-4 py-2 hover:bg-blue-300 ml-auto "
              >
                Next
              </button>
            ) : (
              <div className="">
                <button
                  type="submit"
                  className="italic border rounded-[5px] bg-blue-500 px-4 py-2 hover:bg-blue-300 ml-auto"
                >
                  Register
                </button>
              </div>
            )}
          </div>
          <div className="text-center justify-center">
            <Link
              to="/email"
              className="underline mb-2 italic text-sm block text-blue-800 underline hover:text-red-500 "
            >
              Login with Email
            </Link>
            <Link
              to="/phone"
              className="underline text-sm text-blue-800 italic block hover:text-red-500"
            >
              Login with Phone(IND +91)
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
