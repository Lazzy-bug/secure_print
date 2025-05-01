import React from "react";
import { GoogleLogin } from "@react-oauth/google";

function SignInPage() {
  const handleGoogleSuccess = (response) => {
    // Send the token to your backend for authentication
    const token = response.credential;
    fetch("http://localhost:5000/auth/google/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Logged in successfully", data);
        // Redirect to user dashboard or another page
        window.location.href = "/user/dashboard";
      })
      .catch((error) => {
        console.error("Error logging in", error);
      });
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login failed", error);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl">Sign In</h1>
      <div className="mt-4">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />
      </div>
    </div>
  );
}

export default SignInPage;
