import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await fetch(
        "https://crumblist-g5htfcg7afh8ehdw.canadacentral-01.azurewebsites.net/login",
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
        alert(`Login failed: ${result.error}`);
        return;
      }

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong.");
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
          <button className="butter-button" onClick={handleSignIn}>
            🧈 Sign In
          </button>
          <button
            className="signup-link-button"
            onClick={() => navigate("/signup")}
          >
            New? Sign Up →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
