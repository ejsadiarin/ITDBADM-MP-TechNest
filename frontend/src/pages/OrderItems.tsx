import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}

const OrderItems: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<OrderItem>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/order-items')
      .then(async (res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        const text = await res.text();
        if (!text) return [];
        try {
          return JSON.parse(text);
        } catch {
          throw new Error('Invalid JSON response');
        }
      })
      .then((data) => {
        setOrderItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch order items: ' + err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PATCH' : 'POST';
    const url = editingId ? `/api/order-items/${editingId}` : '/api/order-items';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((item) => {
        if (editingId) {
          setOrderItems((prev) => prev.map((oi) => (oi.id === editingId ? item : oi)));
        } else {
          setOrderItems((prev) => [...prev, item]);
        }
        setForm({});
        setEditingId(null);
      })
      .catch(() => setError('Failed to save order item'));
  };

  const handleEdit = (item: OrderItem) => {
    setEditingId(item.id);
    setForm({ ...item });
  };

  const handleDelete = (id: number) => {
    fetch(`/api/order-items/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setOrderItems((prev) => prev.filter((oi) => oi.id !== id));
        } else {
          setError('Failed to delete order item');
        }
      })
      .catch(() => setError('Failed to delete order item'));
  };

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading order items...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Order Items</h2>
      <form onSubmit={handleSubmit} className="mb-8 flex flex-wrap items-center justify-center gap-4">
        <input name="order_id" value={form.order_id ?? ''} onChange={handleChange} placeholder="Order ID" type="number" required className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <input name="product_id" value={form.product_id ?? ''} onChange={handleChange} placeholder="Product ID" type="number" required className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <input name="quantity" value={form.quantity ?? ''} onChange={handleChange} placeholder="Quantity" type="number" required className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <input name="price_at_purchase" value={form.price_at_purchase ?? ''} onChange={handleChange} placeholder="Price at Purchase" type="number" step="0.01" required className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({}); }} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Cancel</button>
        )}
      </form>
      <ul className="list-none p-0">
        {orderItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center bg-gray-700 mb-4 p-4 rounded-lg shadow-md">
            <div>
              <div className="font-semibold text-lg">Order ID: <span className="text-cyan-400">{item.order_id}</span></div>
              <div className="font-semibold text-lg">Product ID: <span className="text-cyan-400">{item.product_id}</span></div>
              <div className="text-gray-400 text-base">Quantity: {item.quantity}</div>
              <div className="text-gray-400 text-base">Price at Purchase: ₱{Number(item.price_at_purchase).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <button onClick={() => handleEdit(item)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 mr-2">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderItems;