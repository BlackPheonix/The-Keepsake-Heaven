import React, { useState } from 'react';
import { FaLock, FaSignOutAlt, FaUserCog, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Profile.css';
import userImg from '../assets/user.png';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    email: 'admin@keepsakeheaven.lk',
    phone: '0777123456',
    role: 'Super Admin',
    lastLogin: '2023-06-15 14:30'
  });
  
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin',
    password: '',
    confirmPassword: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
    admin: false,
    adminConfirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewAdminChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    // Add admin logic here
    alert('New admin added successfully!');
    setNewAdmin({
      name: '',
      email: '',
      phone: '',
      role: 'Admin',
      password: '',
      confirmPassword: ''
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Change password logic here
    alert('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Admin Profile</h1>
        <button className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUserCog /> My Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'add-admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-admin')}
        >
          <FaUserPlus /> Add Admin
        </button>
        <button 
          className={`tab-btn ${activeTab === 'change-password' ? 'active' : ''}`}
          onClick={() => setActiveTab('change-password')}
        >
          <FaLock /> Change Password
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-info">
            <div className="profile-card">
              <div className="avatar-container">
                <img src={userImg} alt="Profile" className="profile-avatar" />
                <div className="avatar-badge">{adminData.role}</div>
              </div>
              
              <div className="profile-details">
                <div className="detail-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={adminData.name} 
                    onChange={handleAdminChange} 
                    className="modern-input"
                  />
                </div>
                
                <div className="detail-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={adminData.email} 
                    onChange={handleAdminChange} 
                    className="modern-input"
                  />
                </div>
                
                <div className="detail-group">
                  <label>Phone</label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={adminData.phone} 
                    onChange={handleAdminChange} 
                    className="modern-input"
                  />
                </div>
                
                <div className="detail-group">
                  <label>Last Login</label>
                  <div className="login-info">
                    {adminData.lastLogin}
                  </div>
                </div>
                
                <button className="save-btn">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'add-admin' && (
          <form className="admin-form" onSubmit={handleAddAdmin}>
            <h2 className="form-title">Add New Admin</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={newAdmin.name} 
                  onChange={handleNewAdminChange} 
                  required 
                  className="modern-input"
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={newAdmin.email} 
                  onChange={handleNewAdminChange} 
                  required 
                  className="modern-input"
                />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={newAdmin.phone} 
                  onChange={handleNewAdminChange} 
                  required 
                  className="modern-input"
                />
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <select 
                  name="role" 
                  value={newAdmin.role} 
                  onChange={handleNewAdminChange} 
                  required
                  className="modern-select"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <div className="password-input">
                  <input 
                    type={showPassword.admin ? "text" : "password"} 
                    name="password" 
                    value={newAdmin.password} 
                    onChange={handleNewAdminChange} 
                    required 
                    className="modern-input"
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('admin')}
                  >
                    {showPassword.admin ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="password-input">
                  <input 
                    type={showPassword.adminConfirm ? "text" : "password"} 
                    name="confirmPassword" 
                    value={newAdmin.confirmPassword} 
                    onChange={handleNewAdminChange} 
                    required 
                    className="modern-input"
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('adminConfirm')}
                  >
                    {showPassword.adminConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            
            <button type="submit" className="submit-btn">
              Create Admin Account
            </button>
          </form>
        )}
        
        {activeTab === 'change-password' && (
          <form className="password-form" onSubmit={handleChangePassword}>
            <h2 className="form-title">Change Password</h2>
            
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input">
                <input 
                  type={showPassword.current ? "text" : "password"} 
                  name="currentPassword" 
                  value={passwordData.currentPassword} 
                  onChange={handlePasswordChange} 
                  required 
                  className="modern-input"
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <div className="password-input">
                <input 
                  type={showPassword.new ? "text" : "password"} 
                  name="newPassword" 
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChange} 
                  required 
                  className="modern-input"
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input">
                <input 
                  type={showPassword.confirm ? "text" : "password"} 
                  name="confirmNewPassword" 
                  value={passwordData.confirmNewPassword} 
                  onChange={handlePasswordChange} 
                  required 
                  className="modern-input"
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <div className="password-strength">
              <div className={`strength-bar ${passwordData.newPassword.length > 0 ? 'active' : ''}`}></div>
              <div className={`strength-bar ${passwordData.newPassword.length > 5 ? 'active' : ''}`}></div>
              <div className={`strength-bar ${passwordData.newPassword.length > 8 ? 'active' : ''}`}></div>
              <span className="strength-text">
                {passwordData.newPassword.length === 0 ? 'No password' : 
                 passwordData.newPassword.length < 6 ? 'Weak' : 
                 passwordData.newPassword.length < 9 ? 'Moderate' : 'Strong'}
              </span>
            </div>
            
            <button type="submit" className="submit-btn">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;