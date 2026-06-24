import React from 'react';

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = 'px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080C10] disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#FF763D] hover:bg-[#E05B22] text-white focus:ring-[#FF763D] shadow-[0_4px_14px_rgba(255,118,61,0.3)] hover:shadow-[0_6px_20px_rgba(255,118,61,0.4)]',
    secondary: 'bg-transparent border border-[#FFA37A] text-[#FFA37A] hover:bg-[#FFA37A]/10 focus:ring-[#FFA37A]',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-[0_4px_14px_rgba(239,68,68,0.3)]',
    ghost: 'bg-transparent text-textMuted hover:text-white hover:bg-white/5 focus:ring-white/20'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
