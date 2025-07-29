import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';
import { useAuth } from '../hooks/useAuth';

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
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [formData, setFormData] = useState<Partial<Order>>({
    status: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { isLoggedIn, isLoading: authLoading, userRole } = useAuth();

  const fetchOrders = async () => {
    if (authLoading) {
      return; // Wait for authentication status to be determined
    }

    if (!isLoggedIn) {
      setLoading(false);
      setError('You must be logged in to view orders.');
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        credentials: 'include', // Send cookies with the request
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isLoggedIn, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    try {
      const response = await fetch(`/api/orders/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order');
      }

      setNotification({ message: 'Order updated successfully!', type: 'success' });
      setEditingId(null);
      setFormData({ status: '' });
      fetchOrders();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to update order.', type: 'error' });
    }
  };

  const handleEdit = (order: Order) => {
    setEditingId(order.order_id);
    setFormData({ status: order.status });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    setNotification(null);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete order');
      }

      setNotification({ message: 'Order deleted successfully!', type: 'success' });
      fetchOrders();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to delete order.', type: 'error' });
    }
  };

  if (loading || authLoading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading orders...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Order Management</h2>

      {notification && (
        <div className="my-4">
          <Notification message={notification.message} type={notification.type} />
        </div>
      )}

      {editingId && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-700 rounded-lg flex items-center gap-4">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Update Order
          </button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-600 text-cyan-400 font-semibold">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Shipping Address</th>
              {(userRole === 'admin' || userRole === 'staff') && <th className="p-3 text-left">Actions</th>}
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
                {(userRole === 'admin' || userRole === 'staff') && (
                  <td className="p-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg transition-colors duration-300 mr-2"
                      onClick={() => handleEdit(order)}
                    >
                      Edit
                    </button>
                    {userRole === 'admin' && (
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg transition-colors duration-300"
                        onClick={() => handleDelete(order.order_id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
