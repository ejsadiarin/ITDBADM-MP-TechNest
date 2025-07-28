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

  if (loading) return <div className="text-center mt-10 text-cyan-400 font-semibold">Loading transaction logs...</div>;
  if (error) return <Notification message={error} type="error" />;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Transaction Logs</h2>
      {logs.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No transaction logs.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-600 text-cyan-400 font-semibold">
                <th className="p-3 text-left">Log ID</th>
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Action Type</th>
                <th className="p-3 text-left">Table</th>
                <th className="p-3 text-left">Record ID</th>
                <th className="p-3 text-left">Old Value</th>
                <th className="p-3 text-left">New Value</th>
                <th className="p-3 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.log_id} className="border-b border-gray-600 last:border-b-0">
                  <td className="p-3">{log.log_id}</td>
                  <td className="p-3">{log.user_id ?? 'N/A'}</td>
                  <td className="p-3">{log.action_type}</td>
                  <td className="p-3">{log.table_name}</td>
                  <td className="p-3">{log.record_id}</td>
                  <td className="p-3">{log.old_value ?? '-'}</td>
                  <td className="p-3">{log.new_value ?? '-'}</td>
                  <td className="p-3">{new Date(log.action_timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionLogs;