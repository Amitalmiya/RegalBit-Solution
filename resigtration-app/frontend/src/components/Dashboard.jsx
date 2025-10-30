import React, { useState, useEffect, useCallback } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut, IoMdAdd } from "react-icons/io";
import { FaUserTimes, FaUserCheck, FaEdit, FaUsers, FaUserPlus, FaChartBar } from "react-icons/fa";
import { MdDeleteForever, MdSpaceDashboard } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const DashBoard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activePage, setActivePage] = useState("dashboard");

  const [users, setUsers] = useState([]);

  const [user, setUser] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [userName, setUserName] = useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState("");

  const [showPassword, setShowPassword] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  const token = localStorage.getItem("token");

  const userNameRegex = /^[A-Za-z_][A-Za-z0-9_]{2,19}$/;
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userNameRegex.test(userName)) {
      setError("Enter a valid Username (3-20 characters, no spaces)");
      return;
    }

    if (!phoneRegex.test(phone)) {
      setError("Enter a valid Phone number (10 digits)");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Enter a valid Email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must include uppercase, lowercase, number & special character"
      );
      return;
    }

    if (!userName || !email || !phone || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:5000/api/users`,
        { userName, email, phone, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201 || res.status === 200) {
        setSuccess("User created successfully!!");
        setUserName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setRole("user");
        setShowPassword(false);

        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add user");
    }
  };

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: <MdSpaceDashboard size={20} className="text-blue-500" />,
      key: "dashboard",
    },
    {
      name: "All Users",
      icon: <FaUsers size={20} className="text-green-500" />,
      key: "allUsers",
    },
    ...(user?.role === "superadmin"
      ? [
          {
            name: "Add User",
            icon: <FaUserPlus size={20} className="text-purple-500" />,
            key: "addUser",
          },
        ]
      : []),
    {
      name: "Profile",
      icon: <CgProfile size={20} className="text-indigo-500" />,
      key: "profile",
    },
    {
      name: "Logout",
      icon: <IoIosLogOut size={22} className="text-red-500" />,
      key: "logout",
    },
  ];

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allUsers = res.data?.allUsers || res.data?.users || [];
      setUsers(Array.isArray(allUsers) ? allUsers : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [token]);

  useEffect(() => {
    if (activePage === "allUsers") fetchUsers();
    if (activePage === "profile") fetchProfile();
  }, [activePage, fetchUsers, fetchProfile]);

  const handleClick = (item) => {
    if (item.key === "logout") {
      if (window.confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      setActivePage(item.key);
    }
  };

  // Profile data here ----------------------------------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          setError("User not logged in. Please login again.");
          navigate("/login");
          return;
        }
        const res = await axios.get(
          `http://localhost:5000/api/users/profile/${token}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data.user);
        navigate(`/dashboard`);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to fetch user data. Please login again."
        );
      }
    };
    fetchUser();
  }, [navigate]);

  if (error) {
    return (
      <p className="text-red-500 text-center py-20 text-lg font-semibold">
        {error}
      </p>
    );
  }

  if (!user)
    return (
      <p className="text-center py-20 text-gray-500 text-lg italic">
        Loading user details...
      </p>
    );

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleUserStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "deactivate" : "active";

    if (
      !window.confirm(
        `Are you sure you want to ${
          newStatus === "active" ? "activate" : "deactivate"
        } this user?`
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/users/user-status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );

      alert(
        `User ${
          newStatus === "deactivate" ? "deactivated" : "activated"
        } successfully`
      );
    } catch (err) {
      console.error("Status update error:", err.response?.data || err);
      alert("Failed to update user status");
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("User deleted successfully!");
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Try again later.");
    }
  };

  const renderAllUsers = () => (
  <div className="p-10 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 min-h-screen">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
        👥 All Users
      </h2>

      {user.role === "superadmin" && (
        <button
  onClick={() => navigate("/add-newUser")}
  className="relative flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold text-white 
  bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 
  shadow-lg shadow-green-200 
  hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 
  hover:shadow-xl hover:shadow-green-300 
  transform hover:-translate-y-0.5 hover:scale-[1.04] 
  active:scale-95 transition-all duration-300 ease-out group cursor-pointer"
>
  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 blur-lg transition duration-300"></span>

  <IoMdAdd
    size={22}
    className="transform group-hover:rotate-90 transition-transform duration-300"
  />
  <span className="tracking-wide drop-shadow-sm">Add User</span>
</button>
      )}
    </div>

    <div className="overflow-x-auto bg-white shadow-2xl rounded-3xl border border-gray-200">
      <table className="min-w-full text-sm text-gray-800">
        <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white uppercase tracking-wider text-[13px]">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">ID</th>
            <th className="px-6 py-4 text-left font-semibold">Username</th>
            <th className="px-6 py-4 text-left font-semibold">Email</th>
            <th className="px-6 py-4 text-left font-semibold">Phone</th>
            <th className="px-6 py-4 text-left font-semibold">Role</th>
            <th className="px-6 py-4 text-left font-semibold">Status</th>
            <th className="px-6 py-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                No users found
              </td>
            </tr>
          ) : (
            users.map((u, i) => (
              <tr
                key={u.id}
                className={`${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition-all duration-200 border-b border-gray-100`}
              >
                <td className="px-6 py-4 font-semibold text-gray-700">
                  #{u.id}
                </td>
                <td className="px-6 py-4">{u.userName}</td>
                <td className="px-6 py-4">{u.email || "-"}</td>
                <td className="px-6 py-4">{u.phone || "-"}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                      u.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : u.role === "superadmin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                      u.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status || "inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-center relative">
                  <button
                    onClick={() => toggleMenu(u.id)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm transition-all cursor-pointer"
                    title="Options"
                  >
                    <FiMoreVertical size={18} className="text-gray-700" />
                  </button>

                  {openMenuId === u.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-xl border border-gray-200 z-10 animate-fadeIn">
                      <button
                        onClick={() => {
                          handleUserStatus(u.id, u.status);
                          setOpenDropdownId(null);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition"
                      >
                        {u.status === "active" ? (
                          <>
                            <FaUserTimes size={14} className="text-yellow-600" />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <FaUserCheck size={14} className="text-green-600" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => navigate(`/edit/${u.id}`)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition"
                      >
                        <FaEdit size={14} className="text-blue-600" />
                        <span className="text-blue-700 font-medium">Edit User</span>
                      </button>

                      {user?.role === "superadmin" && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition"
                        >
                          <MdDeleteForever size={14} className="text-red-600" />
                          <span className="text-red-600 font-medium">Delete</span>
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

  const renderAddUser = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-gray-200 hover:shadow-indigo-300/40 transition-shadow duration-300">
      <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
        Add New User
      </h2>

      {error && (
        <p className="text-red-500 text-center mb-3 font-medium animate-pulse">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-center mb-3 font-medium animate-pulse">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Username
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Enter username"
            maxLength={20}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Enter phone number"
            maxLength={10}
            pattern="[0-9]{10}"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Enter email address"
            maxLength={30}
            required
          />
        </div>

        <div className="relative">
          <label className="block text-gray-700 font-semibold mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Enter password"
            maxLength={30}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-12 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={22} />
            ) : (
              <AiOutlineEye size={22} />
            )}
          </button>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.03]"
            }`}
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

  const renderProfile = () => (
    <div className="flex justify-center items-start py-16 bg-gradient-to-br from-blue-100 via-white to-purple-100 min-h-screen">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-lg p-10 border border-gray-100 transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner">
                <div className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-tr from-blue-600 to-purple-500 shadow-md">
                  {getInitials(user.userName)}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white animate-pulse"></div>
          </div>

          <h2 className="text-3xl font-bold mt-6 text-gray-800 capitalize tracking-wide">
            {user.userName || "Unknown User"}
          </h2>

          <div className="text-center mt-2 space-y-1">
            <p className="text-gray-500 italic">
              {user.email || "No Email Address"}
            </p>
            <p className="text-gray-500 italic">
              {user.phone || "No Phone Number"}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-gray-700 border-t border-gray-200 pt-6">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Username:</span>
            <span className="italic">{user.userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Email Address:</span>
            <span className="italic">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Phone:</span>
            <span className="italic">{user.phone}</span>
          </div>
        </div>

        <div className="flex justify-between mt-10 gap-4">
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-[1.03] transition-all duration-300"
          >
            Edit Profile
          </button>

          <button
            onClick={() => {
              const confirmLogout = window.confirm(
                "Are you sure you want to log out?"
              );
              if (confirmLogout) {
                localStorage.removeItem("token");
                navigate("/login");
              }
            }}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:scale-[1.03] transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    const mainUsers = users.filter((u) => u.source === "main");
    const phoneUsers = users.filter((u) => u.source === "phone");
    const emailUsers = users.filter((u) => u.source === "email");
    const totalUsers = users.length;

    switch (activePage) {
      case "allUsers":
        return renderAllUsers();
      case "addUser":
        return renderAddUser();
      case "profile":
        return renderProfile();
      default:
        return (
          <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-center italic underline text-gray-800">
              Welcome to your Dashboard
            </h2>

            <div className="flex justify-center gap-6 mb-8 flex-wrap">
              <div className="bg-white shadow-md rounded-lg p-4 w-48 text-center border border-gray-200">
                <h3 className="text-gray-600 italic">Registered Users</h3>
                <p className="text-2xl font-bold">{mainUsers.length}</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 w-48 text-center border border-gray-200">
                <h3 className="text-gray-600 italic">Phone Users</h3>
                <p className="text-2xl font-bold">{phoneUsers.length}</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 w-48 text-center border border-gray-200">
                <h3 className="text-gray-600 italic">Email Users</h3>
                <p className="text-2xl font-bold">{emailUsers.length}</p>
              </div>
              <div className="bg-green-100 shadow-md rounded-lg p-4 w-48 text-center border border-green-200">
                <h3 className="text-green-700 italic">Total Users</h3>
                <p className="text-2xl font-bold text-green-800">
                  {totalUsers}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transform md:flex flex-col w-64 bg-gray-800 transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <div className="flex items-center justify-center h-16 bg-gray-900 shadow-md">
          <span className="text-white font-bold tracking-wide text-lg">
            RegelBitSolutions
          </span>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-gray-800">
            <ul>
              {sidebarItems.map((item) => (
                <li
                  key={item.key}
                  onClick={() => handleClick(item)}
                  className="flex items-center gap-3 px-4 py-3 mt-2 text-gray-100 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashBoard;
