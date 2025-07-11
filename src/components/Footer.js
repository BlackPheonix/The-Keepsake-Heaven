import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div>
        <img src="/images/The Keepsake Heaven logo.png" alt="logo" />
        <p>Your one-stop destination for perfect gifts. We bring joy to every occasion with our curated collection.</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/shop">Shop</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3>Categories</h3>
        <ul>
          <li>Toys</li>
          <li>Jewelry</li>
          <li>Home Decor</li>
          <li>Baby Items</li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      &copy; {new Date().getFullYear()} © 2025 The Keepsake Heaven Pvt Ltd • All rights reserved.
    </div>
  </footer>
);

export default Footer;