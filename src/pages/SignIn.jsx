import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./SignIn.css";
import toyshop from "../assets/toyshop.jpg";

export default function SignIn() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add authentication logic here
    navigate("/profile");
  };

  return (
      <main>
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-image">
              <img src={toyshop} alt="Toy Shop Interior" />
            </div>
            <div className="auth-form">
              <h2>Sign In</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="email" placeholder="Email Address" required />
                </div>
                <div className="form-group">
                  <input type="password" placeholder="Password" required />
                </div>
                <div className="form-group remember-me">
                  <label>
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                </div>
                <div className="form-group">
                  <button type="submit">Sign In</button>
                </div>
              </form>

              <div className="auth-links">
                <p>
                  Don't have an account on Keepsake Heaven?{" "}
                  <Link to="/signup">Sign Up now</Link> 
                </p>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}