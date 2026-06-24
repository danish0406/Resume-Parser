import { useState, useCallback } from 'react';
import { jobAPI } from '../services/api';

export const useJobMatch = () => {
  const [jobs, setJobs] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobAPI.list();
      if (res.data.success) {
        setJobs(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching jobs.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = async (jobData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobAPI.create(jobData);
      if (res.data.success) {
        setJobs(prev => [res.data.data, ...prev]);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error creating job description.';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const fetchRankings = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobAPI.rankings(jobId);
      if (res.data.success) {
        setRankings(res.data.data.rankings);
        setSelectedJob(res.data.data.job);
        return res.data.data;
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching job match rankings.');
    } finally {
      setLoading(false);
    }
  }, []);

  const runManualMatch = async (candidateId, jobId) => {
    setError(null);
    try {
      const res = await jobAPI.match(candidateId, jobId);
      if (res.data.success) {
        fetchRankings(jobId);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error recalculating match.';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  return {
    jobs,
    rankings,
    selectedJob,
    loading,
    error,
    fetchJobs,
    createJob,
    fetchRankings,
    runManualMatch
  };
};
export default useJobMatch;
