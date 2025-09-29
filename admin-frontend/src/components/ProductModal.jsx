import React, { useState, useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ onClose, onSave, mode = 'add', product }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null // This will now store the Base64 string or a URL
  });

  useEffect(() => {
    if (mode === 'edit' && product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        image: product.image || null // Product.image will be the Base64 string or URL
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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the image as a Base64 string
        setForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm(prev => ({ ...prev, image: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form); // Pass the form data with the Base64 image string
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
              <option value="Gift Box / Personalized Gifts">Gift Box / Personalized Gifts</option>
              <option value="Jewelry / Watches">Jewelry / Watches</option>
              <option value="Beauty/Cosmetics & Skin Care">Beauty/Cosmetics & Skin Care</option>
              <option value="Chocolates">Chocolates</option>
              <option value="Flowers">Flowers</option>
              <option value="Soft Toys">Soft Toys</option>
              <option value="Greeting Cards / Handmade Greeting Cards">Greeting Cards / Handmade Greeting Cards</option>
              <option value="Bags/Fashion & Shoes">Bags/Fashion & Shoes</option>
              <option value="Perfumes & Fragrances">Perfumes & Fragrances</option>
              <option value="Home Decor / Homewares & Fancy">Home Decor / Homewares & Fancy</option>
              <option value="Gift Vouchers">Gift Vouchers</option>
              <option value="Resin Products">Resin Products</option>
            </select>
          </div>
          <div className="form-group">
            <label>Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={mode === 'add' && !form.image} // Require only if adding and no image is already selected
            />
            {form.image && (
              <div className="mt-2">
                <img src={form.image} alt="Product Preview" className="w-24 h-24 object-cover rounded-md" />
              </div>
            )}
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
