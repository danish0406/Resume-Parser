import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import DropZone from '../components/upload/DropZone';
import ParseProgress from '../components/upload/ParseProgress';
import FilePreview from '../components/upload/FilePreview';
import useParse from '../hooks/useParse';

export const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { parseResume, loading, progress, error, result, resetParser } = useParse();

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    await parseResume(file);
  };

  const handleReset = () => {
    setSelectedFile(null);
    resetParser();
  };

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <div className="border border-[#253746] bg-[#172330] p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Upload Candidate Resume</h3>
            <p className="text-xs text-gray-400 mb-6">Drag and drop any PDF or DOCX file to analyze technical skills and credentials.</p>
            
            <DropZone onFileSelect={handleFileSelect} disabled={loading || result} />
            
            {loading && <ParseProgress progress={progress} />}
            
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          {selectedFile ? (
            <FilePreview file={selectedFile} result={result} onReset={handleReset} />
          ) : (
            <div className="border border-[#253746] bg-[#172330] p-8 rounded-2xl text-center min-h-[400px] flex flex-col items-center justify-center gap-4">
              <svg className="w-32 h-32 text-gray-700 animate-pulse" fill="none" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="orange-theme" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF763D" />
                    <stop offset="100%" stopColor="#FFA37A" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="80" stroke="#253746" strokeWidth="1" strokeDasharray="5 5" fill="none" />
                <rect x="30" y="50" width="30" height="15" rx="7.5" fill="#FF763D" fillOpacity="0.1" stroke="#FF763D" strokeWidth="1" />
                <rect x="140" y="120" width="35" height="15" rx="7.5" fill="#FFA37A" fillOpacity="0.1" stroke="#FFA37A" strokeWidth="1" />
                <rect x="70" y="60" width="60" height="80" rx="8" fill="#172330" stroke="url(#orange-theme)" strokeWidth="2" />
                <line x1="82" y1="80" x2="118" y2="80" stroke="#8A9CA8" strokeWidth="2" strokeLinecap="round" />
                <line x1="82" y1="95" x2="108" y2="95" stroke="#8A9CA8" strokeWidth="2" strokeLinecap="round" />
                <line x1="82" y1="110" x2="114" y2="110" stroke="#8A9CA8" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h3 className="text-lg font-bold text-white mt-4">No Document Loaded</h3>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                Once you select or drop a candidate's resume, the parser will extract profile sections and rate formatting quality.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
export default Upload;
