import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const EmailRegistration = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log("Google Login Success:", credentialResponse);
        }}
        onError={() => {
          console.log("Google Login Failed");
        }}
      />
    </div>
  );
};

export default EmailRegistration;
