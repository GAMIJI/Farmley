import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("Auth Status:", token);
  
    if (!token) {
      navigate("/login");
      localStorage.removeItem('token');  
    }
  }, );

  return (
    <>
      <Component />
    </>
  );
};

export default PrivateRoute;
