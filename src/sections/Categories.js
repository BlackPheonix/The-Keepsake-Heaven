import React from 'react';
import './Categories.css';

const categories = [
  { name: 'Toys', img: '/images/Toy.jpg' },
  { name: 'Foods', img: '/images/Food.jpg' },
  { name: 'Ornaments', img: '/images/Ornaments.jpg' },
  { name: 'Floral', img: '/images/Floral.jpg' },
  { name: 'Baby Items', img: '/images/Baby Items.jpg' },
  { name: 'Perfumes', img: '/images/Perfumes.jpg' },
  { name: 'Accessories', img: '/images/Accessories.jpg' },
  { name: 'Home Decor', img: '/images/Decor.jpg' }
];

const Categories = () => (
  <section className="categories">
    <h2 className="section-title">Shop by Category</h2>
    <p className="section-subtitle">Discover thoughtful gifts for every occasion</p>
    <div className="categories-grid">
      {categories.map((cat, i) => (
        <div className="category-card" key={i}>
          <img src={cat.img} alt={cat.name} />
          <h3>{cat.name}</h3>
          <button className="explore-btn">Explore</button>
        </div>
      ))}
    </div>
  </section>
);

export default Categories;