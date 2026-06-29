import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'error':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'info':
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <div
      className={`fixed bottom-24 left-4 right-4 md:left-auto md:right-6 max-w-md glass-panel rounded-xl p-4 border flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in ${getStyles()}`}
      role="alert"
    >
      <span className="material-symbols-outlined flex-shrink-0">{getIcon()}</span>
      <p className="font-body-md flex-1">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-on-surface-variant hover:opacity-80 transition-opacity"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
};

export default Toast;
