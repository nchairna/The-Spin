// YouTube API v3 Types
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  viewCount: string;
  category: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: string;
  videoCount: string;
}

export interface YouTubeApiResponse {
  videos: YouTubeVideo[];
  channel: YouTubeChannel;
  totalResults: number;
  nextPageToken?: string;
}

