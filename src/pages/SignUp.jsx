import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./SignUp.css";
import signupImg from "../assets/signup-toyshop.jpg";

export default function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add registration logic here if needed
    navigate("/profile");
  };

  return (
    

      <main>
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-form">
              <h2>Sign Up</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="text" placeholder="Username" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Email Address" required />
                </div>
                <div className="form-group">
                  <input type="password" placeholder="Password" required />
                </div>
                <div className="form-group">
                  <input type="password" placeholder="Confirm Password" required />
                </div>
                <div className="form-group">
                  <button type="submit">Sign Up</button>
                </div>
              </form>

              <div className="auth-links">
                <p>
                  Already have an account on Keepsake Heaven?{" "}
                  <Link to="/signin">Sign In</Link>
                </p>
              </div>
            </div>

            <div className="auth-image">
              <img src={signupImg} alt="Create Your Account" />
            </div>
          </div>
        </div>
      </main>
    
  );
}