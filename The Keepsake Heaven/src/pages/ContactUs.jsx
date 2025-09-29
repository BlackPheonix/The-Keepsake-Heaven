import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import "../styles/ContactUs.css";
import { addReview, fetchReviews } from "../firebase/reviewUtils";
import Popup from "../pages/Popup"; // Import your existing Popup component

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
  const navigate = useNavigate();
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Review system state
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submitMsg, setSubmitMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Popup state
  const [popup, setPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("👤 Auth state changed:", currentUser ? "User logged in" : "No user");
      setUser(currentUser);
      setAuthLoading(false);
      
      // Pre-fill name if user is logged in
      if (currentUser) {
        // Try to get displayName or use email
        const userName = currentUser.displayName || currentUser.email?.split('@')[0] || '';
        if (userName && !reviewName) {
          setReviewName(userName);
        }
      }
    });
    
    return () => unsubscribe();
  }, [reviewName]);

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

  // Function to show popup
  const showPopup = (title, message, type = 'info') => {
    setPopup({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Function to close popup
  const closePopup = () => {
    setPopup({
      isOpen: false,
      title: '',
      message: '',
      type: 'info'
    });
  };

  const handleSubmitReview = async e => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      showPopup(
        'Authentication Required', 
        'Please log in or sign up to submit a review. Your feedback is important to us!', 
        'warning'
      );
      
      // Optionally redirect after showing popup
      setTimeout(() => {
        closePopup();
        navigate('/signin');
      }, 3000);
      
      return;
    }

    // Validate form fields
    if (!reviewName.trim() || !reviewText.trim() || reviewRating === 0) {
      showPopup(
        'Incomplete Review', 
        'Please enter your name, write a review, and select a star rating.', 
        'error'
      );
      return;
    }

    try {
      setSubmitMsg("Submitting your review...");
      
      console.log("📝 Submitting review:", {
        name: reviewName,
        text: reviewText,
        rating: reviewRating,
        userId: user.uid
      });

      await addReview({ 
        name: reviewName, 
        text: reviewText, 
        rating: reviewRating,
        userId: user.uid, // Add user ID for better tracking
        userEmail: user.email // Optional: add email for admin reference
      });

      // Clear form
      setReviewName("");
      setReviewText("");
      setReviewRating(0);
      
      // Show success message
      showPopup(
        'Review Submitted!', 
        'Thank you for your feedback! Your review has been submitted successfully.', 
        'success'
      );

      // Refresh reviews
      const revs = await fetchReviews();
      setReviews(revs);
      
      setSubmitMsg("");
    } catch (error) {
      console.error("❌ Error submitting review:", error);
      showPopup(
        'Submission Failed', 
        'Sorry, there was an error submitting your review. Please try again.', 
        'error'
      );
      setSubmitMsg("");
    }
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
          
          {/* Authentication status indicator */}
          {!authLoading && (
            <div className="auth-status" style={{
              padding: '0.5rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'center',
              fontSize: '0.9rem',
              background: user ? '#d4edda' : '#f8d7da',
              color: user ? '#155724' : '#721c24',
              border: `1px solid ${user ? '#c3e6cb' : '#f5c6cb'}`
            }}>
              {user ? (
                <span> Logged in as: {user.displayName || user.email}</span>
              ) : (
                <span> Please <strong>log in</strong> to submit reviews</span>
              )}
            </div>
          )}
          
          <form className="review-form" onSubmit={handleSubmitReview}>
            <label>
              <span>Your Name:</span>
              <input
                type="text"
                value={reviewName}
                onChange={e => setReviewName(e.target.value)}
                required
                placeholder={user ? "Enter your name" : "Please log in to submit a review"}
                disabled={!user}
                style={{ 
                  marginTop: "0.3rem", 
                  marginBottom: "0.5rem", 
                  borderRadius: "8px", 
                  border: "1px solid #d183ae", 
                  padding: "0.6rem", 
                  fontSize: "1rem", 
                  width: "100%",
                  backgroundColor: user ? '#fff' : '#f8f9fa',
                  cursor: user ? 'text' : 'not-allowed'
                }}
              />
            </label>
            <label>
              <span>Your Review:</span>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                rows={3}
                required
                placeholder={user ? "Write your experience or feedback..." : "Please log in to write a review"}
                disabled={!user}
                style={{
                  backgroundColor: user ? '#fff' : '#f8f9fa',
                  cursor: user ? 'text' : 'not-allowed'
                }}
              />
            </label>
            <div className="review-stars">
              <span>Rating:</span>
              <div style={{ pointerEvents: user ? 'auto' : 'none', opacity: user ? 1 : 0.5 }}>
                <StarRating rating={reviewRating} setRating={setReviewRating} />
              </div>
            </div>
            <button 
              type="submit" 
              className="review-submit-btn"
              disabled={!user}
              style={{
                opacity: user ? 1 : 0.6,
                cursor: user ? 'pointer' : 'not-allowed',
                backgroundColor: user ? '' : '#ccc'
              }}
            >
              {user ? 'Submit Review' : 'Login Required'}
            </button>
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

      {/* Popup Component */}
      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
      />
    </main>
  );
};

export default ContactUs;