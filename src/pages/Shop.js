import React, { useState } from 'react';
import { FiStar, FiSearch, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Shop.css';

const allProducts = [
  { name: 'Luxury Gift Box', price: 29.99, img: '/images/Box.jpg', rating: 5, category: 'Gift Box' },
  { name: 'Handmade Jewelry', price: 49.99, img: '/images/Ornaments.jpg', rating: 4, category: 'Jewelry' },
  { name: 'Soft Teddy Bear', price: 19.99, img: '/images/Toy.jpg', rating: 5, category: 'Plush' },
  { name: 'Branded Perfume', price: 15.99, img: '/images/Perfumes.jpg', rating: 3, category: 'Perfume' },
  { name: 'Choco', price: 24.99, img: '/images/Food.jpg', rating: 4, category: 'Food' },
  { name: 'Flower Bouquet', price: 34.99, img: '/images/Floral.jpg', rating: 5, category: 'Floral' },
  { name: 'Gift Mug', price: 12.99, img: '/images/mug.jpg', rating: 4, category: 'Home' },
  { name: 'Personalized Cushion', price: 25.49, img: '/images/cushion.jpg', rating: 5, category: 'Home' },
  { name: 'Greeting Card Set', price: 7.99, img: '/images/cards.jpg', rating: 4, category: 'Stationery' },
  { name: 'Wooden Keepsake', price: 39.99, img: '/images/wood.jpg', rating: 5, category: 'Keepsake' },
  { name: 'Love Jar Notes', price: 9.99, img: '/images/jar.jpg', rating: 3, category: 'Keepsake' },
  { name: 'Miniature Couple Frame', price: 22.99, img: '/images/frame.jpg', rating: 4, category: 'Home' },
  { name: 'Bath Set', price: 27.49, img: '/images/bath.jpg', rating: 4, category: 'Personal Care' },
  { name: 'Rose Teddy', price: 44.99, img: '/images/roseteddy.jpg', rating: 5, category: 'Plush' },
  { name: 'LED Night Light', price: 19.49, img: '/images/nightlight.jpg', rating: 4, category: 'Home' },
  { name: 'Customized Keychain', price: 8.99, img: '/images/keychain.jpg', rating: 3, category: 'Accessories' },
  { name: 'Leather Wallet', price: 31.99, img: '/images/wallet.jpg', rating: 5, category: 'Accessories' },
  { name: 'Art Candle Set', price: 14.49, img: '/images/candles.jpg', rating: 4, category: 'Home' },
  { name: 'Decorative Photo Album', price: 26.79, img: '/images/album.jpg', rating: 5, category: 'Keepsake' },
  { name: 'Mini Plant Gift', price: 13.59, img: '/images/plant.jpg', rating: 4, category: 'Floral' }
];

const categories = ['All', 'Gift Box / Personalized Gifts', 'Jewelry / Watches', 'Beauty/Cosmetics & Skin Care', 'Chocolates', 'Flowers', 'soft Toys/Kids & Baby', 'Handmade Greeting Cards', 'Hand Bags/Fashion & Shoes', 'Perfumes&Fragrances', 'Home Decor & Homewares', 'Gift Vouchers','Resin Products'];

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.elements.search.value.toLowerCase());
  };

  const handleCategoryChange = (category) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      let updatedCategories = selectedCategories.includes('All')
        ? [category]
        : selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];
      if (updatedCategories.length === 0) updatedCategories = ['All'];
      setSelectedCategories(updatedCategories);
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

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategories.includes('All') || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(product.rating);
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const sectionTitle = selectedCategories.includes('All') || selectedCategories.length === 0
    ? 'All Products'
    : selectedCategories.join(', ');

  return (
    <section className="shop-page">
      <div className={`sidebar-shop-overlay ${isSidebarOpen ? 'sidebar-shop-overlay--visible' : ''}`} onClick={closeSidebar}></div>
      <aside className={`sidebar-shop ${isSidebarOpen ? 'sidebar-shop--open' : ''}`}>
        <div className="sidebar-shop-header">
          <h3 className="filter-title">Filters</h3>
          <button className="sidebar-shop-close-btn" onClick={closeSidebar}>Close</button>
        </div>

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
            max="50"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            className="price-range"
          />
          <input
            type="range"
            min="0"
            max="50"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="price-range"
          />
          <div className="price-range-labels">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
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
        <div className="search-bar-shop">
          <form onSubmit={handleSearch} className="search-form-shop">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              className="search-input-shop"
            />
            <button type="submit" className="search-button-shop">
              <FiSearch />
            </button>
          </form>
        </div>

        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-subtitle">Browse our full selection of heartwarming gifts</p>

        <div className="products-grid">
          {filteredProducts.map((prod, i) => (
            <div key={i} className="product-card">
              <Link to={`/product/${i}`}>
                <img
                  src={prod.img}
                  alt={prod.name}
                  onError={(e) => {
                    e.target.src = 'images/placeholder.png';
                  }}
                  className="product-image"
                />
              </Link>
              <h3 className="product-name">{prod.name}</h3>
              <p className="product-price">${prod.price.toFixed(2)}</p>
              <div className="product-stars">
                {[...Array(5)].map((_, j) => (
                  <FiStar key={j} className={j < prod.rating ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shop;