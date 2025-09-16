import React, { useState, useEffect } from 'react';
import './FeaturedProducts.css';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../firebase/firebaseUtils';
import { FiStar } from 'react-icons/fi';

const FeaturedProducts = () => {
  const [mostRated, setMostRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await getAllProducts();
      if (res.success) {
        // Sort by avgRating (desc), then by numRatings (desc), then by name (asc for stability)
        const sorted = res.data
          .filter(p => typeof p.avgRating === 'number' && typeof p.numRatings === 'number')
          .sort((a, b) => {
            if ((b.avgRating || 0) !== (a.avgRating || 0))
              return (b.avgRating || 0) - (a.avgRating || 0);
            if ((b.numRatings || 0) !== (a.numRatings || 0))
              return (b.numRatings || 0) - (a.numRatings || 0);
            return (a.name || '').localeCompare(b.name || '');
          })
          .slice(0, 6); // Top 6
        setMostRated(sorted);
      } else {
        setMostRated([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <section className="featured-products">
      <h2 className="section-title">Most Rated Products</h2>
      <p className="section-subtitle">Our top-rated gifts that everyone loves</p>
      {loading ? (
        <div className="loading" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <div className="products-grid">
          {mostRated.map((prod, i) => (
            <div key={prod.id || i} className="product-card">
              <img
                src={prod.image || (prod.images && prod.images[0]) || '/images/placeholder.png'}
                alt={prod.name}
                className="product-image"
                onError={e => { e.target.src = '/images/placeholder.png'; }}
              />
              <h3>{prod.name}</h3>
              <p className="price">
                LKR {typeof prod.price === "number"
                  ? prod.price.toLocaleString(undefined, { minimumFractionDigits: 2 })
                  : "0.00"}
              </p>
              <p className="stars">
                {[...Array(5)].map((_, starIdx) => (
                  <FiStar key={starIdx}
                    className={starIdx < Math.round(prod.avgRating || 0) ? 'star-filled' : 'star-empty'}
                  />
                ))}
                <span style={{ fontSize: 13, color: '#888', marginLeft: 7 }}>
                  {prod.numRatings ? `(${prod.numRatings})` : ''}
                </span>
              </p>
              <Link to={`/product/${prod.id}`}>
                <button className="add-to-cart-btn">View Product</button>
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="view-all-container">
        <Link to="/shop" className="view-all-btn">View All Products</Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;