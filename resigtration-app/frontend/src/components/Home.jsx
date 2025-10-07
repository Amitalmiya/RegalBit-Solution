import React from "react";
import { useParams } from "react-router-dom";

const Home = () => {

  const {userName} = useParams()

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center italic underline">
       Hii, Welcome to Home Page.. {userName}
      </h2>
      <div className="overflow-x-auto"></div>
    </div>
  );
};

export default Home;
