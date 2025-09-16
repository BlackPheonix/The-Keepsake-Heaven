import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { createUserDocument } from "../firebase/firebaseUtils";
import { getUserPreferences } from "../firebase/userPreferencesUtil";
import "./SignUp.css";
import signupImg from "../assets/signup-toyshop.jpg";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: formData.username
      });

      const userData = {
        uid: user.uid,
        username: formData.username,
        email: formData.email,
        firstName: "",
        lastName: "",
        address: "",
        phone: "",
        birthday: "",
        category: "",
        avatar: ""
      };
      
      await createUserDocument(user.uid, userData);

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
      console.error("Error creating user:", error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-form">
            <h2>Sign Up</h2>
            {errors.submit && (
              <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                {errors.submit}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="username"
                  placeholder="Username" 
                  value={formData.username}
                  onChange={handleChange}
                  required 
                />
                {errors.username && <span className="error" style={{ color: 'red', fontSize: '12px' }}>{errors.username}</span>}
              </div>
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
              <div className="form-group">
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
                {errors.confirmPassword && <span className="error" style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</span>}
              </div>
              <div className="form-group">
                <button type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
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