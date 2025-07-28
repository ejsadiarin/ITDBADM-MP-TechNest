import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/orders', label: 'Orders', icon: '🧾' },
  { to: '/cart', label: 'Cart', icon: '🛒' },
  { to: '/categories', label: 'Categories', icon: '🏷️' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

const adminNavLinks = [
  { to: '/admin', label: 'Admin Dashboard', icon: '👑' },
  { to: '/admin/users', label: 'User Management', icon: '👥' },
  { to: '/admin/products', label: 'Product Management', icon: '⚙️' },
  { to: '/transaction-logs', label: 'Transaction Logs', icon: '📜' },
  { to: '/currencies', label: 'Currencies', icon: '💰' },
];

const staffNavLinks = [
  { to: '/staff', label: 'Staff Dashboard', icon: '👷' },
  { to: '/inventory', label: 'Inventory Management', icon: '📦' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { userRole } = useAuth();

  let links = [...navLinks]; // Start with common links

  if (userRole === 'admin') {
    links = [...links, ...adminNavLinks, ...staffNavLinks];
  } else if (userRole === 'staff') {
    links = [...links, ...staffNavLinks];
  }

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-cyan-500/30 z-20">
      <div className="p-4">
        <Link to="/" className="text-2xl font-bold text-white">TechNest</Link>
      </div>
      <ul className="mt-4">
        {links.map(link => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 text-lg transition-colors duration-200 ${location.pathname === link.to ? 'bg-cyan-500/20 text-cyan-400 border-r-4 border-cyan-400' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}>
              <span className="text-2xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
