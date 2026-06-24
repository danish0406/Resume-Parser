import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import MatchScoreBar from './MatchScoreBar';

export const MatchList = ({ rankings, onSelectCandidate, selectedCandidateId }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold uppercase tracking-wider text-white">Ranked Matches ({rankings.length})</h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Sorted by Score</span>
      </div>

      <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1">
        {rankings.map(rank => {
          const isSelected = selectedCandidateId === rank.candidate_id;

          return (
            <Card
              key={rank.candidate_id}
              onClick={() => onSelectCandidate(rank)}
              active={isSelected}
              className="!p-4 bg-[#172330] border-[#253746] cursor-pointer transition-all duration-200"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white group-hover:text-[#FF763D] transition-colors duration-200">
                      {rank.name}
                    </h4>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{rank.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={rank.status} className="!text-[9px] !px-2">
                      {rank.status}
                    </Badge>
                  </div>
                </div>

                <MatchScoreBar score={rank.match_score} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default MatchList;
