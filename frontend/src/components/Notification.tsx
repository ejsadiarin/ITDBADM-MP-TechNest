import React from 'react';

interface NotificationProps {
  message: string;
  type?: 'error' | 'success' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, type = 'info' }) => {
  let bgColor = 'bg-blue-500';
  let textColor = 'text-white';

  if (type === 'error') {
    bgColor = 'bg-red-500';
  } else if (type === 'success') {
    bgColor = 'bg-green-500';
  }

  return (
    <div
      className={`p-3 rounded-lg text-center font-medium ${bgColor} ${textColor}`}
    >
      {message}
    </div>
  );
};

export default Notification;