import React from 'react';
import './AdminFooter.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Keepsake Heaven Gift Store - Sri Lanka. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
          <a href="/">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;