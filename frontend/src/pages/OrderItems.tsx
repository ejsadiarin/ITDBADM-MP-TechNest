import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';
import { useAuth } from '../hooks/useAuth';

interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}

const OrderItems: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [formData, setFormData] = useState<Partial<OrderItem>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const { userRole } = useAuth();

  const fetchOrderItems = async () => {
    try {
      const response = await fetch('/api/order-items', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch order items');
      }
      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      setOrderItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError('Failed to fetch order items: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderItems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/order-items/${editingId}` : '/api/order-items';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save order item');
      }

      setNotification({ message: `Order item ${editingId ? 'updated' : 'added'} successfully!`, type: 'success' });
      setFormData({});
      setEditingId(null);
      fetchOrderItems();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to save order item.', type: 'error' });
    }
  };

  const handleEdit = (item: OrderItem) => {
    setEditingId(item.order_item_id);
    setFormData({ ...item });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this order item?')) return;
    setNotification(null);
    try {
      const response = await fetch(`/api/order-items/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete order item');
      }

      setNotification({ message: 'Order item deleted successfully!', type: 'success' });
      fetchOrderItems();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to delete order item.', type: 'error' });
    }
  };

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading order items...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Order Items</h2>

      {notification && (
        <div className="my-4">
          <Notification message={notification.message} type={notification.type} />
        </div>
      )}

      {(userRole === 'admin' || userRole === 'staff') && (
        <form onSubmit={handleSubmit} className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <input name="order_id" value={formData.order_id ?? ''} onChange={handleChange} placeholder="Order ID" type="number" required className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <input name="product_id" value={formData.product_id ?? ''} onChange={handleChange} placeholder="Product ID" type="number" required className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <input name="quantity" value={formData.quantity ?? ''} onChange={handleChange} placeholder="Quantity" type="number" required className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <input name="price_at_purchase" value={formData.price_at_purchase ?? ''} onChange={handleChange} placeholder="Price at Purchase" type="number" step="0.01" required className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">{editingId ? 'Update' : 'Add'}</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({}); }} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Cancel</button>
          )}
        </form>
      )}

      <ul className="list-none p-0">
        {orderItems.map((item) => (
          <li key={item.order_item_id} className="flex justify-between items-center bg-gray-700 mb-4 p-4 rounded-lg shadow-md">
            <div>
              <div className="font-semibold text-lg">Order ID: <span className="text-cyan-400">{item.order_id}</span></div>
              <div className="font-semibold text-lg">Product ID: <span className="text-cyan-400">{item.product_id}</span></div>
              <div className="text-gray-400 text-base">Quantity: {item.quantity}</div>
              <div className="text-gray-400 text-base">Price at Purchase: ₱{Number(item.price_at_purchase).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            {(userRole === 'admin' || userRole === 'staff') && (
              <div>
                <button onClick={() => handleEdit(item)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 mr-2">Edit</button>
                <button onClick={() => handleDelete(item.order_item_id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderItems;
