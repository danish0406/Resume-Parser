import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { scoreBgColor } from '../../utils/scoreColor';

export const FilePreview = ({ file, result, onReset }) => {
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <Card className="flex items-center justify-between border-[#253746] bg-[#172330]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 border border-[#253746] rounded-xl flex items-center justify-center text-[#FFA37A]">
            {file?.name.endsWith('.pdf') ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2h4v3a1 1 0 001 1h3v6H6V6z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="font-bold text-white max-w-xs truncate">{file?.name}</h4>
            <p className="text-xs text-gray-400">{formatBytes(file?.size || 0)}</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-gray-400 hover:text-white hover:bg-white/5 p-2 rounded-lg transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </Card>

      {result && (
        <Card className="border-[#253746] bg-[#172330] flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#253746] pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Parsed Profile Summary</h3>
            <div className={`px-3 py-1 rounded-full border text-xs font-extrabold flex items-center gap-2 ${scoreBgColor(result.score)}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              Quality Score: {result.score}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Candidate Name</p>
              <p className="text-sm font-semibold text-white">{result.profile?.name || result.name || 'Unknown'}</p>
            </div>
            
            {result.profile?.email && (
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Email Address</p>
                <p className="text-sm text-gray-200">{result.profile.email}</p>
              </div>
            )}

            {result.profile?.summary && (
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Professional Summary</p>
                <p className="text-xs text-gray-300 leading-relaxed italic">"{result.profile.summary}"</p>
              </div>
            )}

            {result.profile?.skills && result.profile.skills.length > 0 && (
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Identified Skills ({result.profile.skills.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.profile.skills.slice(0, 8).map((skill, idx) => (
                    <Badge key={idx} category={skill.category}>
                      {skill.skill_name || skill}
                    </Badge>
                  ))}
                  {result.profile.skills.length > 8 && (
                    <span className="text-[10px] text-gray-400 font-bold self-center">
                      +{result.profile.skills.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
export default FilePreview;
