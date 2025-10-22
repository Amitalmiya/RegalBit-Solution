import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        firstName,
        lastName,
        email,
        password,
      });

      if (res.status === 200 || res.status === 201) {
        setSuccess("Account created successfully!");
        alert("Registered successfully!");
        navigate("/login"); // Redirect to login page
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error. Try again later.");
      console.log(err);
    }
  };

  return (
    <div className="h-full bg-gray-400 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full xl:w-3/4 lg:w-11/12 flex flex-wrap shadow-lg">
        {/* Left Image */}
        <div
          className="hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
          style={{
            backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo1p1or7yHxB-dHShQiLBbjxFussSdOFZmyQ&s')",
          }}
        ></div>

        {/* Form */}
        <div className="w-full lg:w-7/12 bg-white dark:bg-gray-700 p-6 lg:rounded-l-none rounded-lg">
          <h3 className="py-4 text-2xl text-center text-gray-800 dark:text-white font-bold">
            Create an Account!
          </h3>

          {error && <p className="text-red-500 text-center mb-3">{error}</p>}
          {success && <p className="text-green-500 text-center mb-3">{success}</p>}

          <form className="px-4 pt-6 pb-8 mb-4 bg-white dark:bg-gray-800 rounded" onSubmit={handleSubmit}>
            <div className="mb-4 md:flex md:justify-between">
              <div className="mb-4 md:mr-2 md:mb-0">
                <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="md:ml-2">
                <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4 md:flex md:justify-between">
              <div className="mb-4 md:mr-2 md:mb-0">
                <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="******************"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="md:ml-2">
                <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="******************"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            <div className="mb-6 text-center">
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
              >
                Register Account
              </button>
            </div>

            <hr className="mb-6 border-t" />

            <div className="text-center">
              <a className="inline-block text-sm text-blue-500 dark:text-blue-400 hover:text-blue-800" href="#">
                Forgot Password?
              </a>
            </div>
            <div className="text-center mt-2">
              <a className="inline-block text-sm text-blue-500 dark:text-blue-400 hover:text-blue-800" href="/login">
                Already have an account? Login!
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
