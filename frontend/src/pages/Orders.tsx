import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';

interface Order {
  order_id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  currency_id: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch orders');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading orders...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No orders found.</div>
      ) : (
        <table className="w-full border-collapse bg-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-600 text-cyan-400 font-semibold">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Shipping Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id} className="border-b border-gray-600 last:border-b-0">
                <td className="p-3">{order.order_id}</td>
                <td className="p-3">{new Date(order.order_date).toLocaleDateString()}</td>
                <td className="p-3">${Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="p-3">{order.status}</td>
                <td className="p-3">{order.shipping_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;