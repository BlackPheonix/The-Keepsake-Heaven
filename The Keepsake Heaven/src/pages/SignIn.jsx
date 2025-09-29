import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { getUserPreferences } from "../firebase/userPreferencesUtil";
import "./SignIn.css";
import toyshop from "../assets/toyshop.jpg";

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      console.log("User signed in successfully:", user);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      // Check for user preferences
      const prefResult = await getUserPreferences(user.uid);
      if (prefResult.success && prefResult.data?.preferences?.length > 0) {
        console.log("User has preferences:", prefResult.data.preferences);
        navigate("/profile");
      } else {
        console.log("No preferences found, redirecting to select preferences");
        navigate("/select-preferences");
      }
      
    } catch (error) {
      console.error("Error signing in:", error);
      let errorMessage = "An error occurred during sign in";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        default:
          errorMessage = error.message;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
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
            {errors.submit && (
              <div className="error-message" style={{ color: 'red', marginBottom: ' Peggy' }}>
                {errors.submit}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
                {errors.email && <span className="error" style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                {errors.password && <span className="error" style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
              </div>
              <div className="form-group remember-me">
                <label>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
              </div>
              <div className="form-group">
                <button type="submit" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </button>
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