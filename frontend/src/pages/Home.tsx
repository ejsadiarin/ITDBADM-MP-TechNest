import React from 'react';

const Home: React.FC = () => (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-cyan-400 mb-4">
        Welcome to TechNest
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8">
        Your one-stop shop for the latest gadgets and tech accessories.
      </p>
      <a href="/products" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105">
        Shop Now
      </a>
    </div>

    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <span role="img" aria-label="fast" className="text-4xl">⚡️</span>
        <h3 className="text-2xl font-bold mt-4 mb-2 text-cyan-400">Fast Delivery</h3>
        <p className="text-gray-400">Get your tech delivered quickly and reliably, right to your door.</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <span role="img" aria-label="secure" className="text-4xl">🔒</span>
        <h3 className="text-2xl font-bold mt-4 mb-2 text-cyan-400">Secure Shopping</h3>
        <p className="text-gray-400">Shop with confidence—your data and payments are always protected.</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <span role="img" aria-label="support" className="text-4xl">💬</span>
        <h3 className="text-2xl font-bold mt-4 mb-2 text-cyan-400">24/7 Support</h3>
        <p className="text-gray-400">Our team is here to help you anytime, anywhere.</p>
      </div>
    </div>
  </div>
);

export default Home;