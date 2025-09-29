import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import "./AdminLogin.css";
import logo from "../assets/logo.png";
import background from "../assets/Background.png"; // Import the background image

const ADMIN_EMAIL = "Thekeepsakeheaven0120@gmail.com";
const ADMIN_PASSWORD = "Admin1";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setError("Invalid credentials. Access denied.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Firebase authentication failed.");
    }
    setLoading(false);
  };

  return (
    <div
      className="admin-login-bg"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="admin-login-container">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <div className="logo-wrapper">
            <img src={logo} alt="The Keepsake Heaven Logo" className="login-logo" />
          </div>
          <h2>Admin Login</h2>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Admin Email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;