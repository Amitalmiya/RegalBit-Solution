import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const initialForm = {
  phone: "",
  zipCode: "",
  email: "",
  password: "",
  socialSecurityNo: "",
  dateOfBirth: "",
  userName: "",
  websiteUrl: "",
  creditCardNo: "",
  driverLicense: "",
  timeFormat: "",
  hexaDecimalColorCode: "",
};

const fields = [
  {
    name: "phone",
    label: "Phone Number :",
    type: "tel",
    placeholder: "+1-555-123-4567 or (555) 123-4567",
  },
  {
    name: "zipCode",
    label: "Zip Code :",
    type: "text",
    placeholder: "12345 or 12345-6789",
    maxLength: 10,
  },
  {
    name: "email",
    label: "Email :",
    type: "email",
    placeholder: "example@gmail.com",
  },
  {
    name: "password",
    label: "Password :",
    type: "password",
    placeholder: "Enter a strong password",
    minLength: 8,
  },
  {
    name: "socialSecurityNo",
    label: "Social Security Number :",
    type: "tel",
    placeholder: "123-45-6789",
    maxLength: 11,
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth :",
    type: "text",
    placeholder: "MM-DD-YYYY or MM/DD/YYYY",
    maxLength: 10,
  },
  {
    name: "userName",
    label: "Username :",
    type: "text",
    placeholder: "Enter your name",
    maxLength: 20,
  },
  {
    name: "websiteUrl",
    label: "Website Url :",
    type: "text",
    placeholder: "https://example.com",
  },
  {
    name: "creditCardNo",
    label: "Credit Card Number :",
    type: "text",
    placeholder: "xxxx-xxxx-xxxx-xxxx",
    maxLength: 19,
  },
  {
    name: "driverLicense",
    label: "Driver License :",
    type: "text",
    placeholder: "X12X456",
    maxLength: 12,
  },
  {
    name: "timeFormat",
    label: "Time :",
    type: "text",
    placeholder: "HH:MM AM/PM",
    maxLength: 7,
  },
  {
    name: "hexaDecimalColorCode",
    label: "Hexadecimal Color Code :",
    type: "text",
    placeholder: "#FFF, #FFFFFF, #F5A52S",
  },
];

const EditUser = () => {
  const { id } = useParams();

  const [edit, setEdit] = useState(initialForm);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((res) => setEdit(res.data))
      .catch((err) => alert(`Error fetching user:`, err));
  }, [id]);

  const handleFormEdit = async (e) => {
    e.preventDefault();

    try {
      const existingUsers = await axios.get("http://localhost:5000/users");

      const userEmailExist = existingUsers.data.some(
        (u) => u.email === edit.email && u.id !== parseInt(id)
      );

      if (userEmailExist) {
        alert("Email already exists");
        return;
      }

      const userNameExist = existingUsers.data.some((u)=> u.userName === edit.userName && u.id !== parseInt(id));

      if (userNameExist){
        alert("Username already exists");
        return;
      }

      await axios.put(`http://localhost:5000/users/${id}`, edit);
      alert("User Data Update Successfully!");
      navigate("/users");
    } catch (error) {
      alert("Update Failed");
    }
  };

  return (
    <div className="flex item-center justify-center  w-full bg-gray-100 min-h-screen py-8">
      <div className="p-8 rounded-[11px] shadow-md w-full max-w-md border border-white">
        <h2 className="text-2xl text-center font-bold underline">Edit Form</h2>
        <form action="" className="py-10" onSubmit={handleFormEdit}>
          {fields.map(
            ({
              name,
              label,
              type,
              placeholder,
              maxLength,
              minLength,
              ...rest
            }) => (
              <div className="mb-4" key={name}>
                <label className="italic">{label}</label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  className="border  w-full focus:ring-1 focus:ring-black font-sans italic text-center"
                  value={edit[name]}
                  onChange={(e) => {
                    setEdit({ ...edit, [name]: e.target.value });
                  }}
                  required
                  {...rest}
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1 italic">
                    {errors[name]}
                  </p>
                )}
              </div>
            )
          )}
          <button
            type="button"
            className="italic ml-[60px] border rounded-[5px] w-1/3 bg-red-500 py-2 cursor-pointer hover:bg-red-300"
            onClick={() => navigate("/users")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="italic ml-[10px] border rounded-[5px] w-1/3 bg-blue-500 py-2 cursor-pointer hover:bg-blue-300"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
