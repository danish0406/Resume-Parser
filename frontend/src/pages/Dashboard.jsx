import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import StatsCard from '../components/analytics/StatsCard';
import SkillChart from '../components/analytics/SkillChart';
import CandidateTable from '../components/candidates/CandidateTable';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import { analyticsAPI } from '../services/api';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, skillsRes] = await Promise.all([
          analyticsAPI.dashboard(),
          analyticsAPI.skills()
        ]);
        
        if (dashRes.data.success) {
          setData(dashRes.data.data);
        }
        if (skillsRes.data.success) {
          setSkills(skillsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="h-[60vh] flex items-center justify-center">
          <Spinner size="large" />
        </div>
      </PageWrapper>
    );
  }

  const stats = data?.stats || { totalCandidates: 0, avgScore: 0, shortlisted: 0, totalJobs: 0 };
  const recentCandidates = data?.recentCandidates || [];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Candidates"
            value={stats.totalCandidates}
            subtext="Uploaded files in system"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Average Score"
            value={`${stats.avgScore}`}
            subtext="ATS profile score avg"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          <StatsCard
            title="Shortlisted"
            value={stats.shortlisted}
            subtext="Candidates in pipeline"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Jobs Posted"
            value={stats.totalJobs}
            subtext="Open job descriptions"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-[#253746] bg-[#172330] h-full flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Recent Uploads</h3>
              {recentCandidates.length > 0 ? (
                <CandidateTable candidates={recentCandidates} />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#080C10]/40 border border-[#253746] rounded-xl">
                  <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-semibold text-white">No candidates uploaded yet</p>
                  <p className="text-xs text-gray-500 mt-1">Upload resumes to get started.</p>
                </div>
              )}
            </Card>
          </div>

          <div>
            <SkillChart data={skills} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
export default Dashboard;
