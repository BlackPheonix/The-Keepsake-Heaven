import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import ProductModal from '../components/ProductModal';
import './Products.css';
import { getAllProducts, deleteProduct, addProduct, updateProduct } from '../firebase/firebaseUtils';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await getAllProducts();

      if (result.success) {
        setProducts(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
  const matchesSearch = (product.name || "").toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory ? (product.category || "") === selectedCategory : true;
  return matchesSearch && matchesCategory;
});

  const handleDeleteProduct = async (id) => {
    try {
      setLoading(true);
      const result = await deleteProduct(id);

      if (result.success) {
        setProducts(products.filter(product => product.id !== id));
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to delete product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = async (product) => {
    try {
      setLoading(true);

      if (editingProduct) {
        // Pass the product object directly, which now contains the Base64 image string
        const result = await updateProduct(editingProduct.id, product);

        if (result.success) {
          setProducts(products.map(p => p.id === editingProduct.id ? result.data : p));
          setEditingProduct(null);
          setError(null);
        } else {
          setError(result.error);
        }
      } else {
        // Pass the product object directly, which now contains the Base64 image string
        const result = await addProduct(product);

        if (result.success) {
          setProducts([...products, result.data]);
          setError(null);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(editingProduct ? "Failed to update product" : "Failed to add product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(products.map(product => product.category))];

  if (loading && products.length === 0) return <div className="loading">Loading products...</div>;

  return (
    <div className="products-page">
      {error && <div className="error-message">{error}</div>}

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
                {/* Use the product.image directly as the src, which will be the Base64 string */}
                <img
                  src={product.image || 'https://placehold.co/180x180/E0E0E0/333333?text=No+Image'}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/180x180/E0E0E0/333333?text=No+Image';
                  }}
                />
                {product.stock < 5 && (
                  <span className="low-stock-badge">Low Stock</span>
                )}
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">
  LKR {typeof product.price === "number" ? product.price.toLocaleString() : "0"}</p>
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
