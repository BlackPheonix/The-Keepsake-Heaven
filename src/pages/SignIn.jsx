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
        <div className="card">
          <div className="card-image">
            <img src={toyshop} alt="Toy Shop Interior" />
          </div>
          <div className="card-form">
            <h2>Sign In</h2>
            <form>
              <input type="email" placeholder="Email Address" required />
              <input type="password" placeholder="Password" required />
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>
              <button type="submit">Sign In</button>
            </form>

            <div className="links">
              <p>
                Don’t have an account on Keepsake Heaven?{" "}
                <Link to="/signup">Sign Up now</Link> 
              </p>
              <Link to="/forgot-password">Forgot Password?</Link>
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
