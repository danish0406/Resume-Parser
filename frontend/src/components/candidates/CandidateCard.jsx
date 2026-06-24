import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ScoreRing from './ScoreRing';

export const CandidateCard = ({ candidate }) => {
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <Link to={`/candidates/${candidate.id}`} className="block">
      <Card onClick={() => {}} className="border-[#253746] bg-[#172330] flex flex-col gap-4 relative group">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF763D]/20 border border-[#FF763D]/30 flex items-center justify-center text-sm font-bold text-[#FF763D]">
              {getInitials(candidate.name)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-[#FF763D] transition-colors duration-200">
                {candidate.name}
              </h3>
              <p className="text-xs text-gray-400 truncate max-w-[130px]">{candidate.location || 'Remote'}</p>
            </div>
          </div>

          <ScoreRing score={candidate.score} size={48} strokeWidth={4} />
        </div>

        {candidate.skills && candidate.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {candidate.skills.slice(0, 3).map((skill, idx) => (
              <Badge key={idx} category={skill.category} className="!text-[9px] !px-2 !py-0.5">
                {skill.skill_name || skill}
              </Badge>
            ))}
            {candidate.skills.length > 3 && (
              <span className="text-[10px] text-gray-500 self-center pl-1 font-bold">
                +{candidate.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#253746] pt-3 mt-1">
          <span className="text-[10px] text-gray-500">
            {new Date(candidate.uploaded_at).toLocaleDateString()}
          </span>
          <Badge status={candidate.status}>
            {candidate.status}
          </Badge>
        </div>
      </Card>
    </Link>
  );
};
export default CandidateCard;
