import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Pencil, Eye } from "lucide-react";


const AllUser = () => {
  const [mainUsers, setMainUsers] = useState([]);
  const [phoneUsers, setPhoneUsers] = useState([]);
  const [emailUsers, setEmailUsers] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin" && role !== "superadmin") {
      navigate("/home");
      return;
    }
    fetchUsers();
  }, [navigate, role]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token missing. Please login.");
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allUsers = res.data.allUsers || [];
      setMainUsers(allUsers.filter((u) => u.source === "main"));
      setPhoneUsers(allUsers.filter((u) => u.source === "phone"));
      setEmailUsers(allUsers.filter((u) => u.source === "email"));
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("Failed to delete user");
    }
  };

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = res.data.user;
      navigate(`/view/${id}`)
    }catch (error) {
      console.log("Error fetching user:", error.response?.data || error);
    }
  }

  const handleEdit = async (id) => {
    navigate(`/edit/${id}`)
  }


  const renderTable = (users, title) => (
    <div className="mb-10 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-2 italic underline text-gray-700">
        {title} ({users.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-green-600 text-white italic">
              <th className="px-4 py-2 text-center">ID</th>
              <th className="px-4 py-2 text-center">Username</th>
              <th className="px-4 py-2 text-center">Phone</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">Role</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500 italic">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-100">
                  <td className="text-center px-4 py-2">{u.id}</td>
                  <td className="text-center px-4 py-2">{u.userName}</td>
                  <td className="text-center px-4 py-2">{u.phone || "-"}</td>
                  <td className="text-center px-4 py-2">{u.email || "-"}</td>
                  <td className="text-center px-4 py-2">{u.role}</td>
                  <td className="text-center px-4 py-2">
                    <button 
                   
                   title="View User"
                    onClick={()=> handleView(u.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-sm transition-all duration-200 hover:scale-105">
                      <Eye className="w-5 h-5"/>
                    </button>

                    <button
                      title="Edit User"
                      onClick={() => handleEdit(u.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-sm transition-all duration-200 hover:scale-105"
                    >
                      <Pencil className="w-5 h-5"/>
                    </button>

                    <button
                      title="Delete User"
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-sm transition-all duration-200 hover:scale-105">
                      <Trash2 className="w-5 h-5"/>
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const totalUsers = mainUsers.length + phoneUsers.length + emailUsers.length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center italic underline text-gray-800">
        Users Dashboard
      </h2>

      <div className="flex justify-center gap-6 mb-8">
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
          <p className="text-2xl font-bold text-green-800">{totalUsers}</p>
        </div>
      </div>

      {renderTable(mainUsers, "Registered Users")}
      {renderTable(phoneUsers, "Phone Users")}
      {renderTable(emailUsers, "Email Users")}
    </div>
  );
};

export default AllUser;
