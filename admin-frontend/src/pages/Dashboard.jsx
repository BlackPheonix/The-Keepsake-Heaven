import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import KpiCard from '../components/KpiCard';
import { FaDollarSign, FaUsers, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { FiShoppingCart, FiDollarSign, FiUser, FiBarChart2 } from 'react-icons/fi';
import './Dashboard.css';
import { getDashboardData } from '../firebase/firebaseUtils';
import { auth } from '../firebase/FirebaseConfig'; // Add this import

// Dummy StatCard to prevent errors if not defined
const StatCard = KpiCard;

const COLORS = ['#B97995', '#83B8A1', '#8AB6C0', '#A694B3'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Add debug logging
    console.log("Current auth user:", auth.currentUser);
    console.log("User email:", auth.currentUser?.email);
    console.log("User UID:", auth.currentUser?.uid);
    console.log("User display name:", auth.currentUser?.displayName);
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const result = await getDashboardData();

        if (result.success) {
          setDashboardData(result.data);
          setError(null);
        } else {
          setError(result.error);
          console.error("Dashboard data error:", result.error);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Rest of your component code stays the same...
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!dashboardData) return <div className="error">No data available</div>;

  const {
    totalSales,
    totalOrders,
    totalCustomers,
    totalProducts,
    newCustomers,
    salesData,
    customerLocations,
    recentOrders,
    stockAlerts
  } = dashboardData;

  // Helper: format date safely
  const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    // If coming from Firestore, might be a Timestamp object
    if (date.toDate) return date.toDate().toLocaleString();
    // If already a JS Date object
    if (date instanceof Date) return date.toLocaleString();
    return '';
  };

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard Overview</h1>
      
      {/* Add debug info temporarily */}
      <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px', fontSize: '12px' }}>
        <strong>Debug Info:</strong><br/>
        Current User: {auth.currentUser?.email || 'Not logged in'}<br/>
        UID: {auth.currentUser?.uid || 'No UID'}<br/>
        Display Name: {auth.currentUser?.displayName || 'No display name'}
      </div>
      
      <div className="kpi-grid">
        <KpiCard title="Total Sales" value={`LKR ${totalSales?.toLocaleString?.() ?? 0}`} icon={<FaDollarSign />} trend="up" trendValue="12% from last month" />
        <KpiCard title="New Customers" value={newCustomers} icon={<FaUsers />} trend="up" trendValue="8% from last month" />
        <KpiCard title="Total Orders" value={totalOrders} icon={<FaShoppingCart />} trend="up" trendValue="5% from last month" />
        <KpiCard title="Total Products" value={totalProducts} icon={<FaChartLine />} trend="up" trendValue="3% from last month" />
        <KpiCard title="Total Customers" value={totalCustomers} icon={<FaUsers />} trend="up" trendValue="8% from last month" />
      </div>

      <div className="dashboard-row">
        <div className="chart-container">
          <h3>Sales Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#FF6B6B" strokeWidth={3} />
              <Line type="monotone" dataKey="target" stroke="#4ECDC4" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="pie-chart-container">
          <h3>Customer Locations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerLocations}
                dataKey="value"
                nameKey="region"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {customerLocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stat-cards">
        <StatCard title="Total Sales" value={`LKR ${totalSales?.toLocaleString?.() ?? 0}`} icon={<FiDollarSign />} />
        <StatCard title="Total Orders" value={totalOrders} icon={<FiShoppingCart />} />
        <StatCard title="Total Customers" value={totalCustomers} icon={<FiUser />} />
        <StatCard title="New Customers" value={newCustomers} icon={<FiBarChart2 />} />
      </div>

      <div className="dashboard-row">
        <div className="table-container">
          <h3>Recent Orders</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount (LKR)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{formatDate(order.date)}</td>
                  <td>{order.items}</td>
                  <td>{order.amount?.toLocaleString?.() ?? order.amount ?? 0}</td>
                  <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h3>Low Stock Alerts</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {stockAlerts.map((alert, index) => (
                <tr key={index}>
                  <td>{alert.product}</td>
                  <td>{alert.category}</td>
                  <td>{alert.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;