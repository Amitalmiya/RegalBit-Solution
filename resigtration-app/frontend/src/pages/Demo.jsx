import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { FaUsers, FaChartPie } from "react-icons/fa";

const NavbarAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-green-600 text-white flex justify-between items-center px-6 py-3 shadow-md">
      <Link to="/dashboard" className="font-bold text-lg">
        Admin Dashboard
      </Link>

      <nav className="flex gap-4 items-center">
        <Link to="/dashboard" className="hover:text-gray-200 flex items-center gap-1">
          <FaChartPie /> Dashboard
        </Link>
        <Link to="/allusers" className="hover:text-gray-200 flex items-center gap-1">
          <FaUsers /> Manage Users
        </Link>
        <button onClick={handleLogout} title="Logout">
          <IoIosLogOut size={18} />
        </button>
      </nav>
    </header>
  );
};

export default NavbarAdmin;
