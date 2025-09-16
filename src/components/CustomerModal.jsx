import React, { useState, useEffect } from 'react';
import './CustomerModal.css';

const CustomerModal = ({ onClose, onSave, mode = 'edit', customer }) => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    orders: '',
    totalSpent: '',
    tier: '',
    lastActive: ''
  });

  useEffect(() => {
    if (mode === 'edit' && customer) {
      setForm({ ...customer });
    }
  }, [mode, customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Customer</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input 
              type="text" 
              name="phone" 
              value={form.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Tier</label>
            <select 
              name="tier" 
              value={form.tier} 
              onChange={handleChange} 
              required
            >
              <option value="Regular">Regular</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
          <div className="form-group">
            <label>Last Active</label>
            <input 
              type="date" 
              name="lastActive" 
              value={form.lastActive} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal; 