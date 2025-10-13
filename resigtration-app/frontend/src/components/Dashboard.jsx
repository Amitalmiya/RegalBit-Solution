import axios from "axios";
import{ useEffect, useState, useCallback } from "react";
import { Trash2, UserCheck, UserX } from "lucide-react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users/allusers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Welcome to the Dashboard
        </h1>

        {!role && (
          <p className="text-center text-gray-600">
            Please <span className="text-blue-600 font-semibold">login</span> to
            access your dashboard.
          </p>
        )}

        {role === "user" && (
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              User Dashboard
            </h2>
            <p className="text-gray-700">
              You can view and update your profile details here.
            </p>
          </div>
        )}

        {role === "admin" && (
          <div>
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              Admin Dashboard
            </h2>
            <p className="text-gray-700">
              You have permission to view all registered users and monitor
              activities.
            </p>
          </div>
        )}

        {role === "superadmin" && (
          <div>
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Superadmin Dashboard
            </h2>
            <p className="text-gray-700">
              You have full access to perform CRUD operations on user data.
            </p>
            <div className="mb-6 p-4 bg-gray-50 rounded shadow">
                    <h3 className="text-lg font-semibold mb-2">Create Admin / SuperAdmin</h3>
                    <form className="flex gap-2 items-center">
                      <input
                        type="text"
                        name="userName"
                        // value={newUser.userName}
                        // onChange={handleInputChange}
                        placeholder="Username"
                        className="border px-2 py-1 rounded"
                        required
                      />
                      <input
                        type="password"
                        name="password"
                        // value={newUser.password}
                        // onChange={handleInputChange}
                        placeholder="Password"
                        className="border px-2 py-1 rounded"
                        required
                      />
                      <select
                        name="role"
                        // value={newUser.role}
                        // onChange={handleInputChange}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">SuperAdmin</option>
                      </select>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Create
                      </button>
                    </form>
                  </div>
            
                  {/* Users Table */}
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
                              <button
                                onClick={() => toggleUserStatus(u.id)}
                                className="px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300"
                              >
                                {u.status === "active" ? <UserX size={16} /> : <UserCheck size={16} />}
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
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 && !loading && (
                      <div className="p-4 text-center text-gray-500">No users found</div>
                    )}
                  </div>
                </div>
        )}

        {role && (
          <div className="mt-6 border-t pt-4">
            <p className="text-gray-600">
              <strong>Logged in as:</strong>{" "}
              <span className="capitalize text-indigo-600">{role}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
