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
    fetch('/categories')
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
      fetch(`/categories/${editingId}`, {
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
      fetch('/categories', {
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
    fetch(`/categories/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setCategories((prev) => prev.filter((cat) => cat.id !== id));
        } else {
          setError('Failed to delete category');
        }
      })
      .catch(() => setError('Failed to delete category'));
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40, color: '#00c6ff', fontWeight: 600 }}>Loading categories...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: 32, background: '#181f2a', borderRadius: 16, color: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 28, fontWeight: 700, letterSpacing: 1, color: '#00c6ff' }}>Categories</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 36, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Category Name"
          required
          style={{ width: 220, padding: 10, borderRadius: 8, border: '1px solid #333', background: '#232b3b', color: '#fff', fontSize: 16 }}
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          style={{ width: 220, padding: 10, borderRadius: 8, border: '1px solid #333', background: '#232b3b', color: '#fff', fontSize: 16 }}
        />
        <button
          type="submit"
          style={{ background: 'linear-gradient(90deg, #00c6ff, #0072ff)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', cursor: 'pointer', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
        >
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setForm({ name: '', description: '' }); }}
            style={{ background: '#444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', cursor: 'pointer', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
          >
            Cancel
          </button>
        )}
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map((cat) => (
          <li key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#232b3b', marginBottom: 14, padding: 18, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>{cat.name}</div>
              <div style={{ fontSize: 15, color: '#b0b8c1' }}>{cat.description}</div>
            </div>
            <div>
              <button
                onClick={() => handleEdit(cat)}
                style={{ marginRight: 8, background: '#0072ff', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
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
