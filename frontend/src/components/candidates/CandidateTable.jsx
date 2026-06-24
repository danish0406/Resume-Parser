import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import ScoreRing from './ScoreRing';

export const CandidateTable = ({ candidates }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#253746] bg-[#172330]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#253746] bg-[#080C10]/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Location</th>
            <th className="p-4">Top Skills</th>
            <th className="p-4 text-center">Score</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#253746]">
          {candidates.map((cand, idx) => (
            <tr 
              key={cand.id} 
              className={`hover:bg-[#FF763D]/5 transition-colors duration-150 ${
                idx % 2 === 0 ? 'bg-transparent' : 'bg-[#253746]/20'
              }`}
            >
              <td className="p-4 font-bold text-white">
                <Link to={`/candidates/${cand.id}`} className="hover:text-[#FF763D] transition-colors duration-200">
                  {cand.name}
                </Link>
              </td>
              <td className="p-4 text-sm text-gray-300">{cand.email || 'N/A'}</td>
              <td className="p-4 text-sm text-gray-400">{cand.location || 'Remote'}</td>
              <td className="p-4">
                {cand.skills && cand.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {cand.skills.slice(0, 3).map((skill, sIdx) => (
                      <Badge key={sIdx} category={skill.category} className="!text-[9px] !px-2 !py-0.5">
                        {skill.skill_name || skill}
                      </Badge>
                    ))}
                    {cand.skills.length > 3 && (
                      <span className="text-[10px] text-gray-500 font-bold self-center">
                        +{cand.skills.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-gray-600">None</span>
                )}
              </td>
              <td className="p-4">
                <div className="flex justify-center">
                  <ScoreRing score={cand.score} size={40} strokeWidth={3} />
                </div>
              </td>
              <td className="p-4 text-center">
                <Badge status={cand.status}>
                  {cand.status}
                </Badge>
              </td>
              <td className="p-4 text-center">
                <Link 
                  to={`/candidates/${cand.id}`}
                  className="text-xs font-bold text-[#FF763D] hover:text-white bg-[#FF763D]/10 hover:bg-[#FF763D] border border-[#FF763D]/30 rounded-lg px-3 py-1.5 transition-all duration-200"
                >
                  View Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CandidateTable;
