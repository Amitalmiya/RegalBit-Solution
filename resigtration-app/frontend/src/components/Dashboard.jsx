import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, UserCheck, UserX } from "lucide-react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (!token) {
        setError("Token missing. Please login.");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedUsers = Array.isArray(res.data.allUsers)
        ? res.data.allUsers
        : [];
      setUsers(fetchedUsers);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
      setError("Failed to fetch users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleUserStatus = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/toggle-status/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle status");
    }
  };

  const toggleRole = async (id) => {
    if (role !== "superadmin") {
      alert("Only SuperAdmin can change roles");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:5000/api/users/toggle-role/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to change role");
    }
  };

  const deleteUser = async (id) => {
    if (role !== "superadmin") {
      alert("Only SuperAdmin can delete users");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome to the {role || "User"} Dashboard
        </h1>

        {role === "superadmin" && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate("/add-newUser")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all"
            >
              + Add New User
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-600">Loading users...</p>
        ) : role === "superadmin" ? (
          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100">
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
                            <UserX size={16} />
                          ) : (
                            <UserCheck size={16} />
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
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            You don’t have permission to view all users.
          </p>
        )}

        {role && (
          <div className="mt-6 border-t pt-4 text-center">
            <p className="text-gray-600">
              Logged in as:{" "}
              <span className="capitalize text-indigo-600">{role}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
