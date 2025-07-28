
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

const Login: React.FC = () => (
  <div className={styles['login-bg']}>
    <div className={styles['login-container']}>
      <div className={styles['login-title']}>Sign in to TechNest</div>
      <form className={styles['login-form']}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Enter your email" required autoComplete="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter your password" required autoComplete="current-password" />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className={styles['login-hint']}>
        Don't have an account? <Link to="/register" style={{ color: '#00d8ff' }}>Sign up</Link>
      </div>
    </div>
  </div>
);

export default Login;
