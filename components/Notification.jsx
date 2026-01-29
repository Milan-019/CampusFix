import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const Notification = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center p-4 rounded-xl border shadow-lg max-w-sm w-full animate-fade-in ${styles[type]}`}>
      {icons[type]}
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button onClick={onClose} className="ml-3 hover:opacity-75 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
