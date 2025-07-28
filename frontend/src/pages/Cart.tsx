import React, { useEffect, useState } from 'react';

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
      setCart(Array.isArray(data) ? data : []);
      setLoading(false);
    });
}, []);

  return (
    <div className="w-full p-4">
      <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">Your Cart</h1>
      {loading ? (
        <div className="text-center text-gray-400">Loading cart...</div>
      ) : cart.length === 0 ? (
        <div className="text-center text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {cart.map(item => (
            <div key={item.id} className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between border border-gray-700">
              <div className="text-white font-semibold text-lg">
                Product ID: {item.product_id}
              </div>
              <div className="text-gray-400 text-base">
                Quantity: {item.quantity}
              </div>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
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