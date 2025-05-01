import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; // Importing icons

const OwnerLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { username, password };

    try {
      const response = await fetch("http://localhost:5000/api/owner/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem("token", data.token);

        // Redirect to the owner's dashboard after successful login
        navigate("/owner-dashboard");
      } else {
        setError(data.message || "Error logging in");
      }
    } catch (error) {
      setError("Error logging in");
      console.error("Login error:", error);
    }
  };

  return (
    <div id="owner-login-wrapper">
      <div className="login-form-container">
        <form onSubmit={handleSubmit}>
          <h2>Owner Login</h2>
          <div className="form-group">
            <label htmlFor="username">
              <FaUser className="input-icon" />
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="form-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default OwnerLoginForm;
