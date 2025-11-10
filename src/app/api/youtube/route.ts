import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeData } from '@/lib/youtube-api';

export async function GET(request: NextRequest) {
  try {
    // Get API key from environment variables
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;
    const playlistId = process.env.YOUTUBE_PLAYLIST_ID;
    
    if (!apiKey || !channelId) {
      return NextResponse.json(
        { error: 'YouTube API configuration missing' },
        { status: 500 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const requestedMaxResults = parseInt(searchParams.get('maxResults') || '50', 10);
    const maxResults = Number.isNaN(requestedMaxResults) ? 50 : requestedMaxResults;
    const pageToken = searchParams.get('pageToken') ?? undefined;
    
    // Fetch YouTube data
    const data = await fetchYouTubeData({
      apiKey,
      channelId,
      playlistId,
      maxResults,
      pageToken,
    });
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('YouTube API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube data' },
      { status: 500 }
    );
  }
}

