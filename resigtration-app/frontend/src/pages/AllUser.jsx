import axios from 'axios';
import React, { useEffect, useState } from 'react'

const AllUser = () => {

    const [data, setData] = useState([{}]);

    const getUser = async () => {
        await axios.get("http://localhost:5000/users").then((res)=> setData(res.data));
    }

    useEffect(()=>{
        getUser();
    }, []);

    const handleDelte = async (id) => {
        await axios.delete(`http://localhost:5000/users/${id}`)
.then((res)=> alert ("Delete Succesfully"));
    getUser()
    }


  return (
    <div className='p-4'>
        <h2 className='text-2xl font-bold mb-4 text-center italic'>All Users</h2>
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
                <thead>
                    <tr className='bg-gray-100 text-gray-700 italic'>
                        <th className='py-2 px-4 border-b'>ID</th>
                        <th className='py-2 px-4 border-b'>Username</th>
                        <th className='py-2 px-4 border-b'>DOB</th>
                        <th className='py-2 px-4 border-b'>Phone No</th>
                        <th className='py-2 px-4 border-b'>Email</th>
                        <th className='py-2 px-4 border-b'>Social Security No</th>
                        <th className='py-2 px-4 border-b'>Driver License</th>
                        <th className='py-2 px-4 border-b'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr className='italic'>
                            <td className='py-2 px-4 border-b'>{user.id}</td>
                            <td className='py-2 px-4 border-b'>{user.userName}</td>
                            <td className='py-2 px-4 border-b'>{user.dateOfBirth}</td>
                            <td className='py-2 px-4 border-b'>{user.phone}</td>
                            <td className='py-2 px-4 border-b'>{user.email}</td>
                            <td className='py-2 px-4 border-b'>{user.socialSecurityNo}</td>
                            <td className='py-2 px-4 border-b'>{user.driverLicense}</td>
                            <td className='py-2 px-4 border-b'>
                                <button onClick={handleDelte} className='mx-1 px-1 py-1 bg-red-500 text-white rounded hover: bg-red-600 transition'>Delete</button>

                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    </div>
  )
}

export default AllUser;