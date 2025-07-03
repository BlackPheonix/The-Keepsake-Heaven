import React from 'react';
import { FiStar } from 'react-icons/fi';
import './FeaturedProducts.css';

const products = [
  { name: 'Luxury Gift Box', price: 29.99, img: '/images/Box.jpg', rating: 5 },
  { name: 'Handmade Jewelry', price: 49.99, img: '/images/Ornaments.jpg', rating: 4 },
  { name: 'Soft Teddy Bear', price: 19.99, img: '/images/Toy.jpg', rating: 5 },
  { name: 'Branded Perfume', price: 15.99, img: '/images/Perfumes.jpg', rating: 3 },
  { name: 'Choco', price: 24.99, img: '/images/Food.jpg', rating: 4 },
  { name: 'Flower Bouquet', price: 34.99, img: '/images/Floral.jpg', rating: 5 }
];

const FeaturedProducts = () => (
  <section className="featured-products">
    <h2 className="section-title">Featured Products</h2>
    <p className="section-subtitle">Our most loved gifts that everyone adores</p>
    <div className="products-grid">
      {products.map((prod, i) => (
        <div key={i} className="product-card">
          <img src={prod.img} alt={prod.name} />
          <h3>{prod.name}</h3>
          <p className="price">${prod.price.toFixed(2)}</p>
          <div className="stars">
            {[...Array(5)].map((_, j) =>
              <FiStar key={j} color={j < prod.rating ? '#ffd700' : '#ddd'} />
            )}
          </div>
          <button className="add-to-cart-btn">Add to Cart</button>
        </div>
      ))}
    </div>
    <div className="view-all-container">
      <button className="view-all-btn">View All Products</button>
    </div>
  </section>
);

export default FeaturedProducts;