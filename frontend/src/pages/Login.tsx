

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ripple, setRipple] = useState<{x: number, y: number} | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    // Simulate login delay (replace with real login logic)
    setTimeout(() => {
      setLoading(false);
      // Simulate error/success
      if (Math.random() < 0.5) {
        setError('Invalid credentials');
      } else {
        setSuccess(true);
      }
    }, 1200);
  };

  // Ripple effect for login button
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setRipple({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setTimeout(() => setRipple(null), 600);
    }
  };

  return (
    <div className={styles['login-bg']}>
      {/* Animated SVG background illustration */}
      <svg className={styles['login-bg-illustration']} width="700" height="700" viewBox="0 0 700 700" fill="none">
        <defs>
          <radialGradient id="bg1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#00d8ff88" />
            <stop offset="100%" stopColor="#23272f00" />
          </radialGradient>
        </defs>
        <circle cx="350" cy="350" r="320" fill="url(#bg1)" />
        <ellipse cx="350" cy="400" rx="180" ry="60" fill="#1de9b622" />
        <ellipse cx="350" cy="250" rx="120" ry="40" fill="#00d8ff22" />
      </svg>
      <div className={styles['login-container']}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <svg width="54" height="54" viewBox="0 0 32 32" fill="none" style={{ marginBottom: 8 }}>
            <rect x="4" y="8" width="24" height="16" rx="5" stroke="#00d8ff" strokeWidth="2.5" fill="#181a20" />
            <path d="M10 16h12" stroke="#00d8ff" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="16" r="3.5" stroke="#1de9b6" strokeWidth="2.5" fill="#23272f" />
          </svg>
          <div className={styles['login-title']}>Sign in to TechNest</div>
        </div>
        <form className={styles['login-form']} onSubmit={handleSubmit} autoComplete="on">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="Enter your email" required autoComplete="username" />
          </div>
          <div className={styles['password-input-wrapper']}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>
          <div style={{ minHeight: 32, marginBottom: 2 }}>
            {error && (
              <div className={styles['login-feedback']} data-type="error">{error}</div>
            )}
            {success && !error && (
              <div className={styles['login-feedback']} data-type="success">Login successful!</div>
            )}
          </div>
          <button
            type="submit"
            ref={buttonRef}
            disabled={loading}
            className={styles['login-btn']}
            style={{ opacity: loading ? 0.7 : 1, position: 'relative', overflow: 'hidden' }}
            onClick={handleButtonClick}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span>Signing in</span>
                <span className="spinner" style={{ width: 18, height: 18, border: '2.5px solid #00d8ff', borderTop: '2.5px solid #1de9b6', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
              </span>
            ) : 'Login'}
            {ripple && (
              <span
                className={styles['ripple']}
                style={{ left: ripple.x, top: ripple.y }}
              />
            )}
          </button>
        </form>
        <div className={styles['login-hint']}>
          Don't have an account? <Link to="/register" style={{ color: '#00d8ff' }}>Sign up</Link>
        </div>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
};

export default Login;
