// Shop.jsx
import React, { useState, useEffect } from 'react';
import { FiStar, FiSearch, FiFilter } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/FirebaseConfig';
import './Shop.css';
import { getAllProducts, addToCart } from '../firebase/firebaseUtils';
import Popup from '../pages/Popup'; 


const categories = [
  'All',
  'Gift Box / Personalized Gifts',
  'Jewelry / Watches',
  'Beauty/Cosmetics & Skin Care',
  'Chocolates',
  'Flowers',
  'Soft Toys',
  'Greeting Cards / Handmade Greeting Cards',
  'Bags/Fashion & Shoes',
  'Perfumes & Fragrances',
  'Home Decor / Homewares & Fancy',
  'Gift Vouchers',
  'Resin Products',
];

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get category and search from URL if present
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category');
  const initialSearch = queryParams.get('search') || '';

  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : ['All']
  );
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

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
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Sync category and search term from URL
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
    if (initialSearch) {
      setSearchTerm(initialSearch.toLowerCase());
    }
  }, [initialCategory, initialSearch]);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const result = await getAllProducts();
      if (result.success) {
        setAllProducts(result.data);
      } else {
        setAllProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
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

  const handleSearch = (e) => {
    e.preventDefault();
    const newSearch = e.target.elements.search.value.toLowerCase();
    setSearchTerm(newSearch);
    navigate(`/shop?search=${encodeURIComponent(newSearch)}`);
  };

  const handleCategoryChange = (category) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
      if (queryParams.get('category')) {
        navigate('/shop');
      }
    } else {
      let updatedCategories = selectedCategories.includes('All')
        ? [category]
        : selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];
      if (updatedCategories.length === 0) updatedCategories = ['All'];
      setSelectedCategories(updatedCategories);

      if (updatedCategories.length === 1 && updatedCategories[0] !== 'All') {
        navigate(`/shop?category=${encodeURIComponent(updatedCategories[0])}`);
      } else {
        navigate('/shop');
      }
    }
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings(
      selectedRatings.includes(rating)
        ? selectedRatings.filter((r) => r !== rating)
        : [...selectedRatings, rating]
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleAddToCart = async (product) => {
    //check if user is authenticated
    if (!user) {
      showPopup('Sign In Required', 'Please sign in to add items to cart', 'warning');
      setTimeout(() => {
        closePopup();
        navigate('/signin');
      }, 2000);
      return;
    }

     // Additional check for user authentication
        if (!auth.currentUser) {
          showPopup('Authentication Required', 'Please sign in again.', 'warning');
          setTimeout(() => {
            closePopup();
            navigate('/signin');
          }, 2000);
          return;
        }
    
        console.log('Current user:', user); // Debug log
        console.log('Auth current user:', auth.currentUser); // Debug log

    setAddingToCart((prev) => ({ ...prev, [product.id]: true }));

    try {
      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image || (product.images && product.images[0]) || '/images/placeholder.png',
        category: product.category,
        quantity: 1,
      };

      const response = await addToCart(user.uid, cartItem);
      if (response.success) {
        showPopup('Success!','Item added to cart successfully!','success');
      } else {
        console.error('Add to cart failed:', response);
        showPopup('Error','Failed to add item to cart: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding to cart:' + error);
      showPopup('Error', `An error occurred while adding to cart: ${error.message}`, 'error');
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      !searchTerm ||
      product.name?.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategories.includes('All') ||
      selectedCategories.includes(product.category);

    const matchesPrice =
      typeof product.price === 'number' &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1];

    const matchesRating =
      selectedRatings.length === 0 ||
      selectedRatings.includes(product.rating);

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const sectionTitle =
    selectedCategories.includes('All') || selectedCategories.length === 0
      ? 'All Products'
      : selectedCategories.join(', ');

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <section className="shop-page">
      <div
        className={`sidebar-shop-overlay ${
          isSidebarOpen ? 'sidebar-shop-overlay--visible' : ''
        }`}
        onClick={closeSidebar}
      ></div>
      <aside className={`sidebar-shop ${isSidebarOpen ? 'sidebar-shop--open' : ''}`}>
        <div className="sidebar-shop-header">
          <h3 className="filter-title">Filters</h3>
          <button className="sidebar-shop-close-btn" onClick={closeSidebar}>
            Close
          </button>
        </div>

        {/* Filters */}
        <div className="filter-section">
          <h4 className="filter-subtitle">Category</h4>
          <div className="checkbox-group">
            {categories.map((category) => (
              <label key={category} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h4 className="filter-subtitle">Price Range</h4>
          <input
            type="range"
            min="0"
            max="100000"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            className="price-range"
          />
          <input
            type="range"
            min="0"
            max="100000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="price-range"
          />
          <div className="price-range-labels">
            <span>LKR {priceRange[0]}</span>
            <span>LKR {priceRange[1]}</span>
          </div>
        </div>

        <div className="filter-section">
          <h4 className="filter-subtitle">Rating</h4>
          <div className="checkbox-group">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                />
                {rating} {rating === 1 ? 'Star' : 'Stars'}
              </label>
            ))}
          </div>
        </div>
      </aside>

      <div className="main-content">
        <button className="filter-toggle-btn" onClick={toggleSidebar}>
          <FiFilter className="filter-icon" /> Show Filters
        </button>

        {/* Shop search bar */}
        <div className="search-bar-shop">
          <form onSubmit={handleSearch} className="search-form-shop">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              className="search-input-shop"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
            <button type="submit" className="search-button-shop">
              <FiSearch />
            </button>
          </form>
        </div>

        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-subtitle">
          Browse our full selection of heartwarming gifts
        </p>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div style={{ width: '100%', textAlign: 'center', padding: '2rem', color: '#888' }}>
              No products found.
            </div>
          ) : (
            filteredProducts.map((prod, i) => (
              <div key={prod.id || i} className="product-card">
                <Link to={`/product/${prod.id}`}>
                  <img
                    src={prod.image || (prod.images && prod.images[0]) || '/images/placeholder.png'}
                    alt={prod.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                    className="product-image"
                  />
                </Link>
                <h3 className="product-name">{prod.name}</h3>
                <p className="product-price">
                  LKR {typeof prod.price === "number"
                    ? prod.price.toLocaleString(undefined, { minimumFractionDigits: 2 })
                    : "0.00"}
                </p>
                <div className="product-stars">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} className={j < Math.round(prod.avgRating || 0) ? 'star-filled' : 'star-empty'} />
                  ))}
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(prod)}
                  disabled={addingToCart[prod.id]}
                >
                  {addingToCart[prod.id] ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
      />

    </section>
  );
};

export default Shop;
