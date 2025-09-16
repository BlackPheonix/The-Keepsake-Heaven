<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import "../styles/ContactUs.css";
import { addReview, fetchReviews } from "../firebase/reviewUtils";

// Star rating component
function StarRating({ rating, setRating }) {
  return (
    <div className="star-rating">
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          className={star <= rating ? "star filled" : "star"}
          onClick={() => setRating(star)}
          role="button"
          aria-label={`${star} Star`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const ContactUs = () => {
  // Review system state
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submitMsg, setSubmitMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch reviews from Firestore
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

  const handleSubmitReview = async e => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim() || reviewRating === 0) {
      setSubmitMsg("Please enter your name, a review and select a star rating.");
      return;
    }
    setSubmitMsg("Submitting...");
    await addReview({ name: reviewName, text: reviewText, rating: reviewRating });
    setReviewName("");
    setReviewText("");
    setReviewRating(0);
    setSubmitMsg("Thank you for your review!");
    // Fetch new reviews
    const revs = await fetchReviews();
    setReviews(revs);
    setTimeout(() => setSubmitMsg(""), 2000);
  };

  return (
    <main className="contactus-container">
      <h1 className="contactus-title">Contact Us</h1>
      <div className="contactus-main-flex">
        <div>
          <div className="contactus-details-card">
            <h2>The Keepsake Heaven</h2>
            <address>
              No 2/1,<br />
              Somawathiya Road,<br />
              Hospital Junction,<br />
              Polonnaruwa,<br />
              Sri Lanka, 51000
            </address>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:Thekeepsakeheaven0120@gmail.com">
                Thekeepsakeheaven0120@gmail.com
              </a>
              <br />
              <strong>Phone:</strong>{" "}
              <a href="tel:+94771415286">+94 77 141 5286</a>
            </p>
          </div>
          <div className="contactus-map">
            <iframe
              title="Keepsake Heaven Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.525407230329!2d81.00879717568557!3d7.9445305050194275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afb450064b0ce13%3A0x8426f0d23a060b41!2sThe%20keepsake%20heaven!5e0!3m2!1sen!2slk!4v1752300612729!5m2!1sen!2slk"
              width="100%"
              height="320"
              style={{ border: 0, borderRadius: "16px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        {/* Customer Review Section */}
        <section className="customer-review-section">
          <h2 className="review-section-title">Customer Reviews</h2>
          <form className="review-form" onSubmit={handleSubmitReview}>
            <label>
              <span>Your Name:</span>
              <input
                type="text"
                value={reviewName}
                onChange={e => setReviewName(e.target.value)}
                required
                placeholder="Enter your name"
                style={{ marginTop: "0.3rem", marginBottom: "0.5rem", borderRadius: "8px", border: "1px solid #d183ae", padding: "0.6rem", fontSize: "1rem", width: "100%" }}
              />
            </label>
            <label>
              <span>Your Review:</span>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                rows={3}
                required
                placeholder="Write your experience or feedback..."
              />
            </label>
            <div className="review-stars">
              <span>Rating:</span>
              <StarRating rating={reviewRating} setRating={setReviewRating} />
            </div>
            <button type="submit" className="review-submit-btn">Submit Review</button>
            {submitMsg && <div className="review-msg">{submitMsg}</div>}
          </form>
          <div className="customer-reviews-list">
            {loading ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="no-reviews-yet">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((rev, i) => (
                <div className="customer-review" key={rev.id || i}>
                  <div className="review-stars-display">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx} className={idx < rev.rating ? "star filled" : "star"}>★</span>
                    ))}
                  </div>
                  <div className="review-text">{rev.text}</div>
                  <div className="review-meta">
                    <span className="review-author">{rev.name}</span>
                    <span className="review-date">{rev.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
=======
import React from "react";
import "../styles/ContactUs.css";

const ContactUs = () => (
  <main className="contactus-container">
    <h1 className="contactus-title">Contact Us</h1>
    <div className="contactus-flex">
      <div className="contactus-info">
        <h2>The Keepsake Heaven</h2>
        <address>
          No 2/1,<br />
          Somawathiya Road,<br />
          Hospital Junction,<br />
          Polonnaruwa,<br />
          Sri Lanka, 51000
        </address>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:Thekeepsakeheaven0120@gmail.com">
            Thekeepsakeheaven0120@gmail.com
          </a>
          <br />
          <strong>Phone:</strong>{" "}
          <a href="tel:+94771415286">+94 77 141 5286</a>
        </p>
      </div>
      <div className="contactus-map">
        <iframe
          title="Keepsake Heaven Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.525407230329!2d81.00879717568557!3d7.9445305050194275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afb450064b0ce13%3A0x8426f0d23a060b41!2sThe%20keepsake%20heaven!5e0!3m2!1sen!2slk!4v1752300612729!5m2!1sen!2slk"
          width="100%"
          height="320"
          style={{ border: 0, borderRadius: "12px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </main>
);
>>>>>>> 262353982ba57221bfe0578b1e4b0a470efa4bae

export default ContactUs;