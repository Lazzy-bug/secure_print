// src/pages/RoleSelection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "admin") {
      navigate("/admin/signup");
    } else if (role === "owner") {
      navigate("/owner/signup");
    } else if (role === "user") {
      navigate("/user/signup");
    }
  };

  return (
    <div>
      <h2>Select Role</h2>
      <button onClick={() => handleRoleSelection("admin")}>Admin Signup</button>
      <button onClick={() => handleRoleSelection("owner")}>Owner Signup</button>
      <button onClick={() => handleRoleSelection("user")}>User Signup</button>
    </div>
  );
}

export default RoleSelection;
