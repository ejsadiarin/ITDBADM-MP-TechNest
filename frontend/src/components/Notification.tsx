import React from 'react';

interface NotificationProps {
  message: string;
  type?: 'error' | 'success' | 'info';
}

const colors = {
  error: '#ff4d4f',
  success: '#52c41a',
  info: '#1890ff',
};

const Notification: React.FC<NotificationProps> = ({ message, type = 'info' }) => (
  <div
    style={{
      background: colors[type],
      color: '#fff',
      padding: '12px 20px',
      borderRadius: 8,
      margin: '16px 0',
      textAlign: 'center',
      fontWeight: 500,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      letterSpacing: 0.5,
    }}
  >
    {message}
  </div>
);

export default Notification;
