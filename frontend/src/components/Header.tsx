import React from 'react';
import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';
import ProfileIcon from './ProfileIcon';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <header className={`fixed top-0 right-0 bg-gray-800 bg-opacity-80 backdrop-blur-md border-b border-cyan-500/30 shadow-lg z-10 h-16 flex items-center justify-end px-6 ${isLoggedIn ? 'left-64' : 'left-0 w-full'}`}>
      <div className="flex items-center gap-4">
        <Link to="/cart" className="text-white hover:text-cyan-400 transition-colors duration-200">
          <CartIcon />
        </Link>
        {isLoggedIn ? (
          <Link to="/profile" className="text-white hover:text-cyan-400 transition-colors duration-200">
            <ProfileIcon />
          </Link>
        ) : (
          <Link to="/login" className="text-white hover:text-cyan-400 transition-colors duration-200">
            <ProfileIcon />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;