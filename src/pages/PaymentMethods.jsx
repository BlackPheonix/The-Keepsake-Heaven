import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentMethods.css";
import logo from "../assets/logo.png";

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [cardDetails, setCardDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [addressDetails, setAddressDetails] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
  });

  const handleSignOut = () => {
    navigate("/signin");
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCard = () => {
    console.log("Card details saved:", cardDetails);
  };

  const handleSaveAddress = () => {
    console.log("Address details saved:", addressDetails);
  };

  return (
    <div className="payment-methods-container">
      <div className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <nav>
          <ul>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/account">Account Details</a></li>
            <li className="active">Payment Methods</li>
            <li><a href="/order-history">Order History</a></li>
          </ul>
        </nav>
      </div>

      <div className="content">
        <div className="header">
          <h2>Payment Methods</h2>
          <p>Here you can manage your saved cards / delivery address</p>
          <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
        </div>

        <div className="payment-forms">
          <div className="form-container">
            <h3>Card Details</h3>
            <div className="form-group">
              <label>Cardholder's Name</label>
              <input
                type="text"
                name="cardName"
                value={cardDetails.cardName}
                onChange={handleCardChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardChange}
                placeholder="xxxx xxxx xxxx xxxx"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expire Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardChange}
                  placeholder="MM / YY"
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="123"
                />
              </div>
            </div>
            <button className="save-btn" onClick={handleSaveCard}>Save Card</button>
          </div>

          <div className="form-container">
            <h3>Address Details</h3>
            <div className="form-group">
              <label>Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={addressDetails.addressLine1}
                onChange={handleAddressChange}
                placeholder="Enter your address"
              />
            </div>
            <div className="form-group">
              <label>Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={addressDetails.addressLine2}
                onChange={handleAddressChange}
                placeholder="Enter your address"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={addressDetails.city}
                  onChange={handleAddressChange}
                  placeholder="Enter your city"
                />
              </div>
              <div className="form-group">
                <label>Postcode</label>
                <input
                  type="text"
                  name="postcode"
                  value={addressDetails.postcode}
                  onChange={handleAddressChange}
                  placeholder="Enter your postcode"
                />
              </div>
            </div>
            <button className="save-btn" onClick={handleSaveAddress}>Save Address</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
