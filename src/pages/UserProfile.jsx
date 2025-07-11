import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";
import logo from "../assets/logo.png";
import profileBg from "../assets/profile-bg.png";
import defaultAvatar from "../assets/avatar.png";

import toy1 from "../assets/toy1.jpg";
import toy2 from "../assets/toy2.jpg";
import toy3 from "../assets/toy3.jpg";
import toy4 from "../assets/toy4.jpg";
import toy5 from "../assets/toy5.png";
import toy6 from "../assets/toy6.jpg";
import toy7 from "../assets/toy7.jpg";
import toy8 from "../assets/toy8.png";
import toy9 from "../assets/toy9.jpg";
import toy10 from "../assets/toy10.png";
import toy11 from "../assets/toy11.jpg";
import toy12 from "../assets/toy12.jpg";
import toy13 from "../assets/toy13.jpg";
import toy14 from "../assets/toy14.jpg";
import toy15 from "../assets/toy15.jpg";
import toy16 from "../assets/toy16.jpg";

export default function UserProfile() {
  const [user, setUser] = useState({
    firstName: "Asheli",
    lastName: "Dias",
    email: "ashelidias@gmail.com",
    address: "No. 7, Main Street, Negombo",
    phone: "+94 771234567",
    avatar: defaultAvatar
  });

  const [avatar, setAvatar] = useState(defaultAvatar);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUserData = localStorage.getItem("accountDetails");
    if (savedUserData) {
      const parsedUserData = JSON.parse(savedUserData);
      setUser(parsedUserData);
      if (parsedUserData.avatar) {
        setAvatar(parsedUserData.avatar);
      }
    }
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setAvatar(imageURL);
      setUser(prevUser => ({ ...prevUser, avatar: imageURL }));
    }
  };

  const handleEditProfile = () => {
    navigate("/account");
  };

  const recommendedItems = [
    { id: 1, image: toy1, title: "White Teddy Bear Gift Pack", price: "Rs. 3,250" },
    { id: 2, image: toy2, title: "Dual-mood Octopus Soft Toy", price: "Rs. 850" },
    { id: 3, image: toy3, title: "Roses & Lindt Chocolates", price: "Rs. 5,950" },
    { id: 4, image: toy4, title: "Heart Shaped Resin Art Ornament", price: "Rs. 4,990" },
    { id: 5, image: toy5, title: "Black Toothless Soft Toy", price: "Rs. 6,500" },
    { id: 6, image: toy6, title: "Evangeline Sakura Perfume", price: "Rs. 2,550" },
    { id: 7, image: toy7, title: "Red Roses & Chocolate Bouquet", price: "Rs. 8,250" },
    { id: 8, image: toy8, title: "Pink Stitch's Gift Pack", price: "Rs. 6,890" },
    { id: 9, image: toy9, title: "NIVEA Men's Gift Pack", price: "Rs. 12,250" },
    { id: 10, image: toy10, title: "Couple Letter Key Chains", price: "Rs. 1,600" },
    { id: 11, image: toy11, title: "Handmade Flower Bouquet", price: "Rs. 1,950" },
    { id: 12, image: toy12, title: "Red Teddy's Gift Pack", price: "Rs. 4,990" },
    { id: 13, image: toy13, title: "Customized Resin Art Key Chains", price: "Rs. 999" },
    { id: 14, image: toy14, title: "Brown Teddy & Roses Gift Pack", price: "Rs. 6,950" },
    { id: 15, image: toy15, title: "Cadbury Chocolate Bouquet", price: "Rs. 10,250" },
    { id: 16, image: toy16, title: "Cadbury Chocolate & Toffee Bouquet", price: "Rs. 7,890" },
  ];

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
          <img src={avatar} alt="User Avatar" className="avatar" />
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
          From teddy bears to treasures—let’s find your next favorite thing!
          <br />
          Because every shelf holds a smile, and every gift tells a story just
          for you.
        </p>
        <p className="contact">
          {user.email} | {user.address} | {user.phone}
        </p>
        <button className="edit-button" onClick={handleEditProfile}>Edit Profile</button>
      </section>

      <section className="recommendation-section">
        <h3>Recommended for you</h3>
        <div className="recommendation-cards">
          {recommendedItems.map((item) => (
            <div className="card hover-card" key={item.id}>
              <div className="card-img-wrapper">
                <img src={item.image} alt={item.title} className="card-img" />
              </div>
              <h4>{item.title}</h4>
              <p className="price">{item.price}</p>
              <p className="stars">⭐⭐⭐⭐⭐</p>
              <button className="add-btn">Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

      <footer>
        © 2025 The Keepsake Heaven Pvt Ltd • All rights reserved.
      </footer>
    </div>
  );
}
