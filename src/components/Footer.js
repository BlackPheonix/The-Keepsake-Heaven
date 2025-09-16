import React from 'react';
import './Footer.css';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Gift Box / Personalized Gifts',
  'Jewelry / Watches',
  'Chocolates',
  'Flowers',
  'Soft Toys',
  'Beauty/Cosmetics & Skin Care',
];

const Footer = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
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
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h3>Categories</h3>
          <ul>
            {categories.map(cat => (
              <li
                key={cat}
                style={{ cursor: 'pointer', color: '#E45959' }}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} The Keepsake Heaven Pvt Ltd • All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;