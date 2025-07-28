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

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40, color: '#00c6ff', fontWeight: 600 }}>Loading currencies...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: 32, background: '#181f2a', borderRadius: 16, color: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 28, fontWeight: 700, letterSpacing: 1, color: '#00c6ff' }}>Currencies</h2>
      {currencies.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 18 }}>No currencies found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#232b3b', borderRadius: 10 }}>
          <thead>
            <tr style={{ color: '#00c6ff', fontWeight: 600 }}>
              <th style={{ padding: 12 }}>Currency ID</th>
              <th style={{ padding: 12 }}>Code</th>
              <th style={{ padding: 12 }}>Symbol</th>
              <th style={{ padding: 12 }}>Exchange Rate to USD</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map(currency => (
              <tr key={currency.currency_id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: 12 }}>{currency.currency_id}</td>
                <td style={{ padding: 12 }}>{currency.currency_code}</td>
                <td style={{ padding: 12 }}>{currency.symbol}</td>
                <td style={{ padding: 12 }}>{currency.exchange_rate_to_usd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Currencies;
