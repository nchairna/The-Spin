import { useState, useEffect, useCallback } from 'react';
import { YouTubeVideo } from '@/types/youtube';
import { CarouselSlot } from '@/types/admin';

interface CarouselData {
  slots: CarouselSlot[];
  videos: Map<string, YouTubeVideo>;
  isFromDatabase: boolean;
}

interface UseCarouselReturn {
  data: CarouselData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCarousel(): UseCarouselReturn {
  const [data, setData] = useState<CarouselData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarouselData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Try to fetch carousel slots from the database
      const carouselResponse = await fetch('/api/carousel');

      if (!carouselResponse.ok) {
        throw new Error(`Carousel API error: ${carouselResponse.status}`);
      }

      const carouselResult = await carouselResponse.json();

      if (!carouselResult.success || !carouselResult.data) {
        throw new Error(carouselResult.error || 'Failed to fetch carousel data');
      }

      const slots: CarouselSlot[] = carouselResult.data;

      // Step 2: Extract YouTube IDs from slots that have videos assigned
      const youtubeIds = slots
        .map((slot) => slot.youtubeId)
        .filter((id): id is string => id !== null && id !== '');

      // Step 3: Fetch video metadata for those IDs (if any)
      const videosMap = new Map<string, YouTubeVideo>();

      if (youtubeIds.length > 0) {
        const youtubeResponse = await fetch(`/api/youtube?ids=${youtubeIds.join(',')}`);

        if (youtubeResponse.ok) {
          const youtubeResult = await youtubeResponse.json();

          if (youtubeResult.videos && Array.isArray(youtubeResult.videos)) {
            for (const video of youtubeResult.videos) {
              videosMap.set(video.id, video);
            }
          }
        } else {
          // Log but don't fail - we can still show placeholders for missing videos
          console.warn('Failed to fetch video metadata, slots will show without video info');
        }
      }

      // Step 4: Return data with isFromDatabase flag
      setData({
        slots,
        videos: videosMap,
        isFromDatabase: true,
      });

    } catch (carouselError) {
      // FALLBACK: If carousel API fails, fall back to direct YouTube fetch
      console.warn('Carousel API failed, falling back to YouTube API:', carouselError);

      try {
        const youtubeResponse = await fetch('/api/youtube?maxResults=9');

        if (!youtubeResponse.ok) {
          throw new Error(`YouTube API error: ${youtubeResponse.status}`);
        }

        const youtubeResult = await youtubeResponse.json();

        if (!youtubeResult.videos || !Array.isArray(youtubeResult.videos)) {
          throw new Error('Invalid YouTube API response');
        }

        // Create a Map from the videos for consistent data structure
        const videosMap = new Map<string, YouTubeVideo>();
        for (const video of youtubeResult.videos) {
          videosMap.set(video.id, video);
        }

        // Create default slots (empty) since we're in fallback mode
        const fallbackSlots: CarouselSlot[] = Array.from({ length: 9 }, (_, i) => ({
          position: i + 1,
          youtubeId: null,
        }));

        setData({
          slots: fallbackSlots,
          videos: videosMap,
          isFromDatabase: false,
        });

      } catch (fallbackError) {
        // Both carousel and YouTube API failed
        console.error('Both carousel and fallback YouTube API failed:', fallbackError);
        setError(
          fallbackError instanceof Error
            ? fallbackError.message
            : 'Failed to fetch carousel data'
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarouselData();
  }, [fetchCarouselData]);

  return {
    data,
    loading,
    error,
    refetch: fetchCarouselData,
  };
}
