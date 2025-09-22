import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const fields = [
  { name: "phone", label: "Phone Number :" },
  { name: "zipCode", label: "Zip Code :" },
  { name: "email", label: "Email :" },
  { name: "password", label: "Password :" },
  { name: "socialSecurityNo", label: "Social Security Number :" },
  { name: "dateOfBirth", label: "Date of Birth :" },
  { name: "userName", label: "Username :" },
  { name: "websiteUrl", label: "Website Url :" },
  { name: "creditCardNo", label: "Credit Card Number :" },
  { name: "driverLicense", label: "Driver License :" },
  { name: "timeFormat", label: "Time :" },
  { name: "hexaDecimalColorCode", label: "Hexadecimal Color Code :" },
  { name: "gender", label: "Gender :"},
  { name: "bloodGroup", label: "Blood Group :"}
];

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        alert("Error fetching user details");
      });
  }, [id]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="italic text-lg">Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="flex item-center justify-center w-full bg-gray-100 min-h-screen py-8">
      <div className="p-8 rounded-[11px] shadow-md w-full max-w-md border border-white">
        <h2 className="text-2xl text-center font-bold underline mb-6">
          User Details
        </h2>
        <div className="space-y-4">
          {fields.map(({ name, label}) => (
            <div key={name} className="mb-2">
              <p className="italic font-semibold">{label}</p>
              <p className="border rounded px-2 py-1 bg-gray-50 italic text-center">
                {user[name] || "N/A"}
              </p>
            </div>
          ))}
        </div>
        <button
          className="italic border rounded-[5px] w-1/3 mt-6 ml-13 bg-blue-500 py-2 cursor-pointer hover:bg-blue-300"
          onClick={() => navigate("/users")}
        >
          Back to Users
        </button>
        <button
          className="italic border rounded-[5px] w-1/3 mt-6 ml-5 bg-green-500 py-2 cursor-pointer hover:bg-green-300"
          onClick={() => navigate(`/edit/${user.id}`)}
        >
          Edit Users
        </button>
      </div>
    </div>
  );
};

export default ViewUser;
