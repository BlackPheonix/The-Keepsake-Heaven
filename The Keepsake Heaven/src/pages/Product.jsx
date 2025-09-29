import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/FirebaseConfig';
import { getProductById, getAllProducts, addToCart } from '../firebase/firebaseUtils';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import './Product.css';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [userRating, setUserRating] = useState(0); // Initialize with 0 for no rating
  const [hoverRating, setHoverRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [numRatings, setNumRatings] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // When auth state changes, re-fetch product to get user-specific rating
      if (product) {
        fetchUserRating(product.id, currentUser);
      }
    });
    return () => unsubscribe();
  }, [product]); // Add product to dependency array to re-fetch user rating if product loads later

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError('');
      try {
        console.log("Fetching product with ID:", id);
        const res = await getProductById(id);
        if (!res.success) {
          setError('Product not found');
          setLoading(false);
          return;
        }
        const prod = res.data;
        setProduct(prod);
        setMainImage(prod.image || (prod.images && prod.images[0]) || '/images/placeholder.png');
        setAvgRating(prod.avgRating || 0);
        setNumRatings(prod.numRatings || 0);

        // Fetch user-specific rating after product is loaded
        fetchUserRating(prod.id, user);

      } catch (err) {
        console.error("Error fetching product:", err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]); // Only depend on ID for initial product fetch

  // Separate function to fetch user rating
  const fetchUserRating = async (productId, currentUser) => {
    if (currentUser) {
      console.log("Fetching user rating for:", `${productId}_${currentUser.uid}`);
      try {
        const userRatingDoc = await getDoc(doc(db, "productRatings", `${productId}_${currentUser.uid}`));
        if (userRatingDoc.exists()) {
          setUserRating(userRatingDoc.data().rating);
        } else {
          setUserRating(0); // Reset if no user rating found
        }
      } catch (err) {
        console.error("Error fetching user rating:", err);
        // Optionally set an error state for user rating fetch
      }
    } else {
      setUserRating(0); // No user, no rating
    }
  };


  useEffect(() => {
    async function fetchSimilar() {
      if (product?.category) {
        console.log("Fetching similar products for category:", product.category);
        const allRes = await getAllProducts();
        if (allRes.success) {
          const similars = allRes.data
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
          setSimilarProducts(similars);
        } else {
          console.error("Error fetching similar products:", allRes.error);
        }
      }
    }
    fetchSimilar();
  }, [product]);

  const handleRate = async (ratingValue) => {
    if (!user) {
      alert('Sign in to rate this product!');
      return;
    }
    try {
      const ratingRef = doc(db, "productRatings", `${id}_${user.uid}`);
      const productRef = doc(db, "products", id);

      console.log("Submitting rating:", ratingValue);
      const prevRatingDoc = await getDoc(ratingRef);
      const productSnap = await getDoc(productRef);

      let currentAvg = productSnap.data().avgRating || 0;
      let currentCount = productSnap.data().numRatings || 0;

      let newAvg;
      let newCount = currentCount;

      if (prevRatingDoc.exists()) {
        // User has rated before, update existing rating
        const oldRating = prevRatingDoc.data().rating;
        // Recalculate average: (old_total - old_rating + new_rating) / count
        newAvg = ((currentAvg * currentCount) - oldRating + ratingValue) / currentCount;
        await setDoc(ratingRef, { productId: id, userId: user.uid, rating: ratingValue });

      } else {
        // First time user is rating this product
        newCount = currentCount + 1;
        // Recalculate average: (old_total + new_rating) / new_count
        newAvg = ((currentAvg * currentCount) + ratingValue) / newCount;
        await setDoc(ratingRef, { productId: id, userId: user.uid, rating: ratingValue });
      }

      await updateDoc(productRef, { avgRating: newAvg, numRatings: newCount });
      setAvgRating(newAvg);
      setNumRatings(newCount);
      setUserRating(ratingValue); // Update local state immediately
      alert('Rating submitted successfully!');
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert('Failed to submit rating: ' + err.message);
    }
  };

  const handleAddToCart = async (prod = product) => {
    if (!user) {
      alert('Please sign in to add to cart.');
      return;
    }
    try {
      console.log("Adding to cart:", prod.id);
      const cartItem = {
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image || (prod.images && prod.images[0]) || '/images/placeholder.png',
        category: prod.category,
        quantity: 1,
      };
      const res = await addToCart(user.uid, cartItem);
      if (res.success) {
        alert('Added to cart successfully!');
      } else {
        alert('Failed to add to cart: ' + (res.error || 'Unknown error'));
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert('Failed to add to cart: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="pd-product-not-found">{error}</div>;

  const handleNext = () => {
    if (carouselIndex < similarProducts.length - 1) setCarouselIndex(carouselIndex + 1);
    else setCarouselIndex(0);
  };

  const handlePrev = () => {
    if (carouselIndex > 0) setCarouselIndex(carouselIndex - 1);
    else setCarouselIndex(similarProducts.length - 1);
  };

  const handleDotClick = idx => setCarouselIndex(idx);

  return (
    <section className="pd-product-page">
      <div className="pd-product-container">
        <div className="pd-product-image-section">
          <img
            src={mainImage}
            alt={product.name}
            onError={e => { e.target.src = '/images/placeholder.png'; }}
            className="pd-product-detail-image"
          />
          <div className="pd-thumbnail-container">
            {(product.images?.length > 0 ? product.images : [product.image]).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                onError={e => { e.target.src = '/images/placeholder.png'; }}
                className={`pd-thumbnail ${mainImage === img ? 'pd-thumbnail-active' : ''}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="pd-product-details">
          <h2 className="pd-product-detail-name">{product.name}</h2>
          <p className="pd-product-detail-price">LKR {product.price ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}</p>
          <div className="pd-product-detail-stars">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.round(avgRating) ? 'pd-star-filled' : 'pd-star-empty'} />
            ))}
            <span style={{ marginLeft: 8, color: '#888', fontSize: 13 }}>
              ({numRatings} rating{numRatings !== 1 ? 's' : ''})
            </span>
          </div>
          <div style={{ margin: '0.5rem 0' }}>
            <span style={{ fontWeight: 500 }}>Your Rating:</span>
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={
                  (hoverRating > 0 ? hoverRating : userRating) > i
                    ? 'pd-star-filled'
                    : 'pd-star-empty'
                }
                style={{ cursor: user ? 'pointer' : 'not-allowed', fontSize: 28, marginLeft: 3 }}
                onMouseEnter={() => user && setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => user && handleRate(i + 1)}
              />
            ))}
            {userRating > 0 && <span style={{ marginLeft: 8, color: '#4ecdc4', fontSize: 13 }}>(You rated {userRating})</span>}
          </div>

          <p className="pd-product-detail-category">Category: {product.category}</p>

          <div className="pd-tabs">
            <button
              className={`pd-tab-button ${activeTab === 'description' ? 'pd-tab-active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`pd-tab-button ${activeTab === 'reviews' ? 'pd-tab-active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          <div className="pd-tab-content">
            {activeTab === 'description' ? (
              <p className="pd-product-detail-description">{product.description}</p>
            ) : (
              <div className="pd-review-section">
                {/* ...your reviews UI... */}
              </div>
            )}
          </div>

          <button className="pd-product-add-to-cart-btn" onClick={() => handleAddToCart()}>
            Add to Cart
          </button>
          <Link to="/shop" className="pd-product-back-link">Back to Shop</Link>
        </div>
      </div>
      <div className="pd-similar-products-section">
        <h2 className="pd-section-title">Similar Products</h2>
        <div className="pd-similar-products-carousel">
          <button className="pd-carousel-prev" onClick={handlePrev}>
            <FiArrowLeft />
          </button>
          <div className="pd-carousel-viewport">
            <div
              className="pd-carousel-track"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              ref={carouselRef}
            >
              {similarProducts.map((prod, i) => (
                <Link
                  to={`/product/${prod.id}`}
                  key={prod.id}
                  className="pd-product-card"
                >
                  <img
                    src={prod.image || (prod.images && prod.images[0]) || '/images/placeholder.png'}
                    alt={prod.name}
                    onError={e => { e.target.src = '/images/placeholder.png'; }}
                    className="pd-product-image"
                  />
                  <h3 className="pd-product-name">{prod.name}</h3>
                  <p className="pd-product-price">
                    LKR {typeof prod.price === "number"
                      ? prod.price.toLocaleString(undefined, { minimumFractionDigits: 2 })
                      : "0.00"}
                  </p>
                  <div className="pd-product-stars">
                    {[...Array(5)].map((_, j) => (
                      <FiStar key={j} className={j < Math.round(prod.avgRating || 0) ? 'pd-star-filled' : 'pd-star-empty'} />
                    ))}
                  </div>
                  <button className="pd-add-to-cart-btn" onClick={e => {
                    e.preventDefault();
                    handleAddToCart(prod);
                  }}>Add to Cart</button>
                </Link>
              ))}
            </div>
          </div>
          <button className="pd-carousel-next" onClick={handleNext}>
            <FiArrowRight />
          </button>
          <div className="pd-carousel-dots">
            {similarProducts.map((_, index) => (
              <span
                key={index}
                className={`pd-carousel-dot ${carouselIndex === index ? 'pd-carousel-dot-active' : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;