import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaStore, FaMapMarkerAlt, FaEnvelope, FaLock } from "react-icons/fa"; // Importing icons

const OwnerSignupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // Track current step
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/owner/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shopName,
          shopAddress,
          username,
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        alert("Owner created successfully");
        navigate("/owner/login");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="owner-signup-wrapper">
      <div className="owner-signup-container">
        <h2>Owner Signup</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Name, Shop Name, and Shop Address */}
          {currentStep === 1 && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <FaUser />
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shopName">
                    <FaStore />
                    Shop Name
                  </label>
                  <input
                    type="text"
                    id="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                    placeholder="Enter your shop's name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="shopAddress">
                    <FaMapMarkerAlt />
                    Shop Address
                  </label>
                  <input
                    type="text"
                    id="shopAddress"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    required
                    placeholder="Enter your shop's address"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Username, Email, and Password */}
          {currentStep === 2 && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">
                    <FaUser />
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Choose a username"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">
                    <FaLock />
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a password"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step Buttons */}
          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="prev-btn"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Prev
              </button>
            )}
            {currentStep < 2 ? (
              <button
                type="button"
                className="next-btn"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? "Submitting..." : "Sign Up"}
              </button>
            )}
          </div>
        </form>

        <hr />
        <p>Already have an account?</p>
        <button type="button" className="login-btn" onClick={() => navigate("/owner/login")}>
          Login
        </button>
      </div>
    </div>
  );
};

export default OwnerSignupForm;
