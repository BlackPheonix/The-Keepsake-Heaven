import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/FirebaseConfig";
import { addToCart } from "../firebase/firebaseUtils";
import "./OrderHistory.css";
import logo from "../assets/logo.png";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [orders, setOrders] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        const userOrders = storedOrders.filter(order => order.userId === user.uid);
        setOrders(userOrders);
      } else {
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const toggleOrder = (orderId) => {
    setExpandedOrderId(orderId === expandedOrderId ? null : orderId);
  };

  const handleSignOut = () => {
    navigate("/signin");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleCheckboxChange = (orderId, itemIndex) => {
    setSelectedItems((prev) => {
      const key = `${orderId}-${itemIndex}`;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const handleAddToCart = async (orderId) => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/signin");
      return;
    }

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const selected = order.items.filter((_, index) =>
      selectedItems[`${orderId}-${index}`]
    );

    if (selected.length === 0) {
      alert("Please select at least one item to add to cart.");
      return;
    }

    try {
      for (const item of selected) {
        const productToAdd = {
          name: item.name,
          quantity: item.quantity,
          price: parseFloat(item.price),
        };
        await addToCart(user.uid, productToAdd);
      }
      alert("Selected items added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Something went wrong while adding to cart.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderIdMatch = order.id.toLowerCase().includes(searchQuery);
    const customerMatch = order.customer.toLowerCase().includes(searchQuery);
    const itemMatch = order.items.some((item) =>
      item.name.toLowerCase().includes(searchQuery)
    );
    return orderIdMatch || customerMatch || itemMatch;
  });

  return (
    <div className="order-history-container">
      <div className="sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <nav>
          <ul>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/account">Account Details</a></li>
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
          <input
            type="text"
            placeholder="Search for Order ID, Customer, or Product"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="order-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <div key={index} className="order-item">
                <div
                  className="order-summary"
                  onClick={() => toggleOrder(order.id)}
                >
                  <span>{order.id}</span>
                  <span>{order.customer}</span>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                {expandedOrderId === order.id && (
                  <div className="order-details">
                    <p>{order.details}</p>
                    <ul className="order-items">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          <input
                            type="checkbox"
                            checked={!!selectedItems[`${order.id}-${i}`]}
                            onChange={() => handleCheckboxChange(order.id, i)}
                          />
                          {item.name} - Qty: {item.quantity} - Rs. {item.price}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(order.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No orders match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
