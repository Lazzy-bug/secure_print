// GoogleLoginButton.jsx
import React from "react";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect to Google login route
    window.location.href = "http://localhost:5000/api/google";
  };

  return (
    <button onClick={handleGoogleLogin}>Sign in with Google</button>
  );
};

export default GoogleLoginButton;
