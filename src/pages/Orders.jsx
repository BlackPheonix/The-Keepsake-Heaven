import React, { useState } from 'react';
import { FiDownload, FiEye, FiPrinter } from 'react-icons/fi';
import InvoiceModal from '../components/InvoiceModal';
import InvoiceTemplate from '../components/InvoiceTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import './Orders.css';
import { useOrders } from '../context/OrdersContext';

const Orders = () => {
  const { orders, setOrders } = useOrders();

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = ['All', 'Processing', 'Shipped', 'Completed'];

  const exportToCSV = () => {
    // Prepare data for Excel
    const wsData = [
      ['Order ID', 'Customer', 'Date', 'Items', 'Amount (LKR)', 'Status'],
      ...orders.map(order => [
        order.id,
        order.customer,
        order.date,
        order.items,
        order.amount,
        order.status
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders.xlsx');
  };

  const today = new Date().toISOString().split('T')[0];

  const averageOrderValue = orders.length
    ? Math.round(orders.reduce((sum, order) => sum + order.amount, 0) / orders.length)
    : 0;

  const invoiceRef = React.useRef();

  const handleViewInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoice(true);
  };

  const handlePrintInvoice = async (order) => {
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
        pdf.save(`invoice-${order.id}.pdf`);
      }
    }, 100);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders => orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  return (
    <div className="orders-page">
      <h1>Order Management</h1>

      <div className="orders-summary">
        <div className="summary-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="summary-card">
          <h3>Pending</h3>
          <p>{orders.filter(o => o.status === 'Processing').length}</p>
        </div>
        <div className="summary-card">
          <h3>Shipped Today</h3>
          <p>{orders.filter(o => o.status === 'Shipped' && o.date === today).length}</p>
        </div>
        <div className="summary-card">
          <h3>Avg. Order Value</h3>
          <p>LKR {averageOrderValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="orders-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search orders..."
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
          <FiDownload /> Export CSV
        </button>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date & Time</th>
              <th>Items</th>
              <th>Amount (LKR)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{order.items}</td>
                <td>{order.amount.toLocaleString()}</td>
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
                    <button className="view-btn" onClick={() => handleViewInvoice(order)}>
                      <FiEye />
                    </button>
                    <button className="print-btn" onClick={() => handlePrintInvoice(order)}>
                      <FiPrinter />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
