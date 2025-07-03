import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";
import logo from "../assets/logo.png";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: "xxxx xxxx xxxx xxxx",
      customer: "Asheli Dias Negombo",
      status: "Delivered",
      details: "This order was delivered on October 15, 2023.",
      items: [
        { name: "Handmade Greeting Card", quantity: 2, price: "Rs.250.00" },
        { name: "Custom Gift Basket", quantity: 1, price: "Rs.5000.00" },
      ],
    },
    {
      id: "xxxx xxxx xxxx xxxx",
      customer: "Asheli Dias Colombo 03",
      status: "Delivered",
      details: "This order was delivered on October 10, 2023.",
      items: [
        { name: "Personalized Mug", quantity: 3, price: "Rs.1250.00" },
        { name: "Photo Frame", quantity: 1, price: "Rs.3000.00" },
      ],
    },
    {
      id: "xxxx xxxx xxxx xxxx",
      customer: "Asheli Dias Negombo",
      status: "Delivered",
      details: "This order was delivered on October 5, 2023.",
      items: [
        { name: "Handmade Candle Set", quantity: 1, price: "Rs.2000.00" },
        { name: "Custom Jewelry Box", quantity: 1, price: "Rs.1500.00" },
      ],
    },
  ];

  const handleSignOut = () => {
    navigate("/signin");
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closePopup = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="order-history-container">
      <div className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <nav>
          <ul>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/account">Account Details</a></li>
            <li><a href="/payment-methods">Payment Methods</a></li>
            <li className="active">Order History</li>
          </ul>
        </nav>
      </div>

      <div className="content">
        <div className="header">
          <h2>Order History</h2>
          <p>Here you can manage your orders</p>
          <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Search for Order ID or Product" />
        </div>

        <div className="order-list">
          {orders.map((order, index) => (
            <div key={index} className="order-item" onClick={() => handleOrderClick(order)}>
              <span>{order.id}</span>
              <span>{order.customer}</span>
              <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={closePopup}>×</button>
            <h3>Order Details</h3>
            <p>{selectedOrder.details}</p>
            <h4>Items:</h4>
            <ul className="order-items">
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  {item.name} - Quantity: {item.quantity} - Price: {item.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
