'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import type { YouTubeVideo, YouTubeApiResponse } from '@/types/youtube';
import type { CarouselSlot, ApiResponse } from '@/types/admin';

interface SlotWithVideo extends CarouselSlot {
  video?: YouTubeVideo;
}

export default function AdminDashboard() {
  // State for carousel slots
  const [slots, setSlots] = useState<SlotWithVideo[]>([]);
  const [originalSlots, setOriginalSlots] = useState<CarouselSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for YouTube videos
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  // State for search
  const [searchQuery, setSearchQuery] = useState('');

  // Check if there are unsaved changes
  const hasChanges = useCallback(() => {
    for (let i = 0; i < 9; i++) {
      const current = slots[i];
      const original = originalSlots[i];
      if (!current || !original) continue;
      if (current.youtubeId !== original.youtubeId) return true;
    }
    return false;
  }, [slots, originalSlots]);

  // Fetch carousel slots
  const fetchSlots = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/carousel');
      const data: ApiResponse<CarouselSlot[]> = await response.json();

      if (data.success && data.data) {
        setOriginalSlots(data.data);
        // Will be enriched with video data after videos are loaded
        setSlots(data.data.map((slot) => ({ ...slot })));
      } else {
        toast.error(data.error || 'Failed to load carousel slots');
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to load carousel slots');
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  // Fetch YouTube videos
  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch('/api/youtube?maxResults=50');
      const data: YouTubeApiResponse = await response.json();

      if (data.videos) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load YouTube videos');
    } finally {
      setIsLoadingVideos(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchSlots();
    fetchVideos();
  }, [fetchSlots, fetchVideos]);

  // Enrich slots with video data when both are loaded
  useEffect(() => {
    if (videos.length > 0 && slots.length > 0) {
      setSlots((prevSlots) =>
        prevSlots.map((slot) => ({
          ...slot,
          video: slot.youtubeId
            ? videos.find((v) => v.id === slot.youtubeId)
            : undefined,
        }))
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos]); // Only re-run when videos change, not slots

  // Handle slot video change
  const handleSlotChange = (position: number, youtubeId: string | null) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.position === position
          ? {
              ...slot,
              youtubeId,
              video: youtubeId
                ? videos.find((v) => v.id === youtubeId)
                : undefined,
            }
          : slot
      )
    );
  };

  // Handle remove video from slot
  const handleRemoveVideo = (position: number) => {
    handleSlotChange(position, null);
  };

  // Save carousel changes
  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/carousel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slots: slots.map(({ position, youtubeId }) => ({
            position,
            youtubeId,
          })),
        }),
      });

      const data: ApiResponse<CarouselSlot[]> = await response.json();

      if (data.success) {
        toast.success('Carousel updated successfully!');
        // Update original slots to match saved state
        setOriginalSlots(slots.map(({ position, youtubeId }) => ({ position, youtubeId })));
      } else {
        toast.error(data.error || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving carousel:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter videos by search query
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format duration for display
  const formatDuration = (duration: string) => {
    // Duration is in ISO 8601 format (e.g., PT1H30M45S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get available videos (not already in carousel)
  const getAvailableVideos = (currentPosition: number) => {
    const usedIds = slots
      .filter((s) => s.position !== currentPosition && s.youtubeId)
      .map((s) => s.youtubeId);
    return videos.filter((v) => !usedIds.includes(v.id));
  };

  const isLoading = isLoadingSlots || isLoadingVideos;

  return (
    <div className="space-y-8 scroll-mt-24" id="dashboard">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-eb-garamond text-2xl sm:text-3xl text-gray-900">Dashboard</h1>
          <p className="font-outfit text-gray-500 mt-1">Manage your carousel and episodes</p>
        </div>
      </div>

      {/* Section 1: Carousel Episodes Management */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-eb-garamond text-xl text-gray-900">Carousel Episodes</h2>
            <p className="font-outfit text-sm text-gray-500 mt-0.5">
              Manage the 9 featured episodes shown in the homepage carousel
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges()}
            className={`px-4 py-2 rounded-lg font-outfit text-sm font-medium transition-all ${
              hasChanges()
                ? 'bg-[#C72B1B] text-white hover:bg-[#B02518] shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

        {/* Carousel Grid */}
        <div className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.position}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                >
                  {/* Slot Header */}
                  <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                    <span className="font-outfit text-xs font-medium text-gray-600">
                      Slot {slot.position}
                    </span>
                    {slot.youtubeId && (
                      <button
                        onClick={() => handleRemoveVideo(slot.position)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove video"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Slot Content */}
                  {slot.video ? (
                    <div className="p-3">
                      <div className="relative aspect-video rounded overflow-hidden mb-2">
                        <Image
                          src={slot.video.thumbnailUrl}
                          alt={slot.video.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="font-outfit text-sm text-gray-900 line-clamp-2">
                        {slot.video.title}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3">
                      <div className="relative aspect-video bg-gray-100 rounded border-2 border-dashed border-gray-200 flex items-center justify-center mb-2">
                        <span className="font-outfit text-sm text-gray-400">Coming Soon</span>
                      </div>
                      <select
                        value=""
                        onChange={(e) => handleSlotChange(slot.position, e.target.value || null)}
                        className="w-full px-3 py-2 text-sm font-outfit bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72B1B]/20 focus:border-[#C72B1B]"
                      >
                        <option value="">Select video...</option>
                        {getAvailableVideos(slot.position).map((video) => (
                          <option key={video.id} value={video.id}>
                            {video.title.length > 50
                              ? `${video.title.slice(0, 50)}...`
                              : video.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 2: All Episodes */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-eb-garamond text-xl text-gray-900">All Episodes</h2>
              <p className="font-outfit text-sm text-gray-500 mt-0.5">
                {videos.length} episodes from YouTube
              </p>
            </div>
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search episodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm font-outfit bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72B1B]/20 focus:border-[#C72B1B]"
              />
            </div>
          </div>
        </div>

        {/* Episodes Table */}
        <div className="overflow-x-auto">
          {isLoadingVideos ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-32 h-18 bg-gray-100 rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="mx-auto w-12 h-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 font-outfit text-gray-500">
                {searchQuery ? 'No episodes found matching your search' : 'No episodes available'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-outfit font-medium text-gray-500 uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-outfit font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-outfit font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-outfit font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Published
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative w-24 h-14 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-outfit text-sm text-gray-900 hover:text-[#C72B1B] line-clamp-2 transition-colors"
                      >
                        {video.title}
                      </a>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="font-outfit text-sm text-gray-500">
                        {formatDuration(video.duration)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="font-outfit text-sm text-gray-500">
                        {formatDate(video.publishedAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
