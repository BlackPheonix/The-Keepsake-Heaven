import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { getUserDocument, updateUserDocument } from "../firebase/firebaseUtils";
import "./AccountDetails.css";
import logo from "../assets/logo.png";

const categoriesList = [
  "Gift Box / Personalized Gifts",
  "Jewelry / Watches",
  "Beauty/Cosmetics & Skin Care",
  "Chocolates",
  "Flowers",
  "Soft Toys/Kids & Baby",
  "Handmade Greeting Cards",
  "Hand Bags/Fashion & Shoes",
  "Perfumes & Fragrances",
  "Home Decor & Homewares",
  "Gift Vouchers",
  "Resin Products"
];

const AccountDetails = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    birthday: "",
    category: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user data from Firestore on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const response = await getUserDocument(currentUser.uid);
        if (response.success) {
          const userData = response.data;
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || currentUser.email || "",
            address: userData.address || "",
            phone: userData.phone || "",
            birthday: userData.birthday || "",
            category: userData.category || "",
          });
        }
      } else {
        navigate("/signin");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const validate = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim() || !formData.phone.match(/^\d{10}$/)) newErrors.phone = "10-digit number required";
    if (!formData.address.trim()) newErrors.address = "Required";
    if (!formData.birthday) newErrors.birthday = "Required";
    if (!formData.category) newErrors.category = "Select a category";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/signin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("");
    } else {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateUserDocument(currentUser.uid, formData);
        setMessage("Changes saved successfully!");
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      }
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading account details...</div>;
  }

  return (
    <div className="account-container">
      <div className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <nav>
          <ul>
            <li><a href="/profile">Profile</a></li>
            <li className="active">Account Details</li>
            <li><a href="/order-history">Order History</a></li>
          </ul>
        </nav>
      </div>

      <div className="content">
        <div className="header">
          <h2>Account Details</h2>
          <p>Here you can manage your personal details</p>
          <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
        </div>

        <form className="details-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Type your first name"
              />
              {errors.firstName && <span className="error">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Type your last name"
              />
              {errors.lastName && <span className="error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Type your email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Home Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Type your address"
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Type your phone number"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Birthday</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
              />
              {errors.birthday && <span className="error">{errors.birthday}</span>}
            </div>

            <div className="form-group">
              <label>Favourite Gift Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {categoriesList.map(opt => (
                  <option value={opt} key={opt}>{opt}</option>
                ))}
              </select>
              {errors.category && <span className="error">{errors.category}</span>}
            </div>
          </div>

          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          {message && <p className="success-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AccountDetails;