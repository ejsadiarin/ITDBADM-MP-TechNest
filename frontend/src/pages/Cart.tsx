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
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fetchCart = useCallback(() => {
    if (authLoading) {
      return; // Wait for authentication status to be determined
    }

    if (!isLoggedIn) {
      setError('You must be logged in to view your cart.');
      setLoading(false);
      return;
    }

    fetch('/api/cart', {
      credentials: 'include', // Send cookies with the request
    })
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
  }, [isLoggedIn, authLoading]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveItem = (itemId: number) => {
    fetch(`/api/cart-items/${itemId}`, {
      method: 'DELETE',
      credentials: 'include', // Send cookies with the request
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

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      setNotification({ message: 'Your cart is empty.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipping_address: '123 Mock Address, Mock City' }), // Mock address
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      setNotification({ message: 'Checkout successful! Your order has been placed.', type: 'success' });
      setCart({ cart_id: cart.cart_id, items: [] }); // Clear cart after successful checkout
    } catch (err: any) {
      setNotification({ message: err.message || 'Checkout failed.', type: 'error' });
    }
  };

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading cart...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="w-full p-4">
      <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">Your Cart</h1>
      {notification && (
        <div className="my-4">
          <Notification message={notification.message} type={notification.type} />
        </div>
      )}
      {cart && cart.items.length > 0 ? (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {cart.items.map(item => (
            <div key={item.cart_item_id} className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between border border-gray-700">
              <div className="text-white font-semibold text-lg">
                Product: {item.name}
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

      {cart && cart.items.length > 0 && (
        <div className="text-center mt-8">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
