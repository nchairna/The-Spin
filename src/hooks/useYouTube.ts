import { useState, useEffect, useCallback } from 'react';
import { YouTubeApiResponse } from '@/types/youtube';

interface UseYouTubeOptions {
  maxResults?: number;
  autoFetch?: boolean;
}

export function useYouTube(options: UseYouTubeOptions = {}) {
  const { maxResults = 50, autoFetch = true } = options;
  
  const [data, setData] = useState<YouTubeApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchYouTubeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/youtube?maxResults=${maxResults}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch YouTube data');
      console.error('YouTube fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [maxResults]);

  useEffect(() => {
    if (autoFetch) {
      fetchYouTubeData();
    }
  }, [autoFetch, fetchYouTubeData]);

  return {
    data,
    loading,
    error,
    refetch: fetchYouTubeData,
  };
}

