import React from "react";
import "./ForgotPassword.css";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 👉 Here you can integrate Firebase or backend password reset later
    alert("A reset link has been sent to your email.");
    navigate("/signin"); // redirect to sign-in after submission
  };

  return (
    <div className="forgot-password-container">
      {/* Card */}
      <div className="forgot-card">
        <h2>Reset Your Password</h2>
        <p>We will send you an email to reset your password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            required
          />
          <button type="submit" className="submit-btn">Submit</button>
        </form>
        <Link to="/signin" className="cancel-btn">Cancel</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
