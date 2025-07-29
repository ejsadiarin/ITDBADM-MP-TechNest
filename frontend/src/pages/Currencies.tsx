import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';
import { useAuth } from '../hooks/useAuth';

interface Currency {
  currency_id: number;
  currency_code: string;
  symbol: string;
  exchange_rate_to_usd: number;
}

const Currencies: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [formData, setFormData] = useState<Partial<Currency>>({
    currency_code: '',
    symbol: '',
    exchange_rate_to_usd: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { userRole } = useAuth();

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('/api/currencies', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch currencies');
      }
      const data = await response.json();
      setCurrencies(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'exchange_rate_to_usd' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/currencies/${editingId}` : '/api/currencies';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save currency');
      }

      setNotification({ message: `Currency ${editingId ? 'updated' : 'added'} successfully!`, type: 'success' });
      setFormData({
        currency_code: '',
        symbol: '',
        exchange_rate_to_usd: 0,
      });
      setEditingId(null);
      fetchCurrencies();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to save currency.', type: 'error' });
    }
  };

  const handleEdit = (currency: Currency) => {
    setEditingId(currency.currency_id);
    setFormData({
      currency_code: currency.currency_code,
      symbol: currency.symbol,
      exchange_rate_to_usd: currency.exchange_rate_to_usd,
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this currency?')) return;
    setNotification(null);
    try {
      const response = await fetch(`/api/currencies/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete currency');
      }

      setNotification({ message: 'Currency deleted successfully!', type: 'success' });
      fetchCurrencies();
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to delete currency.', type: 'error' });
    }
  };

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading currencies...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Currencies</h2>

      {notification && (
        <div className="my-4">
          <Notification message={notification.message} type={notification.type} />
        </div>
      )}

      {userRole === 'admin' && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-700 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="currency_code"
            value={formData.currency_code}
            onChange={handleChange}
            placeholder="Currency Code (e.g., USD)"
            required
            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            placeholder="Symbol (e.g., $)"
            required
            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            name="exchange_rate_to_usd"
            value={formData.exchange_rate_to_usd}
            onChange={handleChange}
            placeholder="Exchange Rate to USD"
            type="number"
            step="0.0001"
            required
            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            className="col-span-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            {editingId ? 'Update Currency' : 'Add Currency'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  currency_code: '',
                  symbol: '',
                  exchange_rate_to_usd: 0,
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
              <th className="p-3 text-left">Currency ID</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Symbol</th>
              <th className="p-3 text-left">Exchange Rate to USD</th>
              {userRole === 'admin' && <th className="p-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currencies.map(currency => (
              <tr key={currency.currency_id} className="border-b border-gray-600 last:border-b-0">
                <td className="p-3">{currency.currency_id}</td>
                <td className="p-3">{currency.currency_code}</td>
                <td className="p-3">{currency.symbol}</td>
                <td className="p-3">{currency.exchange_rate_to_usd}</td>
                {userRole === 'admin' && (
                  <td className="p-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg transition-colors duration-300 mr-2"
                      onClick={() => handleEdit(currency)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg transition-colors duration-300"
                      onClick={() => handleDelete(currency.currency_id)}
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

export default Currencies;