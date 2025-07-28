import React, { useEffect, useState } from 'react';

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
    fetch('/order-items')
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
    const url = editingId ? `/order-items/${editingId}` : '/order-items';
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
    fetch(`/order-items/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setOrderItems((prev) => prev.filter((oi) => oi.id !== id));
        } else {
          setError('Failed to delete order item');
        }
      })
      .catch(() => setError('Failed to delete order item'));
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40, color: '#00c6ff', fontWeight: 600 }}>Loading order items...</div>;
  if (error) return <div style={{ color: '#ff4d4f', textAlign: 'center', marginTop: 24 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: 32, background: '#181f2a', borderRadius: 16, color: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 28, fontWeight: 700, letterSpacing: 1, color: '#00c6ff' }}>Order Items</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 36, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <input name="order_id" value={form.order_id ?? ''} onChange={handleChange} placeholder="Order ID" type="number" required style={{ width: 120, padding: 10, borderRadius: 8, border: '1px solid #333', background: '#232b3b', color: '#fff', fontSize: 16 }} />
        <input name="product_id" value={form.product_id ?? ''} onChange={handleChange} placeholder="Product ID" type="number" required style={{ width: 120, padding: 10, borderRadius: 8, border: '1px solid #333', background: '#232b3b', color: '#fff', fontSize: 16 }} />
        <input name="quantity" value={form.quantity ?? ''} onChange={handleChange} placeholder="Quantity" type="number" required style={{ width: 120, padding: 10, borderRadius: 8, border: '1px solid #333', background: '#232b3b', color: '#fff', fontSize: 16 }} />
        <input name="price_at_purchase" value={form.price_at_purchase ?? ''} onChange={handleChange} placeholder="Price at Purchase" type="number" step="0.01" required style={{ width: 140, padding: 10, borderRadius: 8, border: '1px solid #333', background: '#232b3b', color: '#fff', fontSize: 16 }} />
        <button type="submit" style={{ background: 'linear-gradient(90deg, #00c6ff, #0072ff)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', cursor: 'pointer', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({}); }} style={{ background: '#444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', cursor: 'pointer', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>Cancel</button>
        )}
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {orderItems.map((item) => (
          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#232b3b', marginBottom: 14, padding: 18, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>Order ID: <span style={{ color: '#00c6ff' }}>{item.order_id}</span></div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>Product ID: <span style={{ color: '#00c6ff' }}>{item.product_id}</span></div>
              <div style={{ fontSize: 15, color: '#b0b8c1' }}>Quantity: {item.quantity}</div>
              <div style={{ fontSize: 15, color: '#b0b8c1' }}>Price at Purchase: ₱{Number(item.price_at_purchase).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <button onClick={() => handleEdit(item)} style={{ marginRight: 8, background: '#0072ff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>Edit</button>
              <button onClick={() => handleDelete(item.id)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderItems;
