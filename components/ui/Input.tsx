import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>}
      <input 
        className={twMerge(
          "w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-shadow placeholder:text-gray-400 text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
};