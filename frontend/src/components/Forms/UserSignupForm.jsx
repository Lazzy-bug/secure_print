import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./UserSignupForm.css"; // Link to the external CSS file

const UserSignupForm = () => {
  const [name, setName] = useState(""); // State for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle normal form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { name, email, password }; // Include name in the payload

    try {
      const response = await fetch("http://localhost:5000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Redirect to login page after successful signup
        navigate("/user/login");
      } else {
        setError(data.message || "Error signing up");
      }
    } catch (error) {
      setError("Error signing up");
      console.error(error);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/api/auth/google"; // Corrected route for Google authentication
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign up with Email</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
              placeholder="Name"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="signup-button">Sign up</button>
        </form>

        <hr/>

        <p className="login-prompt">
          Already have an account?{" "}
          <a href="/user/login" className="login-link">Login</a>
        </p>
      </div>
    </div>
  );
};

export default UserSignupForm;
