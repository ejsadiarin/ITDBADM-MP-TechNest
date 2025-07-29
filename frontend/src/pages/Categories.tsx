import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';
import { useAuth } from '../hooks/useAuth';

interface Category {
  category_id: number;
  name: string;
  description?: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [form, setForm] = useState<Partial<Category>>({ name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { userRole } = useAuth();

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError('Failed to fetch categories: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save category');
      }

      setNotification({ message: `Category ${editingId ? 'updated' : 'added'} successfully!`, type: 'success' });
      setForm({ name: '', description: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to save category.', type: 'error' });
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.category_id);
    setForm({ name: cat.name, description: cat.description || '' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setNotification(null);
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      setNotification({ message: 'Category deleted successfully!', type: 'success' });
      fetchCategories();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to delete category.', type: 'error' });
    }
  };

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading categories...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Categories</h2>

      {notification && (
        <div className="my-4">
          <Notification message={notification.message} type={notification.type} />
        </div>
      )}

      {(userRole === 'admin' || userRole === 'staff') && (
        <form onSubmit={handleSubmit} className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Category Name"
            required
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setForm({ name: '', description: '' }); }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Cancel
            </button>
          )}
        </form>
      )}

      <ul className="list-none p-0">
        {categories.map((cat) => (
          <li key={cat.category_id} className="flex justify-between items-center bg-gray-700 mb-4 p-4 rounded-lg shadow-md">
            <div>
              <div className="font-semibold text-lg">{cat.name}</div>
              <div className="text-gray-400 text-base">{cat.description}</div>
            </div>
            {(userRole === 'admin' || userRole === 'staff') && (
              <div>
                <button
                  onClick={() => handleEdit(cat)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 mr-2"
                >
                  Edit
                </button>
                {userRole === 'admin' && (
                  <button
                    onClick={() => handleDelete(cat.category_id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;