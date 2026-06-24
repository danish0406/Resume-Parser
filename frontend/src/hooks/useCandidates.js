import { useState, useCallback } from 'react';
import { candidateAPI } from '../services/api';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCandidates = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await candidateAPI.list(filters);
      if (res.data.success) {
        setCandidates(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching candidates.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCandidateDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await candidateAPI.detail(id);
      if (res.data.success) {
        setDetail(res.data.data);
        return res.data.data;
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching candidate details.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (id, status) => {
    setError(null);
    try {
      const res = await candidateAPI.updateStatus(id, status);
      if (res.data.success) {
        setCandidates(prev => prev.map(c => c.id === parseInt(id) ? { ...c, status } : c));
        setDetail(prev => prev && prev.id === parseInt(id) ? { ...prev, status } : prev);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error updating status.';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const deleteCandidate = async (id) => {
    setError(null);
    try {
      const res = await candidateAPI.delete(id);
      if (res.data.success) {
        setCandidates(prev => prev.filter(c => c.id !== parseInt(id)));
        if (detail && detail.id === parseInt(id)) {
          setDetail(null);
        }
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error deleting candidate.';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  return {
    candidates,
    detail,
    loading,
    error,
    fetchCandidates,
    fetchCandidateDetail,
    updateStatus,
    deleteCandidate
  };
};
export default useCandidates;
