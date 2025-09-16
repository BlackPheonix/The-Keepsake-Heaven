import React from 'react';
import './Categories.css';
import { Link, useNavigate } from 'react-router-dom';

// Update categories to your preferred list (with images)
const categories = [
  { name: 'Gift Box / Personalized Gifts', img: '/images/Box.jpg' },
  { name: 'Jewelry / Watches', img: '/images/jewelry.jpg' },
  { name: 'Beauty/Cosmetics & Skin Care', img: '/images/beauty.jpg' },
  { name: 'Chocolates', img: '/images/Food.jpg' },
  { name: 'Flowers', img: '/images/Floral.jpg' },
  { name: 'Soft Toys', img: '/images/Toy.jpg' },
  { name: 'Greeting Cards / Handmade Greeting Cards', img: '/images/cards.jpg' },
  { name: 'Bags/Fashion & Shoes', img: '/images/bags.jpg' },
  { name: 'Perfumes & Fragrances', img: '/images/Perfumes.jpg' },
  { name: 'Home Decor / Homewares & Fancy', img: '/images/Decor.jpg' },
  { name: 'Gift Vouchers', img: '/images/voucher.jpg' },
  { name: 'Resin Products', img: '/images/resin.jpg' }
];

const Categories = () => {
  const navigate = useNavigate();

  const handleExplore = (category) => {
    // Encode category for URL safety
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="categories">
      <h2 className="section-title">Shop by Category</h2>
      <p className="section-subtitle">Discover thoughtful gifts for every occasion</p>
      <div className="categories-grid">
        {categories.map((cat, i) => (
          <div className="category-card" key={i}>
            <img src={cat.img} alt={cat.name} />
            <h3>{cat.name}</h3>
            <button className="explore-btn" onClick={() => handleExplore(cat.name)}>Explore</button>
          </div>
        ))}
      </div>
      <div className="view-all-container">
        <Link to="/shop" className="view-all-cat">View All Categories</Link>
      </div>
    </section>
  );
};

export default Categories;