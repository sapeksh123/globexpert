import { useState } from 'react';

export const Alert = ({ title, message, type = 'info', dismissible = true, onDismiss }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const typeClasses = {
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
    success: 'bg-green-50 text-green-800 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) return null;

  return (
    <div className={`p-4 rounded-lg ${typeClasses[type]}`}>
      <div className="flex items-start justify-between">
        <div>
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          {message && <p className="text-sm">{message}</p>}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="text-lg font-bold opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
