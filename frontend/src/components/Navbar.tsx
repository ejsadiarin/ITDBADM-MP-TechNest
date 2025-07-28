import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';



const navLinks = [
  {
    to: '/',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-glow">
        <path d="M3 11.5L12 4l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V11.5z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
    label: 'Home',
  },
  {
    to: '/products',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-glow">
        <path d="M6 2l1.5 4.5h9L18 2" />
        <rect x="3" y="7" width="18" height="13" rx="2" />
      </svg>
    ),
    label: 'Products',
  },
  {
    to: '/cart',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-glow">
        <circle cx="9" cy="21" r="1.5" />
        <circle cx="19" cy="21" r="1.5" />
        <path d="M5 6h2l1.68 9.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L21 8H7" />
      </svg>
    ),
    label: 'Cart',
  },
  {
    to: '/orders',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-glow">
        <rect x="1" y="7" width="22" height="13" rx="2" />
        <path d="M3 7l4-4h10l4 4" />
        <path d="M16 13h2v2h-2z" />
        <path d="M6 13h2v2H6z" />
      </svg>
    ),
    label: 'Orders',
  },
  {
    to: '/login',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-glow">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="2" />
      </svg>
    ),
    label: 'Login',
  },
  {
    to: '/cart-items',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-glow">
        <path d="M6 9l6 6 6-6" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
    label: 'Cart Items',
  },
  {
    to: '/categories',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-glow">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
        <path d="M7 10h10" />
      </svg>
    ),
    label: 'Categories',
  },
  {
    to: '/order-items',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-glow">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        <path d="M12 12v4" />
        <path d="M10 16h4" />
      </svg>
    ),
    label: 'Order Items',
  },
  {
    to: '/inventory',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-glow">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
        <path d="M7 10h10" />
      </svg>
    ),
    label: 'Inventory',
  },
  {
    to: '/transaction-logs',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-glow">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 7h6" />
        <path d="M9 11h6" />
        <path d="M9 15h4" />
      </svg>
    ),
    label: 'Transaction Logs',
  },
  {
    to: '/currencies',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon-glow">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    ),
    label: 'Currencies',
  },
];


const Navbar: React.FC = () => {
  const location = useLocation();
  // Check for auth token (customize if you use a different key)
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  // Only show Login (and optionally Register) if not logged in
  const filteredLinks = isLoggedIn
    ? navLinks.filter(link => link.to !== '/login')
    : navLinks.filter(link => link.to === '/login' || link.to === '/' || link.to === '/products');

  return (
    <nav className="navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'linear-gradient(90deg, #23272f 80%, #00c6ff 180%)',
      boxShadow: '0 2px 16px #00c6ff11',
      padding: '1rem 2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 64,
    }}>
      <Link to="/" className="navbar-logo" style={{
        fontSize: '2rem',
        fontWeight: 900,
        letterSpacing: 2.5,
        color: '#00d8ff',
        textDecoration: 'none',
        textShadow: '0 2px 8px #00c6ff22',
        transition: 'color 0.18s',
      }}>TechNest</Link>
      <ul className="navbar-links" style={{
        display: 'flex',
        gap: '1.7rem',
        margin: 0,
        padding: 0,
        alignItems: 'center',
        listStyle: 'none',
      }}>
        {filteredLinks.map(link => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={location.pathname === link.to ? 'active-nav-link' : ''}
              tabIndex={0}
              title={link.label}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}
            >
              {link.icon}
            </Link>
          </li>
        ))}
        {isLoggedIn && (
          <li style={{ marginLeft: 18 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00c6ff 60%, #23272f 180%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 20,
              boxShadow: '0 2px 8px #00c6ff22',
              border: '2px solid #00c6ff',
              cursor: 'pointer',
              userSelect: 'none',
            }}>
              <span role="img" aria-label="user">👤</span>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
