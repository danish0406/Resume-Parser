import React from 'react';
import { scoreColor } from '../../utils/scoreColor';

export const MatchScoreBar = ({ score }) => {
  const color = scoreColor(score);

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400 font-medium">Job Compatibility</span>
        <span className="font-bold" style={{ color }}>{score}% Match</span>
      </div>
      <div className="w-full h-2 bg-[#080C10] border border-[#253746] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${score}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}60`
          }}
        />
      </div>
    </div>
  );
};
export default MatchScoreBar;
