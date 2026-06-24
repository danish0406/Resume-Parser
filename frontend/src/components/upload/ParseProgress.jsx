import React from 'react';

export const ParseProgress = ({ progress }) => {
  const steps = [
    { label: 'Upload', minVal: 15 },
    { label: 'Extract', minVal: 40 },
    { label: 'Analyze', minVal: 70 },
    { label: 'Done', minVal: 100 }
  ];

  return (
    <div className="w-full mt-6 bg-[#172330] border border-[#253746] p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Parsing Progress</span>
        <span className="text-sm font-bold text-[#FF763D]">{progress}%</span>
      </div>

      <div className="w-full bg-[#080C10] h-2 rounded-full overflow-hidden mb-6 border border-[#253746]">
        <div 
          className="bg-gradient-to-r from-[#FF763D] to-[#FFA37A] h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, idx) => {
          const isActive = progress >= step.minVal;
          const isCurrent = progress > (idx > 0 ? steps[idx - 1].minVal : 0) && progress < step.minVal;

          return (
            <div key={step.label} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-[#FF763D] border-[#FF763D] text-white shadow-[0_0_10px_rgba(255,118,61,0.4)]' 
                  : isCurrent 
                    ? 'border-[#FFA37A] text-[#FFA37A] animate-pulse bg-[#FFA37A]/10' 
                    : 'border-[#253746] text-gray-500 bg-[#080C10]'
              }`}>
                {isActive && progress >= 100 ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider mt-2 transition-colors duration-200 ${
                isActive ? 'text-white font-semibold' : isCurrent ? 'text-[#FFA37A]' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ParseProgress;
