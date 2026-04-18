import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  showStrength?: boolean;
}

export default function PasswordInput({ 
  value, 
  onChange, 
  placeholder = "••••••••", 
  label, 
  className = "",
  showStrength = false
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++; // Min 8 chars
    if (/[A-Z]/.test(pwd)) strength++; // Uppercase
    if (/[0-9]/.test(pwd)) strength++; // Numbers
    if (/[^A-Za-z0-9]/.test(pwd)) strength++; // Symbols
    return strength;
  };

  const strength = getStrength(value);
  
  const getStrengthColor = () => {
    if (strength === 0) return 'bg-slate-200';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-amber-500';
    if (strength === 3) return 'bg-indigo-500';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = () => {
    if (strength === 0) return 'Very Weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Medium';
    if (strength === 3) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all pr-12 font-medium"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      {showStrength && value.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-400">Strength: <span className={getStrengthColor().replace('bg-', 'text-')}>{getStrengthLabel()}</span></span>
            <span className="text-slate-400">{strength}/4</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={`flex-1 h-full transition-colors duration-500 ${step <= strength ? getStrengthColor() : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
