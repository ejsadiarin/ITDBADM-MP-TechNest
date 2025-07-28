import React from 'react';

const Home: React.FC = () => (
  <div style={{
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #181f2a 60%, #00c6ff 180%)',
    padding: '2rem 0',
  }}>
    <div style={{
      background: 'rgba(24,31,42,0.95)',
      borderRadius: 18,
      boxShadow: '0 8px 32px #00c6ff33',
      padding: '2.5rem 2rem',
      maxWidth: 600,
      width: '90%',
      textAlign: 'center',
      marginBottom: 32,
    }}>
      <h1 style={{
        color: '#00c6ff',
        fontWeight: 800,
        fontSize: '2.5rem',
        marginBottom: 18,
        letterSpacing: 1.5,
      }}>Welcome to TechNest</h1>
      <p style={{
        color: '#b0b8c1',
        fontSize: '1.2rem',
        marginBottom: 24,
        lineHeight: 1.6,
      }}>
        Your one-stop shop for the latest gadgets and tech accessories.<br />
        Discover smartwatches, wireless earbuds, gaming peripherals, phone accessories, and home tech gear—all in one place!
      </p>
      <a href="/products" style={{
        display: 'inline-block',
        background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
        color: '#fff',
        padding: '14px 38px',
        borderRadius: 10,
        fontWeight: 700,
        fontSize: '1.1rem',
        textDecoration: 'none',
        boxShadow: '0 2px 12px #00c6ff22',
        marginTop: 10,
        transition: 'background 0.2s',
      }}>Shop Now</a>
    </div>
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 32,
      justifyContent: 'center',
      marginTop: 16,
      width: '100%',
      maxWidth: 1100,
    }}>
      <div style={{
        background: '#232b3b',
        borderRadius: 14,
        padding: '1.5rem 1.2rem',
        minWidth: 220,
        flex: 1,
        color: '#fff',
        boxShadow: '0 2px 12px #00c6ff11',
        textAlign: 'center',
      }}>
        <span role="img" aria-label="fast" style={{ fontSize: 32 }}>⚡</span>
        <h3 style={{ margin: '12px 0 6px 0', color: '#00c6ff', fontWeight: 700 }}>Fast Delivery</h3>
        <p style={{ color: '#b0b8c1', fontSize: 15 }}>Get your tech delivered quickly and reliably, right to your door.</p>
      </div>
      <div style={{
        background: '#232b3b',
        borderRadius: 14,
        padding: '1.5rem 1.2rem',
        minWidth: 220,
        flex: 1,
        color: '#fff',
        boxShadow: '0 2px 12px #00c6ff11',
        textAlign: 'center',
      }}>
        <span role="img" aria-label="secure" style={{ fontSize: 32 }}>🔒</span>
        <h3 style={{ margin: '12px 0 6px 0', color: '#00c6ff', fontWeight: 700 }}>Secure Shopping</h3>
        <p style={{ color: '#b0b8c1', fontSize: 15 }}>Shop with confidence—your data and payments are always protected.</p>
      </div>
      <div style={{
        background: '#232b3b',
        borderRadius: 14,
        padding: '1.5rem 1.2rem',
        minWidth: 220,
        flex: 1,
        color: '#fff',
        boxShadow: '0 2px 12px #00c6ff11',
        textAlign: 'center',
      }}>
        <span role="img" aria-label="support" style={{ fontSize: 32 }}>💬</span>
        <h3 style={{ margin: '12px 0 6px 0', color: '#00c6ff', fontWeight: 700 }}>24/7 Support</h3>
        <p style={{ color: '#b0b8c1', fontSize: 15 }}>Our team is here to help you anytime, anywhere.</p>
      </div>
    </div>
    <img src="/tech-banner.jpg" alt="TechNest Banner" style={{ width: '100%', maxWidth: 900, maxHeight: 320, objectFit: 'cover', borderRadius: 16, marginTop: 40, boxShadow: '0 4px 24px #00c6ff22' }} />
  </div>
);

export default Home;
