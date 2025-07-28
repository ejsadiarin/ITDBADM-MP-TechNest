import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';

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

  useEffect(() => {
    fetch('/api/currencies')
      .then(res => res.json())
      .then(data => {
        setCurrencies(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch currencies');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading currencies...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Currencies</h2>
      {currencies.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No currencies found.</div>
      ) : (
        <table className="w-full border-collapse bg-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-600 text-cyan-400 font-semibold">
              <th className="p-3 text-left">Currency ID</th>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Symbol</th>
              <th className="p-3 text-left">Exchange Rate to USD</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map(currency => (
              <tr key={currency.currency_id} className="border-b border-gray-600 last:border-b-0">
                <td className="p-3">{currency.currency_id}</td>
                <td className="p-3">{currency.currency_code}</td>
                <td className="p-3">{currency.symbol}</td>
                <td className="p-3">{currency.exchange_rate_to_usd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Currencies;