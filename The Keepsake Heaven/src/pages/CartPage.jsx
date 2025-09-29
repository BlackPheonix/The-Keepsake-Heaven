import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/FirebaseConfig';
import { getUserCart, updateCartItemQuantity, removeFromCart } from '../firebase/firebaseUtils';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/Cart.css';
import Popup from './Popup';  // Import Popup

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '', address: '' });

  // State for popup messages
  const [popup, setPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchCart(user.uid);
        await fetchUserDetails(user.uid);
      } else {
        setLoading(false);
        setError("Please sign in to view your cart");
      }
    });
    return () => unsubscribe();
  }, []);

  // Functions to handle popup display
  const showPopup = (title, message, type = 'info') => {
    setPopup({ isOpen: true, title, message, type });
  };

  const closePopup = () => {
    setPopup({ isOpen: false, title: '', message: '', type: 'info' });
  };

  const fetchUserDetails = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserDetails({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          address: userData.address || ''
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

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
      const { updateDoc } = await import('firebase/firestore');
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
        showPopup('Error', 'Failed to update quantity', 'error');
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      showPopup('Error', 'An unexpected error occurred', 'error');
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
        showPopup('Error', 'Failed to remove item', 'error');
      }
    } catch (error) {
      console.error("Error removing item:", error);
      showPopup('Error', 'An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    // Validate payment method and cart contents
    if (!selectedPayment) {
      showPopup('Payment Method Required', 'Please select a payment method before checking out', 'warning');
      return;
    }
    if (cart.items.length === 0) {
      showPopup('Cart Empty', 'Your cart is empty', 'warning');
      return;
    }

    try {
      // Generate PDF receipt
      const docPdf = new jsPDF();
      docPdf.setFontSize(16);
      docPdf.text("Order Receipt", 14, 20);

      const tableColumn = ["Product", "Price", "Qty", "Total"];
      const tableRows = cart.items.map(item => [
        item.name || 'Unknown Product',
        `Rs. ${(item.price || 0).toFixed(2)}`,
        (item.quantity || 0).toString(),
        `Rs. ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}`
      ]);

      autoTable(docPdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      // Subtotal, discount and grand total lines
      const finalY = docPdf.lastAutoTable?.finalY || 40;
      docPdf.setFontSize(12);
      docPdf.text(`Subtotal: Rs. ${subTotal.toFixed(2)}`, 14, finalY + 15);
      docPdf.text(`Discount: Rs. ${flatDiscount.toFixed(2)}`, 14, finalY + 25);
      docPdf.setFont(undefined, 'bold');
      docPdf.text(`Grand Total: Rs. ${total.toFixed(2)}`, 14, finalY + 35);

      // Payment method line
      docPdf.setFont(undefined, 'normal');
      docPdf.setFontSize(11);
      docPdf.text(`Payment Method: ${selectedPayment}`, 14, finalY + 50);

      // Order ID and date lines
      docPdf.setFontSize(10);
      const orderID = `ORD${Date.now()}`;
      docPdf.text(`Order ID: ${orderID}`, 14, finalY + 60);
      docPdf.text(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, finalY + 70);

      // Save the PDF locally
      docPdf.save(`receipt-${orderID}.pdf`);

      // Store order details in localStorage
      const orderDetails = {
        id: orderID,
        userId: userId,
        customer: `${userDetails.firstName} ${userDetails.lastName} ${userDetails.address}`,
        status: "Processing",
        details: `Order placed on ${new Date().toLocaleDateString()}`,
        items: cart.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: (item.price || 0).toFixed(2)
        })),
        date: new Date().toLocaleDateString(),
        paymentMethod: selectedPayment,
        amount: total
      };

      // --- ADD TO FIRESTORE ---
      try {
        await addDoc(collection(db, 'orders'), orderDetails);
      } catch (err) {
        console.error("Error saving order to Firestore:", err);
        showPopup('Error', 'Failed to save order to database.', 'error');
        return;
      }

      // Keep localStorage for client-side history (optional)
      const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
      existingOrders.push(orderDetails);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart from Firestore
      const clearResult = await clearCart();

      // Show appropriate popup based on the outcome
      if (clearResult.success) {
        showPopup('Order Confirmed!', `Payment method: ${selectedPayment}. Your cart has been cleared and receipt downloaded.`, 'success');
        setSelectedPayment("");
        setError("");
      } else {
        showPopup('Partial Success', 'Order confirmed, but failed to clear cart. Please refresh the page.', 'warning');
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      showPopup('Error', 'Failed to generate receipt. Please try again.', 'error');
    }
  };

  // Compute subtotal, discount and total
  const subTotal = cart.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  const flatDiscount = 0;
  const total = subTotal - flatDiscount;

  // Handle loading and not-signed-in states
  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }
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
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId, Math.max(1, (item.quantity || 1) - 1))}
                  >
                    -
                  </button>
                  <input type="text" value={item.quantity || 0} readOnly className="quantity-input" />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId, (item.quantity || 0) + 1)}
                  >
                    +
                  </button>
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
            <button
              className="checkout-btn"
              disabled={cart.items.length === 0 || !selectedPayment}
              onClick={handleCheckout}
            >
              CONFIRM ORDER & DOWNLOAD RECEIPT
            </button>
            <Link to="/shop" className="continue-shopping-btn">CONTINUE SHOPPING</Link>
          </div>
        </div>
      </main>

      {/* Popup for notifications */}
      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
      />
    </div>
  );
};

const ImageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: '#a7b98f' }}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

export default CartPage;