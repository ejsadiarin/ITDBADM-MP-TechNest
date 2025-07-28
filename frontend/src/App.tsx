
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RequireAdmin from './components/RequireAdmin';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import CartItems from './pages/CartItems';
import Categories from './pages/Categories';
import OrderItems from './pages/OrderItems';
import Inventory from './pages/Inventory';
import TransactionLogs from './pages/TransactionLogs';
import Currencies from './pages/Currencies';
import './App.css';

const App: React.FC = () => (
  <Router>
    <Navbar />
    <div className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart-items" element={<CartItems />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/order-items" element={<OrderItems />} />
        <Route path="/inventory" element={<RequireAdmin><Inventory /></RequireAdmin>} />
        <Route path="/transaction-logs" element={<RequireAdmin><TransactionLogs /></RequireAdmin>} />
        <Route path="/currencies" element={<RequireAdmin><Currencies /></RequireAdmin>} />
      </Routes>
    </div>
  </Router>
);

export default App;
