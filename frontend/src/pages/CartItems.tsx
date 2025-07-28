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
        setCartItems(Array.isArray(data) ? data : []);
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

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading cart items...</div>;

  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Cart Items</h2>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No items in cart.</div>
      ) : (
        <ul className="list-none p-0">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between items-center bg-gray-700 mb-4 p-4 rounded-lg shadow-md">
              <div>
                <div className="font-semibold text-lg">Product ID: <span className="text-cyan-400">{item.productId}</span></div>
                <div className="text-gray-400 text-base">Quantity: {item.quantity}</div>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
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