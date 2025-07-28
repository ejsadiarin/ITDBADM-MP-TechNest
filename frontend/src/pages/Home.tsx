import React from 'react';

const Home: React.FC = () => (
  <div className="home-page">
    <h1>Welcome to TechNest</h1>
    <p>Your one-stop shop for the latest gadgets and tech accessories. Discover smartwatches, wireless earbuds, gaming peripherals, phone accessories, and home tech gear—all in one place!</p>
    <img src="/tech-banner.jpg" alt="TechNest Banner" style={{width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 12}} />
  </div>
);

export default Home;
