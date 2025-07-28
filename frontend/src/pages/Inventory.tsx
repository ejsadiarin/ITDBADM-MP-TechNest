import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';

interface InventoryItem {
  inventory_id: number;
  product_id: number;
  stock_quantity: number;
  last_updated: string;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch inventory');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading inventory...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Inventory</h2>
      {items.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No inventory items.</div>
      ) : (
        <table className="w-full border-collapse bg-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-600 text-cyan-400 font-semibold">
              <th className="p-3 text-left">Inventory ID</th>
              <th className="p-3 text-left">Product ID</th>
              <th className="p-3 text-left">Stock Quantity</th>
              <th className="p-3 text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.inventory_id} className="border-b border-gray-600 last:border-b-0">
                <td className="p-3">{item.inventory_id}</td>
                <td className="p-3">{item.product_id}</td>
                <td className="p-3">{item.stock_quantity}</td>
                <td className="p-3">{new Date(item.last_updated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Inventory;