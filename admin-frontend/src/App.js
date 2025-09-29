import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/AdminNavbar';
import Footer from './components/AdminFooter';
import AdminLogin from "./pages/AdminLogin";
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Banners from './pages/Banners'; // Add Banners import
import Profile from './pages/Profile';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/FirebaseConfig";
import './App.css';

const ADMIN_EMAIL = "Thekeepsakeheaven0120@gmail.com";

// PrivateRoute checks for admin login
function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) return <div>Loading...</div>;

  // Normalize both strings for comparison
  const norm = str => (str || "").trim().toLowerCase();

  if (!user || norm(user.email) !== norm(ADMIN_EMAIL)) {
    console.log("Access denied. user.email:", JSON.stringify(user && user.email), "ADMIN_EMAIL:", JSON.stringify(ADMIN_EMAIL));
    console.log("Normalized:", norm(user && user.email), norm(ADMIN_EMAIL));
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

// Layout component that includes sidebar, navbar, and footer
const AdminLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/" element={
          <PrivateRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </PrivateRoute>
        } />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Products />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Orders />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Customers />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Add Banners Route */}
        <Route
          path="/banners"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Banners />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Profile />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;