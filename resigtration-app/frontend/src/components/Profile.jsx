import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [error, setError] = useState("");

  const [phoneUser, setPhoneUser] = useState([]);

  const [emailUser, setEmailUser] = useState([]); 

  useEffect(() => {
    const userId = localStorage.getItem("userToken") || id;
    if (!userId) {
      setError("User not found. Please login.");
      return;
    }

    const fetchUser = async () => {
      try{
        const [resUser, resPhone, resEmail ] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${userId}`),
          axios.get(`http://localhost:5000/api/auth/users/${userId}`),
          axios.get(`http://localhost:5000/api/auth/users/${userId}`),
        ]);

        setUser(resUser.data.user || null);
        setPhoneUser(resPhone.data.phoneUser);
        setEmailUser(resEmail.data.emailUser);

      } catch (error) {
        // console.log("API error: ", error.response?.data || error.message);
        setError("Failed to fetch user data")
      }
    }
    fetchUser();
  }, [id]);

  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  if (!user) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="flex justify-center py-20 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-300">
        <h2 className="text-2xl font-bold text-center underline mb-6">
          Your Profile
        </h2>
        <div className="space-y-3 mb-10">
          <p>
            <strong>Username:</strong> {user.userName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.phone && (
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
          )} 
          {user.dateOfBirth && (
            <p>
              <strong>Date of Birth:</strong> {user.dateOfBirth}
            </p>
          )}
          {user.gender && (
            <p>
              <strong>Gender:</strong> {user.gender}
            </p>
          )}
          {user.bloodGroup && (
            <p>
              <strong>Blood Group:</strong> {user.bloodGroup}
            </p>
          )}
          {user.websiteUrl && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={user.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {user.websiteUrl}
              </a>
            </p>
          )}
          {user.creditCardNo && (
            <p>
              <strong>Credit Card No.:</strong> {user.creditCardNo}
            </p>
          )}
          {user.driverLicense && (
            <p>
              <strong>Driver License:</strong> {user.driverLicense}
            </p>
          )}
          {user.socialSecurityNo && (
            <p>
              <strong>Social Security No:</strong> {user.socialSecurityNo}
            </p>
          )}
        </div>
        <div className="flex justify-between">
          <button className="border rounded border-[1px] px-2 text-center bg-gray-300 hover:bg-gray-100 cursor-pointer">
            Back to home
          </button>
          <button className="border rounded border-[1px] px-2 py-1 text-center bg-blue-500 hover:bg-blue-200 cursor-pointer">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
