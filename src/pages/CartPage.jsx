//Cart page
import React,{ useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/FirebaseConfig';
import { getUserCart, updateCartItemQuantity, removeFromCart } from '../firebase/firebaseUtils';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/Cart.css';

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchCart(user.uid);
      } else {
        setLoading(false);
        setError("Please sign in to view your cart");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCart = async (uid) => {
    try {
      setLoading(true);
      const response = await getUserCart(uid);
      if (response.success) {
        const data = response.data;
        if (data && Array.isArray(data.items)) {
          setCart({ items: data.items });
        } else {
          setCart({ items: [] });
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  const clearCart = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      const { updateDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../firebase/FirebaseConfig');
      
      const cartRef = doc(db, 'users', userId, 'cart', 'main');
      await updateDoc(cartRef, {
        items: [],
        updatedAt: new Date()
      });
      
      
      setCart({ items: [] });
      
      return { success: true };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };


  const handleQuantityChange = async (productId, newQuantity) => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await updateCartItemQuantity(userId, productId, newQuantity);
      if (response.success) {
        await fetchCart(userId);
      } else {
        setError("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await removeFromCart(userId, productId);
      if (response.success) {
        await fetchCart(userId);
      } else {
        setError("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  console.log("CART DATA:", cart);

  const handleCheckout = async () => {
    if (!selectedPayment) {
      setError("Please select a payment method before checking out");
      return;
    }

    if (cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text("Order Receipt", 14, 20);
      
      // Prepare table data
      const tableColumn = ["Product", "Price", "Qty", "Total"];
      const tableRows = cart.items.map(item => [
        item.name || 'Unknown Product',
        `Rs. ${(item.price || 0).toFixed(2)}`,
        (item.quantity || 0).toString(),
        `Rs. ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}`
      ]);

      // Use autoTable as a function, not a method
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      // Add total and payment details
      const finalY = doc.lastAutoTable?.finalY || 40;
      doc.setFontSize(12);
      doc.text(`Subtotal: Rs. ${subTotal.toFixed(2)}`, 14, finalY + 15);
      doc.text(`Discount: Rs. ${flatDiscount.toFixed(2)}`, 14, finalY + 25);
      doc.setFont(undefined, 'bold');
      doc.text(`Grand Total: Rs. ${total.toFixed(2)}`, 14, finalY + 35);
      
      // Add payment method
      doc.setFont(undefined, 'normal');
      doc.setFontSize(11);
      doc.text(`Payment Method: ${selectedPayment}`, 14, finalY + 50);
      
      // Add date and order ID
      doc.setFontSize(10);
      const orderID = `ORD${Date.now()}`;
      doc.text(`Order ID: ${orderID}`, 14, finalY + 60);
      doc.text(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, finalY + 70);
      
      // Save the PDF
      doc.save(`receipt-${orderID}.pdf`);
      
      const clearResult = await clearCart();
      
      if (clearResult.success) {
        
        setError("");
        alert(`Order confirmed! Payment method: ${selectedPayment}. Your cart has been cleared.`);
        
        setSelectedPayment("");
      } else {
        setError("Order confirmed, but failed to clear cart. Please refresh the page.");
      }
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate receipt. Please try again.");
    }
  };

  const subTotal = cart.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  const flatDiscount = 0;
  const total = subTotal - flatDiscount;

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error && !userId) {
    return (
      <div className="cart-error">
        <p>{error}</p>
        <Link to="/signin" className="sign-in-link">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      {/*-<div className="search-bar-container">
        <input type="text" placeholder="Find Your Products" className="search-input" />
        <button className="search-button"><SearchIcon /></button>
        <div className="cart-icon-wrapper"><CartIcon /></div>
      </div> */}

      {error && <p className="error-message">{error}</p>}

      <main className="cart-main-content">
        <div className="cart-items-section">

          {cart.items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <Link to="/shop" className="continue-shopping-link">Start Shopping</Link>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="product-details">
                  <div className="product-image-placeholder">
                    {item.image ? <img src={item.image} alt={item.name} /> : <ImageIcon />}
                  </div>
                  <div className="product-info">
                    <span className="product-name">{item.name}</span>
                    <span className="product-category">{item.category}</span>
                    <span className="product-price">Rs. {(item.price || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="product-quantity">
                  <button className="quantity-btn" onClick={() => handleQuantityChange(item.productId, Math.max(1, (item.quantity || 1) - 1))}>-</button>
                  <input type="text" value={item.quantity || 0} readOnly className="quantity-input" />
                  <button className="quantity-btn" onClick={() => handleQuantityChange(item.productId, (item.quantity || 0) + 1)}>+</button>
                </div>
                <div className="product-subtotal">
                  <span>Rs. {((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                </div>
                <div className="product-remove">
                  <button className="remove-btn" onClick={() => handleRemoveItem(item.productId)}><TrashIcon /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="order-summary-section">
          <div className="summary-card">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <span>{cart.items.length} item(s)</span>
            </div>
            <div className="summary-item"><span>Sub Total:</span><span>Rs. {subTotal.toFixed(2)}</span></div>
            <div className="summary-item"><span>Flat Discount:</span><span>Rs. {flatDiscount.toFixed(2)}</span></div>
            <hr className="summary-divider" />
            <div className="summary-total"><span>Total:</span><span>Rs. {total.toFixed(2)}</span></div>
            
            <div className="payment-options">
              <h3>Select Payment Method:</h3>
              <div className="payment-method">
                <label>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Cash on Delivery" 
                    checked={selectedPayment === "Cash on Delivery"}
                    onChange={(e) => setSelectedPayment(e.target.value)} 
                  />
                  <span className="payment-icon">💵</span>
                  Cash on Delivery
                </label>
              </div>
              
              <div className="payment-method">
                <label>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Credit/Debit Card" 
                    checked={selectedPayment === "Credit/Debit Card"}
                    onChange={(e) => setSelectedPayment(e.target.value)} 
                  />
                  <span className="payment-icon">💳</span>
                  Credit/Debit Card
                </label>
              </div> 
                          
              <div className="payment-method">
                <label>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Bank Transfer" 
                    checked={selectedPayment === "Bank Transfer"}
                    onChange={(e) => setSelectedPayment(e.target.value)} 
                  />
                  <span className="payment-icon">🏧</span>
                  Bank Transfer
                </label>
              </div>
            </div>
            
            <button className="checkout-btn" disabled={cart.items.length === 0 || !selectedPayment} onClick={handleCheckout}>
              CONFIRM ORDER & DOWNLOAD RECEIPT
            </button>
            <Link to="/shop" className="continue-shopping-btn">CONTINUE SHOPPING</Link>
          </div>
        </div>
      </main>
    </div>
  );
};


const ImageIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a7b98f' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);

export default CartPage;