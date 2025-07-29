import React, { useEffect, useState } from 'react';
import Notification from '../../components/Notification';
import { useAuth } from '../../hooks/useAuth';

interface Product {
  product_id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  image_url?: string;
  brand?: string;
  currency_id?: number;
}

interface Category {
  category_id: number;
  name: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category_id: 0,
    image_url: '',
    brand: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { userRole } = useAuth();

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch categories:', err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [products, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'category_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      setNotification({ message: `Product ${editingId ? 'updated' : 'added'} successfully!`, type: 'success' });
      setFormData({
        name: '',
        description: '',
        price: 0,
        category_id: 0,
        image_url: '',
        brand: '',
      });
      setEditingId(null);
      fetchProducts();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to save product.', type: 'error' });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.product_id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category_id: product.category_id,
      image_url: product.image_url || '',
      brand: product.brand || '',
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setNotification(null);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      setNotification({ message: 'Product deleted successfully!', type: 'success' });
      fetchProducts();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to delete product.', type: 'error' });
    }
  };

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading products...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Product Management</h2>

      {notification && (
        <div className="my-4">
          <Notification message={notification.message} type={notification.type} />
        </div>
      )}

      {(userRole === 'admin' || userRole === 'staff') && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-700 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            step="0.01"
            required
            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand (optional)"
            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            className="col-span-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: '',
                  description: '',
                  price: 0,
                  category_id: 0,
                  image_url: '',
                  brand: '',
                });
              }}
              className="col-span-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Cancel Edit
            </button>
          )}
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-600 text-cyan-400 font-semibold">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Brand</th>
              <th className="p-3 text-left">Price</th>
              {(userRole === 'admin' || userRole === 'staff') && <th className="p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.product_id} className="border-b border-gray-600 last:border-b-0">
                <td className="p-3">{product.product_id}</td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.brand}</td>
                <td className="p-3">{product.price}</td>
                {(userRole === 'admin' || userRole === 'staff') && (
                  <td className="p-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg transition-colors duration-300 mr-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    {userRole === 'admin' && (
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg transition-colors duration-300"
                        onClick={() => handleDelete(product.product_id)}
                      >
                        Delete
                      </button>
                    )}
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

export default ProductManagement;
