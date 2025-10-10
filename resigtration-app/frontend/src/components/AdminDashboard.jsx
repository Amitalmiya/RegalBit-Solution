import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { RefreshCw, Trash2, UserCheck, UserX } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role"); // 'admin' or 'superadmin'
  const token = localStorage.getItem("token");

  // Fetch users
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users/allusers/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Toggle user status (active/inactive)
  const toggleUserStatus = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/users/toggle-status/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle role (SuperAdmin only)
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
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete user (SuperAdmin only)
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
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-center">Admin Dashboard</h2>
        <button
          onClick={fetchUser}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Id</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{u.id}</td>
                <td className="px-4 py-2">{u.userName}</td>
                <td className="px-4 py-2">{u.email}</td>
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
                  {/* Toggle Status */}
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

                  {/* Toggle Role */}
                  {role === "superadmin" && (
                    <button
                      onClick={() => toggleRole(u.id)}
                      className="px-2 py-1 bg-blue-200 rounded hover:bg-blue-300"
                    >
                      Role
                    </button>
                  )}

                  {/* Delete User */}
                  {role === "superadmin" && (
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && (
          <div className="p-4 text-center text-gray-500">No users found</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
