import { useState, useCallback } from 'react';
import axios from 'axios';

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const chat = useCallback(async (messages, labContext = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/chat', { messages, labContext });
      return res.data.response;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to get AI response';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateExperiment = useCallback(async (description) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/generate-experiment', { description });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to generate experiment';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateQuiz = useCallback(async (labContext, classLevel) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/quiz', { labContext, classLevel });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to generate quiz';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { chat, generateExperiment, generateQuiz, loading, error };
}

export default useGemini;
