import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";


const AllUser = () => {
  const [data, setData] = useState([]);

  const [dropdown, setDropDown] = useState(false);

  const navigate = useNavigate()

  const getUser = async () => {
    await axios
      .get("http://localhost:5000/api/users")
      .then((res) => setData(res.data));
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleDelete = async (id) => {

    const confirmed = window.confirm("Are you sure you want delete this user?");
    if (confirmed) {
        await axios
          .delete(`http://localhost:5000/api/users/${id}`)
          .then((res) => alert("Delete Succesfully"));
        getUser();
    } else {
        alert("Delete cancelled");
    }
  };

  // const handleEdit = async (id) => {}

  // const handleUpdate = async (id) => {}

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center italic underline">All Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-900 rounded-lg shadow-md">
          <thead>
            <tr className="bg-green-800 text-white italic ml-[33px]">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">DOB</th>
              <th className="py-2 px-4 border-b">Phone No</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Social Security No</th>
              <th className="py-2 px-4 border-b">Driver License</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Blood Group</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id} className="italic">
                <td className="py-2 px-8 border-b">{user.id}</td>
                <td className="py-2 px-5 border-b">{user.userName}</td>
                <td className="py-2 px-5 border-b">{user.dateOfBirth}</td>
                <td className="py-2 px-5 border-b">{user.phone}</td>
                <td className="py-2 px-6 border-b">{user.email}</td>
                <td className="py-2 px-7 border-b">{user.socialSecurityNo}</td>
                <td className="py-2 px-5 border-b">{user.driverLicense}</td>
                <td className="py-2 px-6 border-b">{user.gender}</td>
                <td className="py-2 px-8 border-b">{user.bloodGroup}</td>
                <td className="py-2 px-10 border-b relative">
                    <button className="p-2 rounded hover:bg-gray-200 cursor-pointer" onClick={()=> setDropDown(!dropdown === user.id ? null : user.id)}><CiMenuKebab /></button>
                    {dropdown === user.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-gray-100 border rounderd-lg shadow-lg">
                        <button className="block w-full text-left px-2 py-1 bg-blue-50 hover:bg-gray-400 text-blue-600 cursor-pointer" onClick={()=> {setDropDown(false); navigate(`/view/${user.id}`)}} >View User</button>
                        <button className="block w-full text-left px-2 py-1 hover:bg-gray-400 text-green-600 cursor-pointer" onClick={()=> {setDropDown(false); navigate(`/edit/${user.id}`)}}>Edit User</button>
                        <button className="block w-full text-left px-2 py-1 hover:bg-gray-400 text-red-600 cursor-pointer" onClick={()=> {setDropDown(false); handleDelete(user.id)}} >Delete User</button>
                    </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUser;