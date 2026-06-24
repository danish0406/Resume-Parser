import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import JobForm from '../components/jobs/JobForm';
import MatchList from '../components/jobs/MatchList';
import useJobMatch from '../hooks/useJobMatch';

export const JobMatch = () => {
  const { jobs, rankings, selectedJob, loading, error, fetchJobs, createJob, fetchRankings, runManualMatch } = useJobMatch();
  const [showForm, setShowForm] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [matchingCandidate, setMatchingCandidate] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreateJob = async (jobData) => {
    const res = await createJob(jobData);
    if (res.success) {
      // Fetch rankings for newly created job
      await fetchRankings(res.data.id);
      setShowForm(false);
    }
  };

  const handleSelectJob = async (jobId) => {
    await fetchRankings(jobId);
    setShowForm(false);
  };

  const handleSelectCandidate = (cand) => {
    setSelectedCandidate(cand);
  };

  const handleManualRecalculate = async () => {
    if (!selectedCandidate || !selectedJob) return;
    setMatchingCandidate(true);
    const res = await runManualMatch(selectedCandidate.candidate_id, selectedJob.id);
    setMatchingCandidate(false);
    if (res.success) {
      // Find updated candidate from rankings
      const updatedCand = rankings.find(r => r.candidate_id === selectedCandidate.candidate_id);
      if (updatedCand) {
        setSelectedCandidate(updatedCand);
      } else {
        setSelectedCandidate(null);
      }
    }
  };

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Job Description list or Form (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Quick Select Job List */}
          {jobs.length > 0 && (
            <Card className="border-[#253746] bg-[#172330] p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Select Existing Job:</span>
                {!showForm && (
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="text-xs font-bold text-[#FF763D] hover:underline"
                  >
                    + Create New
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {jobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => handleSelectJob(job.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 text-left ${
                      selectedJob?.id === job.id && !showForm
                        ? 'bg-[#FF763D]/20 border-[#FF763D] text-[#FF763D] font-semibold'
                        : 'bg-[#080C10] border-[#253746] text-gray-400 hover:text-white hover:border-[#FF763D]/30'
                    }`}
                  >
                    {job.title} ({job.company})
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Create or Show Job details */}
          {showForm ? (
            <JobForm onSubmit={handleCreateJob} loading={loading} />
          ) : (
            selectedJob && (
              <Card className="border-[#253746] bg-[#172330] flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-[#253746] pb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">{selectedJob.title}</h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">{selectedJob.company}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowForm(true)} 
                    className="!py-1.5 !px-3 border border-[#253746] text-xs hover:border-[#FF763D]/50"
                  >
                    Modify
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Required Skills</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedJob.required_skills.split(',').map((skill, idx) => (
                        <Badge key={idx} category="tool" className="!bg-white/5 !text-gray-300 border border-[#253746] !px-2.5 !py-1">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#253746] pt-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Role Description</span>
                    <p className="text-xs text-gray-300 leading-relaxed font-normal whitespace-pre-line mt-1">
                      {selectedJob.description}
                    </p>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>

        {/* Right Column: Ranked Match list (Span 7) */}
        <div className="lg:col-span-7">
          {loading && !matchingCandidate ? (
            <div className="h-[40vh] flex items-center justify-center bg-[#172330] border border-[#253746] rounded-2xl">
              <Spinner size="medium" />
            </div>
          ) : !showForm && rankings.length > 0 ? (
            <MatchList 
              rankings={rankings} 
              onSelectCandidate={handleSelectCandidate} 
              selectedCandidateId={selectedCandidate?.candidate_id} 
            />
          ) : (
            <div className="border border-[#253746] bg-[#172330] p-8 rounded-2xl text-center min-h-[400px] flex flex-col items-center justify-center gap-4">
              <svg className="w-28 h-28 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <h3 className="text-lg font-bold text-white">No Matching Context</h3>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                Create a job description or choose an existing posting on the left to see ranked candidates matching role requirements.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Match details Modal */}
      <Modal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        title={`${selectedCandidate?.name} Match Details`}
        className="max-w-xl"
      >
        {selectedCandidate && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#253746] pb-4">
              <div>
                <p className="text-xs text-gray-400 font-semibold">{selectedCandidate.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">Review status:</span>
                  <Badge status={selectedCandidate.status} className="!text-[9px] uppercase">
                    {selectedCandidate.status}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Compatibility Score</p>
                <p className="text-3xl font-extrabold text-[#FF763D] tracking-tight">{selectedCandidate.match_score}%</p>
              </div>
            </div>

            {/* Matched Skills */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Matched Skills ({selectedCandidate.matched_skills.length})
              </h4>
              {selectedCandidate.matched_skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedCandidate.matched_skills.map((skill, idx) => (
                    <span key={idx} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic mt-1">No overlapping skills found.</p>
              )}
            </div>

            {/* Missing Skills */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFA37A] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFA37A]" />
                Missing Required Skills ({selectedCandidate.missing_skills.length})
              </h4>
              {selectedCandidate.missing_skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedCandidate.missing_skills.map((skill, idx) => (
                    <span key={idx} className="bg-[#FFA37A]/10 text-[#FFA37A] border border-[#FFA37A]/20 px-2.5 py-1 rounded-xl text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-400 italic mt-1 font-semibold">Zero gaps! Candidate possesses all required skills.</p>
              )}
            </div>

            <div className="border-t border-[#253746] pt-4 mt-2 flex justify-between items-center">
              <Link to={`/candidates/${selectedCandidate.candidate_id}`}>
                <Button variant="ghost" className="text-[#FF763D] hover:underline !px-0 flex items-center gap-1">
                  View Full Candidate Profile
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                onClick={handleManualRecalculate}
                disabled={matchingCandidate}
              >
                {matchingCandidate ? 'Recalculating...' : 'Recalculate Match'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
};
export default JobMatch;
