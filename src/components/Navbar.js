import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/images/The Keepsake Heaven logo.png" alt="Keepsake Heaven" />
        </Link>
      </div>
      
      <div className="menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>
      
      <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>
      
      <div className="navbar-actions">
        <Link to="/cart" className="navbar-cart" aria-label="Shopping Cart">
          <FiShoppingCart size={24} />
          <span className="cart-count">0</span>
        </Link>
        <Link to="/signin" className="navbar-login">Login / Signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;