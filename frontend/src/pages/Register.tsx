import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

const Register: React.FC = () => (
  <div className={styles['login-bg']}>
    <div className={styles['login-container']}>
      <div className={styles['login-title']}>Create your TechNest Account</div>
      <form className={styles['login-form']}>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" placeholder="Enter your username" required autoComplete="username" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Enter your email" required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Create a password" required autoComplete="new-password" />
        </div>
        <div>
          <label htmlFor="first_name">First Name <span style={{color:'#b0b3b8', fontWeight:400}}>(optional)</span></label>
          <input id="first_name" type="text" placeholder="Enter your first name" autoComplete="given-name" />
        </div>
        <div>
          <label htmlFor="last_name">Last Name <span style={{color:'#b0b3b8', fontWeight:400}}>(optional)</span></label>
          <input id="last_name" type="text" placeholder="Enter your last name" autoComplete="family-name" />
        </div>
        <div>
          <label htmlFor="address">Address <span style={{color:'#b0b3b8', fontWeight:400}}>(optional)</span></label>
          <input id="address" type="text" placeholder="Enter your address" autoComplete="street-address" />
        </div>
        <div>
          <label htmlFor="phone_number">Phone Number <span style={{color:'#b0b3b8', fontWeight:400}}>(optional)</span></label>
          <input id="phone_number" type="tel" placeholder="Enter your phone number" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select id="role" required defaultValue="user">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      <div className={styles['login-hint']}>
        Already have an account? <Link to="/login" style={{ color: '#00d8ff' }}>Sign in</Link>
      </div>
    </div>
  </div>
);

export default Register;
