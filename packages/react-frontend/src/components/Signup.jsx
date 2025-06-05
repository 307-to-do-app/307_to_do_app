import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch(
        "https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        alert(`Signup failed: ${result.error}`);
        return;
      }

      alert("User created successfully!");
      console.log("Signed up:", result);
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong during signup.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="flat-bread-shape">
        <div className="bread-inner">
          <div className="input-stack">
            <input
              type="text"
              placeholder="Username"
              className="butter-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="butter-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="butter-button" onClick={handleSignup}>
            🧈 Create Account
          </button>
          <button
            className="signup-link-button"
            onClick={() => navigate("/login")}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
