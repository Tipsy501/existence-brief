import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  to?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  to,
  type = 'button',
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-200',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const width = fullWidth ? 'w-full' : 'w-full md:w-auto';
  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`;

  if (to) {
    return (
      <motion.div whileTap={{ scale: 0.98 }} className={width}>
        <Link to={to} className={combinedClasses}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      className={combinedClasses}
      type={type}
      onClick={onClick}
      {...(props as any)}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
