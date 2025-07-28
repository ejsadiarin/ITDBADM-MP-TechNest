import React, { useEffect, useState } from 'react';
import styles from './Login.module.css';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  // Add more fields as needed from your backend
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Cart</h1>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#00d8ff' }}>Loading cart...</div>
      ) : cart.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#b0b3b8' }}>Your cart is empty.</div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          maxWidth: 600,
          margin: '0 auto',
        }}>
          {cart.map(item => (
            <div key={item.id} style={{
              background: 'linear-gradient(135deg, #23272f 80%, #1de9b6 180%)',
              borderRadius: 18,
              boxShadow: '0 4px 24px #00d8ff22',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid #00d8ff33',
              justifyContent: 'space-between',
            }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>
                Product ID: {item.product_id}
              </div>
              <div style={{ color: '#b0b3b8', fontSize: '1rem' }}>
                Quantity: {item.quantity}
              </div>
              <button
                style={{ minWidth: 100 }}
                onClick={async () => {
                  await fetch(`/api/cart/${item.id}`, { method: 'DELETE' });
                  setCart(cart.filter(ci => ci.id !== item.id));
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
