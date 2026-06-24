import React, { useState, useRef } from 'react';

export const DropZone = ({ onFileSelect, disabled }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndProcess(file);
    }
  };

  const handleFileInput = (e) => {
    if (disabled) return;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndProcess(file);
    }
  };

  const validateAndProcess = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      alert('Only PDF and DOCX files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }
    onFileSelect(file);
  };

  const triggerFileInput = () => {
    if (disabled) return;
    fileInputRef.current.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={triggerFileInput}
      className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
        isDragActive 
          ? 'border-[#FF763D] bg-[#FF763D]/10 pulse-border-drag scale-[0.99]' 
          : 'border-[#253746] bg-[#172330] hover:border-[#FF763D]/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
      <div className="w-16 h-16 rounded-full bg-[#FF763D]/10 border border-[#FF763D]/20 flex items-center justify-center text-[#FF763D] mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Drag & Drop Resume</h3>
      <p className="text-sm text-gray-400 mb-6">Supported Formats: PDF, DOCX (Max 5MB)</p>
      <button 
        type="button" 
        className="px-4 py-2 bg-[#FF763D]/20 border border-[#FF763D]/40 hover:bg-[#FF763D]/35 text-[#FF763D] rounded-xl text-sm font-semibold transition-colors duration-200"
        disabled={disabled}
      >
        Browse Files
      </button>
    </div>
  );
};
export default DropZone;
