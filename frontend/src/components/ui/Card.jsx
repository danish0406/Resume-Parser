import React from 'react';

export const Card = ({ children, className = '', active = false, onClick }) => {
  const baseStyle = 'card-premium p-6 w-full';
  const activeStyle = active ? 'border-[#FF763D] shadow-[0_0_30px_rgba(255,118,61,0.15)]' : '';
  const clickStyle = onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-[#FF763D]' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyle} ${activeStyle} ${clickStyle} ${className}`}
    >
      {children}
    </div>
  );
};
export default Card;
