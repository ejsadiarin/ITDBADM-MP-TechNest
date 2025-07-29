import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArticleIcon from '@mui/icons-material/Article';
import WorkIcon from '@mui/icons-material/Work';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { userRole } = useAuth();

  let links: { to: string; label: string; icon: React.ReactNode }[] = [];

  if (userRole === 'admin') {
    links = [
      { to: '/admin', label: 'Admin Dashboard', icon: <DashboardIcon /> },
      { to: '/admin/users', label: 'User Management', icon: <PeopleIcon /> },
      { to: '/admin/products', label: 'Product Management', icon: <SettingsIcon /> },
      { to: '/inventory', label: 'Inventory Management', icon: <InventoryIcon /> },
      { to: '/currencies', label: 'Currencies', icon: <AttachMoneyIcon /> },
      { to: '/orders', label: 'Order Management', icon: <ReceiptIcon /> },
      { to: '/transaction-logs', label: 'Transaction Logs', icon: <ArticleIcon /> },
    ];
  } else if (userRole === 'staff') {
    links = [
      { to: '/staff', label: 'Staff Dashboard', icon: <WorkIcon /> },
      { to: '/inventory', label: 'Inventory Management', icon: <InventoryIcon /> },
      { to: '/orders', label: 'Order Management', icon: <ReceiptIcon /> },
    ];
  } else if (userRole === 'customer') {
    links = [
      { to: '/products', label: 'Products', icon: <StoreIcon /> },
      { to: '/orders', label: 'Orders', icon: <ShoppingBasketIcon /> },
    ];
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
