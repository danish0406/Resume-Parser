import React, { useEffect } from 'react';
import Card from './Card';

export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080C10]/80 backdrop-blur-sm">
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={onClose}
      />
      <Card className={`relative z-10 max-w-2xl w-full border border-[#253746] bg-[#172330] shadow-premium ${className}`}>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#253746]">
          <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </Card>
    </div>
  );
};
export default Modal;
