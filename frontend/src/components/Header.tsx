import React from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <header className={`fixed top-0 right-0 bg-gray-800 bg-opacity-80 backdrop-blur-md border-b border-cyan-500/30 shadow-lg z-10 h-16 flex items-center justify-end px-6 ${isLoggedIn ? 'left-64' : 'left-0 w-full'}`}>
      <div className="flex items-center gap-4">
        <Link to="/cart" className="text-white hover:text-cyan-400 transition-colors duration-200">
          <ShoppingCartIcon />
        </Link>
        {isLoggedIn ? (
          <Link to="/profile" className="text-white hover:text-cyan-400 transition-colors duration-200">
            <AccountCircleIcon />
          </Link>
        ) : (
          <>
            <Link to="/login" className="text-white hover:text-cyan-400 transition-colors duration-200 text-lg font-semibold">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-cyan-400 transition-colors duration-200 text-lg font-semibold">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;