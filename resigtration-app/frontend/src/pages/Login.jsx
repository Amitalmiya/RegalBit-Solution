import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  
  const [userName, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userName || !password) {
      setError("All fields are required");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/login`, {
          userName: userName,
          password,
        });
      if (res.status === 200) {
        setSuccess('Login Successfully');
        alert('Login successfully!!')

        localStorage.setItem("userToken", res.data.user.id);

        navigate(`/profile/${res.data.user.id}`)
      }
    } catch (err) {
      setError( err.response?.data?.message || "Server error. Please try again later.");
      console.log(err);
    }
  };

  return (
    <div className="flex item-center justify-center w-full min-h bg-full bg-gray-100 py-20">
      <div className="p-8 rounded-[11px] shadow-md w-full max-w-md border border-white">
        <h2 className="text-2xl text-center font-bold underline">Login</h2>
        <form action="" className="py-10" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="" className="italic">
              Username :
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {error && <p className="text-red-500 italic mt-1">{error}</p>}
            {success && <p className="text-red-500 italic mt-1">{success}</p>}

          </div>
          <div className="mb-5">
            <label htmlFor="" className="italic">
              Password :
            </label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              className="border w-full focus:ring-1 focus:ring-black font-sans italic text-center"
              required
            />
          </div>
          {error && <p className="text-red-500 italic mb-3">{error}</p>}
          {/* {success && <p className="text-green-600 italic mb-3">{success}</p>} */}
          <div className="mb-2">
            <button
              type="submit"
              className="italic border rounded-[5px] w-full bg-blue-500 py-2 cursor-pointer hover:bg-blue-300"
            >
              Login
            </button>
          </div>

          <div className="mb-3 text-center space-y-2">
            <Link
              to="/"
              className="underline text-sm text-blue-800 italic block w-full py-1 cursor:pointer hover:text-red-500"
            >
              Register Yourself
            </Link>
            <Link
              to="/email"
              className="underline text-sm text-blue-800 italic block w-full py-1 cursor:pointer hover:text-red-500"
            >
              Login with Email
            </Link>
            <Link
              to="/phone"
              className="mt-3 italic text-sm block text-blue-800 w-full py-1 cursor:pointer underline hover:text-red-500"
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
