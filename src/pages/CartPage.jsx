import React from 'react';
import '../styles/Cart.css';

// SVG Icons for use in the component
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a7b98f' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);


const CartPage = () => {
  // Sample data to populate the cart
  const cartItems = [
    {
      id: 1,
      name: 'Random Item 1',
      category: 'Category Name',
      price: 3000,
    },
    {
      id: 2,
      name: 'Random Item 2',
      category: 'Category Name',
      price: 4000,
    },
  ];

  const subTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const flatDiscount = 0;
  const total = subTotal - flatDiscount;

  return (
    <div className="cart-page-wrapper">
      <div className="search-bar-container">
        <input type="text" placeholder="Find Your Products" className="search-input" />
        <button className="search-button">
          <SearchIcon />
        </button>
        <div className="cart-icon-wrapper">
          <CartIcon />
        </div>
      </div>

      <main className="cart-main-content">
        <div className="cart-items-section">
          <div className="cart-header">
            <span className="header-product">Product Details</span>
            <span className="header-quantity">Quantity</span>
            <span className="header-subtotal">Sub Total</span>
          </div>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="product-details">
                <div className="product-image-placeholder"><ImageIcon /></div>
                <div className="product-info">
                  <span className="product-name">{item.name}</span>
                  <span className="product-category">{item.category}</span>
                  <span className="product-price">Rs. {item.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="product-quantity">
                <button className="quantity-btn">-</button>
                <input type="text" value="1" readOnly className="quantity-input" />
                <button className="quantity-btn">+</button>
              </div>
              <div className="product-subtotal">
                <span>Rs. {item.price.toFixed(2)}</span>
              </div>
              <div className="product-remove">
                <button className="remove-btn"><TrashIcon /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary-section">
          <div className="summary-card">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <span>{cartItems.length} item(s)</span>
            </div>
            <div className="summary-item">
              <span>Sub Total:</span>
              <span>Rs. {subTotal.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Flat Discount:</span>
              <span>Rs. {flatDiscount.toFixed(2)}</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-total">
              <span>Total:</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn">CHECKOUT</button>
            <button className="continue-shopping-btn">CONTINUE SHOPPING</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;