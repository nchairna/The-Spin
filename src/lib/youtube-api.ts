import { YouTubeApiResponse, YouTubeVideo, YouTubeChannel } from '@/types/youtube';

// YouTube API v3 endpoints
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

interface YouTubeApiConfig {
  apiKey: string;
  channelId: string;
  playlistId?: string;
  maxResults?: number;
  pageToken?: string;
}

interface PlaylistItem {
  snippet?: {
    resourceId?: {
      videoId?: string;
    };
  };
}

interface PlaylistItemsResponse {
  items: PlaylistItem[];
  nextPageToken?: string;
}

interface VideoThumbnail {
  url?: string;
}

interface VideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    categoryId: string;
    thumbnails?: {
      maxres?: VideoThumbnail;
      standard?: VideoThumbnail;
      high?: VideoThumbnail;
      medium?: VideoThumbnail;
      default?: VideoThumbnail;
    };
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

interface VideoItemsResponse {
  items: VideoItem[];
}

interface ChannelItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high?: VideoThumbnail;
      default: VideoThumbnail;
    };
  };
  statistics: {
    subscriberCount: string;
    videoCount: string;
  };
}

interface ChannelResponse {
  items: ChannelItem[];
}

interface ChannelContentDetailsResponse {
  items: Array<{
    contentDetails: {
      relatedPlaylists: {
        uploads: string;
      };
    };
  }>;
}

// Convert YouTube duration (PT4M13S) to readable format (4:13)
function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Format view count (1234567 -> 1.2M)
function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

// Fetch channel information
async function fetchChannelInfo(apiKey: string, channelId: string): Promise<YouTubeChannel> {
  const response = await fetch(
    `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
  );
  
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }
  
  const data: ChannelResponse = await response.json();
  const channel = data.items[0];
  
  if (!channel) {
    throw new Error('YouTube API error: channel not found');
  }
  
  return {
    id: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    thumbnailUrl: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url || '',
    subscriberCount: channel.statistics.subscriberCount,
    videoCount: channel.statistics.videoCount,
  };
}

// Fetch videos from channel or playlist
async function fetchVideos(config: YouTubeApiConfig): Promise<{ videos: YouTubeVideo[]; nextPageToken?: string }> {
  const { apiKey, channelId, playlistId, maxResults = 50, pageToken } = config;
  
  const params = new URLSearchParams({
    part: 'snippet',
    maxResults: maxResults.toString(),
    key: apiKey,
  });
  
  if (pageToken) {
    params.set('pageToken', pageToken);
  }
  
  if (playlistId) {
    params.set('playlistId', playlistId);
  } else {
    const uploadsPlaylistId = await getChannelUploadsPlaylist(apiKey, channelId);
    params.set('playlistId', uploadsPlaylistId);
  }
  
  const playlistUrl = `${YOUTUBE_API_BASE}/playlistItems?${params.toString()}`;
  
  console.log('Fetching YouTube data from:', playlistUrl);
  const response = await fetch(playlistUrl);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('YouTube API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      error: errorData
    });
    throw new Error(`YouTube API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }
  
  const playlistData: PlaylistItemsResponse = await response.json();
  
  const videoIds = playlistData.items
    .map((item) => item.snippet?.resourceId?.videoId)
    .filter((id): id is string => Boolean(id));
  
  if (videoIds.length === 0) {
    return {
      videos: [],
      nextPageToken: playlistData.nextPageToken,
    };
  }
  
  const videoResponse = await fetch(
    `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${apiKey}`
  );
  
  if (!videoResponse.ok) {
    throw new Error(`YouTube API error: ${videoResponse.status}`);
  }
  
  const videoData: VideoItemsResponse = await videoResponse.json();
  
  const videos = videoData.items.map((video) => {
    const thumbnails = video.snippet.thumbnails || {};
    const thumbnailUrl =
      thumbnails.maxres?.url ||
      thumbnails.standard?.url ||
      thumbnails.high?.url ||
      thumbnails.medium?.url ||
      thumbnails.default?.url ||
      '';

    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      duration: formatDuration(video.contentDetails.duration),
      thumbnailUrl,
      youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
      viewCount: formatViewCount(video.statistics.viewCount),
      category: video.snippet.categoryId,
    };
  });

  return {
    videos,
    nextPageToken: playlistData.nextPageToken,
  };
}

// Get channel's uploads playlist ID
async function getChannelUploadsPlaylist(apiKey: string, channelId: string): Promise<string> {
  const response = await fetch(
    `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
  );
  
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }
  
  const data: ChannelContentDetailsResponse = await response.json();
  const uploads = data.items[0]?.contentDetails.relatedPlaylists.uploads;
  
  if (!uploads) {
    throw new Error('YouTube API error: uploads playlist not found');
  }
  
  return uploads;
}

// Main function to fetch YouTube data
export async function fetchYouTubeData(config: {
  apiKey: string;
  channelId: string;
  playlistId?: string;
  maxResults?: number;
  pageToken?: string;
}): Promise<YouTubeApiResponse> {
  try {
    const [{ videos, nextPageToken }, channel] = await Promise.all([
      fetchVideos(config),
      fetchChannelInfo(config.apiKey, config.channelId)
    ]);
    
    return {
      videos,
      channel,
      totalResults: videos.length,
      nextPageToken,
    };
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    throw error;
  }
}
