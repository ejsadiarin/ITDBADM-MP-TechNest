import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Admin Dashboard</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/admin/users" className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
              <span className="text-cyan-400 mr-4">👤</span>
              <span className="text-lg font-semibold">User Management</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
              <span className="text-cyan-400 mr-4">📦</span>
              <span className="text-lg font-semibold">Product Management</span>
            </Link>
          </li>
          <li>
            <Link to="/inventory" className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
              <span className="text-cyan-400 mr-4">📊</span>
              <span className="text-lg font-semibold">Inventory Management</span>
            </Link>
          </li>
          <li>
            <Link to="/transaction-logs" className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
              <span className="text-cyan-400 mr-4">📜</span>
              <span className="text-lg font-semibold">Transaction Logs</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
