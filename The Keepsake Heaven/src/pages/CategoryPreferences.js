import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/FirebaseConfig';
import { getUserPreferences, setUserPreferences } from '../firebase/userPreferencesUtil';
import './CategoryPreferences.css';

const categories = [
  { name: 'Gift Box / Personalized Gifts', img: '/images/Box.jpg' },
  { name: 'Jewelry / Watches', img: '/images/jewelry.jpg' },
  { name: 'Beauty/Cosmetics & Skin Care', img: '/images/beauty.jpg' },
  { name: 'Chocolates', img: '/images/Food.jpg' },
  { name: 'Flowers', img: '/images/Floral.jpg' },
  { name: 'Soft Toys', img: '/images/Toy.jpg' },
  { name: 'Greeting Cards / Handmade Greeting Cards', img: '/images/cards.jpg' },
  { name: 'Bags/Fashion & Shoes', img: '/images/bags.jpg' },
  { name: 'Perfumes & Fragrances', img: '/images/Perfumes.jpg' },
  { name: 'Home Decor & Homewares & Fancy', img: '/images/Decor.jpg' },
  { name: 'Gift Vouchers', img: '/images/voucher.jpg' },
  { name: 'Resin Products', img: '/images/resin.jpg' }
];

const CategoryPreferences = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const maxCategories = 5;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/signin');
        setLoading(false);
        return;
      }

      try {
        const result = await getUserPreferences(user.uid);
        if (result.success && result.data?.preferences) {
          setSelectedCategories(result.data.preferences.slice(0, maxCategories));
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else if (prev.length < maxCategories) {
        return [...prev, category];
      } else {
        alert(`You can only select up to ${maxCategories} categories.`);
        return prev;
      }
    });
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await setUserPreferences(user.uid, selectedCategories);
        navigate('/profile');
      } catch (error) {
        console.error("Error saving preferences:", error);
        alert("Failed to save preferences. Please try again.");
      }
    } else {
      navigate('/signin');
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.png';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="category-preferences">
      <h2 className="section-title">Select Your Preferred Categories</h2>
      <p className="section-subtitle">
        Choose up to {maxCategories} gift categories to personalize your shopping experience
      </p>
      <div className="categories-grid">
        {categories.map((cat, i) => (
          <div
            className={`category-card ${
              selectedCategories.includes(cat.name) ? 'selected' : ''
            } ${selectedCategories.length >= maxCategories && !selectedCategories.includes(cat.name) ? 'disabled' : ''}`}
            key={i}
            onClick={() => handleCategoryToggle(cat.name)}
          >
            <img
              src={cat.img || '/images/placeholder.png'}
              alt={cat.name}
              onError={handleImageError}
            />
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
      <div className="submit-container">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={selectedCategories.length === 0}
        >
          Save Preferences
        </button>
      </div>
    </section>
  );
};

export default CategoryPreferences;