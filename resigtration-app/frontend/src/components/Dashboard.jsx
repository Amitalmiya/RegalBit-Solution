import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { FaUserTimes, FaUserCheck, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    role: "",
    password: "",
  });
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const sidebarItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "All Users", icon: "👥" },
    { name: "Add User", icon: "➕" },
    { name: "Profile", icon: <CgProfile size={20} /> },
    { name: "Logout", icon: <IoIosLogOut size={20} /> },
  ];

  const handleClick = (name) => {
    if (name === "Add User") {
      setPopupType("addUser");
      setShowPopup(true);
    }
  };

  const closePopup = () => setShowPopup(false);
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: users.length + 1,
      userName: formData.userName,
      email: formData.email,
      phone: formData.phoneNumber,
      role: formData.role,
      status: "active",
    };
    setUsers([...users, newUser]);
    alert("User added successfully!");
    setFormData({
      userName: "",
      email: "",
      phoneNumber: "",
      role: "",
      password: "",
    });
    closePopup();
  };

  const toggleUserStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
  };

  const toggleRole = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u
      )
    );
  };

  const deleteUser = (id) => setUsers(users.filter((u) => u.id !== id));

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transform md:flex flex-col w-64 bg-gray-800 transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <div className="flex items-center justify-center h-16 bg-gray-900 shadow-md">
          <span className="text-white font-bold uppercase tracking-wide text-lg">
            SuperAdmin
          </span>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-gray-800">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleClick(item.name)}
                className="flex items-center px-4 py-3 mt-2 w-full text-gray-100 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200"
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to your dashboard!
          </h1>
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/add-newUser")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all"
            >
              + Add New User
            </button>
          </div>
        </div>

        <div className="p-6">

          <div className="overflow-x-auto bg-yellow-200 shadow rounded rounded-[15px] mt-4">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-blue-200">
                <tr>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{u.id}</td>
                      <td className="px-4 py-2">{u.userName}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">{u.phone}</td>
                      <td className="px-4 py-2 capitalize">{u.role}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            u.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className="px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300"
                        >
                          {u.status === "active" ? (
                            <FaUserTimes size={16} />
                          ) : (
                            <FaUserCheck size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => toggleRole(u.id)}
                          className="px-2 py-1 bg-blue-200 rounded hover:bg-blue-300"
                        >
                          Role
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showPopup && popupType === "addUser" && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={closePopup}
          ></div>
          <div className="ml-auto w-96 h-full bg-white shadow-xl p-6 relative z-10 overflow-y-auto transform transition-transform duration-300">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="User Name"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
