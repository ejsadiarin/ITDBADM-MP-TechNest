import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import Notification from '../components/Notification';

interface CartItem {
  cart_item_id: number;
  product_id: number;
  quantity: number;
  name?: string; // Optional: for displaying product name
  price?: number; // Optional: for displaying product price
}

interface CartData {
  cart_id: number;
  items: CartItem[];
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  const fetchCart = useCallback(() => {
    if (!isLoggedIn) {
      setError('You must be logged in to view your cart.');
      setLoading(false);
      return;
    }

    fetch('/api/cart')
      .then(async res => {
        if (res.status === 404) { // Cart not found for user
          setCart({ cart_id: 0, items: [] }); // Treat as empty cart
          return null;
        } else if (!res.ok) {
          throw new Error('Failed to fetch cart');
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setCart(data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveItem = (itemId: number) => {
    fetch(`/api/cart-items/${itemId}`, { 
      method: 'DELETE',
     })
      .then(res => {
        if (res.ok) {
          fetchCart(); // Refetch cart to update the view
        } else {
          setError('Failed to remove item from cart');
        }
      })
      .catch(() => setError('Failed to remove item from cart'));
  };

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading cart...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="w-full p-4">
      <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">Your Cart</h1>
      {cart && cart.items.length > 0 ? (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {cart.items.map(item => (
            <div key={item.cart_item_id} className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between border border-gray-700">
              <div className="text-white font-semibold text-lg">
                Product ID: {item.product_id}
              </div>
              <div className="text-gray-400 text-base">
                Quantity: {item.quantity}
              </div>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                onClick={() => handleRemoveItem(item.cart_item_id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      )}
    </div>
  );
};

export default Cart;