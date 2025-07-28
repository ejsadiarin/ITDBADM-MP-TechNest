import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';

interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
}

const CartItems: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/cart-items')
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch cart items');
        setLoading(false);
      });
  }, []);

  const handleRemove = (id: number) => {
    fetch(`/api/cart-items/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setCartItems((prev) => prev.filter((item) => item.id !== id));
        } else {
          setError('Failed to remove item');
        }
      })
      .catch(() => setError('Failed to remove item'));
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40, color: '#00c6ff', fontWeight: 600 }}>Loading cart items...</div>;

  // Consistent notification for errors
  if (error) return <Notification message={error} type="error" />;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 32, background: '#181f2a', borderRadius: 16, color: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 28, fontWeight: 700, letterSpacing: 1, color: '#00c6ff' }}>Cart Items</h2>
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 18 }}>No items in cart.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cartItems.map((item) => (
            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#232b3b', marginBottom: 14, padding: 18, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 17 }}>Product ID: <span style={{ color: '#00c6ff' }}>{item.productId}</span></div>
                <div style={{ fontSize: 15, color: '#b0b8c1' }}>Quantity: {item.quantity}</div>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                style={{ background: 'linear-gradient(90deg, #00c6ff, #0072ff)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartItems;
