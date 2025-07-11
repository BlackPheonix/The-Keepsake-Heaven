import React from "react";
import { Link } from "react-router-dom"; 
import "./SignIn.css";
import toyshop from "../assets/toyshop.jpg";
import logo from "../assets/logo.png";

export default function SignIn() {
  return (
    <div className="container">
      <header>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
      </header>

      <main>
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-image">
              <img src={toyshop} alt="Toy Shop Interior" />
            </div>
            <div className="auth-form">
              <h2>Sign In</h2>
              <form>
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

      <footer>
        © 2025 The Keepsake Heaven Pvt Ltd • All rights reserved.
      </footer>
    </div>
  );
}