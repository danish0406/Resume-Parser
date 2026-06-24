import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ScoreRing from '../components/candidates/ScoreRing';
import useCandidates from '../hooks/useCandidates';
import { formatDate } from '../utils/formatDate';
import { SKILL_CATEGORIES } from '../constants/categories';

export const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detail, loading, error, fetchCandidateDetail, updateStatus, deleteCandidate } = useCandidates();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCandidateDetail(id);
  }, [id, fetchCandidateDetail]);

  const handleStatusChange = async (e) => {
    await updateStatus(id, e.target.value);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      const res = await deleteCandidate(id);
      if (res.success) {
        navigate('/candidates');
      }
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="h-[60vh] flex items-center justify-center">
          <Spinner size="large" />
        </div>
      </PageWrapper>
    );
  }

  if (error || !detail) {
    return (
      <PageWrapper>
        <div className="text-center p-12 bg-[#172330] border border-[#253746] rounded-2xl max-w-lg mx-auto mt-12">
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Candidate</h3>
          <p className="text-sm text-gray-400 mb-6">{error || 'Candidate profile not found.'}</p>
          <Link to="/candidates" className="text-sm font-semibold text-[#FF763D] hover:underline">
            Back to Candidates List
          </Link>
        </div>
      </PageWrapper>
    );
  }

  // Group skills by category
  const groupedSkills = {
    language: [],
    framework: [],
    tool: [],
    soft: [],
    other: []
  };

  if (detail.skills) {
    detail.skills.forEach(skill => {
      const cat = skill.category || 'other';
      if (groupedSkills[cat]) {
        groupedSkills[cat].push(skill);
      } else {
        groupedSkills.other.push(skill);
      }
    });
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <Link to="/candidates" className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 self-start">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Candidates
        </Link>

        {/* Profile Header */}
        <Card className="border-[#253746] bg-[#172330] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FF763D]/20 border border-[#FF763D]/30 flex items-center justify-center text-2xl font-extrabold text-[#FF763D]">
              {detail.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">{detail.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                {detail.email && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {detail.email}
                  </span>
                )}
                {detail.phone && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {detail.phone}
                  </span>
                )}
                {detail.location && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {detail.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 self-stretch md:self-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Status:</span>
              <select
                value={detail.status}
                onChange={handleStatusChange}
                className="bg-[#080C10] border border-[#253746] text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF763D]"
              >
                <option value="new">New</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="interview">Interview</option>
              </select>
            </div>

            <button
              onClick={handleDelete}
              className="px-3 py-2 border border-red-500/30 hover:bg-red-500/10 text-red-500 text-xs font-semibold rounded-xl transition-colors duration-200 focus:outline-none"
            >
              Delete Profile
            </button>

            <ScoreRing score={detail.score} size={64} strokeWidth={5} />
          </div>
        </Card>

        {/* Profile Details Tabs */}
        <div className="flex flex-col gap-6">
          <div className="flex border-b border-[#253746] overflow-x-auto gap-2">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'experience', name: 'Experience' },
              { id: 'education', name: 'Education & Certifications' },
              { id: 'skills', name: 'Skills & Proficiency' },
              { id: 'raw', name: 'Raw Extracted' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs uppercase font-bold tracking-wider transition-all duration-150 border-b-2 whitespace-nowrap focus:outline-none ${
                  activeTab === tab.id
                    ? 'border-[#FF763D] text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab contents */}
          <div className="min-h-[300px]">
            {activeTab === 'overview' && (
              <Card className="border-[#253746] bg-[#172330] flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3">Professional Summary</h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-normal whitespace-pre-line">
                    {detail.summary || 'No summary statement provided.'}
                  </p>
                </div>

                <div className="border-t border-[#253746] pt-6 flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Social References</h3>
                  <div className="flex flex-wrap gap-6 text-sm text-[#FF763D]">
                    {detail.linkedin ? (
                      <a href={`https://${detail.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        LinkedIn Profile
                      </a>
                    ) : <span className="text-xs text-gray-600">No LinkedIn linked</span>}
                    
                    {detail.github ? (
                      <a href={`https://${detail.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub Account
                      </a>
                    ) : <span className="text-xs text-gray-600">No GitHub linked</span>}
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'experience' && (
              <div className="flex flex-col gap-6">
                {detail.experience && detail.experience.length > 0 ? (
                  detail.experience.map((exp, idx) => (
                    <Card key={idx} className="border-[#253746] bg-[#172330]">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4 border-b border-[#253746] pb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                          <p className="text-sm font-semibold text-[#FF763D]">{exp.company}</p>
                        </div>
                        <div className="text-right">
                          <Badge status={exp.is_current ? 'shortlisted' : 'new'} className="!text-[9px] mb-1.5">
                            {exp.is_current ? 'Present Job' : 'Past Job'}
                          </Badge>
                          <p className="text-xs text-gray-400">
                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">{exp.location}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed font-normal whitespace-pre-line">
                        {exp.description}
                      </p>
                    </Card>
                  ))
                ) : (
                  <Card className="border-[#253746] bg-[#172330] text-center py-12">
                    <p className="text-sm text-gray-400">No work experience listed.</p>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'education' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Education section */}
                <Card className="border-[#253746] bg-[#172330] flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#253746] pb-2">Academic History</h3>
                  {detail.education && detail.education.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {detail.education.map((edu, idx) => (
                        <div key={idx} className="border-b border-[#253746]/50 pb-4 last:border-0 last:pb-0">
                          <h4 className="font-bold text-white text-base">{edu.degree || 'Degree'} {edu.field ? `in ${edu.field}` : ''}</h4>
                          <p className="text-sm text-[#FFA37A] font-medium">{edu.institution}</p>
                          <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                            <span>Period: {edu.start_year || '?'} - {edu.end_year || 'Present'}</span>
                            {edu.grade && <span className="bg-white/5 border border-[#253746] px-2 py-0.5 rounded font-bold">{edu.grade}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No education entries found.</p>
                  )}
                </Card>

                {/* Certifications section */}
                <Card className="border-[#253746] bg-[#172330] flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#253746] pb-2">Certifications</h3>
                  {detail.certifications && detail.certifications.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {detail.certifications.map((cert, idx) => (
                        <div key={idx} className="border-b border-[#253746]/50 pb-4 last:border-0 last:pb-0">
                          <h4 className="font-bold text-white text-sm">{cert.title}</h4>
                          <p className="text-xs text-gray-400 font-medium">{cert.issuer}</p>
                          <div className="flex justify-between items-center mt-2 text-[10px] text-gray-500">
                            <span>Issued: {formatDate(cert.issued_date)}</span>
                            {cert.url && (
                              <a href={cert.url} target="_blank" rel="noreferrer" className="text-[#FF763D] hover:underline flex items-center gap-1 font-semibold">
                                Verify
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No certifications listed.</p>
                  )}
                </Card>
              </div>
            )}

            {activeTab === 'skills' && (
              <Card className="border-[#253746] bg-[#172330] flex flex-col gap-6">
                {Object.keys(groupedSkills).some(cat => groupedSkills[cat].length > 0) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Object.keys(groupedSkills).map(catKey => {
                      const categorySkills = groupedSkills[catKey];
                      if (categorySkills.length === 0) return null;

                      const catMeta = SKILL_CATEGORIES[catKey] || { label: 'Other', color: '' };
                      
                      return (
                        <div key={catKey} className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 border-b border-[#253746] pb-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              catKey === 'language' ? 'bg-[#FF763D]' : catKey === 'framework' ? 'bg-[#FFA37A]' : catKey === 'tool' ? 'bg-[#10B981]' : 'bg-gray-400'
                            }`} />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                              {catMeta.label}s ({categorySkills.length})
                            </h4>
                          </div>

                          <div className="flex flex-col gap-3">
                            {categorySkills.map((skill, sIdx) => (
                              <div key={sIdx} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-gray-200">{skill.skill_name}</span>
                                  <span className="text-gray-400 font-bold">{skill.proficiency || 75}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#080C10] border border-[#253746] rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${skill.proficiency || 75}%`,
                                      backgroundColor: catKey === 'language' ? '#FF763D' : catKey === 'framework' ? '#FFA37A' : catKey === 'tool' ? '#10B981' : '#6B7280'
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No skills identified.</p>
                )}
              </Card>
            )}

            {activeTab === 'raw' && (
              <Card className="border-[#253746] bg-[#080C10] p-6 max-h-[60vh] overflow-y-auto">
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed font-normal">
                  {detail.raw_text || 'No raw content found.'}
                </pre>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
export default CandidateDetail;
