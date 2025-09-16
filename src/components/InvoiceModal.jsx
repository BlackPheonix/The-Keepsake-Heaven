import React from 'react';
import './InvoiceModal.css';
import logo from '../assets/logo.png';

const InvoiceModal = ({ order, onClose }) => {
  return (
    <div className="invoice-modal-overlay">
      <div className="invoice-modal-container">
        <div className="invoice-modal-header">
          <img src={logo} alt="Logo" className="invoice-logo" />
          <h2>Invoice</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="invoice-details">
          <div className="invoice-row">
            <span className="label">Order ID:</span>
            <span>{order.id}</span>
          </div>
          <div className="invoice-row">
            <span className="label">Customer:</span>
            <span>{order.customer}</span>
          </div>
          <div className="invoice-row">
            <span className="label">Date:</span>
            <span>{order.date}</span>
          </div>
          <div className="invoice-row">
            <span className="label">Items:</span>
            <span>{order.items}</span>
          </div>
          <div className="invoice-row">
            <span className="label">Amount:</span>
            <span>LKR {order.amount.toLocaleString()}</span>
          </div>
          <div className="invoice-row">
            <span className="label">Status:</span>
            <span>{order.status}</span>
          </div>
        </div>
        <div className="invoice-footer">
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal; 