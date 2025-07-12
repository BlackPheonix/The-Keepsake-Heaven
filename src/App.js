import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUsPage';
import Cart from './pages/CartPage';
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import AccountDetails from "./pages/AccountDetails";
import PaymentMethods from "./pages/PaymentMethods";
import OrderHistory from "./pages/OrderHistory";
import Product from './pages/Product';


import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/account" element={<AccountDetails />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;