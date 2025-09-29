import React, { useState, useEffect } from 'react';
import { FiDownload, FiEye, FiPrinter, FiRefreshCw } from 'react-icons/fi';
import InvoiceModal from '../components/InvoiceModal';
import InvoiceTemplate from '../components/InvoiceTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import './Orders.css';
import { getAllOrders, updateOrderStatus } from '../firebase/firebaseUtils';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📦 Fetching all orders...");
      const result = await getAllOrders();
      
      if (result.success) {
        console.log("✅ Orders fetched successfully:", result.data.length);
        
        // Format the orders for display
        const formattedOrders = result.data.map(order => {
          console.log("📄 Processing order:", order.id, order);
          
          return {
            id: order.id,
            orderNumber: order.orderNumber || order.id,
            customer: order.customerName || order.customer || 'Unknown Customer',
            customerEmail: order.customerEmail || '',
            date: order.createdAt ? 
              (typeof order.createdAt.toDate === 'function' ? 
                order.createdAt.toDate().toLocaleString() : 
                new Date(order.createdAt).toLocaleString()) : 
              new Date().toLocaleString(),
            items: order.items?.length || order.itemCount || 0,
            amount: order.amount || order.total || 0,
            status: order.status || 'Processing',
            paymentMethod: order.paymentMethod || 'Unknown',
            subTotal: order.subTotal || order.amount || 0,
            discount: order.discount || 0,
            orderItems: order.items || [],
            notes: order.notes || ''
          };
        });
        
        // Sort by date (newest first)
        formattedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setOrders(formattedOrders);
        console.log("📊 Formatted orders:", formattedOrders.length);
      } else {
        console.error("❌ Failed to fetch orders:", result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error("💥 Error fetching orders:", err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = ['All', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

  const exportToCSV = () => {
    // Prepare data for Excel
    const wsData = [
      ['Order ID', 'Order Number', 'Customer', 'Email', 'Date', 'Items', 'Amount (Rs.)', 'Payment Method', 'Status'],
      ...filteredOrders.map(order => [
        order.id,
        order.orderNumber,
        order.customer,
        order.customerEmail,
        order.date,
        order.items,
        order.amount,
        order.paymentMethod,
        order.status
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, `orders-export-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const today = new Date().toDateString();

  const averageOrderValue = orders.length
    ? Math.round(orders.reduce((sum, order) => sum + order.amount, 0) / orders.length)
    : 0;

  const invoiceRef = React.useRef();

  const handleViewInvoice = (order) => {
    console.log("👁️ Viewing invoice for order:", order);
    setSelectedOrder(order);
    setShowInvoice(true);
  };

  const handlePrintInvoice = async (order) => {
    console.log("🖨️ Printing invoice for order:", order);
    setSelectedOrder(order);
    setTimeout(async () => {
      if (invoiceRef.current) {
        const canvas = await html2canvas(invoiceRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
        pdf.save(`invoice-${order.orderNumber || order.id}.pdf`);
      }
    }, 100);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log("🔄 Updating order status:", orderId, "to", newStatus);
      const result = await updateOrderStatus(orderId, newStatus);
      
      if (result.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        console.log("✅ Order status updated successfully");
      } else {
        console.error("❌ Failed to update order status:", result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error("💥 Error updating order status:", err);
      setError("Failed to update order status");
    }
  };

  if (loading && orders.length === 0) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      {/* Debug Panel */}
      <div style={{
        background: '#f8f9fa',
        padding: '10px',
        fontSize: '12px',
        fontFamily: 'monospace',
        borderRadius: '4px',
        margin: '10px 0',
        border: '1px solid #dee2e6'
      }}>
        <strong>📦 Orders Debug:</strong><br/>
        Total Orders: {orders.length}<br/>
        Filtered Orders: {filteredOrders.length}<br/>
        Loading: {loading ? 'Yes' : 'No'}<br/>
        Error: {error || 'None'}<br/>
        Search: "{searchTerm}"<br/>
        Status Filter: {selectedStatus}
        
        <button 
          onClick={fetchOrders}
          style={{
            marginLeft: '10px',
            padding: '4px 8px',
            background: '#99BC85',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <h1>Order Management</h1>
      
      {error && (
        <div className="error-message" style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      <div className="orders-summary">
        <div className="summary-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="summary-card">
          <h3>Processing</h3>
          <p>{orders.filter(o => o.status === 'Processing').length}</p>
        </div>
        <div className="summary-card">
          <h3>Today's Orders</h3>
          <p>{orders.filter(o => new Date(o.date).toDateString() === today).length}</p>
        </div>
        <div className="summary-card">
          <h3>Avg. Order Value</h3>
          <p>Rs. {averageOrderValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="orders-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filter">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button className="export-btn" onClick={exportToCSV}>
          <FiDownload /> Export Excel
        </button>
        <button className="refresh-btn" onClick={fetchOrders} disabled={loading}>
          <FiRefreshCw className={loading ? 'spinning' : ''} /> Refresh
        </button>
      </div>

      <div className="orders-table-container">
        {filteredOrders.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666',
            fontSize: '16px' 
          }}>
            {orders.length === 0 ? (
              <>
                📦 No orders found<br/>
                <small>Orders will appear here when customers make purchases</small>
              </>
            ) : (
              <>
                🔍 No orders match your current filters<br/>
                <small>Try changing your search term or status filter</small>
              </>
            )}
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Items</th>
                <th>Payment Method</th>
                <th>Amount (Rs.)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <div style={{ fontSize: '12px' }}>
                      <strong>{order.orderNumber}</strong><br/>
                      <small style={{ color: '#666' }}>{order.id}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{order.customer}</strong><br/>
                      <small style={{ color: '#666' }}>{order.customerEmail}</small>
                    </div>
                  </td>
                  <td style={{ fontSize: '12px' }}>{order.date}</td>
                  <td>{order.items}</td>
                  <td>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '2px 6px', 
                      background: '#e9ecef', 
                      borderRadius: '3px' 
                    }}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td><strong>Rs. {order.amount.toLocaleString()}</strong></td>
                  <td>
                    <select
                      className={`status-badge ${order.status.toLowerCase()}`}
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                    >
                      {statuses.filter(s => s !== 'All').map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn" 
                        onClick={() => handleViewInvoice(order)}
                        title="View Order Details"
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="print-btn" 
                        onClick={() => handlePrintInvoice(order)}
                        title="Download Invoice"
                      >
                        <FiPrinter />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showInvoice && selectedOrder && (
        <InvoiceModal order={selectedOrder} onClose={() => setShowInvoice(false)} />
      )}

      {/* Hidden invoice for PDF generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {selectedOrder && <InvoiceTemplate ref={invoiceRef} order={selectedOrder} />}
      </div>
    </div>
  );
};

export default Orders;