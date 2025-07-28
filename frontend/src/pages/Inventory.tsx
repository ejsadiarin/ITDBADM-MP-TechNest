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

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40, color: '#00c6ff', fontWeight: 600 }}>Loading inventory...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: 32, background: '#181f2a', borderRadius: 16, color: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 28, fontWeight: 700, letterSpacing: 1, color: '#00c6ff' }}>Inventory</h2>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 18 }}>No inventory items.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#232b3b', borderRadius: 10 }}>
          <thead>
            <tr style={{ color: '#00c6ff', fontWeight: 600 }}>
              <th style={{ padding: 12 }}>Inventory ID</th>
              <th style={{ padding: 12 }}>Product ID</th>
              <th style={{ padding: 12 }}>Stock Quantity</th>
              <th style={{ padding: 12 }}>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.inventory_id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: 12 }}>{item.inventory_id}</td>
                <td style={{ padding: 12 }}>{item.product_id}</td>
                <td style={{ padding: 12 }}>{item.stock_quantity}</td>
                <td style={{ padding: 12 }}>{new Date(item.last_updated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Inventory;
