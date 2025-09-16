import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import logo from '../assets/logo.png';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Keepsake Heaven Logo" className="logo" />
      </div>

      <nav className="nav-menu">
        <NavLink to="/" className="nav-item" activeclassname="active">
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/products" className="nav-item" activeclassname="active">
          <i className="fas fa-gift"></i>
          <span>Products</span>
        </NavLink>
        <NavLink to="/orders" className="nav-item" activeclassname="active">
          <i className="fas fa-shopping-cart"></i>
          <span>Orders</span>
        </NavLink>
        <NavLink to="/customers" className="nav-item" activeclassname="active">
          <i className="fas fa-users"></i>
          <span>Customers</span>
        </NavLink>
        <NavLink to="/profile" className="nav-item" activeclassname="active">
          <i className="fas fa-user-cog"></i>
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
