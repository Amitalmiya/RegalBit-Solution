import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import axios from 'axios';


const NavbarMain = () => {

  const navigate = useNavigate();

    useEffect(()=> {
        if (!localStorage.getItem("userToken")) {
          navigate("/login")
        }
    }, [navigate])

    const handleLogOut = () => {
        const confirmLogOut = window.confirm("Are you sure logout!!");
        if (confirmLogOut) {
            localStorage.removeItem("userToken");
            navigate("/login")
        }
    }

    const handleProfile = async (e) => {
    const userId = localStorage.getItem("userToken");
    if (!userId) {
      // console.log("no user token found");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`)
      console.log("User data", res.data);

      navigate(`/profile/${userId}`);
    } catch(error) {
      // console.log("Error fetching user data", error);
      alert("Unable to fetch profile data");
    }
  }

    return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/home" className="hover:bg-blue-700 px-3 py-2 rounded transition">
          Home
        </Link>
      </div>
      <div className="flex space-x-2">

        <button
        onClick={handleProfile}
        className="bg-red-700 hover:bg-red-400 px-3 py-2 rounded transition cursor-pointer hover:focus:ring-1 focus:ring-white"
        >
        <CgProfile/>
        </button>

        <button
          className="bg-red-700 hover:bg-red-400 px-3 py-2 rounded transition cursor-pointer hover:focus:ring-1 focus:ring-white"
          onClick={handleLogOut}
        >
          <IoIosLogOut />
        </button>
      </div>
    </nav>
  );
};

export default NavbarMain;