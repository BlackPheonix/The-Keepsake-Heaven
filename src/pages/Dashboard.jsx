// Dashboard.jsx
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
import { FiEye, FiPrinter } from 'react-icons/fi';
import './Dashboard.css';
import Products from './Products';
import { useOrders } from '../context/OrdersContext';

const COLORS = ['#B97995', '#83B8A1', '#8AB6C0', '#A694B3'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const { orders } = useOrders();

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = {
        salesData: [
          { month: 'Mar', sales: 150000, target: 170000 },
          { month: 'Apr', sales: 180000, target: 180000 },
          { month: 'May', sales: 210000, target: 190000 },
          { month: 'Jun', sales: 250000, target: 200000 },
          { month: 'Jul', sales: 220000, target: 210000 },
          { month: 'Aug', sales: 240000, target: 220000 }
        ],
        recentOrders: [
          { id: '#ORD-1001', customer: 'Nimal Perera', date: '2023-06-15', amount: 5200, status: 'Completed', items: 3 },
          { id: '#ORD-1002', customer: 'Kamala Silva', date: '2023-06-14', amount: 3800, status: 'Shipped', items: 2 },
          { id: '#ORD-1003', customer: 'Sunil Fernando', date: '2023-06-14', amount: 7500, status: 'Processing', items: 5 },
          { id: '#ORD-1004', customer: 'Anoma Rajapakse', date: '2023-06-13', amount: 12000, status: 'Completed', items: 4 },
          { id: '#ORD-1005', customer: 'Priyantha Bandara', date: '2023-06-12', amount: 6300, status: 'Completed', items: 2 },
          { id: '#ORD-1006', customer: 'Samantha Rathnayake', date: '2023-06-11', amount: 8900, status: 'Shipped', items: 3 },
          { id: '#ORD-1007', customer: 'Chamari Atapattu', date: '2023-06-10', amount: 4500, status: 'Processing', items: 1 },
          { id: '#ORD-1008', customer: 'Dinesh Chandimal', date: '2023-06-09', amount: 11200, status: 'Completed', items: 6 }
        ],
        stockAlerts: [
          { product: 'Personalized Keychain', stock: 3, category: 'Personalized Gifts' },
          { product: 'Wooden Photo Frame', stock: 5, category: 'Home Decor' },
          { product: 'Handmade Bracelet', stock: 2, category: 'Jewelry' }
        ],
        customerLocations: [
          { region: 'Colombo', value: 45 },
          { region: 'Kandy', value: 25 },
          { region: 'Galle', value: 15 },
          { region: 'Other', value: 15 }
        ]
      };
      setDashboardData(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (!dashboardData) return <div className="error">Failed to load data</div>;

  const { salesData, customerLocations, recentOrders, stockAlerts } = dashboardData;
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalProducts = 6; // Update this if you have a products array
  const productGrowth = '5% from last month'; // Dummy value for now

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard Overview</h1>
      <div className="kpi-grid">
        <KpiCard title="Total Sales" value={`LKR ${totalSales.toLocaleString()}`} icon={<FaDollarSign />} trend="up" trendValue="12% from last month" />
        <KpiCard title="New Customers" value="48" icon={<FaUsers />} trend="up" trendValue="8% from last month" />
        <KpiCard title="Total Orders" value="156" icon={<FaShoppingCart />} trend="up" trendValue="5% from last month" />
        <KpiCard title="Total Products" value={totalProducts} icon={<FaChartLine />} trend="up" trendValue={productGrowth} />
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
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td>{order.amount.toLocaleString()}</td>
                  <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                  <td>
                    {/* <div className="action-buttons">
                      <button className="view-btn"><FiEye /></button>
                      <button className="print-btn"><FiPrinter /></button>
                    </div> */}
                  </td>
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
