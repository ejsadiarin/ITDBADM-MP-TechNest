import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';
import { useAuth } from '../hooks/useAuth';

interface InventoryItem {
  inventory_id: number;
  product_id: number;
  product_name: string; // Added to display the product name
  stock_quantity: number;
  last_updated: string;
}

interface Product {
  product_id: number;
  name: string;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    product_id: 0,
    stock_quantity: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { userRole } = useAuth();

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch products:', err.message);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/inventory/${editingId}` : '/api/inventory';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save inventory item');
      }

      setNotification({ message: `Inventory item ${editingId ? 'updated' : 'added'} successfully!`, type: 'success' });
      setFormData({
        product_id: 0,
        stock_quantity: 0,
      });
      setEditingId(null);
      fetchInventory();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to save inventory item.', type: 'error' });
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.inventory_id);
    setFormData({
      product_id: item.product_id,
      stock_quantity: item.stock_quantity,
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
    setNotification(null);
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete inventory item');
      }

      setNotification({ message: 'Inventory item deleted successfully!', type: 'success' });
      fetchInventory();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to delete inventory item.', type: 'error' });
    }
  };

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading inventory...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Inventory</h2>

      {notification && (
        <div className="my-4">
          <Notification message={notification.message} type={notification.type} />
        </div>
      )}

      {editingId && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-700 rounded-lg flex items-center gap-4">
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Update Stock
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
              <th className="p-3 text-left">Inventory ID</th>
              <th className="p-3 text-left">Product Name</th>
              <th className="p-3 text-left">Stock Quantity</th>
              <th className="p-3 text-left">Last Updated</th>
              {(userRole === 'admin' || userRole === 'staff') && <th className="p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.inventory_id} className="border-b border-gray-600 last:border-b-0">
                <td className="p-3">{item.inventory_id}</td>
                <td className="p-3">{item.product_name}</td>
                <td className="p-3">{item.stock_quantity}</td>
                <td className="p-3">{new Date(item.last_updated).toLocaleString()}</td>
                {(userRole === 'admin' || userRole === 'staff') && (
                  <td className="p-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg transition-colors duration-300 mr-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg transition-colors duration-300"
                      onClick={() => handleDelete(item.inventory_id)}
                    >
                      Delete
                    </button>
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

export default Inventory;
