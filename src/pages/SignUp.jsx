import React from "react";
import { Link } from "react-router-dom"; 
import "./SignUp.css";
import logo from "../assets/logo.png";
import signupImg from "../assets/signup-toyshop.jpg";

export default function SignUp() {
  return (
    <div className="container">
      <header>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
      </header>

      <main>
        <div className="card">
          <div className="card-form">
            <h2>Sign Up</h2>
            <form>
              <input type="text" placeholder="Username" required />
              <input type="email" placeholder="Email Address" required />
              <input type="password" placeholder="Password" required />
              <input type="password" placeholder="Confirm Password" required />
              <button type="submit">Sign Up</button>
            </form>

            <p className="account-text">
              Already have an account on Keepsake Heaven?{" "}
              <Link to="/signin">Sign In</Link>
            </p>
          </div>

          <div className="card-image">
            <img src={signupImg} alt="Create Your Account" />
          </div>
        </div>
      </main>

      <footer>
        © 2025 The Keepsake Heaven Pvt Ltd • All rights reserved.
      </footer>
    </div>
  );
}
