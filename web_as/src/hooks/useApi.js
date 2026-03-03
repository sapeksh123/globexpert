import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (method === 'GET') {
        response = await apiClient.get(url);
      } else if (method === 'POST') {
        response = await apiClient.post(url, data);
      } else if (method === 'PUT') {
        response = await apiClient.put(url, data);
      } else if (method === 'DELETE') {
        response = await apiClient.delete(url);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { request, loading, error, clearError };
};
