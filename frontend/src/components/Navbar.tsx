import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => (
  <nav className="navbar">
    <div className="navbar-logo">TechNest</div>
    <ul className="navbar-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/products">Products</Link></li>
      <li><Link to="/cart">Cart</Link></li>
      <li><Link to="/orders">Orders</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/cart-items">Cart Items</Link></li>
      <li><Link to="/categories">Categories</Link></li>
      <li><Link to="/order-items">Order Items</Link></li>
      <li><Link to="/inventory">Inventory</Link></li>
      <li><Link to="/transaction-logs">Transaction Logs</Link></li>
      <li><Link to="/currencies">Currencies</Link></li>
    </ul>
  </nav>
);

export default Navbar;
