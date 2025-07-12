import React, { useState } from "react";
import "./ForgotPassword.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("A reset link has been sent to your email.");
      navigate("/signin");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="forgot-password-container">
      {/* Header */}
      <header className="forgot-header">
        <img src={logo} alt="The Keepsake Heaven Logo" />
      </header>
      {/* Card */}
      <div className="forgot-card">
        <h2>Reset Your Password</h2>
        <p>We will send you an email to reset your password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button type="submit" className="submit-btn">Submit</button>
        </form>
        <Link to="/signin" className="cancel-btn">Cancel</Link>
      </div>
      {/* Footer */}
      <footer className="forgot-footer">
        © 2025 The Keepsake Heaven Pvt Ltd • All rights reserved.
      </footer>
    </div>
  );
}

export default ForgotPassword;