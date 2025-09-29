import React, { useState, useEffect } from 'react';
import { FiEdit, FiSearch, FiFilter, FiUser, FiDollarSign, FiTrendingUp, FiStar, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import CustomerModal from '../components/CustomerModal';
import ChatModal from '../components/ChatModal';
import './Customers.css';
import { 
  getAllUsers, 
  updateUserData, 
  getUserStatistics, 
  getUserChatMessages, 
  sendChatMessage 
} from '../firebase/firebaseUtils';
import { auth } from '../firebase/FirebaseConfig';

const Customers = () => {
  // State for customers data
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for statistics
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    newThisMonth: 0,
    tiers: { Regular: 0, Silver: 0, Gold: 0, Platinum: 0 },
    loyaltyMembers: 0,
    highValueCount: 0,
    topSpenders: []
  });

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const tiers = ['All', 'Regular', 'Silver', 'Gold', 'Platinum'];

  // State for editing customer
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State for chat
  const [chatCustomer, setChatCustomer] = useState(null);
  const [chatMessages, setChatMessages] = useState({});

  // Fetch customers and statistics on component mount
  useEffect(() => {
    console.log("🚀 Customers component mounted");
    console.log("🔐 Current admin:", auth.currentUser?.email);
    
    fetchCustomers();
    fetchStatistics();
  }, []);

  const fetchCustomers = async () => {
    try {
      console.log("📡 Fetching customers...");
      setLoading(true);
      setError(null);
      
      const result = await getAllUsers();
      
      console.log("📦 getAllUsers result:", result);
      
      if (result.success) {
        console.log("✅ Customers loaded successfully:", result.data.length, "users");
        setCustomers(result.data);
        setError(null);
      } else {
        console.error("❌ Failed to load customers:", result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error("💥 Exception in fetchCustomers:", err);
      setError("Failed to load customers: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      console.log("📊 Fetching user statistics...");
      const result = await getUserStatistics();
      
      if (result.success) {
        console.log("✅ Statistics loaded:", result.data);
        setStatistics(result.data);
      } else {
        console.error("❌ Failed to load statistics:", result.error);
      }
    } catch (err) {
      console.error("💥 Exception in fetchStatistics:", err);
    }
  };

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesTier = selectedTier === 'All' || customer.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  // Calculate metrics from real data
  const totalCustomers = statistics.totalUsers || customers.length;
  const newThisMonth = statistics.newThisMonth || 0;
  const highValueCount = statistics.highValueCount || 0;
  const loyaltyMembers = statistics.loyaltyMembers || 0;

  // Tier distribution data from real statistics
  const tierData = [
    { tier: 'Platinum', count: statistics.tiers.Platinum || 0, color: '#75A47F' },
    { tier: 'Gold', count: statistics.tiers.Gold || 0, color: '#BACD92' },
    { tier: 'Silver', count: statistics.tiers.Silver || 0, color: '#F5DAD2' },
    { tier: 'Regular', count: statistics.tiers.Regular || 0, color: '#FCFFE0' }
  ];

  // Top spenders from statistics
  const topSpenders = statistics.topSpenders || [];

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleSaveCustomer = async (updatedCustomer) => {
    try {
      console.log("💾 Saving customer:", updatedCustomer);
      
      const result = await updateUserData(updatedCustomer.id, {
        firstName: updatedCustomer.name.split(' ')[0] || '',
        lastName: updatedCustomer.name.split(' ').slice(1).join(' ') || '',
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        tier: updatedCustomer.tier
      });

      if (result.success) {
        // Update local state
        setCustomers(customers.map(c => 
          c.id === updatedCustomer.id ? { ...c, ...updatedCustomer } : c
        ));
        setEditingCustomer(null);
        console.log("✅ Customer updated successfully");
      } else {
        setError("Failed to update customer: " + result.error);
      }
    } catch (err) {
      console.error("💥 Error saving customer:", err);
      setError("Failed to save customer: " + err.message);
    }
  };

  const handleOpenChat = async (customer) => {
    setChatCustomer(customer);
    
    try {
      const result = await getUserChatMessages(customer.id);
      if (result.success) {
        setChatMessages(prev => ({
          ...prev,
          [customer.id]: result.data
        }));
      }
    } catch (err) {
      console.error("Error loading chat:", err);
    }
  };

  const handleSendMessage = async (message) => {
    if (!chatCustomer) return;
    
    try {
      const result = await sendChatMessage(chatCustomer.id, message);
      
      if (result.success) {
        setChatMessages(prev => ({
          ...prev,
          [chatCustomer.id]: [...(prev[chatCustomer.id] || []), message]
        }));
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading && customers.length === 0) {
    return <div className="loading">Loading customers...</div>;
  }

  return (
    <div className="customers-page">
      {/* Debug Panel */}
      <div style={{
        background: '#e8f4f8',
        border: '2px solid #17a2b8',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        fontSize: '13px',
        fontFamily: 'monospace'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>🔍 Debug Information</h4>
        <div><strong>Admin User:</strong> {auth.currentUser?.email || 'Not authenticated'}</div>
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>Error:</strong> {error || 'None'}</div>
        <div><strong>Customers Count:</strong> {customers.length}</div>
        <div><strong>Filtered Count:</strong> {filteredCustomers.length}</div>
        <div><strong>Search Term:</strong> "{searchTerm}"</div>
        <div><strong>Selected Tier:</strong> "{selectedTier}"</div>
        
        <button 
          onClick={() => { fetchCustomers(); fetchStatistics(); }} 
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Reload Data
        </button>
      </div>

      {error && (
        <div className="error-message" style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1>Customer Management</h1>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <FiUser className="summary-icon" />
          <div>
            <h3>Total Customers</h3>
            <p>{totalCustomers}</p>
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
              const percentage = totalCustomers > 0 ? Math.round((item.count / totalCustomers) * 100) : 0;
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
            {topSpenders.length > 0 ? (
              topSpenders.map((customer, index) => (
                <div key={customer.id} className="spender-row">
                  <span className="rank">{index + 1}.</span>
                  <span className="name">{customer.name}</span>
                  <span className="amount">LKR {customer.totalSpent.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No spending data available yet
              </div>
            )}
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
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    {customers.length === 0 ? (
                      "No customers found. Users will appear here when they register."
                    ) : (
                      "No customers match your current search criteria."
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
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
          onSend={handleSendMessage}
          onClose={() => setChatCustomer(null)}
        />
      )}
    </div>
  );
};

export default Customers;