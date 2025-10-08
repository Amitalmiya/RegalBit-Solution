  import React, { useEffect, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import axios from "axios";

  const Profile = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [error, setError] = useState("");

    // useEffect(() => {
    //   const userId = localStorage.getItem("userToken");
    //   if (!userId) {
    //     setError("User not found. Please login.");
    //     return;
    //   }

    //   const fetchUser = async () => {
    //     try{
    //       const res = await axios.get(`http://localhost:5000/api/users/profile`, {
    //         headers: {
    //           Authorization: `Bearer ${token}`
    //         }
    //       });
    //       setUser(res.data.user || res.data || res.data.user?.id)

    //     } catch (error) {
    //       setError("Failed to fetch user data")
    //     }
    //   }
    //   fetchUser();
    // }, [id]);

    useEffect(() => {
      const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if(!token) {
          setError("User not logged in. Please login Again.");
          navigate("/phone");
          return;
        }

        try {
          const res = await axios.get(`http://localhost:5000/api/users/allusers`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data.user);
          navigate(`/profile/${res.data.user.id}`);
        } catch (error) {
          // console.log("Error fetching Profile", error);
          setError("Failed to fetch user data. plase login again.");
          // localStorage.removeItem("token");
        }
      };

      fetchUser();
    }, [navigate]);

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
            <button className="border rounded border-[1px] px-2 text-center bg-gray-300 hover:bg-gray-100 cursor-pointer"
            onClick={()=> navigate(`/home`)}
            >
              Back to home
            </button>
            <button className="border rounded border-[1px] px-2 py-1 text-center bg-blue-500 hover:bg-blue-200 cursor-pointer"
              onClick={()=> navigate(`/edit/${id}`)}
            >
              Edit Profile
            </button>
            <button className="border rounded border-[1px] px-2 py-1 text-center bg-blue-500 hover:bg-blue-200 cursor-pointer"
              onClick={ () => {
                localStorage.removeItem("token");
                navigate("/phone");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default Profile;
