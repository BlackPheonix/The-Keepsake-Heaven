import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import ProductModal from '../components/ProductModal';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Personalized Keychain', category: 'Personalized Gifts', price: 1200, stock: 3, image: 'keychain.jpg' },
    { id: 2, name: 'Wooden Photo Frame', category: 'Home Decor', price: 2500, stock: 5, image: 'frame.jpg' },
    { id: 3, name: 'Handmade Bracelet', category: 'Jewelry', price: 1800, stock: 12, image: 'bracelet.jpg' },
    { id: 4, name: 'Customized Mug', category: 'Home Decor', price: 1500, stock: 8, image: 'mug.jpg' },
    { id: 5, name: 'Teddy Bear', category: 'Toys', price: 3200, stock: 15, image: 'teddy.jpg' },
    { id: 6, name: 'Engraved Pen', category: 'Stationery', price: 800, stock: 20, image: 'pen.jpg' },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, ...product } : p));
      setEditingProduct(null);
    } else {
      setProducts([...products, { ...product, id: products.length + 1 }]);
    }
  };

  const categories = [...new Set(products.map(product => product.category))];

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Product Management</h1>
        <button className="add-product-btn" onClick={() => setShowModal(true)}>
          <FiPlus /> Add Product
        </button>
      </div>
      
      <div className="products-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={`/images/${product.image}`} alt={product.name} />
                {product.stock < 5 && (
                  <span className="low-stock-badge">Low Stock</span>
                )}
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">LKR {product.price.toLocaleString()}</p>
                <p className={`product-stock ${product.stock < 5 ? 'low' : ''}`}>
                  Stock: {product.stock}
                </p>
              </div>
              <div className="product-actions">
                <button className="edit-btn" onClick={() => handleEditProduct(product)}>
                  <FiEdit />
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {showModal && (
        <ProductModal 
          onClose={() => { setShowModal(false); setEditingProduct(null); }} 
          onSave={handleSaveProduct} 
          mode={editingProduct ? 'edit' : 'add'}
          product={editingProduct}
        />
      )}
    </div>
  );
};

export default Products;