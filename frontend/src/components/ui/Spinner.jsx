import React from 'react';

export const Spinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-[3px]',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-transparent border-[#FF763D] ${sizes[size]}`} />
    </div>
  );
};
export default Spinner;
