import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  key?: React.Key;
}

export default function Card({
  children,
  title,
  className = '',
  padding = 'md',
  ...props
}: CardProps) {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-12',
  };

  return (
    <div 
      className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow transition-all duration-300 ${className}`}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
      )}
      <div className={paddings[padding]}>
        {children}
      </div>
    </div>
  );
}
