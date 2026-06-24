import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import CandidateCard from '../components/candidates/CandidateCard';
import CandidateTable from '../components/candidates/CandidateTable';
import Spinner from '../components/ui/Spinner';
import useCandidates from '../hooks/useCandidates';

export const Candidates = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedScoreRange, setSelectedScoreRange] = useState('');
  
  const { candidates, loading, fetchCandidates } = useCandidates();

  useEffect(() => {
    const filters = {};
    if (search) filters.search = search;
    if (selectedStatus) filters.status = selectedStatus;
    if (selectedScoreRange) {
      if (selectedScoreRange === 'high') {
        filters.minScore = 80;
      } else if (selectedScoreRange === 'mid') {
        filters.minScore = 60;
        filters.maxScore = 79;
      } else if (selectedScoreRange === 'low') {
        filters.maxScore = 59;
      }
    }
    fetchCandidates(filters);
  }, [search, selectedStatus, selectedScoreRange, fetchCandidates]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedStatus('');
    setSelectedScoreRange('');
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-[#253746] pb-6">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name, email, or keywords..."
              className="w-full bg-[#172330] border border-[#253746] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF763D] transition-colors duration-200"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[#172330] border border-[#253746] rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none ${
                  viewMode === 'grid' 
                    ? 'bg-[#FF763D] text-white shadow-[0_0_10px_rgba(255,118,61,0.3)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none ${
                  viewMode === 'table' 
                    ? 'bg-[#FF763D] text-white shadow-[0_0_10px_rgba(255,118,61,0.3)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-[#172330]/40 border border-[#253746] p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Status:</span>
            {['new', 'shortlisted', 'rejected', 'interview'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(selectedStatus === status ? '' : status)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all duration-200 focus:outline-none ${
                  selectedStatus === status
                    ? 'bg-[#FF763D] border-[#FF763D] text-white shadow-[0_0_8px_rgba(255,118,61,0.4)]'
                    : 'bg-[#172330] border-[#253746] text-gray-400 hover:text-white hover:border-[#FF763D]/40'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:border-l md:border-[#253746] md:pl-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Score Tier:</span>
            {[
              { label: 'High (80+)', value: 'high' },
              { label: 'Mid (60-79)', value: 'mid' },
              { label: 'Low (<60)', value: 'low' }
            ].map(tier => (
              <button
                key={tier.value}
                onClick={() => setSelectedScoreRange(selectedScoreRange === tier.value ? '' : tier.value)}
                className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all duration-200 focus:outline-none ${
                  selectedScoreRange === tier.value
                    ? 'bg-[#FFA37A] border-[#FFA37A] text-white shadow-[0_0_8px_rgba(255,163,122,0.4)]'
                    : 'bg-[#172330] border-[#253746] text-gray-400 hover:text-white hover:border-[#FFA37A]/40'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>

          {(search || selectedStatus || selectedScoreRange) && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#FFA37A] hover:underline font-bold tracking-wider uppercase ml-auto"
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="h-[40vh] flex items-center justify-center">
            <Spinner size="medium" />
          </div>
        ) : candidates.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {candidates.map(candidate => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          ) : (
            <CandidateTable candidates={candidates} />
          )
        ) : (
          <div className="border border-[#253746] bg-[#172330] p-12 rounded-2xl text-center min-h-[300px] flex flex-col items-center justify-center gap-4">
            <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-bold text-white">No Candidates Found</h3>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              No matching records found. Try modifying your search criteria or filter tags.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
export default Candidates;
