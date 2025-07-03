import React from 'react';
import { FiStar } from 'react-icons/fi';
import './CustomerReviews.css';

const reviews = [
  { rating: 5, quote: "Amazing quality gifts! I ordered a custom gift box and it exceeded my expectations. The packaging was beautiful and the items were perfect.", customer: "Sarah Johnson" },
  { rating: 4, quote: "Great selection of unique gifts. Found the perfect birthday present for my daughter. Fast shipping and excellent customer service!", customer: "Michael Chen" },
  { rating: 5, quote: "I've been shopping here for years and they never disappoint. The handmade jewelry collection is absolutely stunning. Highly recommend!", customer: "Emily Rodriguez" },
  { rating: 4, quote: "Perfect for last-minute gifts! The website is easy to navigate and they have something for everyone. Will definitely shop here again.", customer: "David Thompson" }
];

const CustomerReviews = () => (
  <section className="customer-reviews">
    <h2 className="section-title">Customer Love</h2>
    <p className="section-subtitle">What our happy customers have to say</p>
    <div className="reviews-grid">
      {reviews.map((r, i) => (
        <div className="review-card" key={i}>
          <div className="stars">
            {[...Array(5)].map((_, j) =>
              <FiStar key={j} color={j < r.rating ? '#ffd700' : '#ddd'} />
            )}
          </div>
          <blockquote className="review-quote">"{r.quote}"</blockquote>
          <div className="review-customer">{r.customer}</div>
        </div>
      ))}
    </div>
  </section>
);

export default CustomerReviews;