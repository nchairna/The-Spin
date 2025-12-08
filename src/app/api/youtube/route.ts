import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeData, fetchVideosByIds } from '@/lib/youtube-api';

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

    // Check if specific video IDs are requested
    const idsParam = searchParams.get('ids');

    if (idsParam) {
      // Fetch specific videos by IDs
      const videoIds = idsParam.split(',').filter((id) => id.trim() !== '');

      if (videoIds.length === 0) {
        return NextResponse.json({ videos: [] });
      }

      const videos = await fetchVideosByIds(apiKey, videoIds);
      return NextResponse.json({ videos });
    }

    // Default behavior: fetch channel uploads
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

