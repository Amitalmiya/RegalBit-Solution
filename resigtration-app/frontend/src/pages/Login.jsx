import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userName || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        userName,
        password,
      });

      if (res.status === 200 || res.status === 201) {
        const token = res.data.token;
        const userId = res.data.user.id;

        localStorage.setItem("token", token);
        localStorage.setItem("role", res.data.user.role);
        setSuccess("Login Successfully");
        alert("Login successfully!!");

        if (
          res.data.user.role === "superadmin" ||
          res.data.user.role === "admin"
        ) {
          navigate("/dashboard");
        } else {
          navigate(`/profile/${userId}`);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Server error. Please try again later."
      );
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 py-20">
      <div className="p-8 rounded-[11px] shadow-md w-full max-w-md border border-white bg-white">
        <h2 className="text-2xl text-center font-bold underline">Login</h2>

        <form className="py-10" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="italic">Username :</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* ✅ Fixed password field with toggle */}
          <div className="mb-3 relative">
            <label className="italic">Password :</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-[30px] cursor-pointer text-gray-600 hover:text-black"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="text-red-500 italic mb-3">{error}</p>}
          {success && <p className="text-green-600 italic mb-3">{success}</p>}

          <button
            type="submit"
            className="italic border rounded-[5px] w-full bg-blue-500 py-2 cursor-pointer hover:bg-blue-300"
          >
            Login
          </button>

          <div className="mt-4 text-center space-y-2">
            <Link
              to="/"
              className="underline text-sm text-blue-800 italic block hover:text-red-500"
            >
              Register Yourself
            </Link>
            <Link
              to="/email"
              className="underline text-sm text-blue-800 italic block hover:text-red-500"
            >
              Login with Email
            </Link>
            <Link
              to="/phone"
              className="underline text-sm text-blue-800 italic block hover:text-red-500"
            >
              Login with (+91 IND)Phone Number
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
