import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiStar, FiSearch, FiFilter, FiUser, FiDollarSign, FiTrendingUp, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import './Customers.css';
import CustomerModal from '../components/CustomerModal';
import ChatModal from '../components/ChatModal';

const Customers = () => {
  // Customer data
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Nimal Perera', email: 'nimal@example.com', phone: '0771234567', orders: 5, totalSpent: 25000, tier: 'Gold', lastActive: '2023-06-15' },
    { id: 2, name: 'Kamala Silva', email: 'kamala@example.com', phone: '0712345678', orders: 3, totalSpent: 12000, tier: 'Silver', lastActive: '2023-06-14' },
    { id: 3, name: 'Sunil Fernando', email: 'sunil@example.com', phone: '0762345678', orders: 8, totalSpent: 45000, tier: 'Platinum', lastActive: '2023-06-14' },
    { id: 4, name: 'Anoma Rajapakse', email: 'anoma@example.com', phone: '0753456789', orders: 2, totalSpent: 8000, tier: 'Silver', lastActive: '2023-06-13' },
    { id: 5, name: 'Priyantha Bandara', email: 'priyantha@example.com', phone: '0784567890', orders: 4, totalSpent: 18000, tier: 'Gold', lastActive: '2023-06-12' },
    { id: 6, name: 'Samantha Rathnayake', email: 'samantha@example.com', phone: '0725678901', orders: 6, totalSpent: 32000, tier: 'Gold', lastActive: '2023-06-11' },
    { id: 7, name: 'Chamari Atapattu', email: 'chamari@example.com', phone: '0706789012', orders: 1, totalSpent: 4500, tier: 'Regular', lastActive: '2023-06-10' },
    { id: 8, name: 'Dinesh Chandimal', email: 'dinesh@example.com', phone: '0747890123', orders: 7, totalSpent: 38000, tier: 'Platinum', lastActive: '2023-06-09' },
  ]);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const tiers = ['All', 'Regular', 'Silver', 'Gold', 'Platinum'];

  // State for editing customer
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State for chat
  const [chatCustomer, setChatCustomer] = useState(null);
  const [chatMessages, setChatMessages] = useState({}); // { customerId: [ { sender, text, time } ] }

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesTier = selectedTier === 'All' || customer.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  // Calculate metrics
  const thisMonth = new Date().getMonth();
  const newThisMonth = customers.filter(c => new Date(c.lastActive).getMonth() === thisMonth).length;
  const highValueCount = customers.filter(c => c.totalSpent > 30000).length;
  const loyaltyMembers = customers.filter(c => c.tier !== 'Regular').length;

  // Tier distribution data
  const tierData = [
    { tier: 'Platinum', count: customers.filter(c => c.tier === 'Platinum').length, color: '#75A47F' },
    { tier: 'Gold', count: customers.filter(c => c.tier === 'Gold').length, color: '#BACD92' },
    { tier: 'Silver', count: customers.filter(c => c.tier === 'Silver').length, color: '#F5DAD2' },
    { tier: 'Regular', count: customers.filter(c => c.tier === 'Regular').length, color: '#FCFFE0' }
  ];

  // Top spenders
  const topSpenders = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleSaveCustomer = (customer) => {
    setCustomers(customers.map(c => c.id === customer.id ? { ...c, ...customer } : c));
    setEditingCustomer(null);
  };

  const handleOpenChat = (customer) => {
    setChatCustomer(customer);
  };

  const handleSendMessage = (customerId, message) => {
    setChatMessages(prev => ({
      ...prev,
      [customerId]: [...(prev[customerId] || []), message]
    }));
  };

  return (
    <div className="customers-page">
      {/* Header */}
      <div className="page-header">
        <h1>Customer Management</h1>
        {/* Remove or comment out the + Add Customer button in the page header */}
        {/* <button className="primary-btn">+ Add Customer</button> */}
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <FiUser className="summary-icon" />
          <div>
            <h3>Total Customers</h3>
            <p>{customers.length}</p>
          </div>
        </div>
        <div className="summary-card">
          <FiTrendingUp className="summary-icon" />
          <div>
            <h3>New This Month</h3>
            <p>{newThisMonth}</p>
          </div>
        </div>
        <div className="summary-card">
          <FiStar className="summary-icon" />
          <div>
            <h3>Loyalty Members</h3>
            <p>{loyaltyMembers}</p>
          </div>
        </div>
        <div className="summary-card">
          <FiDollarSign className="summary-icon" />
          <div>
            <h3>High-Value</h3>
            <p>{highValueCount}</p>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        {/* Tier Distribution */}
        <div className="insight-card">
          <h2>Customer Tier Distribution</h2>
          <div className="tier-distribution">
            {tierData.map(item => {
              const percentage = Math.round((item.count / customers.length) * 100);
              return (
                <div key={item.tier} className="tier-row">
                  <div className="tier-info">
                    <span className="tier-name">{item.tier}</span>
                    <span className="tier-count">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="tier-bar-container">
                    <div 
                      className="tier-bar" 
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Spenders */}
        <div className="insight-card">
          <h2>Top Spenders</h2>
          <div className="top-spenders">
            {topSpenders.map((customer, index) => (
              <div key={customer.id} className="spender-row">
                <span className="rank">{index + 1}.</span>
                <span className="name">{customer.name}</span>
                <span className="amount">LKR {customer.totalSpent.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="controls">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <FiFilter className="filter-icon" />
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
          >
            {tiers.map(tier => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>Customer List</h2>
        </div>
        <div className="table-scroll">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Tier</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-info">
                      <div className="avatar">{customer.name.charAt(0)}</div>
                      {customer.name}
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{customer.email}</div>
                      <div className="phone">{customer.phone}</div>
                    </div>
                  </td>
                  <td>{customer.orders}</td>
                  <td>LKR {customer.totalSpent.toLocaleString()}</td>
                  <td>
                    <span className={`tier-badge ${customer.tier.toLowerCase()}`}>
                      {customer.tier}
                    </span>
                  </td>
                  <td>
                    <div className="last-active">
                      <FiCalendar className="calendar-icon" />
                      {customer.lastActive}
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="edit-btn" onClick={() => handleEditCustomer(customer)}>
                        <FiEdit />
                      </button>
                      <button className="chat-btn" onClick={() => handleOpenChat(customer)}>
                        <FiMessageSquare />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="no-results">
              No customers found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="feedback-section">
        <h2>Recent Feedback</h2>
        <div className="feedback-list">
          <div className="feedback-item">
            <div className="feedback-header">
              <div className="avatar">N</div>
              <div>
                <div className="customer-name">Nimal Perera</div>
                <div className="rating">★★★★☆</div>
              </div>
            </div>
            <p className="feedback-text">"Beautiful personalized keychain, exactly as described!"</p>
            <div className="feedback-date">2023-06-15</div>
          </div>
          <div className="feedback-item">
            <div className="feedback-header">
              <div className="avatar">K</div>
              <div>
                <div className="customer-name">Kamala Silva</div>
                <div className="rating">★★★☆☆</div>
              </div>
            </div>
            <p className="feedback-text">"Product was good but delivery took longer than expected."</p>
            <div className="feedback-date">2023-06-14</div>
          </div>
        </div>
      </div>

      {showModal && editingCustomer && (
        <CustomerModal 
          onClose={() => { setShowModal(false); setEditingCustomer(null); }} 
          onSave={handleSaveCustomer} 
          mode="edit"
          customer={editingCustomer}
        />
      )}

      {chatCustomer && (
        <ChatModal 
          customer={chatCustomer}
          messages={chatMessages[chatCustomer.id] || []}
          onSend={msg => handleSendMessage(chatCustomer.id, msg)}
          onClose={() => setChatCustomer(null)}
        />
      )}
    </div>
  );
};

export default Customers;