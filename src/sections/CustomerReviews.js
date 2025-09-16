import React, { useEffect, useState } from 'react';
import './CustomerReviews.css';
import { fetchReviews } from '../firebase/reviewUtils';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchReviews().then(revs => {
      if (mounted) {
        setReviews(revs);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="customer-reviews">
      <h2 className="section-title">Customer Love</h2>
      <p className="section-subtitle">What our happy customers have to say</p>
      <div className="reviews-grid">
        {loading ? (
          <div style={{gridColumn: "1 / -1", textAlign: "center"}}>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div style={{gridColumn: "1 / -1", textAlign: "center"}}>No reviews yet. Be the first to review!</div>
        ) : (
          reviews.map((r, i) => (
            <div className="review-card" key={r.id || i}>
              <p className="stars">
                {Array.from({length: 5}).map((_, idx) => (
                  <span key={idx}>{idx < r.rating ? "★" : "☆"}</span>
                ))}
              </p>
              <blockquote className="review-quote">"{r.text}"</blockquote>
              <div className="review-customer">{r.name}</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CustomerReviews;