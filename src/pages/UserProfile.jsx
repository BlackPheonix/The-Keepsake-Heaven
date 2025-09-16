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
      if (currentUser) {
        try {
          const response = await getUserDocument(currentUser.uid);
          if (response.success) {
            const userData = response.data;
            setUser({
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              email: userData.email || currentUser.email,
              address: userData.address || "",
              phone: userData.phone || "",
              avatar: userData.avatar || defaultAvatar
            });
          } else {
            setError("Failed to load user profile");
          }
        } catch {
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      } else {
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
      const tempURL = URL.createObjectURL(file);
      setUser(prevUser => ({ ...prevUser, avatar: tempURL }));
      const response = await uploadUserAvatar(currentUser.uid, file);
      if (response.success) {
        setUser(prevUser => ({ ...prevUser, avatar: response.url }));
      } else {
        setError("Failed to upload avatar");
        setUser(prevUser => ({ ...prevUser, avatar: defaultAvatar }));
      }
    } catch (error) {
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
      setError("Failed to sign out. Try again.");
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
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
        <h2>Hello {user.firstName} {user.lastName}!</h2>
        <p className="quote">
          From teddy bears to treasures.let's find your next favorite thing!
          <br />
          Because every shelf holds a smile, and every gift tells a story just
          for you.
        </p>
        <p className="contact">
          {user.email} | {user.address} | {user.phone}
        </p>
        <div className="profile-buttons">
          <button className="edit-button" onClick={handleEditProfile}>Edit Profile</button>
          <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
        </div>
      </section>
      <UserPreferredItems />
    </div>
  );
}
