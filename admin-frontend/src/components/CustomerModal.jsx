import React, { useState, useEffect } from 'react';
import { updateUserData } from '../firebase/firebaseUtils';
import { auth } from '../firebase/FirebaseConfig';
import './CustomerModal.css';

const CustomerModal = ({ onClose, onSave, mode = 'edit', customer }) => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    tier: 'Regular',
    address: '',
    lastActive: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    console.log("🔄 CustomerModal initialized:", { mode, customer });
    
    if (mode === 'edit' && customer) {
      setForm({
        id: customer.id || '',
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        tier: customer.tier || 'Regular',
        address: customer.address || '',
        lastActive: customer.lastActive || ''
      });
    }
  }, [mode, customer]);

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    if (!form.name.trim()) {
      errors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(form.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    const validTiers = ['Regular', 'Silver', 'Gold', 'Platinum'];
    if (!validTiers.includes(form.tier)) {
      errors.tier = 'Please select a valid tier';
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});
    
    console.log("💾 Attempting to save customer:", form);
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }
    
    try {
      console.log("🔐 Current admin user:", auth.currentUser?.email);
      
      const nameParts = form.name.trim().split(' ');
      const updateData = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: form.email.trim(),
        phone: form.phone.trim(),
        tier: form.tier,
        address: form.address.trim()
      };
      
      console.log("📤 Sending update data:", updateData);
      
      const result = await updateUserData(customer.id, updateData);
      
      console.log("📦 Update result:", result);
      
      if (result.success) {
        console.log("✅ Customer updated successfully");
        
        onSave({
          ...form,
          ...updateData,
          name: form.name
        });
        
        onClose();
      } else {
        console.error("❌ Update failed:", result.error);
        setError(result.error || 'Failed to update customer');
      }
    } catch (err) {
      console.error("💥 Exception occurred:", err);
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("❌ Customer edit cancelled");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
      <div className="modal-container">
        <button onClick={handleCancel} className="close-btn" aria-label="Close modal">
          &times;
        </button>

        <div className="modal-header">
          <h2>
            {mode === 'edit' ? 'Edit Customer' : 'Add Customer'}
          </h2>
        </div>
        
        {/* Debug Info */}
        <div style={{
          background: '#FDFAF6',
          padding: '12px',
          fontSize: '12px',
          fontFamily: 'monospace',
          borderRadius: '6px',
          marginBottom: '18px',
          border: '1px solid #E4EFE7',
          color: '#99BC85',
          width: '100%'
        }}>
          <strong>Debug:</strong> Editing {customer?.name} ({customer?.id}) | Admin: {auth.currentUser?.email}
        </div>
        
        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '18px',
            border: '1px solid #fcc',
            width: '100%',
            fontSize: '14px'
          }}>
            <strong>❌ Error:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input 
              id="name"
              type="text" 
              name="name" 
              value={form.name} 
              onChange={handleChange}
              style={{ 
                borderColor: validationErrors.name ? '#c33' : '#E4EFE7',
                boxShadow: validationErrors.name ? '0 0 0 2px rgba(204, 51, 51, 0.1)' : 'none'
              }}
              placeholder="Enter full name"
              disabled={loading}
              required 
            />
            {validationErrors.name && (
              <div style={{ 
                color: '#c33', 
                fontSize: '12px', 
                marginTop: '4px',
                fontWeight: '500' 
              }}>
                {validationErrors.name}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input 
              id="email"
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange}
              style={{ 
                borderColor: validationErrors.email ? '#c33' : '#E4EFE7',
                boxShadow: validationErrors.email ? '0 0 0 2px rgba(204, 51, 51, 0.1)' : 'none'
              }}
              placeholder="Enter email address"
              disabled={loading}
              required 
            />
            {validationErrors.email && (
              <div style={{ 
                color: '#c33', 
                fontSize: '12px', 
                marginTop: '4px',
                fontWeight: '500' 
              }}>
                {validationErrors.email}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input 
              id="phone"
              type="text" 
              name="phone" 
              value={form.phone} 
              onChange={handleChange}
              style={{ 
                borderColor: validationErrors.phone ? '#c33' : '#E4EFE7',
                boxShadow: validationErrors.phone ? '0 0 0 2px rgba(204, 51, 51, 0.1)' : 'none'
              }}
              placeholder="Enter phone number"
              disabled={loading}
              required 
            />
            {validationErrors.phone && (
              <div style={{ 
                color: '#c33', 
                fontSize: '12px', 
                marginTop: '4px',
                fontWeight: '500' 
              }}>
                {validationErrors.phone}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input 
              id="address"
              type="text" 
              name="address" 
              value={form.address} 
              onChange={handleChange}
              placeholder="Enter address (optional)"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tier">Customer Tier *</label>
            <select 
              id="tier"
              name="tier" 
              value={form.tier} 
              onChange={handleChange}
              style={{ 
                borderColor: validationErrors.tier ? '#c33' : '#E4EFE7',
                boxShadow: validationErrors.tier ? '0 0 0 2px rgba(204, 51, 51, 0.1)' : 'none'
              }}
              disabled={loading}
              required
            >
              <option value="Regular">Regular</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
            {validationErrors.tier && (
              <div style={{ 
                color: '#c33', 
                fontSize: '12px', 
                marginTop: '4px',
                fontWeight: '500' 
              }}>
                {validationErrors.tier}
              </div>
            )}
          </div>
          
          {form.lastActive && (
            <div className="form-group">
              <label>Last Active</label>
              <input 
                type="text" 
                value={form.lastActive} 
                disabled 
                style={{ 
                  background: '#f8f8f8', 
                  color: '#666',
                  cursor: 'not-allowed'
                }}
              />
            </div>
          )}
          
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;