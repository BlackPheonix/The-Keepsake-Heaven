import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import './Navbar.css';
import defaultAvatar from '../assets/user.png';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/FirebaseConfig';
import { getUserDocument } from '../firebase/firebaseUtils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (getUserDocument) {
          const res = await getUserDocument(currentUser.uid);
          setAvatarUrl(res && res.success && res.data.avatar ? res.data.avatar : defaultAvatar);
        } else {
          setAvatarUrl(defaultAvatar);
        }
      } else {
        setAvatarUrl(defaultAvatar);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search)}`);
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/images/The Keepsake Heaven logo.png" alt="Keepsake Heaven" />
        </Link>
      </div>

      <div className="menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>

      <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li>
          <Link to="/contact">Contact Us</Link>
          {isHomePage && (
            <form className="navbar-searchbar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">
                <FiSearch size={15} />
              </button>
            </form>
          )}
        </li>
      </ul>

      <div className="navbar-actions">
        <Link to="/cart" className="navbar-cart" aria-label="Shopping Cart">
          <FiShoppingCart size={24} />
        </Link>
        {!user ? (
          <Link to="/signin" className="navbar-login">Login / Signup</Link>
        ) : (
          <img
            src={avatarUrl}
            alt="User"
            className="navbar-avatar"
            onClick={handleProfileClick}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              objectFit: 'cover',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
            title="Profile"
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;