import { useState } from 'react';
import { uploadAPI } from '../services/api';

export const useParse = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100 representing stepper stages
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const parseResume = async (file) => {
    setLoading(true);
    setProgress(15); // Stage 1: Uploading
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await uploadAPI.uploadResume(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // Map upload progress into the 15-40 range
        setProgress(15 + Math.round(percentCompleted * 0.25));
      });

      if (res.data.success) {
        setProgress(60); // Stage 2: Extracting text
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setProgress(85); // Stage 3: Analyzing NLP data
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setProgress(100); // Stage 4: Done
        setResult(res.data.data);
        return { success: true, data: res.data.data };
      } else {
        setError(res.data.message || 'Parsing failed.');
        setProgress(0);
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Error uploading file.';
      setError(errMsg);
      setProgress(0);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const resetParser = () => {
    setProgress(0);
    setError(null);
    setResult(null);
    setLoading(false);
  };

  return { parseResume, loading, progress, error, result, resetParser };
};
export default useParse;
