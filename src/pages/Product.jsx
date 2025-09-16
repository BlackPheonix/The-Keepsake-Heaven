<<<<<<< HEAD
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
=======
import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import './Product.css';

const allProducts = [
  {
    name: 'Luxury Gift Box', price: 29.99, 
    images: ['/images/Box.jpg', '/images/Box2.jpg', '/images/Box3.jpg'], 
    rating: 5, category: 'Gift Box', 
    description: 'A beautifully curated gift box filled with premium items.'
  },
  {
    name: 'Handmade Jewelry', price: 49.99, 
    images: ['/images/Ornaments.jpg', '/images/Ornaments2.jpg', '/images/Ornaments3.jpg'], 
    rating: 4, category: 'Jewelry', 
    description: 'Exquisite handmade jewelry crafted with care.'
  },
  {
    name: 'Soft Teddy Bear', price: 19.99, 
    images: ['/images/Toy.jpg', '/images/Toy2.jpg', '/images/Toy3.jpg'], 
    rating: 5, category: 'Plush', 
    description: 'A cuddly teddy bear perfect for all ages.'
  },
  {
    name: 'Branded Perfume', price: 15.99, 
    images: ['/images/Perfumes.jpg', '/images/Perfumes2.jpg', '/images/Perfumes3.jpg'], 
    rating: 3, category: 'Perfume', 
    description: 'A luxurious fragrance with lasting scent.'
  },
  {
    name: 'Choco', price: 24.99, 
    images: ['/images/Food.jpg', '/images/Food2.jpg', '/images/Food3.jpg'], 
    rating: 4, category: 'Food', 
    description: 'Delicious assorted chocolates in a gift pack.'
  },
  {
    name: 'Flower Bouquet', price: 34.99, 
    images: ['/images/Floral.jpg', '/images/Floral2.jpg', '/images/Floral3.jpg'], 
    rating: 5, category: 'Floral', 
    description: 'A vibrant bouquet of fresh flowers.'
  },
  {
    name: 'Gift Mug', price: 12.99, 
    images: ['/images/mug.jpg', '/images/mug2.jpg', '/images/mug3.jpg'], 
    rating: 4, category: 'Home', 
    description: 'A stylish ceramic mug for everyday use.'
  },
  {
    name: 'Personalized Cushion', price: 25.49, 
    images: ['/images/cushion.jpg', '/images/cushion2.jpg', '/images/cushion3.jpg'], 
    rating: 5, category: 'Home', 
    description: 'Customizable cushion with soft filling.'
  },
  {
    name: 'Greeting Card Set', price: 7.99, 
    images: ['/images/cards.jpg', '/images/cards2.jpg', '/images/cards3.jpg'], 
    rating: 4, category: 'Stationery', 
    description: 'A set of beautifully designed greeting cards.'
  },
  {
    name: 'Wooden Keepsake', price: 39.99, 
    images: ['/images/wood.jpg', '/images/wood2.jpg', '/images/wood3.jpg'], 
    rating: 5, category: 'Keepsake', 
    description: 'A handcrafted wooden box for cherished memories.'
  },
  {
    name: 'Love Jar Notes', price: 9.99, 
    images: ['/images/jar.jpg', '/images/jar2.jpg', '/images/jar3.jpg'], 
    rating: 3, category: 'Keepsake', 
    description: 'A jar filled with heartfelt love notes.'
  },
  {
    name: 'Miniature Couple Frame', price: 22.99, 
    images: ['/images/frame.jpg', '/images/frame2.jpg', '/images/frame3.jpg'], 
    rating: 4, category: 'Home', 
    description: 'A charming frame for couple photos.'
  },
  {
    name: 'Bath Set', price: 27.49, 
    images: ['/images/bath.jpg', '/images/bath2.jpg', '/images/bath3.jpg'], 
    rating: 4, category: 'Personal Care', 
    description: 'A relaxing bath set with natural ingredients.'
  },
  {
    name: 'Rose Teddy', price: 44.99, 
    images: ['/images/roseteddy.jpg', '/images/roseteddy2.jpg', '/images/roseteddy3.jpg'], 
    rating: 5, category: 'Plush', 
    description: 'A unique teddy bear made of rose petals.'
  },
  {
    name: 'LED Night Light', price: 19.49, 
    images: ['/images/nightlight.jpg', '/images/nightlight2.jpg', '/images/nightlight3.jpg'], 
    rating: 4, category: 'Home', 
    description: 'A soft-glowing LED night light.'
  },
  {
    name: 'Customized Keychain', price: 8.99, 
    images: ['/images/keychain.jpg', '/images/keychain2.jpg', '/images/keychain3.jpg'], 
    rating: 3, category: 'Accessories', 
    description: 'A personalized keychain with custom engraving.'
  },
  {
    name: 'Leather Wallet', price: 31.99, 
    images: ['/images/wallet.jpg', '/images/wallet2.jpg', '/images/wallet3.jpg'], 
    rating: 5, category: 'Accessories', 
    description: 'A premium leather wallet with sleek design.'
  },
  {
    name: 'Art Candle Set', price: 14.49, 
    images: ['/images/candles.jpg', '/images/candles2.jpg', '/images/candles3.jpg'], 
    rating: 4, category: 'Home', 
    description: 'A set of artistic candles for ambiance.'
  },
  {
    name: 'Decorative Photo Album', price: 26.79, 
    images: ['/images/album.jpg', '/images/album2.jpg', '/images/album3.jpg'], 
    rating: 5, category: 'Keepsake', 
    description: 'A beautifully designed photo album.'
  },
  {
    name: 'Mini Plant Gift', price: 13.59, 
    images: ['/images/plant.jpg', '/images/plant2.jpg', '/images/plant3.jpg'], 
    rating: 4, category: 'Floral', 
    description: 'A cute mini plant for any space.'
  }
];

const Product = () => {
  const { id } = useParams();
  const product = allProducts[parseInt(id)];
  const [mainImage, setMainImage] = useState(product ? product.images[0] : '');
  const [activeTab, setActiveTab] = useState('description');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef(null);

  if (!product) {
    return <div className="pd-product-not-found">Product not found</div>;
  }

  // Enhanced similar products selection: prioritize same category, supplement with high-rated products if needed
  const relatedCategories = {
    'Gift Box': ['Keepsake', 'Home'],
    'Jewelry': ['Accessories'],
    'Plush': ['Home'],
    'Perfume': ['Personal Care'],
    'Food': ['Gift Box'],
    'Floral': ['Home'],
    'Home': ['Keepsake', 'Plush'],
    'Stationery': ['Keepsake'],
    'Keepsake': ['Home', 'Stationery'],
    'Personal Care': ['Perfume'],
    'Accessories': ['Jewelry']
  };

  const similarProducts = allProducts
    .filter((p, index) => p.category === product.category && index !== parseInt(id))
    .sort((a, b) => b.rating - a.rating) // Sort by rating
    .slice(0, 4);

  // If fewer than 4 products, supplement with related categories
  if (similarProducts.length < 4) {
    const additionalProducts = allProducts
      .filter(
        (p, index) =>
          index !== parseInt(id) &&
          relatedCategories[product.category]?.includes(p.category) &&
          !similarProducts.some((sp) => sp.name === p.name)
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4 - similarProducts.length);
    similarProducts.push(...additionalProducts);
  }

  const conversionRate = 300; // 1 USD = 300 LKR
  const priceInLKR = (product.price * conversionRate).toFixed(2);

  const handleNext = () => {
    if (carouselIndex < similarProducts.length - 1) {
      setCarouselIndex(carouselIndex + 1);
    } else {
      setCarouselIndex(0);
    }
  };

  const handlePrev = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    } else {
      setCarouselIndex(similarProducts.length - 1);
    }
  };

  const handleDotClick = (index) => {
    setCarouselIndex(index);
  };
>>>>>>> 262353982ba57221bfe0578b1e4b0a470efa4bae

  return (
    <section className="pd-product-page">
      <div className="pd-product-container">
        <div className="pd-product-image-section">
          <img
            src={mainImage}
            alt={product.name}
<<<<<<< HEAD
            onError={e => { e.target.src = '/images/placeholder.png'; }}
            className="pd-product-detail-image"
          />
          <div className="pd-thumbnail-container">
            {(product.images?.length > 0 ? product.images : [product.image]).map((img, index) => (
=======
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
            }}
            className="pd-product-detail-image"
          />
          <div className="pd-thumbnail-container">
            {product.images.map((img, index) => (
>>>>>>> 262353982ba57221bfe0578b1e4b0a470efa4bae
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
<<<<<<< HEAD
                onError={e => { e.target.src = '/images/placeholder.png'; }}
=======
                onError={(e) => {
                  e.target.src = '/images/placeholder.png';
                }}
>>>>>>> 262353982ba57221bfe0578b1e4b0a470efa4bae
                className={`pd-thumbnail ${mainImage === img ? 'pd-thumbnail-active' : ''}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="pd-product-details">
          <h2 className="pd-product-detail-name">{product.name}</h2>
<<<<<<< HEAD
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

=======
          <p className="pd-product-detail-price">LKR {priceInLKR}</p>
          <div className="pd-product-detail-stars">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < product.rating ? 'pd-star-filled' : 'pd-star-empty'} />
            ))}
          </div>
          <p className="pd-product-detail-category">Category: {product.category}</p>
          
>>>>>>> 262353982ba57221bfe0578b1e4b0a470efa4bae
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
<<<<<<< HEAD

=======
          
>>>>>>> 262353982ba57221bfe0578b1e4b0a470efa4bae
          <div className="pd-tab-content">
            {activeTab === 'description' ? (
              <p className="pd-product-detail-description">{product.description}</p>
            ) : (
              <div className="pd-review-section">
<<<<<<< HEAD
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
=======
                <div className="pd-review">
                  <div className="pd-review-header">
                    <span className="pd-review-author">John Doe</span>
                    <div className="pd-review-stars">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < 4 ? 'pd-star-filled' : 'pd-star-empty'} />
                      ))}
                    </div>
                  </div>
                  <p className="pd-review-text">
                    This product is amazing! The quality is top-notch, and it makes for a perfect gift. Highly recommend!
                  </p>
                  <p className="pd-review-date">Posted on July 1, 2025</p>
                </div>
              </div>
            )}
          </div>
          
          <button className="pd-product-add-to-cart-btn">Add to Cart</button>
          <Link to="/shop" className="pd-product-back-link">Back to Shop</Link>
        </div>
      </div>

>>>>>>> 262353982ba57221bfe0578b1e4b0a470efa4bae
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
<<<<<<< HEAD
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
=======
                  to={`/product/${allProducts.findIndex((p) => p.name === prod.name)}`}
                  key={i}
                  className="pd-product-card"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                    className="pd-product-image"
                  />
                  <h3 className="pd-product-name">{prod.name}</h3>
                  <p className="pd-product-price">LKR {(prod.price * conversionRate).toFixed(2)}</p>
                  <div className="pd-product-stars">
                    {[...Array(5)].map((_, j) => (
                      <FiStar key={j} className={j < prod.rating ? 'pd-star-filled' : 'pd-star-empty'} />
                    ))}
                  </div>
                  <button className="pd-add-to-cart-btn">Add to Cart</button>
>>>>>>> 262353982ba57221bfe0578b1e4b0a470efa4bae
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