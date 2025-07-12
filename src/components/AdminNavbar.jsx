import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';
import { FaBell, FaSearch, FaCog, FaSignOutAlt } from 'react-icons/fa';
import userImg from '../assets/user.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [notifications] = useState([
    { id: 1, message: 'New order received', time: '2 mins ago', read: false },
    { id: 2, message: 'Low stock alert for Teddy Bear', time: '1 hour ago', read: true },
  ]);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Add search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="admin-navbar">
      <form className="search-bar" onSubmit={handleSearch}>
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search products, orders..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="nav-right">
        <div className="notification-wrapper">
          <button 
            className="notification-icon" 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <button 
                  className="mark-all-read"
                  onClick={() => console.log('Mark all as read')}
                >
                  Mark all as read
                </button>
              </div>
              <div className="notification-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => navigate('/orders')}
                  >
                    <p>{notification.message}</p>
                    <small>{notification.time}</small>
                  </div>
                ))}
              </div>
              <Link to="/notifications" className="view-all">View All Notifications</Link>
            </div>
          )}
        </div>

        <div className="profile-wrapper">
          <button 
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="Profile menu"
          >
            <img src={userImg} alt="Profile" className="profile-avatar" />
            <span>Administrator</span>
          </button>
          
          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <img src={userImg} alt="Profile" className="profile-avatar profile-avatar-lg" />
                <div>
                  <h5>Admin User</h5>
                  <small>admin@keepsakeheaven.com</small>
                </div>
              </div>
              <hr />
              <Link to="/profile">
                <img src={userImg} alt="Profile" className="profile-avatar profile-avatar-sm" /> My Profile
              </Link>
              <Link to="/settings">
                <FaCog /> Settings
              </Link>
              <button onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;