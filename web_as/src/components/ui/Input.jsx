import { forwardRef } from 'react';

export const Input = forwardRef(
  ({ label, error, helpText, type = 'text', className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
        <input
          ref={ref}
          type={type}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {helpText && !error && <p className="text-gray-500 text-sm mt-1">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
