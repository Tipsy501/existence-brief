import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  className?: string;
  required?: boolean;
  maxLength?: number;
  value?: string | number | string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  multiline = false,
  className = '',
  icon,
  ...props
}: InputProps) {
  const inputStyles = `
    w-full ${icon ? 'pl-11 pr-4' : 'px-4'} py-3 bg-white border rounded-lg text-slate-900 placeholder:text-slate-400
    transition-all duration-200 outline-none
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
      : 'border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
    }
  `;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
        {multiline ? (
          <textarea
            className={`${inputStyles} min-h-[120px] resize-none leading-relaxed`}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={inputStyles}
            {...props}
          />
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-red-500 text-xs mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
