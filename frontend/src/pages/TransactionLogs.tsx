import React, { useEffect, useState } from 'react';
import Notification from '../components/Notification';

interface TransactionLog {
  log_id: number;
  user_id: number | null;
  action_type: string;
  table_name: string;
  record_id: number;
  old_value: string | null;
  new_value: string | null;
  action_timestamp: string;
}

const TransactionLogs: React.FC = () => {
  const [logs, setLogs] = useState<TransactionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/transaction-logs')
      .then(res => res.json())
      .then(data => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch transaction logs');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40, color: '#00c6ff', fontWeight: 600 }}>Loading transaction logs...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: 32, background: '#181f2a', borderRadius: 16, color: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 28, fontWeight: 700, letterSpacing: 1, color: '#00c6ff' }}>Transaction Logs</h2>
      {logs.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 18 }}>No transaction logs.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#232b3b', borderRadius: 10 }}>
          <thead>
            <tr style={{ color: '#00c6ff', fontWeight: 600 }}>
              <th style={{ padding: 12 }}>Log ID</th>
              <th style={{ padding: 12 }}>User ID</th>
              <th style={{ padding: 12 }}>Action Type</th>
              <th style={{ padding: 12 }}>Table</th>
              <th style={{ padding: 12 }}>Record ID</th>
              <th style={{ padding: 12 }}>Old Value</th>
              <th style={{ padding: 12 }}>New Value</th>
              <th style={{ padding: 12 }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.log_id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: 12 }}>{log.log_id}</td>
                <td style={{ padding: 12 }}>{log.user_id ?? 'N/A'}</td>
                <td style={{ padding: 12 }}>{log.action_type}</td>
                <td style={{ padding: 12 }}>{log.table_name}</td>
                <td style={{ padding: 12 }}>{log.record_id}</td>
                <td style={{ padding: 12 }}>{log.old_value ?? '-'}</td>
                <td style={{ padding: 12 }}>{log.new_value ?? '-'}</td>
                <td style={{ padding: 12 }}>{new Date(log.action_timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionLogs;
