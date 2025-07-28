import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';

interface Category {
  id: number;
  name: string;
  description?: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; description?: string }>({ name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/categories')
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
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch categories: ' + err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      fetch(`/api/categories/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((updated) => {
          setCategories((prev) => prev.map((cat) => (cat.id === editingId ? updated : cat)));
          setEditingId(null);
          setForm({ name: '', description: '' });
        })
        .catch(() => setError('Failed to update category'));
    } else {
      fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((newCat) => {
          setCategories((prev) => [...prev, newCat]);
          setForm({ name: '', description: '' });
        })
        .catch(() => setError('Failed to create category'));
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description || '' });
  };

  const handleDelete = (id: number) => {
    fetch(`/api/categories/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setCategories((prev) => prev.filter((cat) => cat.id !== id));
        } else {
          setError('Failed to delete category');
        }
      })
      .catch(() => setError('Failed to delete category'));
  };

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading categories...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Categories</h2>
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
      <ul className="list-none p-0">
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center bg-gray-700 mb-4 p-4 rounded-lg shadow-md">
            <div>
              <div className="font-semibold text-lg">{cat.name}</div>
              <div className="text-gray-400 text-base">{cat.description}</div>
            </div>
            <div>
              <button
                onClick={() => handleEdit(cat)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;