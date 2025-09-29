import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { getUserDocument, uploadUserAvatar } from "../firebase/firebaseUtils";
import UserPreferredItems from "../sections/UserPreferredItems";
import "./UserProfile.css";
import logo from "../assets/logo.png";
import profileBg from "../assets/profile-bg.png";
import defaultAvatar from "../assets/avatar.png";

export default function UserProfile() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    avatar: defaultAvatar
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("🔍 Auth state changed:", currentUser ? "User found" : "No user");
      
      if (currentUser) {
        console.log("👤 Current user UID:", currentUser.uid);
        console.log("📧 Current user email:", currentUser.email);
        
        try {
          console.log("🔄 Calling getUserDocument...");
          const response = await getUserDocument(currentUser.uid);
          console.log("📋 getUserDocument response:", response);
          
          if (response.success) {
            const userData = response.data;
            console.log("✅ User data received:", userData);
            
            setUser({
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              email: userData.email || currentUser.email,
              address: userData.address || "",
              phone: userData.phone || "",
              avatar: userData.avatar || defaultAvatar
            });
            
            setError(""); // Clear any previous errors
          } else {
            console.error("❌ getUserDocument failed:", response.error);
            
            // Check if profile doesn't exist - this is common for new users
            if (response.error === "Profile does not exist") {
              console.log("📝 Profile doesn't exist, creating basic profile...");
              
              // Set basic user info from auth
              setUser({
                firstName: currentUser.displayName?.split(' ')[0] || "",
                lastName: currentUser.displayName?.split(' ')[1] || "",
                email: currentUser.email || "",
                address: "",
                phone: "",
                avatar: currentUser.photoURL || defaultAvatar
              });
              
              setError("Profile not complete - please edit your profile to add more details.");
            } else {
              setError(`Failed to load profile: ${response.error}`);
            }
          }
        } catch (err) {
          console.error("💥 Unexpected error:", err);
          setError(`An unexpected error occurred: ${err.message}`);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("🚫 No user authenticated, redirecting to signin");
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("You must be logged in to update your avatar");
        return;
      }
      
      console.log("📸 Uploading avatar for user:", currentUser.uid);
      
      const tempURL = URL.createObjectURL(file);
      setUser(prevUser => ({ ...prevUser, avatar: tempURL }));
      
      const response = await uploadUserAvatar(currentUser.uid, file);
      console.log("📸 Avatar upload response:", response);
      
      if (response.success) {
        setUser(prevUser => ({ ...prevUser, avatar: response.url }));
        setError(""); // Clear error on success
      } else {
        console.error("❌ Avatar upload failed:", response.error);
        setError("Failed to upload avatar");
        setUser(prevUser => ({ ...prevUser, avatar: defaultAvatar }));
      }
    } catch (error) {
      console.error("💥 Avatar upload error:", error);
      setError("Failed to upload avatar");
      setUser(prevUser => ({ ...prevUser, avatar: defaultAvatar }));
    }
  };

  const handleEditProfile = () => {
    navigate("/account");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (err) {
      console.error("🚪 Sign out error:", err);
      setError("Failed to sign out. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="top-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="profile-banner">
        <img src={profileBg} alt="Toy Shop Banner" />
      </div>
      <div className="avatar-wrapper">
        <label htmlFor="avatar-upload" className="avatar-label">
          <img src={user.avatar} alt="User Avatar" className="avatar" />
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          capture="user"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
        <p className="upload-hint">Tap the photo to take a new one 📷</p>
      </div>
      <section className="profile-info">
        <h2>Hello {user.firstName || 'User'} {user.lastName}!</h2>
        
        {/* Show error message if there is one */}
        {error && (
          <div className="error-message" style={{
            background: '#fee',
            color: '#c33',
            padding: '1rem',
            borderRadius: '5px',
            margin: '1rem 0',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}
        
        <p className="quote">
          From teddy bears to treasures.let's find your next favorite thing!
          <br />
          Because every shelf holds a smile, and every gift tells a story just
          for you.
        </p>
        <p className="contact">
          {user.email} {user.address && `| ${user.address}`} {user.phone && `| ${user.phone}`}
        </p>
        <div className="profile-buttons">
          <button className="edit-button" onClick={handleEditProfile}>
            Edit Profile
          </button>
          <button className="signout-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </section>
      <UserPreferredItems />
    </div>
  );
}