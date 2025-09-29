import React, { forwardRef } from 'react';
import logo from '../assets/logo.png';
import './InvoiceModal.css';

function generateReference(order) {
  // Example: ORD-1001-20240608-1530
  const now = new Date();
  const date = now.toISOString().slice(0,10).replace(/-/g, '');
  const time = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
  return `${order.id.replace('#','')}-${date}-${time}`;
}

const InvoiceTemplate = forwardRef(({ order }, ref) => (
  <div className="invoice-modal-container" ref={ref} style={{ boxShadow: 'none', margin: 0 }}>
    <div className="invoice-modal-header">
      <img src={logo} alt="Logo" className="invoice-logo" />
      <h2>Invoice</h2>
    </div>
    <div className="invoice-details">
      <div className="invoice-row">
        <span className="label">Reference No:</span>
        <span>{generateReference(order)}</span>
      </div>
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
));

export default InvoiceTemplate; 