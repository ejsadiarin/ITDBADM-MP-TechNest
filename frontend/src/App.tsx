import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import Profile from './pages/Profile';
import StaffDashboard from './pages/staff/StaffDashboard';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { isLoggedIn, userRole } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (roles && userRole && !roles.includes(userRole)) {
    return <Navigate to="/products" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <div className="bg-gray-900 text-white flex min-h-screen">
        {isLoggedIn && <Sidebar />}
        <div className={`flex-1 flex flex-col ${isLoggedIn ? 'ml-64' : 'ml-0 w-full'}`}> {/* Adjust margin and width based on login status */}
          {isLoggedIn && <Header />}
          <main className="p-6 mt-16 flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={isLoggedIn ? <Navigate to="/products" replace /> : <Home />} /> {/* Redirect to products if logged in, else show Home */}

              {/* Protected Routes (require login) */}
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/cart-items" element={<ProtectedRoute><CartItems /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/order-items" element={<ProtectedRoute><OrderItems /></ProtectedRoute>} />

              {/* Staff and Admin Routes (require specific roles) */}
              <Route path="/inventory" element={<ProtectedRoute roles={['staff', 'admin']}><Inventory /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute roles={['staff', 'admin']}><StaffDashboard /></ProtectedRoute>} />

              {/* Admin Only Routes (require admin role) */}
              <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><ProductManagement /></ProtectedRoute>} />
              <Route path="/transaction-logs" element={<ProtectedRoute roles={['admin']}><TransactionLogs /></ProtectedRoute>} />
              <Route path="/currencies" element={<ProtectedRoute roles={['admin']}><Currencies /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
