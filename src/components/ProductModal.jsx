import React, { useState, useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ onClose, onSave, mode = 'add', product }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null
  });

  useEffect(() => {
    if (mode === 'edit' && product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        image: product.image || null
      });
    } else {
      setForm({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: null
      });
    }
  }, [mode, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm(prev => ({ ...prev, image: e.target.files[0] }));
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
          <h2>{mode === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input 
              type="text" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price (LKR)</label>
              <input 
                type="number" 
                name="price" 
                value={form.price} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input 
                type="number" 
                name="stock" 
                value={form.stock} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Category</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Personalized Gifts">Personalized Gifts</option>
              <option value="Toys">Toys</option>
              <option value="Stationery">Stationery</option>
            </select>
          </div>
          <div className="form-group">
            <label>Product Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              required={mode === 'add'}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {mode === 'edit' ? 'Save Changes' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;