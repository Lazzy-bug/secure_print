import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./UserLoginForm.css"; // Link to the external CSS file

const UserLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/user-dashboard");
        } else {
          setError("No token received in response.");
        }
      } else {
        setError(data.message || "Error logging in");
      }
    } catch (error) {
      setError("Error logging in");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">User Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
          <p className="signup-prompt">
            Don’t have an account?{" "}
            <a href="/user/signup" className="signup-link">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLoginForm;
