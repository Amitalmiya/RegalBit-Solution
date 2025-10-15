import React, { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [dropdown, setDropdown] = useState(null);
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

      console.log(res.data);

      console.log("All users data:", res.data);
      setUsers(res.data.allUsers || []);
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center italic underline">
        All Users
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-900 rounded-lg shadow-md">
          <thead>
            <tr className="bg-green-800 text-white italic">
              <th>ID</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>

            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.userName}</td>
                  <td>{u.phone}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button onClick={() => handleDelete(u.id)}
                    className="border rounded-[15px] bg-red-500 m-2 p-2 text-white cursor-pointer"
                    >Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUser;
