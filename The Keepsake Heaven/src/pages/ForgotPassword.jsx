import React, { useState } from "react";
import "./ForgotPassword.css";
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
      alert("Password reset email sent successfully.");
      navigate("/signin");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-card">
        <h2>Reset Password</h2>
        <p>Enter your email address to receive a password reset link</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="submit-btn">Submit</button>
        </form>
        <Link to="/signin" className="cancel-btn">Cancel</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
