import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const ProfileForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

//   const { userId } = useParams();

    // const {token} = useParams();

  const location = useLocation();

  const userId = location.state?.userId

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    password: "",
    zipCode: "",
  });

  
useEffect(() => {
  if (!userId || !token) return;

  (async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setMessage({ type: "error", text: "Failed to fetch profile data." });
    } finally {
      setLoading(false);
    }
  })();
}, [token, userId]);

  
  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });


  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/users`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: "Profile saved successfully!" });
      setTimeout(() => navigate(`/profile/${token}`), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to save profile.",
      });
    }
  };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen text-xl">
//         Loading profile...
//       </div>
//     );
  const step1Fields = [
    { name: "userName", label: "Username", type: "text", placeholder: "Enter username" },
    { name: "email", label: "Email", type: "email", placeholder: "Enter email" },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    { name: "phone", label: "Phone", type: "tel", placeholder: "Enter Phone" },
    { name: "password", label: "Password", type: "password", placeholder: "Enter password" },
  ];

  const step2Fields = [
    { name: "zipCode", label: "Zip Code", type: "text", placeholder: "Enter zip code" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>

        {message.text && (
          <p
            className={`text-center mb-4 ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              {step1Fields.map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-gray-700 font-medium mb-1">{label}</label>
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
              >
                Next →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {step2Fields.map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-gray-700 font-medium mb-1">{label}</label>
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-gray-700 mb-1 font-medium">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  required
                >
                  <option value="">Select Gender</option>
                  {["Male", "Female", "Other"].map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  required
                >
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 bg-gray-400 text-white py-3 rounded-md hover:bg-gray-500 transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
                >
                  Save Profile
                </button>
              </div>
            </>
          )}
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Step {step} of 2
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
