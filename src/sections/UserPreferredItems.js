import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/FirebaseConfig';
import { getUserPreferences } from '../firebase/userPreferencesUtil';
import { getAllProducts, addToCart } from '../firebase/firebaseUtils';
import '../sections/UserPreferredItems.css';

const normalizeCategory = (category) => {
  return category
    .toLowerCase()
    .replace(/[/&-]/g, ' ')
    .split(' ')
    .filter(word => word);
};

const categoryMapping = {
  'Gift Box / Personalized Gifts': 'gift box',
  'Jewelry / Watches': 'jewelry',
  'Beauty/Cosmetics & Skin Care': 'beauty',
  'Chocolates': 'chocolates',
  'Flowers': 'flowers',
  'Soft Toys': 'soft toys',
  'Greeting Cards / Handmade Greeting Cards': 'greeting cards',
  'Bags/Fashion & Shoes': 'hand bags',
  'Perfumes & Fragrances': 'perfumes',
  'Home Decor / Homewares & Fancy': 'home decor',
  'Gift Vouchers': 'gift vouchers',
  'Resin Products': 'resin'
};

function UserPreferredItems() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreferredProducts = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/signin');
        return;
      }

      try {
        const prefResult = await getUserPreferences(user.uid);
        if (!prefResult.success || !prefResult.data?.preferences?.length) {
          setError('No preferences set. Please select your preferences.');
          setLoading(false);
          return;
        }

        const userPreferences = prefResult.data.preferences;
        const preferenceKeywords = userPreferences
          .map(pref => categoryMapping[pref])
          .filter(Boolean)
          .flatMap(normalizeCategory);

        if (preferenceKeywords.length === 0) {
          setError('No matching product categories found.');
          setLoading(false);
          return;
        }

        const productResult = await getAllProducts();
        if (!productResult.success) {
          setError('Failed to load products.');
          setLoading(false);
          return;
        }

        const filteredProducts = productResult.data
          .filter(product => {
            const productCategoryWords = normalizeCategory(product.category || '');
            return preferenceKeywords.some(keyword =>
              productCategoryWords.includes(keyword)
            );
          })
          .slice(0, 8);

        if (filteredProducts.length === 0) {
          setError('No products found matching your preferences.');
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching preferred products:', error);
        setError('Failed to load recommended products.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferredProducts();
  }, [navigate]);

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.png';
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    const user = auth.currentUser;
    if (!user) {
      navigate('/signin');
      return;
    }
    try {
      await addToCart(user.uid, product);
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart.');
    }
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);
    return isNaN(numericPrice) ? 'Price not available' : `LKR ${numericPrice.toFixed(2)}`;
  };

  if (loading) {
    return <div className="loading">Loading recommendations...</div>;
  }

  return (
    <section className="preferred-items">
      <h2 className="section-title">Recommended For You</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <p className="section-subtitle">Explore products based on your favorite categories</p>
          <div className="products-grid">
            {products.map((product) => (
              <div
                className="product-card"
                key={product.id}
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={product.image || '/images/placeholder.png'}
                  alt={product.name}
                  onError={handleImageError}
                />
                <h3>{product.name}</h3>
                <p>{formatPrice(product.price)}</p>
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default UserPreferredItems;
